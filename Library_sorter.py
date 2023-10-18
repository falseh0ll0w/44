import os
import shutil
from PyPDF2 import PdfFileReader
from PIL import Image, ImageDraw, ImageFont
import win32clipboard


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

    def sort_by_selection(self, selection):
        """Sorts all files in the source folder based on the given selection."""
        root_destination_folder = os.path.join(self.source_folder, selection)
        os.makedirs(root_destination_folder, exist_ok=True)

        all_files = self._get_all_files()

        if selection == "sort44":
            self._sort_44(all_files, root_destination_folder)
        else:
            self._sort_by_file_type(all_files, root_destination_folder)

    def export_to_folder(self, destination_folder):
        """Exports the sorted files and folders to the destination folder."""
        shutil.copytree(self.source_folder, destination_folder)

    def combine_python_code(self, output_file, *input_files):
        """Combines Python code from input files into the output file."""
        combined_code = ''
        for input_file in input_files:
            with open(input_file, 'r') as file:
                code = file.read()
                combined_code += code + '\n\n'

        with open(output_file, 'w') as file:
            file.write(combined_code)

    def scrape_pdf_python_code(self, file_path):
        """Scrapes Python code from a PDF file."""
        with open(file_path, 'rb') as file:
            pdf = PdfFileReader(file)
            code_text = ''
            for page_num in range(pdf.getNumPages()):
                page = pdf.getPage(page_num)
                text = page.extractText()
                code_text += self._extract_python_code_from_text(text)
            return code_text

    def display_results_popup(self, window_text, x, y, width, height):
        """Displays the text in a results popup window with custom dimensions."""
        with open('results.txt', 'w') as file:
            file.write(window_text)
        image = Image.new('RGB', (width, height), (255, 255, 255))
        draw = ImageDraw.Draw(image)
        font = ImageFont.truetype('arial.ttf', size=12)
        draw.text((10, 10), window_text, font=font, fill=(0, 0, 0))
        image.save('results.png')
        cropped_image = image.crop((x, y, x + width, y + height))
        cropped_image.show()

    def hex_code_preview_tool(self):
        """Displays a color preview tool with the provided color palette."""
        tool_width = 400
        tool_height = 300
        tool = Image.new('RGB', (tool_width, tool_height), (255, 255, 255))

        preview_box_width = (tool_width - 40) // 5
        preview_box_height = (tool_height - 60) // 5
        x_start = 20
        y_start = 20

        for i, color_hex in enumerate(self.theme_colors):
            row = i // 5
            col = i % 5
            x = x_start + (col * (preview_box_width + 10))
            y = y_start + (row * (preview_box_height + 10))
            color_rgb = tuple(int(color_hex[i:i + 2], 16) for i in (0, 2, 4))
            draw = ImageDraw.Draw(tool)
            draw.rectangle([(x, y), (x + preview_box_width, y + preview_box_height)], fill=color_rgb)

        drag_box_x = 200
        drag_box_y = 200
        drag_box_width = 100
        drag_box_height = 100
        drag_box_color = tuple(int('e5989b'[i:i + 2], 16) for i in (0, 2, 4))
        draw_drag_box(tool, drag_box_x, drag_box_y, drag_box_width, drag_box_height, drag_box_color)

        tool.show()

    def toggle_copy(self, selected_colors):
        """Copies the hex codes of selected colors to the clipboard."""
        hex_codes = [self.theme_colors[color_index] for color_index in selected_colors]

        hex_codes_text = '\n'.join(hex_codes)
        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardText(hex_codes_text)
        win32clipboard.CloseClipboard()

    def _get_all_files(self):
        """Recursively retrieves all files in the source folder."""
        all_files = []
        for root, dirs, files in os.walk(self.source_folder):
            for file in files:
                file_path = os.path.join(root, file)
                all_files.append(file_path)
        return all_files

    def _sort_44(self, files, root_destination_folder):
        """Sorts files using 'sort44' selection."""
        for file_path in files:
            filename = os.path.basename(file_path)
            _, file_extension = os.path.splitext(filename)

            if file_extension in self.script_extensions:
                destination_folder = os.path.join(root_destination_folder, 'scripts')
            elif file_extension in self.library_extensions:
                destination_folder = os.path.join(root_destination_folder, 'libraries')
            elif file_extension in self.data_extensions:
                destination_folder = os.path.join(root_destination_folder, 'data')
            elif file_extension in self.document_extensions:
                destination_folder = os.path.join(root_destination_folder, 'documents')
            elif any(module_name in file_path for module_name in self.module_names):
                destination_folder = os.path.join(root_destination_folder, 'modules')
            else:
                destination_folder = os.path.join(root_destination_folder, 'other_files')

            os.makedirs(destination_folder, exist_ok=True)
            shutil.move(file_path, os.path.join(destination_folder, filename))

    def _sort_by_file_type(self, files, root_destination_folder):
        """Sorts files based on their file type."""
        for file_path in files:
            filename = os.path.basename(file_path)
            _, file_extension = os.path.splitext(filename)

            destination_folder = os.path.join(root_destination_folder, file_extension[1:])
            os.makedirs(destination_folder, exist_ok=True)
            shutil.move(file_path, os.path.join(destination_folder, filename))

    def _extract_python_code_from_text(self, text):
        """Extracts Python code blocks from text based on code block markers."""
        lines = text.split('\n')
        code_blocks = []
        current_block = []
        in_code_block = False

        for line in lines:
            if any(marker in line for marker in self.code_block_markers):
                in_code_block = not in_code_block

                if not in_code_block:
                    code_blocks.append('\n'.join(current_block))
                    current_block = []
            elif in_code_block:
                current_block.append(line.strip())

        return '\n'.join(code_blocks)

    def create_folder(self, folder_path):
        """Creates a folder at the given path."""
        os.makedirs(folder_path, exist_ok=True)
        print(f"Created folder: {folder_path}")

    def execute_script(self, script_path):
        """Executes a Python script from the given script path."""
        if os.path.isfile(script_path) and script_path.endswith('.py'):
            os.system(f'python {script_path}')
            print(f"Executed script: {script_path}")
        else:
            print("Invalid script file or file format.")

    def download_all_files(self, destination_folder):
        """Downloads all files in the source folder to the destination folder."""
        shutil.copytree(self.source_folder, destination_folder)
        print(f"All files in the source folder have been downloaded to: {destination_folder}")

    def combine_code_files(self, output_file, *input_files):
        """Combines code from input files into the output file."""
        combined_code = ''
        for input_file in input_files:
            if os.path.isfile(input_file):
                with open(input_file, 'r') as file:
                    code = file.read()
                    combined_code += code + '\n\n'
            else:
                print(f"File not found: {input_file}")

        with open(output_file, 'w') as file:
            file.write(combined_code)
        print(f"Code files have been combined into: {output_file}")


# Example usage
source_folder = 'path/to/source/folder'
selection = 'sort44'
destination_folder = 'path/to/destination/folder'
output_file = 'combined_code.py'
input_files = ['file1.py', 'file2.py']
pdf_file = 'sample.pdf'
display_x = 100
display_y = 100
display_width = 400
display_height = 400
new_folder_path = 'path/to/new/folder'
script_path = 'path/to/script.py'
download_destination = 'path/to/download/destination'

sorter = LibrarySorter(source_folder)
sorter.sort_by_selection(selection)
sorter.export_to_folder(destination_folder)
sorter.combine_python_code(output_file, *input_files)
scraped_code = sorter.scrape_pdf_python_code(pdf_file)
sorter.display_results_popup(scraped_code, display_x, display_y, display_width, display_height)
sorter.hex_code_preview_tool()
sorter.toggle_copy([1, 3, 4])
sorter.create_folder(new_folder_path)
sorter.execute_script(script_path)
sorter.download_all_files(download_destination)
sorter.combine_code_files(output_file, *input_files)
