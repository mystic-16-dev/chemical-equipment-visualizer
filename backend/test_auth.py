
import urllib.request
import json
import traceback

BASE_URL = "http://127.0.0.1:8000/api"

def post_json(url, data):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as response:
        return response.getcode(), json.loads(response.read().decode('utf-8'))

def test_auth():
    # 1. Register
    print("Testing Registration...")
    reg_data = {"username": "testuser", "password": "testpassword123"}
    try:
        status, resp = post_json(f"{BASE_URL}/register/", reg_data)
        print(f"Register Status: {status}")
        print(f"Register Response: {resp}")
    except urllib.error.HTTPError as e:
        # 400 is expected if user already exists from previous failed attempts
        print(f"Register failed (might already exist): {e.code} {e.read().decode()}")
    except Exception as e:
        print(f"Register failed: {e}")
        traceback.print_exc()

    # 2. Login
    print("\nTesting Login...")
    login_data = {"username": "testuser", "password": "testpassword123"}
    try:
        status, resp = post_json(f"{BASE_URL}/login/", login_data)
        print(f"Login Status: {status}")
        print(f"Login Response: {resp}")
        
        if status == 200 and "token" in resp:
            print("AUTH TEST PASSED")
        else:
            print("AUTH TEST FAILED")
    except Exception as e:
        print(f"Login failed: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    test_auth()
