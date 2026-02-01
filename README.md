Chemical Equipment Parameter Visualizer
Hybrid Web + Desktop Application

This project is developed as part of the FOSSEE Web-Based Application Internship .
It is a hybrid application consisting of a common Django backend, a React-based web frontend,and a PyQt5 desktop application.

--------------------------------------------------
PROJECT OVERVIEW
--------------------------------------------------
The application allows users to upload a CSV file containing chemical equipment parameters
such as Flowrate, Pressure, and Temperature.

The Django backend processes the data, computes analytics, stores upload history,
and exposes REST APIs that are consumed by both the Web and Desktop applications.

--------------------------------------------------
KEY FEATURES
--------------------------------------------------
- Basic authentication (login required)
- CSV upload and validation
- Data analytics:
  * Total equipment count
  * Average Flowrate
  * Average Pressure
  * Average Temperature
  * Equipment type distribution
- Data visualization:
  * Web: Chart.js
  * Desktop: Matplotlib
- History management:
  * Stores only the last 5 uploaded datasets
- PDF report generation with summary and charts

--------------------------------------------------
TECH STACK
--------------------------------------------------
Backend:
- Python
- Django
- Django REST Framework
- Pandas
- SQLite
- ReportLab

Web Frontend:
- React.js
- Chart.js

Desktop Frontend:
- PyQt5
- Matplotlib

Version Control:
- Git
- GitHub

--------------------------------------------------
PROJECT STRUCTURE
--------------------------------------------------
project-root/
|-- backend/
|-- web-frontend/
|-- desktop/
|-- README.txt

--------------------------------------------------
SETUP & INSTALLATION
--------------------------------------------------
Prerequisites:
- Python 3.9+
- Node.js & npm
- Git

-----------------
BACKEND SETUP
-----------------
cd backend
python -m venv venv

Activate virtual environment:
Windows:
venv\Scripts\activate

Linux / macOS:
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

Run migrations:
python manage.py makemigrations
python manage.py migrate

Start server:
python manage.py runserver

Backend URL:
http://127.0.0.1:8000

-----------------
WEB APP SETUP
-----------------
cd web-frontend
npm install
npm run dev

Web App URL:
http://localhost:5173

-----------------
DESKTOP APP SETUP
-----------------
Ensure backend is running.
cd desktop
python main.py

--------------------------------------------------
HOW TO USE
--------------------------------------------------
1. Start Django backend
2. Open Web or Desktop application
3. Login
4. Upload CSV file
5. View table, charts, and summary
6. Download PDF report

--------------------------------------------------
CSV DATA FORMAT
--------------------------------------------------
Required CSV columns:
Equipment Name, Type, Flowrate, Pressure, Temperature

- Column names are case-insensitive
- Invalid CSV files are rejected

--------------------------------------------------
SUBMISSION NOTE
--------------------------------------------------
The application is fully functional on localhost.
Deployment is optional as per the screening task guidelines.

--------------------------------------------------
