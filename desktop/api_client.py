import requests

class APIClient:
    def __init__(self, base_url="http://127.0.0.1:8000/api/"):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()

    def set_token(self, token):
        self.token = token
        self.session.headers.update({'Authorization': f'Token {token}'})

    def login(self, username, password):
        """Authenticates user and sets token."""
        url = f"{self.base_url}login/"
        try:
            response = self.session.post(url, json={'username': username, 'password': password})
            response.raise_for_status()
            data = response.json()
            if 'token' in data:
                self.set_token(data['token'])
                return True, "Login Successful"
            return False, "Token not found in response"
        except requests.exceptions.RequestException as e:
            return False, str(e)

    def upload_dataset(self, file_path, dataset_name):
        """Uploads a CSV file."""
        url = f"{self.base_url}upload/"
        try:
            with open(file_path, 'rb') as f:
                files = {'file': f}
                data = {'dataset_name': dataset_name}
                response = self.session.post(url, files=files, data=data)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Upload Error: {e}")
            return None

    def get_history(self):
        """Fetches upload history."""
        url = f"{self.base_url}history/"
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"History Error: {e}")
            return []

    def get_dataset_data(self, dataset_id):
        """Fetches full data for a dataset."""
        url = f"{self.base_url}data/{dataset_id}/"
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Data Fetch Error: {e}")
            return []

    def get_dataset_summary(self, dataset_id):
        """Fetches summary stats for a dataset."""
        url = f"{self.base_url}summary/{dataset_id}/"
        try:
            response = self.session.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Summary Fetch Error: {e}")
            return {}

    def download_report(self, dataset_id, save_path):
        """Downloads the PDF report."""
        url = f"{self.base_url}report/{dataset_id}/"
        try:
            response = self.session.get(url, stream=True)
            response.raise_for_status()
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            return True, "Download Successful"
        except Exception as e:
            return False, str(e)
