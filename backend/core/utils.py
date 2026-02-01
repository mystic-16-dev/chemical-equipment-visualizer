import pandas as pd
import numpy as np

REQUIRED_COLUMNS = ['EquipmentType', 'Flowrate', 'Pressure', 'Temperature']

def process_csv_analytics(file_path):
    """
    Parses CSV and returns summary statistics.
    """
    try:
        df = pd.read_csv(file_path)
        
        # Normalize columns: strip spaces, lower case, handles aliases
        # Map known aliases to standard names
        column_mapping = {
            'type': 'EquipmentType',
            'equipment type': 'EquipmentType',
            'equipmenttype': 'EquipmentType',
            'equipment_type': 'EquipmentType',
            'flowrate': 'Flowrate',
            'flow rate': 'Flowrate',
            'flow_rate': 'Flowrate',
            'pressure': 'Pressure',
            'temperature': 'Temperature',
            'temp': 'Temperature'
        }
        
        # Rename columns based on mapping (case insensitive)
        new_columns = {}
        for col in df.columns:
            col_lower = col.strip().lower()
            if col_lower in column_mapping:
                new_columns[col] = column_mapping[col_lower]
        
        df.rename(columns=new_columns, inplace=True)

        # Validation
        missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing_cols:
            return {"error": f"Missing columns: {', '.join(missing_cols)}. Found: {list(df.columns)}"}

        # Basic Checks
        if df.empty:
            return {"error": "Dataset is empty"}

        # Analytics
        total_count = len(df)
        
        # Equipment Type Distribution
        type_dist = df['EquipmentType'].value_counts().to_dict()
        
        # Averages (handling potential non-numeric data gracefully)
        avg_flowrate = pd.to_numeric(df['Flowrate'], errors='coerce').mean()
        avg_pressure = pd.to_numeric(df['Pressure'], errors='coerce').mean()
        avg_temperature = pd.to_numeric(df['Temperature'], errors='coerce').mean()

        # Handle NaNs (replace with 0 or None for JSON serialization)
        summary = {
            "total_count": int(total_count),
            "avg_flowrate": float(avg_flowrate) if not np.isnan(avg_flowrate) else 0.0,
            "avg_pressure": float(avg_pressure) if not np.isnan(avg_pressure) else 0.0,
            "avg_temperature": float(avg_temperature) if not np.isnan(avg_temperature) else 0.0,
            "equipment_type_distribution": type_dist
        }
        
        return summary

    except Exception as e:
        return {"error": str(e)}

import io

def generate_pdf_report(dataset):
    """
    Generates a PDF report for the given dataset summary.
    Returns a BytesIO buffer containing the PDF.
    """
    # Lazy Import to prevent startup crashes if reportlab has issues
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.graphics.shapes import Drawing
    from reportlab.graphics.charts.barcharts import VerticalBarChart
    from reportlab.graphics.charts.legends import Legend
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom Styles
    # Use explicit Hex for colors to avoid AttributeError if standard color name is missing
    white_color = colors.HexColor('#FFFFFF')
    whitesmoke_color = colors.HexColor('#F5F5F5')
    deep_purple = colors.HexColor('#2D1B69')
    
    styles.add(ParagraphStyle(name='HeaderTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=24, textColor=white_color, alignment=1)) # Center
    styles.add(ParagraphStyle(name='HeaderSub', parent=styles['Normal'], fontName='Helvetica', fontSize=12, textColor=whitesmoke_color, alignment=1))
    styles.add(ParagraphStyle(name='SectionTitle', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=18, textColor=deep_purple, spaceAfter=12))
    styles.add(ParagraphStyle(name='CardValue', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=20, textColor=deep_purple, alignment=1))
    styles.add(ParagraphStyle(name='CardLabel', parent=styles['Normal'], fontName='Helvetica', fontSize=10, textColor=colors.gray, alignment=1))

    # --- 1. Modern Dark Header ---
    header_data = [
        [Paragraph(f"Analysis Report", styles['HeaderTitle'])],
        [Paragraph(f"{dataset.dataset_name}", styles['HeaderSub'])],
        [Paragraph(f"Uploaded by: {dataset.user.username} | Date: {dataset.upload_timestamp.strftime('%Y-%m-%d')}", styles['HeaderSub'])]
    ]
    
    header_table = Table(header_data, colWidths=[7.5*inch])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), deep_purple),
        ('TOPPADDING', (0, 0), (-1, -1), 10), # Reduced padding
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10), # Reduced padding
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    elements.append(header_table)
    elements.append(Spacer(1, 0.2*inch)) # Reduced spacing

    # --- 2. Key Metrics Cards ---
    elements.append(Paragraph("Key Metrics", styles['SectionTitle']))
    
    summary = dataset.summary_data
    if not summary or "error" in summary:
        elements.append(Paragraph("No valid analysis data found.", styles['Normal']))
    else:
        # Prepare card data
        metrics = [
            ("Total Equipment", str(summary.get('total_count', 0))),
            ("Avg Flowrate", f"{summary.get('avg_flowrate', 0):.2f}"),
            ("Avg Pressure", f"{summary.get('avg_pressure', 0):.2f}"),
            ("Avg Temperature", f"{summary.get('avg_temperature', 0):.2f}")
        ]
        
        # Create a table row for cards. 
        card_row = []
        for label, value in metrics:
            # Inner table for structure within the 'cell'
            content = [
                [Paragraph(value, styles['CardValue'])],
                [Paragraph(label, styles['CardLabel'])]
            ]
            t = Table(content, colWidths=[1.6*inch])
            t.setStyle(TableStyle([
                ('BOX', (0, 0), (-1, -1), 1, colors.lightgrey),
                # ('ROUNDEDCORNERS', [8, 8, 8, 8]), 
                ('TOPPADDING', (0, 0), (-1, -1), 10), # Reduced padding
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10), # Reduced padding
                ('BACKGROUND', (0, 0), (-1, -1), whitesmoke_color),
            ]))
            card_row.append(t)
            
        # Parent table to hold the 4 cards horizontally
        metrics_table = Table([card_row], colWidths=[1.8*inch]*4)
        metrics_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        elements.append(metrics_table)
        elements.append(Spacer(1, 0.2*inch)) # Reduced spacing
        
        # --- 3. Equipment Distribution (Bar Chart) ---
        elements.append(Paragraph("Equipment Distribution", styles['SectionTitle']))
        
        dist_data = summary.get('equipment_type_distribution', {})
        if dist_data:
            # Sort data
            clean_data = sorted([(k, v) for k, v in dist_data.items()], key=lambda x: x[1], reverse=True)
            labels = [x[0] for x in clean_data]
            values = [x[1] for x in clean_data]
            
            # Drawing container - Increased size to fit content
            drawing = Drawing(540, 300)
            
            # Bar Chart
            bc = VerticalBarChart()
            bc.x = 50
            bc.y = 80 # Increased bottom margin for rotated labels
            bc.height = 180
            bc.width = 300 # Wider chart
            bc.data = [values]
            bc.barWidth = 15
            
            # Axis Setup
            bc.valueAxis.valueMin = 0
            
            # Ensure proper step/range for small integers
            if values:
                max_val = max(values)
                if max_val < 10:
                    bc.valueAxis.valueStep = 1

            bc.categoryAxis.labels.boxAnchor = 'ne'
            bc.categoryAxis.labels.dx = 0
            bc.categoryAxis.labels.dy = -5
            bc.categoryAxis.labels.angle = 45 # Rotate 45 degrees to prevent overlap
            bc.categoryAxis.categoryNames = labels
            
            # Colors scheme (Frontend Palette)
            palette = [
                '#2D1B69', '#673AB7', '#E91E63', '#03A9F4', 
                '#00BCD4', '#009688', '#4CAF50', '#FFC107', '#FF5722'
            ]
            
            # Apply individual bar colors
            for i in range(len(values)):
                color_hex = palette[i % len(palette)]
                bc.bars[(0, i)].fillColor = colors.HexColor(color_hex)
            
            # Legend
            legend = Legend()
            legend.x = 380 # Positioned to the right of the wider chart
            legend.y = 250
            legend.alignment = 'right'
            legend.colorNamePairs = [(colors.HexColor(palette[i % len(palette)]), labels[i]) for i in range(len(values))]
            # legend.columnCount = 1  # Not supported in this version
            legend.fontSize = 10
            legend.dx = 8 
            legend.dy = 8 
            
            drawing.add(bc)
            drawing.add(legend)
            
            elements.append(drawing)
    
    try:
        doc.build(elements)
    except Exception as e:
        # Fallback if build fails (e.g. font issues)
        print(f"PDF Build Error: {e}") 
        raise e

    buffer.seek(0)
    return buffer
