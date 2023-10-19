import requests
from bs4 import BeautifulSoup
from fpdf import FPDF

def save_webpage_as_pdf(url, filename):
    # Send a GET request to the webpage
    response = requests.get(url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Create a new PDF document
    pdf = FPDF()

    # Add a new page to the PDF document
    pdf.add_page()

    # Set the font and size for the text
    pdf.set_font("Arial", size=12)

    # Extract the text from the HTML content and add it to the PDF document
    text = soup.get_text()
    pdf.cell(0, 10, text)

    # Save the PDF document
    pdf.output(filename)

# Function to scrape URL for Python code, extract Python code, and save as text file
def scrape_url_for_python_code(url, filename):
    # Send a GET request to the webpage
    response = requests.get(url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all code blocks in the HTML
    code_blocks = soup.find_all('code')

    # Extract the Python code from the code blocks
    python_code = ''
    for code_block in code_blocks:
        if 'python' in code_block.get('class', []):
            python_code += code_block.text + '\n'

    # Save the Python code as a text file
    with open(filename, 'w') as file:
        file.write(python_code)

# Example usage
url = 'https://example.com'
save_webpage_as_pdf(url, 'webpage.pdf')
scrape_url_for_python_code(url, 'python_code.txt')