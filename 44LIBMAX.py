import os
import shutil
from PyPDF2 import PdfFileReader
from collections import defaultdict
import heapq


class LibrarySorter:
    def __init__(self, source_folder):
        self.source_folder = source_folder
        self.module_names = [
            'numpy', 'pandas', 'matplotlib', 'requests', 'scikit-learn', 'tensorflow', 'torch', 'seaborn',
            'flask', 'django', 'sqlalchemy', 'beautifulsoup', 'openpyxl', 'pyqt5', 'pytest', 'selenium'
        ]
        self.code_block_markers = ['```', '```python', '```java', '```javascript', '```c++']
        self.script_extensions = ['.py', '.js', '.java', '.cpp']
        self.library_extensions = ['.dll', '.so', '.dylib']
        self.data_extensions = ['.csv', '.json', '.xlsx', '.sqlite', '.h5']
        self.document_extensions = ['.docx', '.pdf', '.txt']
        self.sorting_options = ['sorted_by', 'file_type', 'module']

    def sort_folders(self, sorting_option):
        """Sorts files and folders in the source folder based on the given sorting option."""
        if sorting_option == 'sorted_by':
            self._sort_by_sorted_by_option()
        elif sorting_option == 'file_type':
            self._sort_by_file_type_option()
        elif sorting_option == 'module':
            self._sort_by_module_option()
        else:
            print(f"Invalid sorting option: {sorting_option}")

    def export_to_folder(self, destination_folder):
        """Exports the sorted files and folders to the destination folder."""
        shutil.copytree(self.source_folder, destination_folder)
        print(f"All files and folders have been exported to: {destination_folder}")

    def create_folders(self):
        """Creates folders in the source folder based on recommendations."""
        for recommendation in self.module_names:
            folder_path = os.path.join(self.source_folder, recommendation)
            os.makedirs(folder_path, exist_ok=True)
            print(f"Created folder: {folder_path}")

    def combine_selected_pdfs(self, output_name, files_to_combine):
        """Combines selected PDF files into one output PDF."""
        output_path = os.path.join(self.source_folder, f"{output_name}.pdf")
        self._combine_pdfs(output_path, *files_to_combine)
        print(f"PDFs combined and saved to: {output_path}")

    def analyze_code_files(self):
        """Analyzes code files and calculates optimized Huffman lengths."""
        code_files = self._get_files_by_extensions(self.script_extensions)
        for file_path in code_files:
            code = self._read_text_file(file_path)
            optimized_length = self._calculate_optimized_huffman_length(code)
            print(f"Optimized Huffman Length of file '{file_path}': {optimized_length}")

    def _sort_by_sorted_by_option(self):
        """Sorts files based on the 'sorted_by' option."""
        for folder in os.listdir(self.source_folder):
            if os.path.isdir(os.path.join(self.source_folder, folder)):
                for file in os.listdir(self.source_folder):
                    if os.path.isfile(os.path.join(self.source_folder, file)):
                        _, file_extension = os.path.splitext(file)
                        destination_folder = os.path.join(self.source_folder, folder, file_extension[1:])
                        os.makedirs(destination_folder, exist_ok=True)
                        shutil.move(
                            os.path.join(self.source_folder, file),
                            os.path.join(destination_folder, file)
                        )
                        print(f"Moved file '{file}' to folder: {destination_folder}")

    def _sort_by_file_type_option(self):
        """Sorts files based on their file type."""
        for file in os.listdir(self.source_folder):
            if os.path.isfile(os.path.join(self.source_folder, file)):
                _, file_extension = os.path.splitext(file)
                destination_folder = os.path.join(self.source_folder, file_extension)
                os.makedirs(destination_folder, exist_ok=True)
                shutil.move(
                    os.path.join(self.source_folder, file),
                    os.path.join(destination_folder, file)
                )
                print(f"Moved file '{file}' to folder: {destination_folder}")

    def _sort_by_module_option(self):
        """Sorts files based on contained module names."""
        for file in os.listdir(self.source_folder):
            if os.path.isfile(os.path.join(self.source_folder, file)):
                _, file_extension = os.path.splitext(file)
                for module_name in self.module_names:
                    if module_name in file.lower():
                        destination_folder = os.path.join(self.source_folder, module_name)
                        os.makedirs(destination_folder, exist_ok=True)
                        shutil.move(
                            os.path.join(self.source_folder, file),
                            os.path.join(destination_folder, file)
                        )
                        print(f"Moved file '{file}' to module folder: {destination_folder}")
                        break

    def _get_files_by_extensions(self, extensions):
        """Finds all files with the given extensions in the source folder."""
        files = []
        for root, dirs, filenames in os.walk(self.source_folder):
            for filename in filenames:
                if os.path.splitext(filename)[1] in extensions:
                    file_path = os.path.join(root, filename)
                    files.append(file_path)
        return files

    def _read_text_file(self, file_path):
        """Reads and returns the content of a text file."""
        with open(file_path, 'r') as file:
            return file.read()

    def _combine_pdfs(self, output_path, *file_paths):
        """Combines multiple PDF files into one."""
        merged_pdf = PdfFileMerger()
        for file_path in file_paths:
            merged_pdf.append(file_path)
        with open(output_path, 'wb') as output_file:
            merged_pdf.write(output_file)

    def _calculate_optimized_huffman_length(self, data):
        """Calculates the optimized Huffman length of the given data."""
        frequency = self._calculate_frequencies(data)
        priority_queue = self._build_priority_queue(frequency)
        huffman_tree = self._build_huffman_tree(priority_queue)
        huffman_dict = self._build_huffman_dict(huffman_tree)

        ohl = 0
        for symbol in data:
            ohl += len(huffman_dict[symbol])

        return ohl

    def _calculate_frequencies(self, data):
        """Calculates the frequencies of symbols in the given data."""
        frequency = defaultdict(int)
        for item in data:
            for symbol in item:
                frequency[symbol] += 1
        return frequency

    def _build_priority_queue(self, frequency):
        """Builds a priority queue (heap) based on the symbol frequencies."""
        heap = [[weight, symbol] for symbol, weight in frequency.items()]
        heapq.heapify(heap)
        return heap

    def _build_huffman_tree(self, heap):
        """Builds a Huffman tree based on the symbol frequencies."""
        while len(heap) > 1:
            lo = heapq.heappop(heap)
            hi = heapq.heappop(heap)
            combined_weight = lo[0] + hi[0]
            combined_node = [combined_weight, lo, hi]
            heapq.heappush(heap, combined_node)
        return heap[0]

    def _build_huffman_dict(self, tree):
        """Builds a Huffman dictionary (symbol to code mapping) based on the Huffman tree."""
        huff_dict = {}

        def traverse(node, code):
            if len(node) == 2:  # Leaf node
                symbol = node[1]
                huff_dict[symbol] = code
            else:  # Internal node
                traverse(node[1], code + "0")
                traverse(node[2], code + "1")

        traverse(tree, "")
        return huff_dict


# Example usage
source_folder = 'path/to/source/folder'
sorting_option = 'sorted_by'  # or 'file_type' or 'module'
destination_folder = os.path.join(source_folder, sorting_option)

sorter = LibrarySorter(source_folder)
sorter.create_folders()
sorter.sort_folders(sorting_option)
sorter.export_to_folder(destination_folder)
sorter.analyze_code_files()

# Example usage with combining PDFs
output_name = 'combined_document'
files_to_combine = [
    'file1.pdf',
    'file2.pdf',
    'file3.pdf'
]
sorter.combine_selected_pdfs(output_name, files_to_combine)
import os
import shutil
from PyPDF2 import PdfFileReader
from collections import defaultdict
import heapq


class LibrarySorter:
    def __init__(self, source_folder):
        self.source_folder = source_folder
        self.module_names = [
            'numpy', 'pandas', 'matplotlib', 'requests', 'scikit-learn', 'tensorflow', 'torch', 'seaborn',
            'flask', 'django', 'sqlalchemy', 'beautifulsoup', 'openpyxl', 'pyqt5', 'pytest', 'selenium'
        ]
        self.code_block_markers = ['```', '```python', '```java', '```javascript', '```c++']
        self.script_extensions = ['.py', '.js', '.java', '.cpp']
        self.library_extensions = ['.dll', '.so', '.dylib']
        self.data_extensions = ['.csv', '.json', '.xlsx', '.sqlite', '.h5']
        self.document_extensions = ['.docx', '.pdf', '.txt']
        self.sorting_options = ['sorted_by', 'file_type', 'module']

    def sort_folders(self, sorting_option):
        """Sorts files and folders in the source folder based on the given sorting option."""
        if sorting_option == 'sorted_by':
            self._sort_by_sorted_by_option()
        elif sorting_option == 'file_type':
            self._sort_by_file_type_option()
        elif sorting_option == 'module':
            self._sort_by_module_option()
        else:
            print(f"Invalid sorting option: {sorting_option}")

    def export_to_folder(self, destination_folder):
        """Exports the sorted files and folders to the destination folder."""
        shutil.copytree(self.source_folder, destination_folder)
        print(f"All files and folders have been exported to: {destination_folder}")

    def create_folders(self):
        """Creates folders in the source folder based on recommendations."""
        for recommendation in self.module_names:
            folder_path = os.path.join(self.source_folder, recommendation)
            os.makedirs(folder_path, exist_ok=True)
            print(f"Created folder: {folder_path}")

    def combine_selected_pdfs(self, output_name, files_to_combine):
        """Combines selected PDF files into one output PDF."""
        output_path = os.path.join(self.source_folder, f"{output_name}.pdf")
        self._combine_pdfs(output_path, *files_to_combine)
        print(f"PDFs combined and saved to: {output_path}")

    def analyze_code_files(self):
        """Analyzes code files and calculates optimized Huffman lengths."""
        code_files = self._get_files_by_extensions(self.script_extensions)
        for file_path in code_files:
            code = self._read_text_file(file_path)
            optimized_length = self._calculate_optimized_huffman_length(code)
            print(f"Optimized Huffman Length of file '{file_path}': {optimized_length}")

    def _sort_by_sorted_by_option(self):
        """Sorts files based on the 'sorted_by' option."""
        for folder in os.listdir(self.source_folder):
            if os.path.isdir(os.path.join(self.source_folder, folder)):
                for file in os.listdir(self.source_folder):
                    if os.path.isfile(os.path.join(self.source_folder, file)):
                        _, file_extension = os.path.splitext(file)
                        destination_folder = os.path.join(self.source_folder, folder, file_extension[1:])
                        os.makedirs(destination_folder, exist_ok=True)
                        shutil.move(
                            os.path.join(self.source_folder, file),
                            os.path.join(destination_folder, file)
                        )
                        print(f"Moved file '{file}' to folder: {destination_folder}")

    def _sort_by_file_type_option(self):
        """Sorts files based on their file type."""
        for file in os.listdir(self.source_folder):
            if os.path.isfile(os.path.join(self.source_folder, file)):
                _, file_extension = os.path.splitext(file)
                destination_folder = os.path.join(self.source_folder, file_extension)
                os.makedirs(destination_folder, exist_ok=True)
                shutil.move(
                    os.path.join(self.source_folder, file),
                    os.path.join(destination_folder, file)
                )
                print(f"Moved file '{file}' to folder: {destination_folder}")

    def _sort_by_module_option(self):
        """Sorts files based on contained module names."""
        for file in os.listdir(self.source_folder):
            if os.path.isfile(os.path.join(self.source_folder, file)):
                _, file_extension = os.path.splitext(file)
                for module_name in self.module_names:
                    if module_name in file.lower():
                        destination_folder = os.path.join(self.source_folder, module_name)
                        os.makedirs(destination_folder, exist_ok=True)
                        shutil.move(
                            os.path.join(self.source_folder, file),
                            os.path.join(destination_folder, file)
                        )
                        print(f"Moved file '{file}' to module folder: {destination_folder}")
                        break

    def _get_files_by_extensions(self, extensions):
        """Finds all files with the given extensions in the source folder."""
        files = []
        for root, dirs, filenames in os.walk(self.source_folder):
            for filename in filenames:
                if os.path.splitext(filename)[1] in extensions:
                    file_path = os.path.join(root, filename)
                    files.append(file_path)
        return files

    def _read_text_file(self, file_path):
        """Reads and returns the content of a text file."""
        with open(file_path, 'r') as file:
            return file.read()

    def _combine_pdfs(self, output_path, *file_paths):
        """Combines multiple PDF files into one."""
        merged_pdf = PdfFileMerger()
        for file_path in file_paths:
            merged_pdf.append(file_path)
        with open(output_path, 'wb') as output_file:
            merged_pdf.write(output_file)

    def _calculate_optimized_huffman_length(self, data):
        """Calculates the optimized Huffman length of the given data."""
        frequency = self._calculate_frequencies(data)
        priority_queue = self._build_priority_queue(frequency)
        huffman_tree = self._build_huffman_tree(priority_queue)
        huffman_dict = self._build_huffman_dict(huffman_tree)

        ohl = 0
        for symbol in data:
            ohl += len(huffman_dict[symbol])

        return ohl

    def _calculate_frequencies(self, data):
        """Calculates the frequencies of symbols in the given data."""
        frequency = defaultdict(int)
        for item in data:
            for symbol in item:
                frequency[symbol] += 1
        return frequency

    def _build_priority_queue(self, frequency):
        """Builds a priority queue (heap) based on the symbol frequencies."""
        heap = [[weight, symbol] for symbol, weight in frequency.items()]
        heapq.heapify(heap)
        return heap

    def _build_huffman_tree(self, heap):
        """Builds a Huffman tree based on the symbol frequencies."""
        while len(heap) > 1:
            lo = heapq.heappop(heap)
            hi = heapq.heappop(heap)
            combined_weight = lo[0] + hi[0]
            combined_node = [combined_weight, lo, hi]
            heapq.heappush(heap, combined_node)
        return heap[0]

    def _build_huffman_dict(self, tree):
        """Builds a Huffman dictionary (symbol to code mapping) based on the Huffman tree."""
        huff_dict = {}

        def traverse(node, code):
            if len(node) == 2:  # Leaf node
                symbol = node[1]
                huff_dict[symbol] = code
            else:  # Internal node
                traverse(node[1], code + "0")
                traverse(node[2], code + "1")

        traverse(tree, "")
        return huff_dict


# Example usage
source_folder = 'path/to/source/folder'
sorting_option = 'sorted_by'  # or 'file_type' o
        sorter = LibrarySorter(source_folder)
        sorter.create_folders()
        sorter.sort_folders(sorting_option)
        sorter.export_to_folder(destination_folder)
        sorter.analyze_code_files()

        # Example usage with combining PDFs
        output_name = 'combined_document'
        files_to_combine = [
            'file1.pdf',
            'file2.pdf',
            'file3.pdf'
        ]
        sorter.combine_selected_pdfs(output_name, files_to_combine)
import os
import shutil
from PyPDF2 import PdfFileReader, PdfFileMerger

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

class CodeAnalyzer:
    def __init__(self, input_folder):
        self.input_folder = input_folder

    def find_files_by_extension(self, extension):
        """Finds all files with the given extension in the input folder."""
        files = []
        for root, dirs, filenames in os.walk(self.input_folder):
            for filename in filenames:
                if filename.lower().endswith(extension):
                    file_path = os.path.join(root, filename)
                    files.append(file_path)
        return files

    def scrape_text_files(self):
        """Scrapes text content from all text files (PDF, TXT) in the input folder."""
        text_files = self.find_files_by_extension('.pdf') + self.find_files_by_extension('.txt')
        for file_path in text_files:
            text = scrape_pdf(file_path) if file_path.lower().endswith('.pdf') else self._read_text_file(file_path)
            print(f"Scraped content from file '{file_path}':")
            print(text)
            print()

    def combine_selected_pdfs(self, output_name, files_to_combine):
        """Combines selected PDF files into one output PDF."""
        output_path = os.path.join(self.input_folder, f"{output_name}.pdf")
        combine_pdfs(output_path, *files_to_combine)
        print(f"PDFs combined and saved to: {output_path}")

    def _read_text_file(self, file_path):
        """Reads and returns the content of a text file."""
        with open(file_path, 'r') as file:
            return file.read()

# Example usage
input_folder = 'path/to/input/folder'
analyzer = CodeAnalyzer(input_folder)
analyzer.scrape_text_files()

# Example usage with combining PDFs
output_name = 'combined_document'
files_to_combine = [
    'file1.pdf',
    'file2.pdf',
    'file3.pdf'
]
analyzer.combine_selected_pdfs(output_name, files_to_combine)
import heapq
from collections import defaultdict

def calculate_frequencies(data):
    """Calculates the frequencies of symbols in the given data."""
    frequency = defaultdict(int)
    for item in data:
        for symbol in item:
            frequency[symbol] += 1
    return frequency

def build_priority_queue(frequency):
    """Builds a priority queue (heap) based on the symbol frequencies."""
    heap = []
    for symbol, weight in frequency.items():
        heapq.heappush(heap, [weight, symbol])
    return heap

def build_huffman_tree(heap):
    """Builds a Huffman tree based on the symbol frequencies."""
    while len(heap) > 1:
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        combined_weight = lo[0] + hi[0]
        combined_node = [combined_weight, lo, hi]
        heapq.heappush(heap, combined_node)
    return heap[0]

def build_huffman_dict(tree):
    """Builds a Huffman dictionary (symbol to code mapping) based on the Huffman tree."""
    huff_dict = {}

    def traverse(node, code):
        if len(node) == 2:  # Leaf node
            symbol = node[1]
            huff_dict[symbol] = code
        else:  # Internal node
            traverse(node[1], code + "0")
            traverse(node[2], code + "1")

    traverse(tree, "")
    return huff_dict

def optimized_huffman_length(data):
    """Calculates the optimized Huffman length of the given data."""
    frequency = calculate_frequencies(data)
    priority_queue = build_priority_queue(frequency)
    huffman_tree = build_huffman_tree(priority_queue)
    huffman_dict = build_huffman_dict(huffman_tree)

    ohl = 0
    for item in data:
        for symbol in item:
            ohl += len(huffman_dict[symbol])

    return ohl

# Usage example
data = ["AB", "AC", "BAC"]
ohl = optimized_huffman_length(data)
print("Optimized Huffman Length:", ohl)