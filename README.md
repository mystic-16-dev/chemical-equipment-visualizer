# Chemical Equipment Parameter Visualizer
## Hybrid Web + Desktop Application

A full-stack application for visualizing and analyzing chemical equipment data (Flowrate, Pressure, Temperature, etc.). This project consists of a central Django backend, a React.js web frontend, and a PyQt5 desktop client.

### 📋 Project Overview
- **Backend**: Django REST Framework API for data processing, analytics, and history management.
- **Web App**: Modern React dashboard with drag-and-drop upload and interactive Chart.js visualizations.
- **Desktop App**: Native PyQt5 application with dark mode UI, offering the same analytics capabilities.
- **Features**: 
    - Full Authentication (Login/Register)
    - CSV Data Analysis (Auto-calculation of averages and distributions)
    - PDF Report Generation (with charts and tables)
    - Data Persistence (User history, synced across Web and Desktop)

### 🛠 Tech Stack
| Component | Technologies |
|-----------|--------------|
| **Backend** | Python, Django, Django REST Framework, Boolean-Pandas, SQLite, ReportLab |
| **Web Frontend** | JavaScript, React.js, Chart.js, CSS |
| **Desktop Frontend**| Python, PyQt5, Matplotlib |
| **Version Control** | Git, GitHub |

---

### 🚀 Setup & Installation

#### Prerequisite
- Python 3.9+
- Node.js & npm

#### 1. Backend Setup
1. Open terminal in `backend/` folder.
2. Create virtual env: `python -m venv venv`
3. Activate env: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies (covers both Backend & Desktop): 
   ```bash
   pip install -r requirements.txt
   ```
5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Start Server:
   ```bash
   python manage.py runserver
   ```
   *Server runs at http://127.0.0.1:8000*

#### 2. Web Application Setup
1. Open new terminal in `frontend/` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start React App:
   ```bash
   npm run dev
   ```
   *App runs at http://localhost:5173* (or similar)

#### 3. Desktop Application Setup
1. Open new terminal in `desktop/` folder (or root).
2. Ensure you have installed the requirements from Step 1.
3. Run the App:
   ```bash
   python desktop/main.py
   ```

### 📂 How to Run
1. Ensure Backend is running on port 8000.
2. **Web**: Login at the web URL. Go to Dashboard -> Upload CSV -> View Charts -> Download Report.
3. **Desktop**: Launch app -> Login -> Upload CSV -> Switch Tabs to view Datatable or Charts -> Download Report.

### 📜 Data Format
CSV files must contain:
`EquipmentType`, `Flowrate`, `Pressure`, `Temperature` (Headers are case-insensitive).

---

