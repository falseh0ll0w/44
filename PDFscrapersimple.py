import os
from PyPDF2 import PdfFileReader

def scrape_pdf(file_path):
    """Scrapes the text content from a PDF file."""
    with open(file_path, 'rb') as file:
        pdf = PdfFileReader(file)
        text = ''
        for page_num in range(pdf.getNumPages()):
            page = pdf.getPage(page_num)
            text += page.extractText()
        return text

def combine_pdfs(output_path, *file_paths):
    """Combines multiple PDF files into one."""
    merged_pdf = PdfFileMerger()
    for file_path in file_paths:
        merged_pdf.append(file_path)
    with open(output_path, 'wb') as output_file:
        merged_pdf.write(output_file)

# Example usage
pdf_text = scrape_pdf('sample.pdf')
print(pdf_text)

combine_pdfs('combined.pdf', 'file1.pdf', 'file2.pdf')
print("PDFs combined successfully!")
