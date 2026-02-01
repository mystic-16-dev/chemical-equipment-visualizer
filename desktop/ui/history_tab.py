from PyQt5.QtWidgets import QWidget, QVBoxLayout, QListWidget, QListWidgetItem, QLabel
from PyQt5.QtCore import Qt, pyqtSignal
import datetime

class HistoryTab(QWidget):
    dataset_selected = pyqtSignal(int, str) # id, name

    def __init__(self, api_client):
        super().__init__()
        self.api_client = api_client
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)

        self.label = QLabel("Recent Uploads (Last 5)")
        layout.addWidget(self.label)

        self.history_list = QListWidget()
        self.history_list.itemDoubleClicked.connect(self.on_item_double_clicked)
        layout.addWidget(self.history_list)

        # Refresh Button (optional, but good for UX)
        # For now, we auto-refresh when tab is shown or just once on init?
        # Let's just load on init for simplicity, user can restart app to refresh or we add a btn
        self.load_history()

    def load_history(self):
        self.history_list.clear()
        history_data = self.api_client.get_history()
        
        if not history_data:
            self.history_list.addItem("No history found.")
            return

        for item in history_data:
            # item = {'id': 1, 'dataset_name': 'foo.csv', 'upload_timestamp': '...'}
            name = item.get('dataset_name', 'Unknown')
            timestamp = item.get('upload_timestamp', '')
            
            # Simple formatting
            display_text = f"{name} \n   Uploaded: {timestamp}"
            
            list_item = QListWidgetItem(display_text)
            list_item.setData(Qt.UserRole, item['id']) # Store ID
            self.history_list.addItem(list_item)


    def on_item_double_clicked(self, item):
        # We stored simple text...
        # Wait, better to store ID in the item.
        data_id = item.data(Qt.UserRole)
        name = item.text().split('\n')[0].strip()
        
        if data_id:
             self.dataset_selected.emit(data_id, name)
