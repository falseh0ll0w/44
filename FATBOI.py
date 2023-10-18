import re
import pathlib
import logging
import tkinter as tk
from tkinter import filedialog
import PyPDF2
from langdetect import detect
from textblob import TextBlob
from sympy import *
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application
)
import pylint.lint
from pylint.reporters.text import TextReporter
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import HtmlFormatter
import requests
from bs4 import BeautifulSoup

logging.basicConfig(filename='code_extraction.log', level=logging.ERROR)


def extract_code_blocks(conversation):
    """Extracts code (with or without a language) from a conversation."""
    code_blocks = re.findall(r"```(\w+)\n([\s\S]*?)\n```", conversation, re.DOTALL)
    return code_blocks


def extract_math_and_algorithms(code_blocks):
    """Extracts mathematical expressions and algorithms from code blocks."""
    math_and_algorithms = []
    transformations = (standard_transformations + (implicit_multiplication_application,))
    for code_block in code_blocks:
        language = code_block[0]
        code = code_block[1]
        if language in ['python', 'Python', 'PYTHON']:
            # Extract algorithms from Python code
            lines = code.split('\n')
            for line in lines:
                if 'def ' in line:
                    algorithm = line.strip()
                    math_and_algorithms.append(algorithm)
        else:
            # Extract mathematical expressions from code
            try:
                expr = parse_expr(code, transformations=transformations)
                if isinstance(expr, (Add, Mul, Pow, Symbol)):
                    math_and_algorithms.append(str(expr))
            except:
                pass
    return math_and_algorithms


def save_code_blocks_to_file(code_blocks, file_name):
    """Saves code blocks to a file."""
    with open(file_name, 'w', newline='') as file:
        for code_block in code_blocks:
            language = code_block[0]
            code = code_block[1]
            file.write(f"Language: {language}\n")
            file.write(f"Code:\n")
            file.write(f"{code}\n\n")


def save_math_and_algorithms_to_file(math_and_algorithms, file_name):
    """Saves mathematical expressions and algorithms to a file."""
    with open(file_name, 'w', newline='') as file:
        for math_or_algorithm in math_and_algorithms:
            file.write(math_or_algorithm)
            file.write('\n')


def validate_file_name(file_name):
    """Validates the file name and ensures that it is a valid file name for the current operating system."""
    invalid_chars = ['<', '>', ':', '"', '/', '\\', '|', '?', '*']
    for char in invalid_chars:
        if char in file_name:
            return False
    return True


def extract_and_save_code_blocks():
    """Extracts code blocks from conversation and saves them to a file."""
    conversation = conversation_text.get('1.0', 'end-1c')
    file_type = file_type_var.get()
    file_name = file_name_entry.get()
    if not validate_file_name(file_name):
        status_label.config(text="Invalid file name. Please enter a valid file name.")
        return
    if file_type == 'Text':
        code_blocks = extract_code_blocks(conversation)
    elif file_type == 'PDF':
        file_name = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if not file_name:
            status_label.config(text="File not selected.")
            return
        code_blocks = extract_code_blocks_from_pdf(file_name)
    elif file_type == 'Code Search':
        query = conversation.strip().replace(' ', '+')
        code_blocks = extract_code_blocks_from_code_search(query)
    else:
        status_label.config(text="Invalid file type.")
        return
    save_code_blocks_to_file(code_blocks, file_name)
    status_label.config(text=f"Code blocks extracted and saved to '{file_name}' successfully!")


def extract_and_analyze_code_blocks():
    """Extracts code blocks from conversation, analyzes them, and saves the summary to a file."""
    conversation = conversation_text.get('1.0', 'end-1c')
    file_type = file_type_var.get()
    file_name = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV Files", "*.csv")])
    if not file_name:
        status_label.config(text="File not saved.")
        return
    if not validate_file_name(file_name):
        status_label.config(text="Invalid file name. Please enter a valid file name.")
        return
    if file_type == 'Text':
        code_blocks = extract_code_blocks(conversation)
    elif file_type == 'PDF':
        file_name = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
        if not file_name:
            status_label.config(text="File not selected.")
            return
        code_blocks = extract_code_blocks_from_pdf(file_name)
    elif file_type == 'Code Search':
        query = conversation.strip().replace(' ', '+')
        code_blocks = extract_code_blocks_from_code_search(query)
    else:
        status_label.config(text="Invalid file type.")
        return
    math_and_algorithms = extract_math_and_algorithms(code_blocks)
    save_math_and_algorithms_to_file(math_and_algorithms, file_name)
    status_label.config(text=f"Math and algorithms extracted and saved to '{file_name}' successfully!")
    # Analyze code blocks
    summary = {}
    for code_block in code_blocks:
        language = code_block[0]
        code = code_block[1]
        if language in summary:
            summary[language]['num_blocks'] += 1
            summary[language]['num_lines'] += code.count('\n')
            summary[language]['num_chars'] += len(code)
            summary[language]['num_words'] += len(code.split())
        else:
            summary[language] = {'num_blocks': 1, 'num_lines': code.count('\n'), 'num_chars': len(code), 'num_words': len(code.split())}
        # Analyze code quality
        if language in ['python', 'Python', 'PYTHON']:
            try:
                pylint_output = StringIO()
                pylint.lint.py_run(code, reporter=TextReporter(pylint_output), exit=False)
                pylint_score = float(pylint_output.getvalue().split()[-2])
                if language in summary:
                    summary[language]['pylint_score'] += pylint_score
                else:
                    summary[language]['pylint_score'] = pylint_score
            except:
                pass
    # Save summary to file
    with open(file_name, 'a', newline='') as file:
        file.write('\n\n')
        file.write('Language,Num Blocks,Num Lines,Num Chars,Num Words,Pylint Score\n')
        for language, stats in summary.items():
            num_blocks = stats['num_blocks']
            num_lines = stats['num_lines']
            num_chars = stats['num_chars']
            num_words = stats['num_words']
            pylint_score = stats.get('pylint_score', '-')
            file.write(f"{language},{num_blocks},{num_lines},{num_chars},{num_words},{pylint_score}\n")
    status_label.config(text=f"Summary saved to '{file_name}' successfully!")


def extract_code_blocks_from_pdf(file_name):
    """Extracts code blocks from a PDF file."""
    code_blocks = []
    with open(file_name, 'rb') as file:
        pdf_reader = PyPDF2.PdfFileReader(file)
        for page_num in range(pdf_reader.getNumPages()):
            page = pdf_reader.getPage(page_num)
            text = page.extractText()
            code_blocks += re.findall(r"```(\w+)\n([\s\S]*?)\n```", text, re.DOTALL)
    return code_blocks


def extract_code_blocks_from_code_search(query):
    """Extracts code blocks from a code search engine."""
    code_blocks = []
    url = f"https://api.github.com/search/code?q={query}"
    headers = {'Accept': 'application/vnd.github.v3+json'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        results = response.json()['items']
        for result in results:
            if result['name'].endswith('.py'):
                url = result['url']
                response = requests.get(url, headers=headers)
                if response.status_code == 200:
                    code = response.json()['content']
                    code = base64.b64decode(code).decode('utf-8')
                    code_blocks += [('python', code)]
    return code_blocks


def highlight_code(code, language):
    """Highlights the syntax of the code using Pygments."""
    lexer = get_lexer_by_name(language)
    formatter = HtmlFormatter(style='colorful')
    highlighted_code = highlight(code, lexer, formatter)
    return highlighted_code


def analyze_conversation():
    """Analyzes the conversation and displays the results."""
    conversation = conversation_text.get('1.0', 'end-1c')
    language = detect(conversation)
    sentiment = TextBlob(conversation).sentiment.polarity
    highlighted_conversation = highlight_code(conversation, language)
    conversation_analysis_text.delete('1.0', 'end')
    conversation_analysis_text.insert('1.0', f"Language: {language}\n")
    conversation_analysis_text.insert('2.0', f"Sentiment: {sentiment}\n")
    conversation_analysis_text.insert('3.0', f"Highlighted Conversation:\n{highlighted_conversation}")


# Create UI
root = tk.Tk()
root.title("Code Extraction Tool")

# Conversation Text
conversation_label = tk.Label(root, text="Conversation Text:")
conversation_label.grid(row=0, column=0, sticky='w')
conversation_text = tk.Text(root, width=50, height=10)
conversation_text.grid(row=1, column=0, padx=5, pady=5)

# Conversation Analysis
conversation_analysis_label = tk.Label(root, text="Conversation Analysis:")
conversation_analysis_label.grid(row=2, column=0, sticky='w')
conversation_analysis_text = tk.Text(root, width=50, height=10)
conversation_analysis_text.grid(row=3, column=0, padx=5, pady=5)

# File Type
file_type_label = tk.Label(root, text="File Type:")
file_type_label.grid(row=4, column=0, sticky='w')
file_type_var = tk.StringVar(value='Text')
file_type_text_radio = tk.Radiobutton(root, text="Text", variable=file_type_var, value='Text')
file_type_text_radio.grid(row=5, column=0, padx=5, pady=5, sticky='w')
file_type_pdf_radio = tk.Radiobutton(root, text="PDF", variable=file_type_var, value='PDF')
file_type_pdf_radio.grid(row=6, column=0, padx=5, pady=5, sticky='w')
file_type_code_search_radio = tk.Radiobutton(root, text="Code Search", variable=file_type_var, value='Code Search')
file_type_code_search_radio.grid(row=7, column=0, padx=5, pady=5, sticky='w')

# File Name
file_name_label = tk.Label(root, text="File Name:")
file_name_label.grid(row=8, column=0, sticky='w')
file_name_entry = tk.Entry(root, width=20)
file_name_entry.insert(0, "code_blocks.txt")
file_name_entry.grid(row=9, column=0, padx=5, pady=5)

# Extract Code Blocks Button
extract_code_blocks_button = tk.Button(root, text="Extract Code Blocks", command=extract_and_save_code_blocks)
extract_code_blocks_button.grid(row=10, column=0, padx=5, pady=5)

# Extract and Analyze Code Blocks Button
extract_and_analyze_code_blocks_button = tk.Button(root, text="Extract and Analyze Code Blocks", command=extract_and_analyze_code_blocks)
extract_and_analyze_code_blocks_button.grid(row=11, column=0, padx=5, pady=5)

# Analyze Conversation Button
analyze_conversation_button = tk.Button(root, text="Analyze Conversation", command=analyze_conversation)
analyze_conversation_button.grid(row=12, column=0, padx=5, pady=5)

# Status Label
status_label = tk.Label(root, text="")
status_label.grid(row=13, column=0, padx=5, pady=5)

root.mainloop()
