import os
import shutil
from PyPDF2 import PdfFileReader
from collections import defaultdict
import heapq

def _build_huffman_tree(self, heap):
    """Builds a Huffman tree based on the heap of symbol frequencies."""
    # While there are more than one node in the heap
    while len(heap) > 1:
        # Pop two nodes with the lowest frequencies
        lo = heapq.heappop(heap)
        hi = heapq.heappop(heap)
        # Combine the two nodes into a single node with a combined weight
        combined_weight = lo[0] + hi[0]
        combined_node = [combined_weight, lo, hi]
        # Push the combined node back onto the heap
        heapq.heappush(heap, combined_node)
    # Return the root node of the Huffman tree
    return heap[0]

def _build_huffman_dict(self, tree):
    """Builds a Huffman dictionary (symbol to code mapping) based on the Huffman tree."""
    # Initialize a dictionary to store the Huffman dictionary
    huff_dict = {}

    # Recursive function to traverse the Huffman tree and build the dictionary
    def traverse(node, code):
        # If the node is a leaf node, add the symbol and code to the dictionary
        if len(node) == 2:
            symbol = node[1]
            huff_dict[symbol] = code
        # If the node is an internal node, recursively traverse its children
        else:
            traverse(node[1], code + "0")
            traverse(node[2], code + "1")

    # Call the recursive function to traverse the tree and build the dictionary
    traverse(tree, "")
    # Return the Huffman dictionary
    return huff_dict


# Example usage
source_folder = 'path/to/source/folder'
sorting_option = 'sorted_by'

def _build_priority_queue(self, frequency):
    """Builds a priority queue from the given symbol frequencies."""
    # Import the heapq module
    import heapq

    # Create a priority queue
    priority_queue = []

    # Add each symbol to the priority queue
    for symbol, freq in frequency.items():
        heapq.heappush(priority_queue, (freq, symbol))

    # Return the priority queue
    return priority_queue
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
            from collections import defaultdict
            import heapq
            from PyPDF2 import PdfFileMerger


            class FileOrganizer:
                def __init__(self, source_folder, script_extensions):
                    self.source_folder = source_folder
                    self.script_extensions = script_extensions

                def sort_files(self, sort_option, module_names=None):
                    if sort_option == "sorted_by":
                        self._sort_by_sorted_by_option()
                    elif sort_option == "file_type":
                        self._sort_by_file_type_option()
                    elif sort_option == "module":
                        self._sort_by_module_option(module_names)

                def _sort_by_sorted_by_option(self):
                    """Sorts files based on the 'sorted_by' option."""
                    for folder in os.listdir(self.source_folder):
                        if os.path.isdir(os.path.join(self.source_folder, folder)):
                            for file in os.listdir(os.path.join(self.source_folder, folder)):
                                if os.path.isfile(os.path.join(self.source_folder, folder, file)):
                                    _, file_extension = os.path.splitext(file)
                                    destination_folder = os.path.join(self.source_folder, folder, file_extension[1:])
                                    os.makedirs(destination_folder, exist_ok=True)
                                    shutil.move(
                                        os.path.join(self.source_folder, folder, file),
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

                def _sort_by_module_option(self, module_names):
                    """Sorts files based on contained module names."""
                    for file in os.listdir(self.source_folder):
                        if os.path.isfile(os.path.join(self.source_folder, file)):
                            _, file_extension = os.path.splitext(file)
                            for module_name in module_names:
                                if module_name in file.lower():
                                    destination_folder = os.path.join(self.source_folder, module_name)
                                    os.makedirs(destination_folder, exist_ok=True)
                                    shutil.move(
                                        os.path.join(self.source_folder, file),
                                        os.path.join(destination_folder, file)
                                    )
                                    print(f"Moved file '{file}' to module folder: {destination_folder}")
                                    break

                def combine_selected_pdfs(self, output_name, files_to_combine):
                    """Combines selected PDF files into one output PDF."""
                    output_path = os.path.join(self.source_folder, f"{output_name}.pdf")
                    self._combine_pdfs(output_path, *files_to_combine)
                    print(f"PDFs combined and saved to: {output_path}")

                def _combine_pdfs(self, output_path, *file_paths):
                    """Combines multiple PDF files into one."""
                    merged_pdf = PdfFileMerger()
                    for file_path in file_paths:
                        merged_pdf.append(file_path)
                    with open(output_path, 'wb') as output_file:
                        merged_pdf.write(output_file)

                def analyze_code_files(self):
                    """Analyzes code files and calculates optimized Huffman lengths."""
                    code_files = self._get_files_by_extensions(self.script_extensions)
                    for file_path in code_files:
                        code = self._read_text_file(file_path)
                        optimized_length = self._calculate_optimized_huffman_length(code)
                        print(f"Optimized Huffman Length of file '{file_path}': {optimized_length}")

                def _get_files_by_extensions(self, extensions):
                    """Finds all files with the given extensions in the source folder."""
                    files = []
                    for root, _, filenames in os.walk(self.source_folder):
                        for filename in filenames:
                            if os.path.splitext(filename)[1] in extensions:
                                file_path = os.path.join(root, filename)
                                files.append(file_path)
                    return files

                def _read_text_file(self, file_path):
                    """Reads and returns the content of a text file."""
                    with open(file_path, 'r') as file:
                        return file.read()

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
                    # implementation omitted for brevity
                    pass

                def _build_huffman_dict(self, tree):
                    """Builds a dictionary of Huffman codes based on the Huffman tree."""
                    # implementation omitted for brevity
                    pass


        class LibrarySorter:
            def __init__(self, source_folder):
                self.source_folder = source_folder
                self.module_names = [
                    'numpy', 'pandas', 'matplotlib', 'requests', 'scikit-learn', 'tensorflow', 'torch', 'seaborn',
                    'flask', 'django', 'sqlalchemy', 'beautifulsoup4', 'openpyxl', 'pyqt5', 'pytest', 'selenium'
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
                        for file in os.listdir(os.path.join(self.source_folder, folder)):
                            if os.path.isfile(os.path.join(self.source_folder, folder, file)):
                                _, file_extension = os.path.splitext(file)
                                destination_folder = os.path.join(self.source_folder, folder, file_extension[1:])
                                os.makedirs(destination_folder, exist_ok=True)
                                shutil.move(
                                    os.path.join(self.source_folder, folder, file),
                                    os.path.join(destination_folder, file)
                                )
                                print(f"Moved file '{file}' to folder: {destination_folder}")

            def _sort_by_file_type_option(self):
                """Sorts files based on their file type."""
                for file in os.listdir(self.source_folder):
                    if os.path.isfile(os.path.join(self.source_folder, file)):
                        import os
                        import shutil
                        from PyPDF2 import PdfFileMerger

                        class LibrarySorter:
                            def __init__(self, source_folder, module_names=None):
                                self.source_folder = source_folder
                                self.module_names = module_names or []
                                self.script_extensions = ['.py']

                            def create_folders(self):
                                """Creates folders for each module name."""
                                for module_name in self.module_names:
                                    os.makedirs(os.path.join(self.source_folder, module_name), exist_ok=True)

                            def sort_folders(self, sorting_option):
                                """Sorts files based on the selected sorting option."""
                                if sorting_option == 'sorted_by':
                                    self._sort_by_module_option()
                                elif sorting_option == 'file_type':
                                    self._sort_by_file_type_option()

                            def export_to_folder(self, destination_folder):
                                from PyPDF2 import PdfFileMerger
                                import os
                                import shutil

                                class FileOrganizer:
                                    def __init__(self, source_folder, script_extensions, module_names):
                                        self.source_folder = source_folder
                                        self.script_extensions = script_extensions
                                        import os
                                        import shutil
                                        from PyPDF2 import PdfFileMerger, PdfFileReader

                                        class FileOrganizer:
                                            def __init__(self, source_folder, script_extensions, module_names):
                                                self.source_folder = source_folder
                                                self.script_extensions = script_extensions
                                                self.module_names = module_names

                                            def sort_files(self, sort_option):
                                                if sort_option == 'module':
                                                    self._sort_by_module_option()
                                                elif sort_option == 'file_type':
                                                    self._sort_by_file_type_option()

                                            def _sort_by_module_option(self):
                                                """Sorts files based on their module."""
                                                for file in os.listdir(self.source_folder):
                                                    if os.path.isfile(os.path.join(self.source_folder, file)):
                                                        _, file_extension = os.path.splitext(file)
                                                        if file_extension in self.script_extensions:
                                                            module_name = self._get_module_name(file)
                                                            if module_name in self.module_names:
                                                                destination_folder = os.path.join(self.source_folder, module_name)
                                                                os.makedirs(destination_folder, exist_ok=True)
                                                                shutil.move(
                                                                    os.path.join(self.source_folder, file),
                                                                    os.path.join(destination_folder, file)
                                                                )
                                                                print(f"Moved file '{file}' to folder: {destination_folder}")

                                            def _sort_by_file_type_option(self):
                                                """Sorts files based on their file type."""
                                                for file in os.listdir(self.source_folder):
                                                    import os
                                                    import shutil
                                                    from PyPDF2 import PdfFileMerger, PdfFileReader

                                                    class FileOrganizer:
                                                        def __init__(self, source_folder):
                                                            self.source_folder = source_folder

                                                        import os
                                                        import shutil
                                                        from PyPDF2 import PdfFileMerger, PdfFileReader

                                                        class HuffmanEncoder:
                                                            def encode(self, text):
                                                                """Encodes a text string using Huffman encoding."""
                                                                frequency = self._calculate_frequencies(text)
                                                                heap = self._build_priority_queue(frequency)
                                                                import heapq
                                                                import os
                                                                import shutil


                                                                class HuffmanEncoder:
                                                                    def encode(self, text):
                                                                        """Encodes a text string using Huffman encoding."""
                                                                        frequency = {}
                                                                        for char in text:
                                                                            if char in frequency:
                                                                                frequency[char] += 1
                                                                            else:
                                                                                frequency[char] = 1
                                                                        heap = self._build_priority_queue(frequency)
                                                                        tree = self._build_huffman_tree(heap)
                                                                        huffman_dict = self._build_huffman_dict(tree)
                                                                        encoded_text = self._encode_text(text, huffman_dict)
                                                                        return encoded_text

                                                                    def _build_priority_queue(self, frequency):
                                                                        """Builds a priority queue from a frequency dictionary."""
                                                                        heap = [[weight, [symbol, '']] for symbol, weight in frequency.items()]
                                                                        heapq.heapify(heap)
                                                                        return heap

                                                                    def _build_huffman_tree(self, heap):
                                                                        """Builds a Huffman tree from a priority queue."""
                                                                        while len(heap) > 1:
                                                                            lo = heapq.heappop(heap)
                                                                            hi = heapq.heappop(heap)
                                                                            for pair in lo[1:]:
                                                                                pair[1] = '0' + pair[1]
                                                                            for pair in hi[1:]:
                                                                                pair[1] = '1' + pair[1]
                                                                            heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
                                                                        return heap[0]

                                                                    def _build_huffman_dict(self, tree):
                                                                        """Builds a Huffman dictionary from a Huffman tree."""
                                                                        huffman_dict = {}
                                                                        for pair in tree[1:]:
                                                                            huffman_dict[pair[0]] = pair[1]
                                                                        return huffman_dict

                                                                    def _encode_text(self, text, huffman_dict):
                                                                        """Encodes a text string using a Huffman dictionary."""
                                                                        encoded_text = ''
                                                                        for char in text:
                                                                            encoded_text += huffman_dict[char]
                                                                        return encoded_text

                                                                    def decode(self, encoded_text, huffman_dict):
                                                                        """Decodes a Huffman-encoded text string."""
                                                                        reverse_dict = {v: k for k, v in huffman_dict.items()}
                                                                        decoded_text = ''
                                                                        i = 0
                                                                        while i < len(encoded_text):
                                                                            j = i + 1
                                                                            while j <= len(encoded_text):
                                                                                symbol = reverse_dict.get(encoded_text[i:j])
                                                                                if symbol is not None:
                                                                                    decoded_text += symbol
                                                                                    break
                                                                                j += 1
                                                                            i = j
                                                                        return decoded_text


                                                                class FileOrganizer:
                                                                    def __init__(self, source_folder, destination_folder):
                                                                        self.source_folder = source_folder
                                                                        self.destination_folder = destination_folder

                                                                    def sort_files(self, sorting_option):
                                                                        extensions = {
                                                                            'images': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
                                                                            'videos': ['.mp4', '.mkv', '.avi', '.mov', '.flv'],
                                                                            'documents': ['.doc', '.docx', '.pdf', '.txt', '.ppt', '.pptx', '.xls', '.xlsx'],
                                                                            'music': ['.mp3', '.wav', '.flac', '.m4a', '.aac'],
                                                                            'archives': ['.zip', '.rar', '.tar', '.gz', '.7z']
                                                                        }
                                                                        dirs = {
                                                                            'images': os.path.join(self.destination_folder, 'Images'),
                                                                            'videos': os.path.join(self.destination_folder, 'Videos'),
                                                                            'documents': os.path.join(self.destination_folder, 'Documents'),
                                                                            'music': os.path.join(self.destination_folder, 'Music'),
                                                                            'archives': os.path.join(self.destination_folder, 'Archives')
                                                                        }
                                                                        for dir_path in dirs.values():
                                                                            if not os.path.exists(dir_path):
                                                                                os.makedirs(dir_path)
                                                                        for file_name in os.listdir(self.source_folder):
                                                                            file_extension = os.path.splitext(file_name)[1]
                                                                            for category, ext_list in extensions.items():
                                                                                if file_extension in ext_list:
                                                                                    shutil.move(os.path.join(self.source_folder, file_name), dirs[category])
                                                                                    break

                                                                    def merge_pdfs(self):
                                                                        pdfs = [file for file in os.listdir(self.source_folder) if file.endswith('.pdf')]
                                                                        pdf_merger = PdfFileMerger()
                                                                        for pdf in pdfs:
                                                                            with open(os.path.join(self.source_folder, pdf), 'rb') as file:
                                                                                pdf_merger.append(PdfFileReader(file))
                                                                        with open(os.path.join(self.destination_folder, 'merged.pdf'), 'wb') as file:
                                                                            pdf_merger.write(file)


                                                                class LibrarySorter:
                                                                    def __init__(self, source_folder, destination_folder):
                                                                        self.source_folder = source_folder
                                                                        self.destination_folder = destination_folder

                                                                    def sort_books(self):
                                                                        module_names = ['sqlalchemy', 'openpyxl', 'pyqt']
                                                                        for module_name in module_names:
                                                                            if not os.path.exists(os.path.join(self.destination_folder, module_name)):
                                                                                os.makedirs(os.path.join(self.destination_folder, module_name))
                                                                        for file_name in os.listdir(self.source_folder):
                                                                            if file_name.endswith('.py'):
                                                                                with open(os.path.join(self.source_folder, file_name), 'r') as file:
                                                                                    text = file.read()
                                                                                if any(module_name in text for module_name in module_names):
                                                                                    shutil.move(os.path.join(self.source_folder, file_name), os.path.join(self.destination_folder, module_name, file_name))


                                                                                        pair[1] = '0' + pair[1]
                                                                                    for pair in hi[1:]:
                                                                                        pair[1] = '1' + pair[1]
                                                                                    heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:] + hi[1:])
                                                                                return heap[0]

                                                                            def _build_huffman_dict(self, tree):
                                                                                """Builds a Huffman dictionary from a Huffman tree."""
                                                                                huffman_dict = {}
                                                                                for pair in tree[1:]:
                                                                                    huffman_dict[pair[0]] = pair[1]
                                                                                return huffman_dict

                                                                            def _encode_text(self, text, huffman_dict):
                                                                                """Encodes a text string using a Huffman dictionary."""
                                                                                encoded_text = ''
                                                                                for char in text:
                                                                                    encoded_text += huffman_dict[char]
                                                                                return encoded_text

                                                                        class FileOrganizer:
                                                                            def __init__(self, source_folder):
                                                                                self.source_folder = source_folder

                                                                            def organize_files(self):
                                                                                """Organizes files in the source folder by moving them to folders based on their file extension."""
                                                                                for file in os.listdir(self.source_folder):
                                                                                    if os.path.isfile(os.path.join(self.source_folder, file)):
                                                                                        _, file_extension = os.path.splitext(file)
                                                                                        destination_folder = os.path.join(self.source_folder, file_extension[1:])
                                                                                        os.makedirs(destination_folder, exist_ok=True)
                                                                                        shutil.move(
                                                                                            os.path.join(self.source_folder, file),
                                                                                            os.path.join(destination_folder, file)
                                                                                        )
                                                                                        print(f"Moved file '{file}' to folder: {destination_folder}")

                                                                            def _get_module_name(self, file_name):
                                                                                """Returns the module name of a Python script."""
                                                                                with open(os.path.join(self.source_folder, file_name), 'r') as f:
                                                                                    for line in f:
                                                                                        if line.startswith('import'):
                                                                                            module_name = line.split()[1]
                                                                            return module_name.split('.')[0]
                                                                return 'other'

                                                            def _get_files_by_extensions(self, extensions):
                                                                """Returns a list of files in the source folder with the given extensions."""
                                                                files = []
                                                                for file in os.listdir(self.source_folder):
                                                                    if os.path.isfile(os.path.join(self.source_folder, file)):
                                                                        _, file_extension = os.path.splitext(file)
                                                                        if file_extension in extensions:
                                                                            files.append(os.path.join(self.source_folder, file))
                                                                import heapq
                                                                import os
                                                                import shutil
                                                                from collections import defaultdict
                                                                from PyPDF2 import PdfFileMerger, PdfFileReader
                                                                from huffman_encoder import HuffmanEncoder


                                                                class LibrarySorter:
                                                                    def __init__(self, source_folder):
                                                                        self.source_folder = source_folder

                                                                    def merge_pdfs(self, destination_folder):
                                                                        """Exports all PDF files in the source folder to the destination folder."""
                                                                        pdf_files = self._get_files_by_extensions(['.pdf'])
                                                                        merger = PdfFileMerger()
                                                                        for pdf_file in pdf_files:
                                                                            merger.append(PdfFileReader(pdf_file, 'rb'))
                                                                        merger.write(os.path.join(destination_folder, 'merged.pdf'))
                                                                        print(f"Exported {len(pdf_files)} PDF files to folder: {destination_folder}")

                                                                    def _get_files_by_extensions(self, extensions):
                                                                        """Returns a list of files in the source folder with the given extensions."""
                                                                        files = []
                                                                        for file in os.listdir(self.source_folder):
                                                                            if os.path.isfile(os.path.join(self.source_folder, file)):
                                                                                _, file_extension = os.path.splitext(file)
                                                                                if file_extension in extensions:
                                                                                    files.append(os.path.join(self.source_folder, file))
                                                                        return files

                                                                    def _calculate_optimized_huffman_length(self, text):
                                                                        """Calculates the length of an optimized Huffman-encoded text string."""
                                                                        freq = defaultdict(int)
                                                                        for symbol in text:
                                                                            freq[symbol] += 1
                                                                        heap = [[weight, [symbol, ""]] for symbol, weight in freq.items()]
                                                                        heapq.heapify(heap)
                                                                        while len(heap) > 1:
                                                                            lo = heapq.heappop(heap)
                                                                            hi = heapq.heappop(heap)
                                                                            for pair in lo[1:]:
                                                                                hi[1] = [s + "0" for s in hi[1]]
                                                                            for pair in hi[1:]:
                                                                                lo[1].append(pair)
                                                                            heapq.heappush(heap, [lo[0] + hi[0]] + lo[1:])
                                                                        huffman_dict = dict(sorted(heap[0][1:], key=lambda p: (len(p[-1]), p)))
                                                                        encoded_text = ''.join(huffman_dict[symbol] for symbol in text)
                                                                        return len(encoded_text) // 8 + (len(encoded_text) % 8 != 0)


                                                                class FileOrganizer:
                                                                    def __init__(self, source_folder, module_names):
                                                                        self.source_folder = source_folder
                                                                        self.module_names = module_names

                                                                    def organize_files(self, option):
                                                                        if option == 'file_type':
                                                                            self._sort_by_file_type_option()
                                                                        elif option == 'module':
                                                                            self._sort_by_module_option()

                                                                    def export_files(self, destination_folder):
                                                                        """Exports all files in the source folder to the destination folder."""
                                                                        for module_name in self.module_names:
                                                                            module_folder = os.path.join(destination_folder, module_name)
                                                                            os.makedirs(module_folder, exist_ok=True)
                                                                            for file in os.listdir(self.source_folder):
                                                                                if os.path.isfile(os.path.join(self.source_folder, file)):
                                                                                    _, file_extension = os.path.splitext(file)
                                                                                    if file_extension == '.py' and module_name in file:
                                                                                        shutil.copy(os.path.join(self.source_folder, file), os.path.join(module_folder, file))

                                                                    def _sort_by_file_type_option(self):
                                                                        """Sorts files in the source folder by file type."""
                                                                        for file in os.listdir(self.source_folder):
                                                                            if os.path.isfile(os.path.join(self.source_folder, file)):
                                                                                _, file_extension = os.path.splitext(file)
                                                                                destination_folder = os.path.join(self.source_folder, file_extension[1:].upper())
                                                                                os.makedirs(destination_folder, exist_ok=True)
                                                                                shutil.move(os.path.join(self.source_folder, file), os.path.join(destination_folder, file))

                                                                    def _sort_by_module_option(self):
                                                                        """Sorts files in the source folder by module."""
                                                                        for module_name in self.module_names:
                                                                            module_folder = os.path.join(self.source_folder, module_name)
                                                                            os.makedirs(module_folder, exist_ok=True)
                                                                            for file in os.listdir(self.source_folder):
                                                                                if os.path.isfile(os.path.join(self.source_folder, file)):
                                                                                    _, file_extension = os.path.splitext(file)
                                                                                    if file_extension == '.py' and module_name in file:
                                                                                        shutil.move(os.path.join(self.source_folder, file), os.path.join(module_folder, file))
                                                    else:
                                                        print(f"Invalid option: {option}")

                                                def export_files(self, destination_folder):
                                                    """Exports all files to the destination folder."""
                                                    files = self._get_files_by_extensions(['.py', '.txt'])
                                                    for file in files:
                                                        shutil.move(
                                                            os.path.join(self.source_folder, file),
                                                            os.path.join(destination_folder, file)
                                                        )
                                                        print(f"Moved file '{file}' to folder: {destination_folder}")

                                                def analyze_code_files(self):
                                                    """Analyzes all code files in the source folder."""
                                                    files = self._get_files_by_extensions(['.py'])
                                                    for file in files:
                                                        text = self._read_text_file(file)
                                                        ohl = self._calculate_optimized_huffman_length(text)
                                                        print(f"Optimized Huffman length of '{file}': {ohl}")

                                                def _sort_by_file_type_option(self):
                                                    """Sorts files based on their file type."""
                                                    extensions = ['.py', '.txt']
                                                    for file in os.listdir(self.source_folder):
                                                        if os.path.isfile(os.path.join(self.source_folder, file)):
                                                            _, file_extension = os.path.splitext(file)
                                                            destination_folder = os.path.join(self.source_folder, file_extension[1:])
                                                            os.makedirs(destination_folder, exist_ok=True)
                                                            shutil.move(
                                                                os.path.join(self.source_folder, file),
                                                                os.path.join(destination_folder, file)
                                                            )
                                                            print(f"Moved file '{file}' to folder: {destination_folder}")

                                                def _sort_by_module_option(self):
                                                    """Sorts files based on contained module names."""
                                                    for file in os.listdir(self.source_folder):
                                                        import heapq
                                                        import os
                                                        import shutil


                                                        class HuffmanEncoder:
                                                            def __init__(self, source_folder):
                                                                self.source_folder = source_folder

                                                            def encode(self, extensions):
                                                                """Encodes all files with the given extensions in the source folder using Huffman coding."""
                                                                files = self._get_files_by_extensions(extensions)
                                                                for file_path in files:
                                                                    data = self._read_text_file(file_path)
                                                                    ohl = self._calculate_optimized_huffman_length(data)
                                                                    print(f"{file_path}: {ohl}")

                                                            def _build_huffman_dict(self, huffman_tree, prefix="", huffman_dict=None):
                                                                """Builds a Huffman dictionary from the given Huffman tree."""
                                                                if huffman_dict is None:
                                                                    huffman_dict = {}
                                                                if isinstance(huffman_tree[1], str):
                                                                    huffman_dict[huffman_tree[1]] = prefix
                                                                else:
                                                                    self._build_huffman_dict(huffman_tree[1], prefix + "0", huffman_dict)
                                                                    self._build_huffman_dict(huffman_tree[2], prefix + "1", huffman_dict)
                                                                return huffman_dict

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

                                                            def _calculate_optimized_huffman_length(self, data):
                                                                """Calculates the optimized Huffman length for the given data."""
                                                                frequencies = {}
                                                                for char in data:
                                                                    if char not in frequencies:
                                                                        frequencies[char] = 0
                                                                    frequencies[char] += 1
                                                                heap = [[freq, [char, ""]] for char, freq in frequencies.items()]
                                                                heapq.heapify(heap)
                                                                while len(heap) > 1:
                                                                    left = heapq.heappop(heap)
                                                                    right = heapq.heappop(heap)
                                                                    for pair in left[1:]:
                                                                        pair[1] = '0' + pair[1]
                                                                    for pair in right[1:]:
                                                                        pair[1] = '1' + pair[1]
                                                                    heapq.heappush(heap, [left[0] + right[0]] + left[1:] + right[1:])
                                                                huffman_dict = self._build_huffman_dict(heap[0])
                                                                return sum(frequencies[char] * len(huffman_dict[char]) for char in data)
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
                                                                            """Calculates the frequency of each symbol in the given data."""
                                                                            frequency = {}
                                                                            for char in data:
                                                                                if char in frequency:
                                                                                    frequency[char] += 1
                                                                                else:
                                                                                    frequency[char] = 1
                                                                            return frequency

                                                                        def _build_priority_queue(self, frequency):
                                                                            """Builds a priority queue from the given frequency dictionary."""
                                                                            priority_queue = []
                                                                            for char, freq in frequency.items():
                                                                                heapq.heappush(priority_queue, (freq, char))
                                                                            return priority_queue

                                                                        def _build_huffman_tree(self, priority_queue):
                                                                            """Builds a Huffman tree from the given priority queue."""
                                                                            while len(priority_queue) > 1:
                                                                                left_child = heapq.heappop(priority_queue)
                                                                                right_child = heapq.heappop(priority_queue)
                                                                                merged_node = (left_child[0] + right_child[0], left_child, right_child)
                                                                                heapq.heappush(priority_queue, merged_node)
                                                                            return priority_queue[0]
                                            for symbol in data:
                                                if symbol in frequency:
                                                    frequency[symbol] += 1
                                                else:
                                                    frequency[symbol] = 1
                                            return frequency

                                        def _build_priority_queue(self, frequency):
                                            """Builds a priority queue from the given symbol frequencies."""
                                            import heapq
                                            from collections import defaultdict


                                            class HuffmanEncoder:
                                                def __init__(self):
                                                    pass

                                                def encode(self, data):
                                                    """Encodes the given data using Huffman coding."""
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
                                            sorting_option = 'sorted_by'  # or 'file_type'
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
