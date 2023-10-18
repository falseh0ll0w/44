import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    # Send a GET request to the specified URL
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Perform advanced scraping operations
        # Example: Extract all the links from the page
        links = soup.find_all('a')
        for link in links:
            print(link.get('href'))
            
        # Example: Extract text from specific CSS selectors
        titles = soup.select('.title')
        for title in titles:
            print(title.text)
            
    else:
        # Request was not successful
        print("Failed to retrieve the webpage.")

# Example usage:
scrape_website('https://example.com')
