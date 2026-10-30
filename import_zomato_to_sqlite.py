import sqlite3
import csv
import sys
import time
import os

# Increase CSV field size limit to handle large review lists
csv.field_size_limit(sys.maxsize)

CSV_FILE = "zomato.csv"
DB_FILE = "restaurant_feedback.db"
TABLE_NAME = "zomato_restaurants"

def migrate_csv_to_db():
    if not os.path.exists(CSV_FILE):
        print(f"Error: {CSV_FILE} not found!")
        sys.exit(1)

    print(f"Connecting to database: {DB_FILE}...")
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()

    # Optimizations for fast batch inserts in SQLite
    cursor.execute("PRAGMA synchronous = OFF;")
    cursor.execute("PRAGMA journal_mode = MEMORY;")

    print(f"Creating table '{TABLE_NAME}' if not exists...")
    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {TABLE_NAME} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT,
            address TEXT,
            name TEXT,
            online_order TEXT,
            book_table TEXT,
            rate TEXT,
            votes INTEGER,
            phone TEXT,
            location TEXT,
            rest_type TEXT,
            dish_liked TEXT,
            cuisines TEXT,
            approx_cost_for_two TEXT,
            reviews_list TEXT,
            menu_item TEXT,
            listed_in_type TEXT,
            listed_in_city TEXT
        );
    """)

    # Check if table already has rows
    cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
    existing_count = cursor.fetchone()[0]
    if existing_count > 0:
        print(f"Table '{TABLE_NAME}' currently contains {existing_count} rows.")
        print(f"Clearing existing rows in '{TABLE_NAME}' to ensure a clean import...")
        cursor.execute(f"DELETE FROM {TABLE_NAME}")
        cursor.execute("DELETE FROM sqlite_sequence WHERE name=?", (TABLE_NAME,))
        conn.commit()

    insert_sql = f"""
        INSERT INTO {TABLE_NAME} (
            url, address, name, online_order, book_table, rate, votes, phone,
            location, rest_type, dish_liked, cuisines, approx_cost_for_two,
            reviews_list, menu_item, listed_in_type, listed_in_city
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    print(f"Reading {CSV_FILE} and inserting into {DB_FILE}...")
    start_time = time.time()
    batch_size = 5000
    batch = []
    total_inserted = 0

    with open(CSV_FILE, mode="r", encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        header = next(reader)
        print(f"Detected columns ({len(header)}): {header}")

        for row_idx, row in enumerate(reader, start=1):
            if len(row) < 17:
                # Pad if row is shorter
                row = row + [None] * (17 - len(row))
            elif len(row) > 17:
                # Truncate if row has extra elements
                row = row[:17]

            # Parse votes safely to integer if possible
            votes_str = row[6]
            try:
                votes = int(votes_str)
            except (ValueError, TypeError):
                votes = 0

            record = (
                row[0],   # url
                row[1],   # address
                row[2],   # name
                row[3],   # online_order
                row[4],   # book_table
                row[5],   # rate
                votes,    # votes
                row[7],   # phone
                row[8],   # location
                row[9],   # rest_type
                row[10],  # dish_liked
                row[11],  # cuisines
                row[12],  # approx_cost(for two people)
                row[13],  # reviews_list
                row[14],  # menu_item
                row[15],  # listed_in(type)
                row[16]   # listed_in(city)
            )
            batch.append(record)

            if len(batch) >= batch_size:
                cursor.executemany(insert_sql, batch)
                conn.commit()
                total_inserted += len(batch)
                batch = []
                elapsed = time.time() - start_time
                print(f"Inserted {total_inserted} rows ({total_inserted / elapsed:.0f} rows/s)...")

        if batch:
            cursor.executemany(insert_sql, batch)
            conn.commit()
            total_inserted += len(batch)

    # Re-enable standard journal and synchronous modes
    cursor.execute("PRAGMA journal_mode = DELETE;")
    cursor.execute("PRAGMA synchronous = NORMAL;")

    print("Creating search indexes on common query columns...")
    cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_zomato_name ON {TABLE_NAME}(name);")
    cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_zomato_location ON {TABLE_NAME}(location);")
    cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_zomato_cuisines ON {TABLE_NAME}(cuisines);")
    cursor.execute(f"CREATE INDEX IF NOT EXISTS idx_zomato_rate ON {TABLE_NAME}(rate);")
    conn.commit()

    elapsed = time.time() - start_time
    print(f"\nMigration completed successfully in {elapsed:.2f} seconds!")
    print(f"Total rows in '{TABLE_NAME}': {total_inserted}")

    # Validation
    cursor.execute(f"SELECT COUNT(*) FROM {TABLE_NAME}")
    db_count = cursor.fetchone()[0]
    print(f"Verified row count in database: {db_count}")

    # Sample query verification
    cursor.execute(f"SELECT id, name, location, rate, cuisines, approx_cost_for_two FROM {TABLE_NAME} LIMIT 3")
    sample_records = cursor.fetchall()
    print("\nSample records:")
    for rec in sample_records:
        print(f"  [ID {rec[0]}] {rec[1]} | Loc: {rec[2]} | Rating: {rec[3]} | Cuisines: {rec[4]} | Cost for 2: {rec[5]}")

    conn.close()

if __name__ == "__main__":
    migrate_csv_to_db()
