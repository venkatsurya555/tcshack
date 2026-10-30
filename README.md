# QR-Based Smart Restaurant Feedback, Department Routing, and Complaint Resolution System

An enterprise-grade, full-stack restaurant feedback management and operations platform. Customers scan a unique QR code printed on their dining bill, rate strictly the items included in their specific order, answer dynamic rating-based questions, and report issues. Actionable complaints are automatically routed to the responsible department (Kitchen, Service, Billing, Packing, Delivery, Management), tracked against strict SLA targets, remediated through root-cause analysis, verified by authorized managers, and updated via real-time customer notifications.

---

## 1. System Architecture & Tech Stack

- **Backend**:
  - **Java 21 (LTS)** with **Spring Boot 3.3.4**
  - **Spring MVC RESTful Architecture** (`/api/v1/...` and `/api/...`)
  - Thread-safe in-memory resilient datastore with JSON initialization
  - Unsupervised NLP semantic complaint grouping & clustering engine
  - Automated department routing engine with SLA tracking
  - Manager verification gatekeeper workflow
  - Built-in Apache Maven 3.9.9 build tooling
  - Runs on port 8000

- **Frontend**:
  - **React 19** + **Vite** + **TypeScript**
  - **Tailwind CSS v4** with dark SaaS design system (slate, indigo, emerald, amber, rose)
  - **React Router v7** for single-page application navigation
  - **Recharts** for real-time KPI and distribution analytics
  - **Lucide React** modern icons
  - Dedicated AI Review Intelligence & Semantic Clustering dashboard

---

## 2. Complete Workflow Implemented

1. **Bill QR Generation**: An order is generated at the POS. A cryptographically unguessable token and QR code image are assigned to the bill.
2. **QR Scan & Order Validation**: The customer scans the bill QR code. The server validates token status and expiry, ensuring only the items from that verified order are displayed.
3. **Dynamic Item-Level Ratings**: The customer awards 1–5 stars for each ordered item. Dynamic follow-up inquiries appear based on each rating:
   - **5 Stars**: Prompts what the customer enjoyed most.
   - **4 Stars**: Asks for subtle suggestions to achieve perfection.
   - **3 Stars**: Requests what was lacking and category selection.
   - **1–2 Stars**: Triggers incident escalation, asking for exact issue categorization and detailed remediation expectation.
4. **Automated Department Routing**: The routing engine classifies the issue category and routes the ticket to the responsible department:
   - *Food Quality / Temperature / Taste / Missing Item* $\rightarrow$ **Kitchen & Culinary**
   - *Staff Behaviour / Service Delay* $\rightarrow$ **Service & Hospitality**
   - *Billing & Payment Discrepancies* $\rightarrow$ **Billing & Cashier**
   - *Packaging & Spillages* $\rightarrow$ **Packaging & Dispatch**
   - *Delivery Delays* $\rightarrow$ **Delivery Operations**
   - *Unclassified or Cross-Department* $\rightarrow$ **Executive Management**
5. **Investigation & Corrective Actions**: Department specialists log investigation findings, record the root cause, and document both corrective and preventive actions. Status advances to `Resolved Pending Verification`.
6. **Manager Verification Rule**: Complaints cannot be marked finally resolved until an authorized Restaurant Manager or Super Admin conducts a formal verification. If approved, the status transitions to `Resolved`.
7. **Customer Notification & Tracking**: Only after manager verification is the guest sent the final resolution notification. The customer tracks their ticket in real time at `/track/:ticketNumber` and rates post-resolution satisfaction (1–5 stars).

---

## 3. Demo Credentials (Local Development)

All demo accounts use password: `admin123`

| Role | Username | Full Name | Department / Branch |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | Rajesh Sharma | Executive Management |
| **Restaurant Manager** | `manager` | Kavita Nair | The Royal Rasoi - Indiranagar |
| **Kitchen Staff** | `chef_suresh` | Chef Suresh Rao | Kitchen & Culinary |
| **Service Staff** | `service_priya` | Priya Menon | Service & Hospitality |
| **Billing Staff** | `billing_rahul` | Rahul Verma | Billing & Cashier |
| **Packing Staff** | `packing_anita` | Anita Deshmukh | Packaging & Dispatch |
| **Delivery Staff** | `delivery_kiran` | Kiran Kumar | Delivery Operations |

> **Role Switcher in UI**: A quick role switcher is embedded directly into the top navbar of the dashboard for convenient demo testing.

---

## 4. Quick Start & Local Execution

### 1. Backend Setup (Java 21 + Spring Boot)

Run the following from the root directory:
```powershell
# Package with bundled Maven (Java 21)
& "maven_tools\apache-maven-3.9.9\bin\mvn.cmd" clean package -DskipTests -f food-feedback-ai/backend/pom.xml

# Start the Spring Boot server (port 8000)
java -jar food-feedback-ai/backend/target/food-feedback-ai-1.0.0.jar
```
The Java backend server will be live at `http://localhost:8000`.

### 2. Frontend Setup (React + Vite)

Open a second terminal in `frontend/`:
```powershell
cd frontend
npm run dev
```
The web application will be live at:
- **Management & AI Dashboard**: `http://localhost:5173/`
- **AI Semantic Review Intelligence**: `http://localhost:5173/ai-clusters`
- **Live Customer Bill QR Feedback**: `http://localhost:5173/feedback/demo-token-5-ord-2026-105`
- **Customer Ticket Tracking Portal**: `http://localhost:5173/track/TKT-2026-001`

---

## 5. Running Automated Backend Tests (Java & JUnit 5)

The system includes a 100% automated Java unit test suite:
```powershell
# Run the Java test suite with bundled Maven
& "maven_tools\apache-maven-3.9.9\bin\mvn.cmd" test -f food-feedback-ai/backend/pom.xml
```
The test suite verifies:
- Pure Java Sentiment Analysis with domain restaurant lexicon, negations, intensifiers, and contrastive clauses
- Pure Java 384-dimensional semantic projection embeddings with unit L2 normalization
- Pure Java Cosine similarity and cluster centroid calculations
- Pure Java Agglomerative hierarchical clustering, topic labeling, and outlier detection

---

## 6. Project Directory Structure

```
d:/food review/
├── food-feedback-ai/
│   ├── backend/                     # 100% Java 21 + Spring Boot 3.3.4 Backend
│   │   ├── src/main/java/com/foodfeedback/ai/
│   │   │   ├── config/              # Security and Web configurations
│   │   │   ├── controller/          # REST Controllers (Reviews, Groups, NLP, Orders, etc.)
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   ├── model/               # Domain models
│   │   │   ├── repository/          # Thread-safe in-memory & Mongo data stores
│   │   │   └── service/
│   │   │       ├── nlp/             # Native Java NLP Engine (Sentiment, Embeddings, Clustering, Labeling)
│   │   │       ├── AiClientService.java
│   │   │       └── ReviewService.java
│   │   ├── src/test/java/           # JUnit 5 test suites
│   │   ├── pom.xml                  # Maven build definition
│   │   └── src/main/resources/      # application.yml, seed data
│   └── sample-data/                 # Sample reviews dataset
├── frontend/                        # React 19 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/              # Sidebar, Navbar, Layout, StatusBadge, KPICard
│   │   ├── context/                 # AuthContext & role switcher
│   │   ├── pages/                   # AI Review Intelligence, Complaint Tracking, etc.
│   │   ├── services/                # Typed API client connecting to port 8000
│   │   └── types/                   # TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── maven_tools/                     # Bundled Apache Maven 3.9.9
└── README.md
```
