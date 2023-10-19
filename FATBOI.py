import logging
import re
from typing import List

import tkinter as tk
from tkinter import filedialog
from sympy import Add, Mul, Pow, Symbol, cancel, checksol, divisor_count, itermonomials, motzkin, primefactors, rad, reshape, root, zeros
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)
import pylint.lint
from pylint.reporters.text import TextReporter

logging.basicConfig(filename='code_extraction.log', level=logging.ERROR)

try:
    import os
    from pathlib import Path
    from typing import List, Tuple
    from sympy import *
    from bs4 import BeautifulSoup
    from io import StringIO
    import PyPDF2
    import requests
    import base64

    logging.getLogger().setLevel(logging.INFO)

    def extract_and_save_code_blocks(conversation: str, file_name: str) -> None:
        code_blocks = extract_and_analyze_code_blocks(conversation)
        save_code_blocks_to_file(code_blocks, file_name)

    def extract_and_analyze_code_blocks(conversation: str) -> List[str]:
        code_blocks = []
        soup = BeautifulSoup(conversation, 'html.parser')
        for code_block in soup.find_all('code'):
            code_blocks.append(code_block.text)
        return code_blocks

    def analyze_conversation(conversation: str) -> None:
        math_and_algorithms = []
        soup = BeautifulSoup(conversation, 'html.parser')
        for code_block in soup.find_all('code'):
            if 'import' in code_block.text:
                exec(code_block.text)
            else:
                math_and_algorithms.append(code_block.text)
        for algorithm in math_and_algorithms:
            exec(algorithm)

    def save_code_blocks_to_file(code_blocks: List[str], file_name: str) -> None:
        with open(file_name, 'w') as f:
            for code_block in code_blocks:
                f.write(code_block + '\n')

    def mainloop() -> None:
        root = tk.Tk()
        root.withdraw()
        file_name_label = tk.Label(root, text="File Name:")
        file_name_label.grid(row=8, column=0, sticky='w')
        file_name_entry = tk.Entry(root, width=20)
        file_name_entry.insert(0, "code_blocks.txt")
        file_name_entry.grid(row=9, column=0, padx=5, pady=5)

        def extract_and_save_code_blocks_wrapper() -> None:
            file_name = file_name_entry.get()
            file_path = filedialog.askopenfilename()
            if file_path:
                with open(file_path, 'r') as f:
                    conversation = f.read()
                extract_and_save_code_blocks(conversation, file_name)
                analyze_conversation(conversation)
                status_label.config(text='Code blocks extracted and analyzed successfully.')
            else:
                status_label.config(text='No file selected.')

        # Extract Code Blocks Button
        extract_code_blocks_button = tk.Button(root, text="Extract Code Blocks", command=extract_and_save_code_blocks_wrapper)
        extract_code_blocks_button.grid(row=10, column=0, padx=5, pady=5)

        # Extract and Analyze Code Blocks Button
        extract_and_analyze_code_blocks_button = tk.Button(root, text="Extract and Analyze Code Blocks", command=lambda: extract_and_save_code_blocks_wrapper())
        extract_and_analyze_code_blocks_button.grid(row=11, column=0, padx=5, pady=5)

        # Analyze Conversation Button
        analyze_conversation_button = tk.Button(root, text="Analyze Conversation", command=lambda: analyze_conversation_wrapper())
        analyze_conversation_button.grid(row=12, column=0, padx=5, pady=5)

        def analyze_conversation_wrapper() -> None:
            file_path = filedialog.askopenfilename()
            if file_path:
                with open(file_path, 'r') as f:
                    conversation = f.read()
                analyze_conversation(conversation)
                status_label.config(text='Conversation analyzed successfully.')
            else:
                status_label.config(text='No file selected.')

        # Status Label
        status_label = tk.Label(root, text="")
        status_label.grid(row=13, column=0, padx=5, pady=5)

        root.mainloop()

except ImportError as e:
    logging.error(f"ImportError: {e}")
except Exception as e:
    logging.error(f"Exception: {e}")
