
import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000/api"

def test_upload_flow():
    # 1. Login to get token
    print("LOGGING IN...")
    login_data = {"username": "testuser", "password": "testpassword123"}
    try:
        r = requests.post(f"{BASE_URL}/login/", json=login_data)
        if r.status_code != 200:
            print(f"Login failed: {r.text}")
            return
        token = r.json()['token']
        print(f"Got Token: {token}")
    except Exception as e:
        print(f"Login Error: {e}")
        return

    headers = {"Authorization": f"Token {token}"}

    # 2. Upload CSV
    print("\nUPLOADING CSV...")
    try:
        csv_path = "sample.csv"
        with open(csv_path, "rb") as f:
            files = {"file": (os.path.basename(csv_path), f, "text/csv")}
            data = {"dataset_name": "Test Dataset 1"}
            r = requests.post(f"{BASE_URL}/upload/", headers=headers, data=data, files=files)
            print(f"Upload Status: {r.status_code}")
            print(f"Upload Response: {r.json()}")
            if r.status_code == 201:
                upload_id = r.json()['id']
            else:
                return
    except Exception as e:
        print(f"Upload Error: {e}")
        return

    # 3. Get Summary
    print(f"\nGETTING SUMMARY for ID {upload_id}...")
    try:
        r = requests.get(f"{BASE_URL}/summary/{upload_id}/", headers=headers)
        print(f"Summary Status: {r.status_code}")
        summary = r.json()['summary_data']
        print(f"Analytics Data: {json.dumps(summary, indent=2)}")
        
        # Verify analytics
        if summary['total_count'] == 5 and summary['avg_flowrate'] > 0:
            print("ANALYTICS VERIFIED")
        else:
            print("ANALYTICS WRONG")
    except Exception as e:
        print(f"Summary Error: {e}")

    # 4. Get History
    print("\nGETTING HISTORY...")
    try:
        r = requests.get(f"{BASE_URL}/history/", headers=headers)
        print(f"History Status: {r.status_code}")
        history = r.json()['results'] if 'results' in r.json() else r.json()
        print(f"History Count: {len(history)}")
    except Exception as e:
        print(f"History Error: {e}")
        
    # 5. Download Report
    print(f"\nDOWNLOADING PDF REPORT for ID {upload_id}...")
    try:
        r = requests.get(f"{BASE_URL}/report/{upload_id}/", headers=headers)
        print(f"Report Status: {r.status_code}")
        if r.status_code == 200 and r.headers['Content-Type'] == 'application/pdf':
            print("PDF GENERATED SUCCESSFULLY")
            with open(f"report_{upload_id}.pdf", "wb") as f:
                f.write(r.content)
            print(f"Saved to report_{upload_id}.pdf")
        else:
            print(f"PDF FAILED: {r.text}")
    except Exception as e:
        print(f"PDF Error: {e}")

if __name__ == "__main__":
    if not os.path.exists("sample.csv"):
        print("Please create sample.csv first")
    else:
        test_upload_flow()
