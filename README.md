# ⛈️ ThunderCast AI: Multi-Source AI/ML Thunderstorm & Lightning Nowcasting Platform

> **From Multi-Source Atmospheric Observations to Explainable 0–120 Minute Severe Weather Intelligence**

---

## 🎯 Smart India Hackathon 2026

**Problem Statement:** SIH26072  
**Organization:** Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)

**Problem Statement:**  
*AIML based Nowcasting of thunderstorm and lightning using atmospheric observation including multiple radars, satellite, lightning and model data.*

### Team Members

**Team Leader:** Medhansh Garg

**Team Member:** Krish Bharti

**Team Member:** Prateek Sangwan

**Team Member:** Vivaan Tamrakar

**Team Member:** Mayank Aggarwal

**Team Member:** Kumkum Thakur


---

## 🌩️ Overview

Thunderstorms and lightning are rapidly evolving weather hazards that can develop, intensify and change direction within a short period of time.

Accurate nowcasting therefore requires more than observing a single weather source.

**ThunderCast AI** is a multi-source AI/ML-based thunderstorm and lightning nowcasting and decision-support platform designed to combine:

- 📡 Multiple Doppler Weather Radars
- 🛰️ INSAT Satellite Observations
- ⚡ Lightning Observations
- 🌍 Numerical Weather Prediction / Atmospheric Data
- 🌡️ Thermodynamic & Environmental Parameters

into a unified storm-intelligence pipeline.

The proposed system performs:

**Observe → Fuse → Detect → Track → Predict → Assess → Warn**

ThunderCast is designed to detect individual storm cells, monitor their evolution, predict their movement and intensity for up to **120 minutes**, estimate location-specific hazards and transform complex meteorological information into actionable early-warning intelligence.

---

# 🚀 Key Features

### 📡 Multi-Source Weather Data Fusion

Designed to combine heterogeneous information from:

- Multiple weather radars
- INSAT-3D/3DR satellite products
- Lightning observations
- NWP/model data
- Atmospheric environmental parameters

Different datasets can be spatially and temporally aligned before being provided to the AI/ML pipeline.

---

### 🗺️ Interactive Meteorological Command Centre

A **Leaflet.js-based interactive geospatial interface** provides a unified visualization of the evolving weather situation.

Features include:

- Radar visualization
- Lightning activity
- Radar coverage rings
- Storm-cell visualization
- Storm trajectory vectors
- Predicted storm footprints
- Risk/impact regions
- Independent weather-layer controls
- Interactive zoom and pan

---

### 🌩️ Automated Storm Cell Detection & Tracking

ThunderCast is designed to identify individual convective storm cells and continuously monitor:

- Location
- Movement direction
- Movement speed
- Storm intensity
- Radar reflectivity
- Lightning activity
- Growth/decay trend
- Predicted trajectory

Each detected storm can be assigned a unique identifier such as:

**Storm Cell T-01**

---

### 🧠 AI/ML Thunderstorm Nowcasting

The proposed AI pipeline uses multi-source spatial and temporal weather information to estimate storm evolution at:

**+30 min → +60 min → +90 min → +120 min**

The architecture supports spatiotemporal deep-learning approaches such as:

- U-Net-style spatial architectures
- ConvLSTM-style temporal architectures
- Multi-modal feature fusion

The intended outputs include:

- Thunderstorm probability
- Lightning risk
- Future storm location
- Storm trajectory
- Intensity evolution
- Future storm footprint

---

### ⚡ Lightning Risk Intelligence

Lightning information is analysed together with storm evolution rather than being treated only as an independent visualization layer.

ThunderCast is designed to estimate:

- Lightning activity
- Lightning probability
- Spatial lightning risk
- Lightning activity trends
- Threatened regions

This enables a combined:

**Thunderstorm + Lightning Nowcasting Workflow**

---

### 🌡️ 3D Atmospheric Environment

ThunderCast incorporates environmental information relevant to convective storm development.

Important parameters include:

| Parameter | Meteorological Role |
|---|---|
| **CAPE** | Atmospheric instability |
| **CIN** | Convective inhibition |
| **Wind Shear** | Storm organization and evolution |
| **Atmospheric Moisture** | Moisture availability for convection |
| **Temperature** | Surface/environmental thermal state |
| **Dew Point** | Near-surface moisture conditions |
| **Upper-Level Winds** | Storm steering/environment |

Historical ERA5/reanalysis information can support atmospheric analysis, model development, historical-event reconstruction and feature engineering.

For prototype demonstrations where operational atmospheric data is unavailable, synthetic environmental fields are explicitly labelled as **simulated data**.

---

### 🔍 Explainable Storm Intelligence

ThunderCast does not aim to provide only a final probability.

The platform is designed to communicate **why storm risk may be increasing**.

Example:

**CAPE ↑**  
**CIN ↓**  
**Atmospheric Moisture ↑**  
**Wind Shear Supportive**  
**Radar Reflectivity ↑**  
**Lightning Activity ↑**  
**Cloud Tops Cooling**

↓

### ⚠️ Rapid Intensification Likely

This explainability layer can help meteorologists and decision-makers understand the environmental and observational signals contributing to an AI-generated assessment.

---

### 🛡️ Location-Specific Risk Assessment

AI nowcasts are converted into actionable hazard information.

Potential outputs include:

- Affected region
- Expected storm arrival
- Thunderstorm severity
- Lightning risk
- Heavy rainfall risk
- Strong-wind/gust risk
- Forecast confidence
- Available warning lead time

This transforms:

**Weather Prediction → Risk Intelligence → Early Warning**

---

# 🎬 Six-Hour Storm Lifecycle Simulation

A key prototype feature is an interactive storm-event simulation.

Approximately:

### **6 Hours of Storm Evolution → Compressed into ~5 Minutes**

The simulation demonstrates:

**Initial Instability**

↓

**Storm Initiation**

↓

**Rapid Intensification**

↓

**Mature / Severe Thunderstorm**

↓

**Storm Movement**

↓

**Threat Identification**

↓

**Early Warning**

↓

**Weakening**

↓

**Dissipation**

During the simulation, multiple parameters evolve dynamically, including:

- Radar reflectivity
- Storm size
- Storm position
- Lightning activity
- Rainfall intensity
- Atmospheric instability
- Wind conditions
- Thunderstorm probability
- Lightning probability
- Severity level

The simulation provides a deterministic demonstration environment so that the complete ThunderCast workflow can be presented reliably during SIH evaluation.

---

# 🧩 System Architecture

ThunderCast follows a modular end-to-end pipeline:

```text
MULTI-SOURCE WEATHER DATA
        │
        ├── Doppler Weather Radars
        ├── INSAT Satellite
        ├── Lightning Observations
        └── NWP / Atmospheric Environment
        │
        ▼
DATA PREPROCESSING
        │
        ├── Quality Control
        ├── Spatial Alignment
        ├── Temporal Alignment
        └── Feature Generation
        │
        ▼
MULTI-MODAL DATA FUSION
        │
        ▼
STORM CELL DETECTION
        │
        ▼
STORM TRACKING
        │
        ▼
AI / ML NOWCASTING ENGINE
        │
        ├── +30 Minutes
        ├── +60 Minutes
        ├── +90 Minutes
        └── +120 Minutes
        │
        ▼
RISK ASSESSMENT
        │
        ▼
EARLY WARNING
        │
        ▼
INTERACTIVE DECISION-SUPPORT DASHBOARD
```

---

# 🧠 Proposed AI/ML Architecture

ThunderCast is designed around a multi-modal spatiotemporal AI pipeline.

```text
Radar Reflectivity
        +
Satellite Brightness Temperature
        +
Lightning Observations
        +
Atmospheric / NWP Features
        │
        ▼
Spatial + Temporal Alignment
        │
        ▼
Multi-Modal Feature Fusion
        │
        ▼
Spatial / Temporal AI Models
(U-Net / ConvLSTM-style architecture)
        │
        ▼
Storm Detection + Tracking
        │
        ▼
0–120 Minute Nowcast
        │
        ▼
Risk & Early Warning
```

The final model architecture will be determined through training and validation against historical severe-weather events.

---

# 🛰️ Data Sources & Intended Role

| Data Source | Primary Role |
|---|---|
| **Doppler Weather Radar** | Storm structure, reflectivity, movement and intensity |
| **INSAT-3D/3DR** | Cloud development and cloud-top characteristics |
| **Lightning Observations** | Electrical activity and convective evolution |
| **NWP / Model Data** | Forecast atmospheric environment |
| **ERA5 Reanalysis** | Historical atmospheric analysis, training/replay and feature engineering |
| **Geospatial Data** | Mapping, administrative boundaries and risk visualization |

---

# ⚙️ Technology Stack

### Frontend

- React / TypeScript
- Leaflet.js
- Interactive weather overlays
- Responsive command-centre dashboard

### Backend

- Python
- FastAPI
- REST APIs
- Modular weather-data services

### Meteorological Data Processing

- NumPy
- xarray
- NetCDF4
- rioxarray
- CDS API integration

### AI / ML — Proposed Architecture

- PyTorch / TensorFlow
- U-Net
- ConvLSTM
- Spatiotemporal deep learning
- Multi-modal feature fusion

### Geospatial Visualization

- Leaflet.js
- CartoDB basemap
- Radar overlays
- Lightning canvas visualization
- Storm trajectory vectors
- Risk polygons
- Radar coverage visualization

---

# ⚙️ Core Software Modules

## 1. Multi-Source Data Ingestion

Handles radar, satellite, lightning and atmospheric/model information.

---

## 2. Data Preprocessing & Harmonization

Performs:

- Quality control
- Missing-data handling
- Spatial alignment
- Temporal synchronization
- Resampling
- Feature extraction

---

## 3. Storm Detection & Tracking

Identifies individual storm cells and tracks their movement and evolution over time.

---

## 4. AI Nowcasting Engine

Designed to process spatiotemporal multi-source information and generate short-range storm predictions.

Forecast horizons:

**30 / 60 / 90 / 120 minutes**

---

## 5. Atmospheric Intelligence Module

Processes environmental predictors such as:

- CAPE
- CIN
- Moisture
- Wind shear
- Temperature
- Dew point
- Upper-air winds

---

## 6. Risk Assessment Engine

Converts meteorological predictions into:

- Severity
- Impact area
- Expected arrival
- Hazard probability
- Warning lead time

---

## 7. Explainability Engine

Highlights the meteorological signals contributing to the current prediction.

---

## 8. Early Warning Engine

Transforms risk assessments into structured location-specific warning information.

---

## 9. Interactive GIS Engine

Provides map-based visualization of:

- Radar
- Lightning
- Storm cells
- Storm trajectory
- AI forecasts
- Risk areas
- Atmospheric information

---

## 10. Storm Simulation & Event Replay

Demonstrates the full storm lifecycle and allows the complete ThunderCast workflow to be tested without depending on a live severe-weather event.

---

# 🧪 Prototype Workflow

```text
1. Multi-source atmospheric information is ingested
                    ↓
2. Data is cleaned and spatially/temporally aligned
                    ↓
3. Storm Cell T-01 is detected
                    ↓
4. Cell movement and intensity are tracked
                    ↓
5. Atmospheric environment is analysed
                    ↓
6. AI generates +30/+60/+90/+120 min nowcasts
                    ↓
7. Future storm trajectory and risk zones are generated
                    ↓
8. Threatened locations and expected arrival are estimated
                    ↓
9. Explainability layer identifies prediction drivers
                    ↓
10. Early-warning information is generated
                    ↓
11. Forecast continuously updates as the storm evolves
```

---

# 📊 Model Validation Framework

A meteorological AI system must be evaluated against observed events.

ThunderCast therefore includes a proposed validation framework using standard metrics such as:

| Metric | Purpose |
|---|---|
| **POD — Probability of Detection** | Measures successful detection of observed events |
| **FAR — False Alarm Ratio** | Measures false warnings |
| **CSI — Critical Success Index** | Measures overall event-detection skill |

Validation can be performed separately at:

**+30 min | +60 min | +90 min | +120 min**

The intended evaluation framework compares:

**AI Forecast vs Baseline Forecast vs Actual Observation**

> **Note:** The current prototype demonstrates the validation architecture. Final performance metrics require training and evaluation using historical meteorological datasets and are not claimed as validated operational accuracy.

---

# 🛡️ Reliability & Graceful Degradation

Real meteorological systems can experience missing or delayed data.

ThunderCast is therefore designed around modular data sources.

If one source becomes unavailable:

```text
One Input Degraded
        ↓
Data Health Module Detects Failure
        ↓
Remaining Available Sources Continue
        ↓
Forecast Confidence Adjusted
        ↓
User Informed of Degraded Data State
```

This architecture avoids making the entire platform dependent on a single observation source.

---

# 🆚 How ThunderCast Complements Existing Systems

ThunderCast is **not intended to replace IMD or existing government warning platforms**.

It is designed as an additional AI-powered intelligence and decision-support layer.

| Existing Capability | ThunderCast Proposed Enhancement |
|---|---|
| Multiple meteorological products | Unified multi-modal AI pipeline |
| Current/recent storm observations | Storm evolution prediction |
| Radar-based nowcasting | Multi-source AI-assisted nowcasting |
| Lightning monitoring/alerts | Joint storm + lightning risk intelligence |
| Weather warnings | Dynamic storm-cell-level risk assessment |
| Meteorological model outputs | Explainable prediction drivers |
| Separate visualization products | Unified interactive command centre |
| Forecast output | Prediction → Risk → Early-warning workflow |

The objective is to transform:

### **Multi-Source Observations → Predictive Intelligence → Actionable Risk**

---

# 👥 Intended Users

ThunderCast can support:

- 🌦️ Meteorologists & Weather Forecasters
- 🚨 Disaster Management Authorities
- 🏛️ State & District Administration
- ✈️ Aviation Operations
- 🚆 Transport & Rail Networks
- 🏗️ Critical Infrastructure Operators
- 🚑 Emergency Response Agencies

---

# 🌍 Potential Impact

ThunderCast aims to support:

- Earlier identification of rapidly developing thunderstorms
- Improved storm trajectory awareness
- Location-specific lightning risk intelligence
- Better understanding of storm intensification
- Increased warning lead time
- Faster disaster-response decisions
- Unified visualization of heterogeneous weather information
- Data-driven severe-weather decision support

---

# 🔮 Development Roadmap

### Phase 1 — Current SIH Prototype

- Interactive Leaflet weather map
- Weather-layer visualization
- Storm Cell T-01 demonstration
- Storm trajectory visualization
- 0–120 minute forecast visualization
- Atmospheric environment panel
- Explainability interface
- Risk/early-warning interface
- Six-hour storm simulation

### Phase 2 — Historical Data Integration

- Historical radar datasets
- INSAT satellite data
- Lightning datasets
- ERA5/NWP environmental information
- Multi-source spatial/temporal alignment

### Phase 3 — AI Model Development

- Training dataset generation
- U-Net/ConvLSTM experimentation
- Storm-cell tracking model
- Lightning-risk modelling
- Hyperparameter optimization

### Phase 4 — Historical Validation

- Historical severe-weather event testing
- POD/FAR/CSI evaluation
- Lead-time-wise performance analysis
- AI vs baseline comparison

### Phase 5 — Operational Pilot

- Real-time data feeds
- Live inference pipeline
- Data-health monitoring
- Meteorologist feedback
- Pilot deployment within selected radar domain

### Phase 6 — Scale-Up

- Multi-radar deployment
- Regional expansion
- API integration
- Government warning-system interoperability
- Pan-India scalability

---

# 🎯 What Makes ThunderCast Different?

ThunderCast does not aim to be another weather-display application.

Its core concept is:

### **Observe → Understand → Predict → Explain → Warn**

The proposed platform combines multi-source atmospheric observations into a single AI-driven workflow capable of tracking individual storms, predicting their evolution and translating complex meteorological information into understandable risk intelligence.

---

# ⚠️ Prototype & Data Disclaimer

ThunderCast AI is currently an **SIH prototype and research concept**.

Certain atmospheric values, storm trajectories, risk assessments and event-replay data used in the demonstration are synthetic/simulated and are explicitly intended to demonstrate the proposed workflow.

The project does **not** claim operational forecast accuracy at the current stage.

Operational deployment would require:

- Authorized/appropriate real-time meteorological data feeds
- Historical training datasets
- Model training
- Independent validation
- Meteorological expert review
- Operational infrastructure testing

This distinction between **prototype demonstration** and **validated operational forecasting** is intentionally maintained throughout the project.

---

# 🏆 SIH26072

### Problem

Thunderstorms and lightning evolve rapidly, while the relevant information is distributed across radar, satellite, lightning and atmospheric/model datasets.

### Our Approach

**Fuse multi-source weather observations using AI/ML to detect, track and predict storm evolution.**

### Intended Output

**0–120 minute explainable thunderstorm & lightning risk intelligence.**

### Ultimate Goal

> **Convert complex atmospheric observations into timely, location-specific and actionable early warnings.**

---

# ⛈️ ThunderCast AI

### **Observe. Understand. Predict. Warn. Protect.**

**Smart India Hackathon 2026 — SIH26072**
## Prototype Video Link - https://www.youtube.com/watch?v=oVpKFteOI-c

