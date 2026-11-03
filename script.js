/**
 * ============================================================================
 * RESQMIND AI — TCS HACKATHON INTERACTIVE PRESENTATION JAVASCRIPT
 * Strictly following the attached ResQMind-AI.pdf source of truth.
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------
  const TOTAL_SLIDES = 10;
  let currentSlideIndex = 0; // 0 to 9
  let isAutoplayingWorkflow = false;
  let workflowTimer = null;
  let simAnimationTimer = null;

  // Slide Metadata (Matching PDF Titles)
  const slideTitles = [
    "Title",
    "Problem Statement",
    "Proposed Platform",
    "Complete System Workflow",
    "Trust-Aware Intelligence",
    "Prioritization & Allocation",
    "Risk-Aware Route & Shelter",
    "Dynamic Replanning Engine",
    "Technical Architecture",
    "Innovation & Conclusion"
  ];

  // --------------------------------------------------------------------------
  // DOM ELEMENTS
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.slide');
  const slideNavPillsContainer = document.getElementById('slide-nav-pills');
  const currentSlideNumEl = document.getElementById('current-slide-num');
  const footerSlideTitleEl = document.getElementById('footer-slide-title');
  const deckProgressBar = document.getElementById('deck-progress-bar');
  const prevSlideBtn = document.getElementById('prev-slide-btn');
  const nextSlideBtn = document.getElementById('next-slide-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  // --------------------------------------------------------------------------
  // PRESENTATION INITIALIZATION
  // --------------------------------------------------------------------------
  function initPresentation() {
    buildSlideNavPills();
    updateSlideView(currentSlideIndex);
    setupEventListeners();
  }

  // Generate 10 Navigation Pills in Header
  function buildSlideNavPills() {
    slideNavPillsContainer.innerHTML = '';
    for (let i = 0; i < TOTAL_SLIDES; i++) {
      const pill = document.createElement('button');
      pill.className = `nav-pill ${i === currentSlideIndex ? 'active' : ''}`;
      pill.textContent = (i + 1).toString().padStart(2, '0');
      pill.title = `Jump to Slide ${i + 1}: ${slideTitles[i]}`;
      pill.setAttribute('aria-label', `Slide ${i + 1}: ${slideTitles[i]}`);
      pill.addEventListener('click', () => goToSlide(i));
      slideNavPillsContainer.appendChild(pill);
    }
  }

  // --------------------------------------------------------------------------
  // SLIDE NAVIGATION LOGIC
  // --------------------------------------------------------------------------
  function updateSlideView(newIndex) {
    if (newIndex < 0 || newIndex >= TOTAL_SLIDES) return;

    // Reset workflow autoplay if leaving Slide 4
    if (currentSlideIndex === 3 && newIndex !== 3 && isAutoplayingWorkflow) {
      stopWorkflowAutoplay();
    }

    currentSlideIndex = newIndex;

    // Toggle active class on slide sections
    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Header Navigation Pills
    const pills = slideNavPillsContainer.querySelectorAll('.nav-pill');
    pills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx === currentSlideIndex);
    });

    // Update Footer Chrome
    currentSlideNumEl.textContent = (currentSlideIndex + 1).toString().padStart(2, '0');
    footerSlideTitleEl.textContent = slideTitles[currentSlideIndex];
    
    // Progress Bar
    const progressPercent = ((currentSlideIndex + 1) / TOTAL_SLIDES) * 100;
    deckProgressBar.style.width = `${progressPercent}%`;

    // Button states
    prevSlideBtn.disabled = currentSlideIndex === 0;
    nextSlideBtn.disabled = currentSlideIndex === TOTAL_SLIDES - 1;
  }

  function goToSlide(index) {
    updateSlideView(index);
  }

  function nextSlide() {
    if (currentSlideIndex < TOTAL_SLIDES - 1) {
      updateSlideView(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      updateSlideView(currentSlideIndex - 1);
    }
  }

  // --------------------------------------------------------------------------
  // KEYBOARD CONTROLS & FULLSCREEN
  // --------------------------------------------------------------------------
  function setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(TOTAL_SLIDES - 1);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    });

    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  // --------------------------------------------------------------------------
  // SLIDE 02: PROBLEM STATEMENT INTERACTION
  // --------------------------------------------------------------------------
  const problemDetailsData = {
    1: {
      tag: "PROBLEM 01 · MULTI-SOURCE DISARRAY",
      title: "Fragmented reports from citizens, helplines, weather, & rescue teams",
      desc: "Emergency reports arrive through disparate, disconnected channels: citizen 911/112 helplines, weather department warnings, social feeds, and radio traffic from ground crews. Without centralized aggregation, critical rescue windows are lost in transmission delays."
    },
    2: {
      tag: "PROBLEM 02 · DATA INTEGRITY CHALLENGE",
      title: "Duplicate, stale, conflicting, or unverified information",
      desc: "During rapid flood surges, 40-60% of incoming reports describe the same incident with varied locations or outdated timestamps. False alarms or stale reports cause precious rescue boats and ambulances to be dispatched to already evacuated zones."
    },
    3: {
      tag: "PROBLEM 03 · OPERATIONAL BOTTLENECKS",
      title: "Unclear priorities, constrained resources, flooded roads, & unsuitable shelters",
      desc: "Emergency command centers face acute resource scarcity: limited rescue teams, flooded access roads, and overcrowded or flood-peril shelters. Without constraint-aware intelligence, relief supplies are misallocated while stranded survivors remain unreached."
    },
    4: {
      tag: "PROBLEM 04 · DYNAMIC ENVIRONMENT",
      title: "Conditions change faster than static response plans",
      desc: "Pre-planned disaster response routes collapse the moment a river levee breaches or an arterial bridge is submerged. Static emergency blueprints cannot adapt in real time to fast-evolving environmental hazards."
    }
  };

  window.selectProblem = function (num) {
    const cards = document.querySelectorAll('.problem-card');
    cards.forEach((card) => {
      const pNum = parseInt(card.getAttribute('data-problem'), 10);
      card.classList.toggle('active', pNum === num);
    });

    const data = problemDetailsData[num];
    if (data) {
      document.getElementById('problem-detail-tag').textContent = data.tag;
      document.getElementById('problem-detail-title').textContent = data.title;
      document.getElementById('problem-detail-desc').textContent = data.desc;
    }
  };

  // --------------------------------------------------------------------------
  // SLIDE 03: PROPOSED SOLUTION CAPABILITIES
  // --------------------------------------------------------------------------
  window.highlightCapability = function (capNum) {
    const nodes = document.querySelectorAll('.capability-node');
    nodes.forEach((node) => {
      const c = parseInt(node.getAttribute('data-cap'), 10);
      node.classList.toggle('active-cap', c === capNum);
    });
  };

  // --------------------------------------------------------------------------
  // SLIDE 04: 8-STAGE WORKFLOW INTERACTIVE ENGINE
  // --------------------------------------------------------------------------
  const workflowStagesData = {
    1: {
      tag: "STAGE 01 OF 08",
      phase: "INGESTION PHASE",
      title: "Collect multi-source data",
      desc: "Aggregates raw incident reports from citizens, helpline transcripts, weather department meteorological alerts, road sensor telemetry, and boots-on-the-ground rescue reports into a unified telemetry stream.",
      prev: "Stage 08: Approved Response Plan (Feedback)",
      curr: "01: Ingestion & Telemetry",
      next: "Stage 02: Verification & Deduplication"
    },
    2: {
      tag: "STAGE 02 OF 08",
      phase: "VERIFICATION PHASE",
      title: "Verify evidence and detect duplicates",
      desc: "Applies semantic similarity embeddings, timestamp validation, source reliability metrics, and cross-source corroboration to filter duplicates and detect unverified or stale reports.",
      prev: "Stage 01: Multi-Source Data Collection",
      curr: "02: Semantic Verification & Deduplication",
      next: "Stage 03: Risk Prediction & Prioritization"
    },
    3: {
      tag: "STAGE 03 OF 08",
      phase: "INTELLIGENCE PHASE",
      title: "Predict risk and prioritize incidents",
      desc: "Combines historical, weather, and sensor data with priority scoring algorithms to assess immediate severity, population at risk, medical urgency, and time sensitivity across incidents.",
      prev: "Stage 02: Evidence Verification",
      curr: "03: Urgency Scoring & Risk Forecasting",
      next: "Stage 04: Resource Allocation"
    },
    4: {
      tag: "STAGE 04 OF 08",
      phase: "OPTIMIZATION PHASE",
      title: "Allocate resources",
      desc: "Employs Google OR-Tools constraint programming to distribute ambulances, rescue boats, food, water, medical kits, and rescue personnel against availability, capacity, and logistical bounds.",
      prev: "Stage 03: Incident Prioritization",
      curr: "04: Constrained Mathematical Dispatch",
      next: "Stage 05: Route & Shelter Recommendation"
    },
    5: {
      tag: "STAGE 05 OF 08",
      phase: "ROUTING & DESTINATIONS",
      title: "Recommend routes and shelters",
      desc: "Solves topological road network graphs with NetworkX, excluding flooded or blocked roads, and matches safe shelters evaluated for flood security, capacity, and medical readiness.",
      prev: "Stage 04: Resource Allocation",
      curr: "05: Hazard-Aware Route & Shelter Match",
      next: "Stage 06: Relief Execution & Monitoring"
    },
    6: {
      tag: "STAGE 06 OF 08",
      phase: "OPERATIONAL EXECUTION",
      title: "Execute relief and monitor conditions",
      desc: "Dispatches field responders along approved paths while continuously monitoring live conditions, river sensors, vehicle GPS trackers, and field telemetry updates.",
      prev: "Stage 05: Route & Shelter Recommendation",
      curr: "06: Field Operations & Real-Time Telemetry",
      next: "Stage 07: Dynamic Replanning"
    },
    7: {
      tag: "STAGE 07 OF 08",
      phase: "ADAPTIVE ENGINE",
      title: "Replan as reality changes",
      desc: "Triggered whenever an assigned road floods, a shelter reaches capacity, or vehicle availability shifts. Recalculates alternative paths and resource distributions automatically.",
      prev: "Stage 06: Operational Monitoring",
      curr: "07: Dynamic Re-routing & Reallocation",
      next: "Stage 08: Coordinator Approval & Publishing"
    },
    8: {
      tag: "STAGE 08 OF 08",
      phase: "GOVERNANCE & PUBLICATION",
      title: "Approve and publish the updated response plan",
      desc: "Presents the re-optimized response plan to the human disaster coordinator for review. Once verified and approved, changes are published to field teams and logged in the immutable audit trail.",
      prev: "Stage 07: Dynamic Replanning Engine",
      curr: "08: Human Approval & Plan Dissemination",
      next: "Stage 01: Next Continuous Feedback Cycle"
    }
  };

  let activeWfStep = 1;

  window.selectWorkflowStep = function (stepNum) {
    activeWfStep = stepNum;
    const nodes = document.querySelectorAll('.wf-step-node');
    nodes.forEach((node) => {
      const s = parseInt(node.getAttribute('data-step'), 10);
      node.classList.toggle('active', s === stepNum);
    });

    const info = workflowStagesData[stepNum];
    if (info) {
      document.getElementById('wf-inspect-tag').textContent = info.tag;
      document.getElementById('wf-inspect-loop').textContent = info.phase;
      document.getElementById('wf-inspect-title').textContent = info.title;
      document.getElementById('wf-inspect-desc').textContent = info.desc;
      document.getElementById('wf-inspect-prev').textContent = info.prev;
      document.getElementById('wf-inspect-curr').textContent = info.curr;
      document.getElementById('wf-inspect-next').textContent = info.next;
    }
  };

  window.toggleWorkflowAutoplay = function () {
    if (isAutoplayingWorkflow) {
      stopWorkflowAutoplay();
    } else {
      startWorkflowAutoplay();
    }
  };

  function startWorkflowAutoplay() {
    isAutoplayingWorkflow = true;
    document.getElementById('wf-play-icon').textContent = '⏸';
    document.getElementById('wf-play-text').textContent = 'Pause Cycle';
    
    workflowTimer = setInterval(() => {
      let nextStep = activeWfStep + 1;
      if (nextStep > 8) nextStep = 1;
      selectWorkflowStep(nextStep);
    }, 2400);
  }

  function stopWorkflowAutoplay() {
    isAutoplayingWorkflow = false;
    clearInterval(workflowTimer);
    document.getElementById('wf-play-icon').textContent = '▶';
    document.getElementById('wf-play-text').textContent = 'Auto-Cycle Workflow';
  }

  // --------------------------------------------------------------------------
  // SLIDE 07: ROUTE & SHELTER DECISION LAYERS
  // --------------------------------------------------------------------------
  window.focusRouteLayer = function (layerKey) {
    const rows = document.querySelectorAll('.matrix-row');
    rows.forEach((r) => r.classList.remove('focused'));

    const targetRow = document.getElementById(`row-${layerKey}`);
    if (targetRow) targetRow.classList.add('focused');

    const routeA = document.getElementById('shortest-route-line');
    const routeB = document.getElementById('safe-route-line');

    if (layerKey === 'road') {
      routeA.style.stroke = '#FF965C';
      routeA.style.strokeWidth = '3';
      routeB.style.stroke = 'var(--teal)';
      routeB.style.strokeWidth = '5';
    } else if (layerKey === 'blocked') {
      routeA.style.stroke = '#FF5E7E';
      routeA.style.strokeWidth = '6';
      routeB.style.stroke = 'rgba(32, 197, 181, 0.4)';
      routeB.style.strokeWidth = '3';
    } else if (layerKey === 'shelter') {
      routeA.style.stroke = '#FF965C';
      routeB.style.stroke = 'var(--lime)';
      routeB.style.strokeWidth = '6';
    }
  };

  // --------------------------------------------------------------------------
  // SLIDE 08: DYNAMIC REPLANNING ENGINE SIMULATION (CORE DEMO)
  // --------------------------------------------------------------------------
  let simState = 'INITIAL'; // INITIAL -> SIMULATING -> AWAITING_APPROVAL -> APPROVED

  window.triggerFloodSimulation = function () {
    if (simState === 'SIMULATING' || simState === 'AWAITING_APPROVAL') return;

    simState = 'SIMULATING';

    // 1. Update Buttons & UI State
    document.getElementById('btn-simulate-flood').disabled = true;
    const simStatusText = document.getElementById('sim-status-text');
    const simBeacon = document.querySelector('.status-beacon-sim');
    const engineStatus = document.getElementById('engine-status-pill');

    simBeacon.className = 'status-beacon-sim alert';
    simStatusText.innerHTML = '<strong style="color:var(--orange);">ALERT TRIGGERED:</strong> Route A water level rising above 1.4m. Commencing dynamic recalculation...';
    engineStatus.textContent = 'REPLANNING ACTIVE';
    engineStatus.style.background = 'var(--orange-dim)';
    engineStatus.style.color = 'var(--orange)';

    // 2. Animate Water Level Rising on Map
    const floodPatch = document.getElementById('flood-water-patch');
    const floodLabel = document.getElementById('flood-label-text');
    const routeALine = document.getElementById('sim-route-a');
    const routeBLine = document.getElementById('sim-route-b');
    const routeAStatus = document.getElementById('route-a-status-pill');
    const stepBox2 = document.getElementById('step-box-2');

    floodPatch.setAttribute('fill', 'rgba(255, 150, 92, 0.45)');
    floodPatch.setAttribute('stroke', '#FF965C');
    floodLabel.style.opacity = '1';

    routeALine.setAttribute('stroke', '#FF965C');
    routeALine.setAttribute('stroke-dasharray', '8,6');
    routeAStatus.textContent = 'FLOODED CLOSURE';
    routeAStatus.className = 'step-tag';
    routeAStatus.style.background = 'var(--orange-dim)';
    routeAStatus.style.color = 'var(--orange)';
    stepBox2.classList.add('alert');

    // 3. Step 01: Detect & verify
    const step1 = document.getElementById('replan-step-1');
    step1.classList.add('active-step');
    setTimeout(() => {
      step1.classList.remove('active-step');
      step1.classList.add('completed-step');
      step1.querySelector('.replan-check').textContent = '✓';

      // Step 02: Find impact
      const step2 = document.getElementById('replan-step-2');
      step2.classList.add('active-step');
      setTimeout(() => {
        step2.classList.remove('active-step');
        step2.classList.add('completed-step');
        step2.querySelector('.replan-check').textContent = '✓';

        // Step 03: Recalculate with NetworkX
        const step3 = document.getElementById('replan-step-3');
        step3.classList.add('active-step');
        routeBLine.setAttribute('stroke', 'var(--cyan)');
        routeBLine.setAttribute('stroke-width', '5');
        routeBLine.setAttribute('stroke-dasharray', '0');

        const routeBStatus = document.getElementById('route-b-status-pill');
        const stepBox3 = document.getElementById('step-box-3');
        routeBStatus.textContent = 'ACCESSIBLE PATH';
        routeBStatus.style.background = 'var(--cyan-dim)';
        routeBStatus.style.color = 'var(--cyan)';
        stepBox3.classList.add('active');

        setTimeout(() => {
          step3.classList.remove('active-step');
          step3.classList.add('completed-step');
          step3.querySelector('.replan-check').textContent = '✓';

          // Step 04: Check capacity
          const step4 = document.getElementById('replan-step-4');
          step4.classList.add('active-step');
          const destEastCircle = document.getElementById('dest-east-circle');
          destEastCircle.setAttribute('stroke', 'var(--lime)');
          destEastCircle.setAttribute('stroke-width', '3');

          setTimeout(() => {
            step4.classList.remove('active-step');
            step4.classList.add('completed-step');
            step4.querySelector('.replan-check').textContent = '✓';

            // Step 05: Re-optimize with Google OR-Tools
            const step5 = document.getElementById('replan-step-5');
            step5.classList.add('active-step');
            setTimeout(() => {
              step5.classList.remove('active-step');
              step5.classList.add('completed-step');
              step5.querySelector('.replan-check').textContent = '✓';

              // Step 06: Send for Human Approval
              const step6 = document.getElementById('replan-step-6');
              step6.classList.add('active-step');

              simState = 'AWAITING_APPROVAL';
              simStatusText.innerHTML = '<strong style="color:var(--lime);">ADAPTIVE RE-ROUTE COMPUTED:</strong> Route B via East Haven validated. Waiting for coordinator approval.';

              // Enable Human Approval Button
              const approveBtn = document.getElementById('btn-approve-plan');
              approveBtn.classList.remove('disabled');
              approveBtn.disabled = false;
              document.getElementById('approval-instruction-text').innerHTML = 
                '<strong>REVISED PLAN READY:</strong> Divert Ambulance 04 to East Haven Safe Hub via elevated Route B.';
            }, 600);
          }, 600);
        }, 700);
      }, 600);
    }, 600);
  };

  window.approveRevisedPlan = function () {
    if (simState !== 'AWAITING_APPROVAL') return;

    simState = 'APPROVED';

    const approveBtn = document.getElementById('btn-approve-plan');
    approveBtn.classList.add('disabled');
    approveBtn.disabled = true;

    const step6 = document.getElementById('replan-step-6');
    step6.classList.remove('active-step');
    step6.classList.add('completed-step');
    step6.querySelector('.replan-check').textContent = '✓';

    const simStatusText = document.getElementById('sim-status-text');
    const simBeacon = document.querySelector('.status-beacon-sim');
    simBeacon.className = 'status-beacon-sim';
    simStatusText.innerHTML = '<strong style="color:var(--lime);">COORDINATOR APPROVED:</strong> Ambulance dispatched along Route B. Audit trail logged.';

    const destStatusPill = document.getElementById('destination-status-pill');
    const stepBox4 = document.getElementById('step-box-4');
    destStatusPill.textContent = 'East Haven Safe Hub';
    destStatusPill.style.background = 'var(--lime-dim)';
    destStatusPill.style.color = 'var(--lime)';
    stepBox4.classList.add('active');

    // Move ambulance along Route B
    const ambulance = document.getElementById('ambulance-token');
    ambulance.style.transition = 'transform 2.2s cubic-bezier(0.25, 1, 0.5, 1)';
    ambulance.setAttribute('transform', 'translate(470, 280)');

    document.getElementById('approval-instruction-text').textContent = 
      'PLAN EXECUTED: Dispatched successfully to East Haven Safe Hub with verified medical capacity.';
    document.getElementById('btn-simulate-flood').disabled = true;
  };

  window.resetFloodSimulation = function () {
    simState = 'INITIAL';

    document.getElementById('btn-simulate-flood').disabled = false;
    const approveBtn = document.getElementById('btn-approve-plan');
    approveBtn.classList.add('disabled');
    approveBtn.disabled = true;

    // Reset status text
    const simStatusText = document.getElementById('sim-status-text');
    const simBeacon = document.querySelector('.status-beacon-sim');
    const engineStatus = document.getElementById('engine-status-pill');
    simBeacon.className = 'status-beacon-sim';
    simStatusText.textContent = 'INITIAL STATUS: Ambulance Unit 04 dispatched via Route A to North Relief Depot';
    engineStatus.textContent = 'STANDBY';
    engineStatus.style.background = 'var(--teal-dim)';
    engineStatus.style.color = 'var(--teal)';

    // Reset SVG map
    const floodPatch = document.getElementById('flood-water-patch');
    const floodLabel = document.getElementById('flood-label-text');
    const routeALine = document.getElementById('sim-route-a');
    const routeBLine = document.getElementById('sim-route-b');
    const ambulance = document.getElementById('ambulance-token');

    floodPatch.setAttribute('fill', 'rgba(255, 150, 92, 0)');
    floodPatch.setAttribute('stroke', 'rgba(255, 150, 92, 0)');
    floodLabel.style.opacity = '0';

    routeALine.setAttribute('stroke', 'var(--teal)');
    routeALine.setAttribute('stroke-dasharray', '0');

    routeBLine.setAttribute('stroke', 'rgba(66, 217, 232, 0.2)');
    routeBLine.setAttribute('stroke-width', '4');
    routeBLine.setAttribute('stroke-dasharray', '6,4');

    ambulance.style.transition = 'none';
    ambulance.setAttribute('transform', 'translate(60, 190)');

    const destEastCircle = document.getElementById('dest-east-circle');
    destEastCircle.setAttribute('stroke', 'rgba(155, 228, 91, 0.4)');
    destEastCircle.setAttribute('stroke-width', '2');

    // Reset steps
    for (let i = 1; i <= 6; i++) {
      const step = document.getElementById(`replan-step-${i}`);
      step.className = 'replan-step-card';
      step.querySelector('.replan-check').textContent = '○';
    }

    // Reset flow boxes
    document.getElementById('route-a-status-pill').textContent = 'Clear Route';
    document.getElementById('route-a-status-pill').style.background = 'var(--teal-dim)';
    document.getElementById('route-a-status-pill').style.color = 'var(--teal)';
    document.getElementById('step-box-2').className = 'flow-step-box';

    document.getElementById('route-b-status-pill').textContent = 'Standby';
    document.getElementById('route-b-status-pill').style.background = 'transparent';
    document.getElementById('route-b-status-pill').style.color = 'var(--text-secondary)';
    document.getElementById('step-box-3').className = 'flow-step-box';

    document.getElementById('destination-status-pill').textContent = 'North Depot';
    document.getElementById('destination-status-pill').style.background = 'transparent';
    document.getElementById('destination-status-pill').style.color = 'var(--text-secondary)';
    document.getElementById('step-box-4').className = 'flow-step-box';

    document.getElementById('approval-instruction-text').textContent = 
      'Scenario running. If flooding triggers, revised plan requires coordinator confirmation.';
  };

  // --------------------------------------------------------------------------
  // SLIDE 09: TECHNICAL ARCHITECTURE INSPECTOR
  // --------------------------------------------------------------------------
  window.inspectTech = function (name, layer, desc) {
    document.getElementById('arch-drawer-title').textContent = name;
    document.getElementById('arch-drawer-layer').textContent = `LAYER: ${layer}`;
    document.getElementById('arch-drawer-desc').textContent = desc;

    const drawer = document.getElementById('arch-detail-drawer');
    drawer.style.borderColor = 'var(--cyan)';
    drawer.style.boxShadow = '0 0 20px rgba(66, 217, 232, 0.25)';
  };

  window.closeArchDrawer = function () {
    const drawer = document.getElementById('arch-detail-drawer');
    drawer.style.borderColor = 'var(--teal)';
    drawer.style.boxShadow = 'none';
  };

  // --------------------------------------------------------------------------
  // EXPOSE GLOBAL NAVIGATION FUNCTIONS
  // --------------------------------------------------------------------------
  window.goToSlide = goToSlide;
  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresentation);
  } else {
    initPresentation();
  }

})();
