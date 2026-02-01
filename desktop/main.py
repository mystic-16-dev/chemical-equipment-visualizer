import sys
import os
from PyQt5.QtWidgets import QApplication, QMessageBox
from api_client import APIClient
from ui.login_window import LoginWindow
from ui.dashboard_window import DashboardWindow

def main():
    app = QApplication(sys.argv)
    
    # Load Stylesheet
    # Use path relative to this script file to ensure it works from any CWD
    base_dir = os.path.dirname(os.path.abspath(__file__))
    style_path = os.path.join(base_dir, "styles.qss")
    
    try:
        with open(style_path, "r") as f:
            app.setStyleSheet(f.read())
    except FileNotFoundError:
        print(f"Warning: {style_path} not found, using default style.")

    # Check if backend is running (optional check, or handled by login error)
    api = APIClient()

    # Show Login
    login = LoginWindow(api)
    if login.exec_() == LoginWindow.Accepted:
        # If login success, show dashboard
        dashboard = DashboardWindow(api)
        dashboard.show()
        sys.exit(app.exec_())
    else:
        sys.exit(0)

if __name__ == "__main__":
    main()
