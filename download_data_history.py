import requests

def download_data_history():
    """Downloads the data history of the conversations."""
    # Replace 'YOUR_API_KEY' with your actual API key
    api_key = 'YOUR_API_KEY'
    endpoint = 'https://api.openai.com/v1/conversations'

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    response = requests.get(endpoint, headers=headers)
    data = response.json()

    # Save the data history to a file
    with open('data_history.json', 'w') as file:
        file.write(json.dumps(data, indent=4))

    print("Data history downloaded successfully!")

# Call the function to download the data history
download_data_history()
