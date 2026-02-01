from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QLabel, QFileDialog, QTableWidget, QTableWidgetItem, QMessageBox, QTabWidget, QComboBox, QFrame
from ui.widgets.chart_widget import ChartWidget

class DashboardTab(QWidget):
    def __init__(self, api_client):
        super().__init__()
        self.api_client = api_client
        self.current_data = [] # Store current dataset
        self.current_id = None
        self.init_ui()

    def init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setSpacing(20)
        main_layout.setContentsMargins(20, 20, 20, 20)

        # Top Bar: Upload
        top_bar = QHBoxLayout()
        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.setObjectName("primaryButton")
        self.upload_btn.setMinimumHeight(40)
        self.upload_btn.clicked.connect(self.upload_csv)
        
        self.status_label = QLabel("Ready")
        self.status_label.setObjectName("statusLabel")
        
        top_bar.addWidget(self.upload_btn)
        top_bar.addWidget(self.status_label)
        top_bar.addStretch()
        
        # PDF Button (Initially disabled)
        self.pdf_btn = QPushButton("Download Report")
        self.pdf_btn.setObjectName("secondaryButton") 
        self.pdf_btn.setEnabled(False)
        self.pdf_btn.clicked.connect(self.download_pdf)
        top_bar.addWidget(self.pdf_btn)
        
        main_layout.addLayout(top_bar)

        # Stats Area
        self.stats_layout = QHBoxLayout()
        self.stats_layout.setSpacing(15)
        
        # Helper to create stat card
        def create_stat_card(value_text, label_text):
            frame = QFrame()
            frame.setObjectName("StatCard")
            frame.setFrameShape(QFrame.StyledPanel)
            
            flayout = QVBoxLayout(frame)
            flayout.setContentsMargins(15, 15, 15, 15)
            
            val_lbl = QLabel(value_text)
            val_lbl.setObjectName("StatValue") # Will need to add to CSS
            val_lbl.setStyleSheet("font-size: 18pt; font-weight: bold; color: #2D1B69;")
            
            lbl_lbl = QLabel(label_text)
            lbl_lbl.setStyleSheet("color: #666; font-size: 10pt;")
            
            flayout.addWidget(val_lbl)
            flayout.addWidget(lbl_lbl)
            return frame, val_lbl

        self.card_total, self.lbl_total_val = create_stat_card("-", "Total Equipment")
        self.card_flow, self.lbl_flow_val = create_stat_card("-", "Avg Flowrate")
        self.card_press, self.lbl_press_val = create_stat_card("-", "Avg Pressure")
        self.card_temp, self.lbl_temp_val = create_stat_card("-", "Avg Temperature")

        self.stats_layout.addWidget(self.card_total)
        self.stats_layout.addWidget(self.card_flow)
        self.stats_layout.addWidget(self.card_press)
        self.stats_layout.addWidget(self.card_temp)
            
        main_layout.addLayout(self.stats_layout)

        # Content Area: Split into Charts and Table
        content_tabs = QTabWidget()
        
        # Charts Tab
        charts_layout = QVBoxLayout()
        charts_widget = QWidget()
        charts_widget.setLayout(charts_layout)
        
        # Controls for Chart
        chart_controls = QHBoxLayout()
        self.chart_selector = QComboBox()
        self.chart_selector.addItems(["Type Distribution", "Flowrate", "Pressure", "Temperature"])
        self.chart_selector.currentTextChanged.connect(self.update_chart)
        chart_controls.addWidget(QLabel("Select Chart:"))
        chart_controls.addWidget(self.chart_selector)
        chart_controls.addStretch()
        charts_layout.addLayout(chart_controls)

        self.chart_view = ChartWidget()
        charts_layout.addWidget(self.chart_view)
        
        content_tabs.addTab(charts_widget, "Visualization")

        # Table Tab
        self.table_widget = QTableWidget()
        content_tabs.addTab(self.table_widget, "Data Table")

        main_layout.addWidget(content_tabs)

    def upload_csv(self):
        file_path, _ = QFileDialog.getOpenFileName(self, "Open CSV", "", "CSV Files (*.csv)")
        if file_path:
            self.status_label.setText("Uploading...")
            dataset_name = file_path.split('/')[-1]
            response = self.api_client.upload_dataset(file_path, dataset_name)
            
            if response and 'id' in response:
                self.status_label.setText(f"Uploaded: {dataset_name}")
                self.status_label.setText(f"Uploaded: {dataset_name}")
                
                # Fetch full data content for table and charts
                full_data = self.api_client.get_dataset_data(response['id'])
                
                if full_data:
                    self.process_data(full_data)
                
                    # Also load summary for stats
                    summary_resp = self.api_client.get_dataset_summary(response['id'])
                    if summary_resp and 'summary_data' in summary_resp:
                         self.update_stats(summary_resp['summary_data'])
                     
                    self.current_id = response['id']
                    self.pdf_btn.setEnabled(True)
                
                else:
                    self.status_label.setText("Upload Done. (Failed to fetch data)")
            else:
                self.status_label.setText("Upload Failed")
                QMessageBox.warning(self, "Error", "Upload failed.")

    def process_data(self, data):
        self.current_data = data
        self.populate_table(data)
        self.update_chart()

    def populate_table(self, data):
        if not data: return
        
        headers = list(data[0].keys())
        self.table_widget.setColumnCount(len(headers))
        self.table_widget.setRowCount(len(data))
        self.table_widget.setHorizontalHeaderLabels(headers)

        for row_idx, row_data in enumerate(data):
            for col_idx, header in enumerate(headers):
                val = row_data.get(header, "")
                self.table_widget.setItem(row_idx, col_idx, QTableWidgetItem(str(val)))

    def update_chart(self):
        if not self.current_data: return
        
        chart_type = self.chart_selector.currentText()
        if chart_type == "Type Distribution":
            self.chart_view.plot_bar(self.current_data)
        else:
            self.chart_view.plot_line(self.current_data, chart_type)

    def load_dataset(self, dataset_id, dataset_name="Dataset"):
        self.current_id = dataset_id
        self.status_label.setText(f"Loaded: {dataset_name}")
        self.pdf_btn.setEnabled(True)

        # Fetch full data
        full_data = self.api_client.get_dataset_data(dataset_id)
        if full_data:
            self.process_data(full_data)
        
        # Fetch summary for stats
        summary_resp = self.api_client.get_dataset_summary(dataset_id)
        if summary_resp and 'summary_data' in summary_resp:
            self.update_stats(summary_resp['summary_data'])

    def update_stats(self, summary):
        if not summary: return
        self.lbl_total_val.setText(str(summary.get('total_count', 0)))
        self.lbl_flow_val.setText(f"{summary.get('avg_flowrate', 0):.2f}")
        self.lbl_press_val.setText(f"{summary.get('avg_pressure', 0):.2f}")
        self.lbl_temp_val.setText(f"{summary.get('avg_temperature', 0):.2f}")

    def download_pdf(self):
        if not self.current_id: return
        save_path, _ = QFileDialog.getSaveFileName(self, "Save Report", f"report_{self.current_id}.pdf", "PDF Files (*.pdf)")
        if save_path:
            success, msg = self.api_client.download_report(self.current_id, save_path)
            if success:
                 QMessageBox.information(self, "Success", "Report downloaded successfully.")
            else:
                 QMessageBox.critical(self, "Error", f"Download failed: {msg}")
