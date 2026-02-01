from PyQt5.QtWidgets import QMainWindow, QWidget, QVBoxLayout, QTabWidget
from api_client import APIClient
from ui.dashboard_tab import DashboardTab
from ui.history_tab import HistoryTab

class DashboardWindow(QMainWindow):
    def __init__(self, api_client):
        super().__init__()
        self.api_client = api_client
        self.setWindowTitle("Chemical Equipment Visualizer")
        self.resize(1000, 700)
        
        self.init_ui()

    def init_ui(self):
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)

        # Tabs
        self.tabs = QTabWidget()
        layout.addWidget(self.tabs)

        self.dashboard_tab = DashboardTab(self.api_client)
        self.tabs.addTab(self.dashboard_tab, "Dashboard")
        
        self.history_tab = HistoryTab(self.api_client)
        self.history_tab.dataset_selected.connect(self.load_history_dataset)
        self.tabs.addTab(self.history_tab, "History")

    def load_history_dataset(self, dataset_id, dataset_name):
        self.tabs.setCurrentIndex(0) # Switch to Dashboard
        self.dashboard_tab.load_dataset(dataset_id, dataset_name)
