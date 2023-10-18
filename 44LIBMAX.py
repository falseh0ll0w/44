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
                                                return files

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
                                        for file in os.listdir(self.source_folder):
                                            if os.path.isfile(os.path.join(self.source_folder, file)):
                                                _, file_extension = os.path.splitext(file)
                                                if file_extension in extensions:
                                                    files.append(os.path.join(self.source_folder, file))
                                        return files

                            """Returns a list of files in the source folder with the given extensions."""
                            files = []
                            for file in os.listdir(self.source_folder):
                                if os.path.isfile(os.path.join(self.source_folder, file)):
                                    _, file_extension = os.path.splitext(file)
                                    if file_extension in extensions:
                                        files.append(os.path.join(self.source_folder, file))
                            return files

                        def _read_text_file(self, file_path):
                            """Reads a text file and returns its contents."""
                            with open(file_path, 'r') as f:
                                return f.read()

                        def _calculate_optimized_huffman_length(self, text):
                            """Calculates the optimized Huffman length of a text."""
                            freq = defaultdict(int)
                            for symbol in text:
                                freq[symbol] += 1
                            heap = [[weight, [symbol, ""]] for symbol, weight in freq.items()]
                            heapq.heapify(heap)
                            while len(heap) > 1:
                                lo = heapq.heappop(heap)
                                hi = heapq.heappop(heap)
                                for pair in lo[1:]:
                                    import heapq
                                    import os
                                    import shutil
                                    from PyPDF2 import PdfFileMerger


                                    class FileOrganizer:
                                        def __init__(self, source_folder, module_names):
                                            self.source_folder = source_folder
                                            self.module_names = module_names

                                        def organize_files(self, option):
                                            """Organizes files based on the selected option."""
                                            if option == 'file_type':
                                                self._sort_by_file_type_option()
                                            elif option == 'module':
                                                self._sort_by_module_option()

                                        def export_files(self, destination_folder):
                                            import os
                                            import shutil

                                            class FileOrganizer:
                                                def __init__(self, source_folder, module_names):
                                                    self.source_folder = source_folder
                                                    self.module_names = module_names

                                                def organize_files(self, option):
                                                    if option == 'file_type':
                                                        self._sort_by_file_type_option()
                                                    elif option == 'module':
                                                        self._sort_by_module_option()
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

                                                def _calculate_optimized_huffman_length(self, data):
                                                    """Calculates the optimized Huffman length of the given data."""
                                                    frequency = self._calculate_frequencies(data)
                                                    priority_queue = self._build_priority_queue(frequency)
                                                    huffman_tree = self._build_huffman_tree(priority_queue)
                                                    return self._calculate_huffman_length(huffman_tree, frequency)

                                                def _calculate_frequencies(self, data):
                                                    """Calculates the frequency of each character in the given data."""
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

                                                def _calculate_huffman_length(self, huffman_tree, frequency):
                                                    """Calculates the Huffman length of the given Huffman tree and frequency dictionary."""
                                                    if isinstance(huffman_tree[1], str):
                                                        return huffman_tree[0] * frequency[huffman_tree[1]]
                                                    else:
                                                        return (self._calculate_huffman_length(huffman_tree[1], frequency) +
                                                                self._calculate_huffman_length(huffman_tree[2], frequency))
                                            huffman_dict = self._build_huffman_dict(huffman_tree)

                                            ohl = 0
                                            for symbol in data:
                                                ohl += len(huffman_dict[symbol])
                                            return ohl

                                        def _calculate_frequencies(self, data):
                                            """Calculates the frequency of each symbol in the given data."""
                                            frequency = {}
                                            for symbol in data:
                                                if symbol in frequency:
                                                    frequency[symbol] += 1
                                                else:
                                                    frequency[symbol] = 1
                                            return frequency

                                        def _build_priority_queue(self, frequency):
                                            """Builds a priority queue from the given symbol frequencies."""
                                            priority_queue = []
                                            for symbol, freq in frequency.items():
                                                heapq.heappush(priority_queue, [freq, symbol])
                                            return priority_queue

                                        def _build_huffman_tree(self, priority_queue):
                                            """Builds a Huffman tree from the given priority queue."""
                                            while len(priority_queue) > 1:
                                                lo = heapq.heappop(priority_queue)
                                                hi = heapq.heappop(priority_queue)
                                                for pair in lo[1:]:
                                                    pair[1] = '0' + pair[1]
                                                for pair in hi[1:]:
                                                    pair[1] = '1' + pair[1]
                                                heapq.heappush(priority_queue, [lo[0] + hi[0]] + lo[1:] + hi[1:])
                                            return priority_queue[0]

                                        def _build_huffman_dict(self, huffman_tree):
                                            """Builds a Huffman dictionary from the given Huffman tree."""
                                            huffman_dict = {}
                                            for pair in huffman_tree[1:]:
                                                huffman_dict[pair[0]] = pair[1]
                                            return huffman_dict
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
