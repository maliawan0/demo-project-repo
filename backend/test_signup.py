import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_signup_and_get_user():
    """
    Tests the signup process and then fetches the user details.
    """
    # --- Step 1: Sign up a new user ---
    signup_url = f"{BASE_URL}/auth/signup"
    user_data = {
        "username": "testuser_from_script",
        "email": "test_script@example.com",
        "password": "a_secure_password"
    }
    
    print("Attempting to sign up...")
    try:
        signup_response = requests.post(signup_url, json=user_data)
        signup_response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
        
        token_data = signup_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            print("Signup failed: No access token in response.")
            print("Response:", signup_response.text)
            return

        print("Signup successful! Token received.")
        
        # --- Step 2: Use the token to get user details ---
        me_url = f"{BASE_URL}/users/me"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        
        print("\nAttempting to fetch user details...")
        me_response = requests.get(me_url, headers=headers)
        me_response.raise_for_status()
        
        user_details = me_response.json()
        
        print("\nSuccessfully fetched user details:")
        print(json.dumps(user_details, indent=2))
        
    except requests.exceptions.HTTPError as http_err:
        print(f"\nHTTP error occurred: {http_err}")
        print("Response body:", http_err.response.text)
    except Exception as err:
        print(f"\nAn other error occurred: {err}")

if __name__ == "__main__":
    test_signup_and_get_user()