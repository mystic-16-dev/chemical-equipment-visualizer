from PyQt5.QtWidgets import QWidget, QVBoxLayout
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import numpy as np

class MplCanvas(FigureCanvas):
    def __init__(self, parent=None, width=5, height=4, dpi=100):
        self.fig = Figure(figsize=(width, height), dpi=dpi)
        self.axes = self.fig.add_subplot(111)
        super(MplCanvas, self).__init__(self.fig)

class ChartWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.layout = QVBoxLayout(self)
        self.canvas = MplCanvas(self, width=5, height=4, dpi=100)
        self.layout.addWidget(self.canvas)
    
    def plot_bar(self, data):
        self.canvas.axes.clear()
        
        # Logic to extract types similar to frontend
        # data is list of dicts: [{'Equipment Name': 'Pump-1', 'Type': 'Pump', ...}]
        type_counts = {}
        for item in data:
            etype = item.get('Type') or item.get('Equipment Type') or item.get('equipment_type') or 'Unknown'
            type_counts[etype] = type_counts.get(etype, 0) + 1
        
        labels = list(type_counts.keys())
        counts = list(type_counts.values())
        
        self.canvas.axes.bar(labels, counts, color='skyblue')
        self.canvas.axes.set_title("Equipment Type Distribution")
        self.canvas.axes.set_ylabel("Count")
        # Rotate x-axis labels for readability
        self.canvas.axes.set_xticks(range(len(labels)))
        self.canvas.axes.set_xticklabels(labels, rotation=45, ha='right')
        self.canvas.fig.tight_layout() # Fix layout
        self.canvas.draw()

    def plot_line(self, data, parameter):
        self.canvas.axes.clear()
        
        # Filter items that have the parameter
        valid_items = [item for item in data if item.get(parameter) is not None]
        # Just plot index vs value for simplicity as per requirements (trend)
        values = [float(item[parameter]) for item in valid_items if str(item[parameter]).replace('.','',1).isdigit()]
        
        self.canvas.axes.plot(values, marker='o', linestyle='-', color='coral')
        self.canvas.axes.set_title(f"{parameter} Trend")
        self.canvas.axes.set_ylabel(parameter)
        self.canvas.draw()
