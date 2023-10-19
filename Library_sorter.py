import os
import shutil
from PyPDF2 import PdfFileReader
from PIL import Image, ImageDraw, ImageFont
import win32clipboard


def sort_by_selection(self, selection):
    """
    Sorts all files in the source folder based on the given selection.

    Args:
        selection (str): The selection to sort the files by.

    Returns:
        None
    """
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
        import os
        import subprocess
        import shutil
        from typing import List, Tuple


        class ImageProcessor:
            def __init__(self, source_folder: str):
                self.source_folder = source_folder

            def __repr__(self) -> str:
                return f"ImageProcessor({self.source_folder})"

            def _get_files(self, selection: List[str]) -> List[str]:
                files = []
                for root, _, filenames in os.walk(self.source_folder):
                    for filename in filenames:
                        if filename.endswith(tuple(selection)):
                            files.append(os.path.join(root, filename))
                return files

            def resize_images(self, destination_folder: str, output_size: Tuple[int, int]) -> None:
                for file_path in self._get_files([".jpg", ".jpeg", ".png"]):
                    img = Image.open(file_path)
                    img = img.resize(output_size, Image.ANTIALIAS)
                    output_file = os.path.join(destination_folder, os.path.basename(file_path))
                    img.save(output_file)

            def convert_images(self, destination_folder: str, output_format: str) -> None:
                for file_path in self._get_files([".jpg", ".jpeg", ".png"]):
                    img = Image.open(file_path)
                    output_file = os.path.join(destination_folder, os.path.splitext(os.path.basename(file_path))[0] + f".{output_format}")
                    img.save(output_file)

            def crop_images(self, output_folder: str, selection: List[str], x: int, y: int, width: int, height: int) -> None:
                for file_path in self._get_files(selection):
                    img = Image.open(file_path)
                    img = img.crop((x, y, x + width, y + height))
                    output_file = os.path.join(output_folder, os.path.basename(file_path))
                    img.save(output_file)

            def draw_drag_box(self, window_text: str, x: int, y: int, width: int, height: int) -> None:
                subprocess.Popen(["nircmd.exe", "win", "activate", "class", "Shell_TrayWnd", "setsize", str(x), str(y), str(width), str(height)])

            def copy_files(self, files: List[str], root_destination_folder: str) -> None:
                for file_path in files:
                    destination_folder = os.path.join(root_destination_folder, os.path.dirname(file_path))
                    os.makedirs(destination_folder, exist_ok=True)
                    shutil.copy(file_path, destination_folder)

            def move_files(self, files: List[str], root_destination_folder: str) -> None:
                for file_path in files:
                    destination_folder = os.path.join(root_destination_folder, os.path.dirname(file_path))
                    os.makedirs(destination_folder, exist_ok=True)
                    shutil.move(file_path, destination_folder)

            def rename_files(self, text: str, selection: List[str]) -> None:
                for file_path in self._get_files(selection):
                    file_name, file_ext = os.path.splitext(os.path.basename(file_path))
                    new_file_name = f"{text}{file_ext}"
                    new_file_path = os.path.join(os.path.dirname(file_path), new_file_name)
                    os.rename(file_path, new_file_path)

            def create_folder(self, folder_path: str) -> None:
                os.makedirs(folder_path, exist_ok=True)

            @staticmethod
            def run_script(script_path: str) -> None:
                subprocess.Popen(["python", script_path])

            def compress_images(self, output_file: str, *input_files: str) -> None:
                subprocess.run(["tar", "-czvf", output_file] + list(input_files), check=True)
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
