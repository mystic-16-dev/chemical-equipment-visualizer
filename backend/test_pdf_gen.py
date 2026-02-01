
import sys
import os
import datetime

# Add core to path to import utils
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.utils import generate_pdf_report

class MockUser:
    username = "testuser"

class MockDataset:
    dataset_name = "test_data.csv"
    user = MockUser()
    upload_timestamp = datetime.datetime.now()
    summary_data = {
        "total_count": 10,
        "avg_flowrate": 100.5,
        "avg_pressure": 50.2,
        "avg_temperature": 30.0,
        "equipment_type_distribution": {"Pump": 5, "Valve": 5, "Reactor": 2, "Condenser": 1}
    }

try:
    print("Starting PDF generation test (Bar Chart)...")
    dataset = MockDataset()
    pdf_buffer = generate_pdf_report(dataset)
    print("PDF generated successfully. Size:", len(pdf_buffer.getvalue()))
    with open("test_output_bar.pdf", "wb") as f:
        f.write(pdf_buffer.getvalue())
    print("PDF saved to test_output_bar.pdf")
except Exception as e:
    print("\nXXX ERROR DURING PDF GENERATION XXX")
    print(e)
    import traceback
    traceback.print_exc()
