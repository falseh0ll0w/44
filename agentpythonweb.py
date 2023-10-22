import requests
from bs4 import BeautifulSoup
from fpdf import FPDF


def save_webpage_as_pdf(webpage_url: str, filename: str, timeout: int = 10) -> None:
    """
    Save a webpage as a PDF document.

    Args:
        webpage_url (str): The URL of the webpage to save.
        filename (str): The name of the PDF file to save.
        timeout (int, optional): The number of seconds to wait for the server to send data before giving up. Defaults to 10.
    """

    # Send a GET request to the webpage
    response = requests.get(webpage_url, timeout=timeout)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, "html.parser")

    # Create a new PDF document
    pdf = FPDF()

    # Add a new page to the PDF document
    pdf.add_page()

    # Set the font and size for the text
    pdf.set_font("Arial", size=12)

    text = soup.get_text()
    pdf.cell(0, 10, text)

    # Save the PDF
    pdf.output(filename)


def scrape_url_for_python_code(webpage_url: str, filename: str) -> None:
    """
    Scrape a webpage for Python code, extract Python code, and save as text file.

    Args:
        webpage_url (str): The URL of the webpage to scrape.
        filename (str): The name of the text file to save.
    """
    response = requests.get(webpage_url, timeout=10)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all code blocks in the HTML
    code_blocks = soup.find_all("code", class_="python")

    # Extract Python code from code blocks
    python_code = ""
    for code_block in code_blocks:
        python_code += code_block.text + "\n"

    # Save Python code as text file
    with open(filename, "w", encoding="utf-8") as file:
        file.write(python_code)


# Example usage
url = "https://example.com"

save_webpage_as_pdf(url, "webpage.pdf", timeout=10)
scrape_url_for_python_code(url, "python_code.txt")
