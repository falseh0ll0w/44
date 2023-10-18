import os
import shutil

class LibrarySorter:
    def __init__(self, source_folder):
        self.source_folder = source_folder

    def sort_by_selection(self, selection):
        """Sorts all files in the source folder based on the given selection."""
        # Create a root destination folder based on the selection
        root_destination_folder = os.path.join(self.source_folder, selection)
        os.makedirs(root_destination_folder, exist_ok=True)

        # Get all files and folders in the source folder
        files = []
        folders = []
        for item in os.listdir(self.source_folder):
            item_path = os.path.join(self.source_folder, item)
            if os.path.isfile(item_path):
                files.append(item_path)
            elif os.path.isdir(item_path):
                folders.append(item_path)

        # Sort files based on the selection
        if selection == "sort44":
            self._sort_44(files, root_destination_folder)
        else:
            self._sort_by_file_type(files, root_destination_folder)

        # Sort folders recursively
        for folder in folders:
            subfolder_name = os.path.basename(folder)
            subfolder_destination = os.path.join(root_destination_folder, subfolder_name)
            sorter = LibrarySorter(folder)
            sorter.sort_by_selection(selection)
            self._move_folder_contents(folder, subfolder_destination)

    def export_to_folder(self, destination_folder):
        """Exports the sorted files and folders to the destination folder."""
        shutil.copytree(self.source_folder, destination_folder)

    def create_folder(self, folder_path):
        """Creates a folder at the given path."""
        os.makedirs(folder_path, exist_ok=True)

    def pop_out_window(self, window_text):
        """Opens a text file window with the given text."""
        with open('window.txt', 'w') as file:
            file.write(window_text)
        # Open the text file window in the default text editor
        os.system('start notepad window.txt')

    def crop_and_reshape_window(self, x1, y1, x2, y2):
        """Crops and reshapes the text file window to the specified size."""
        # Crop and reshape the window using external tool or library
        # Example: using Pillow library
        from PIL import Image

        image = Image.open('window.txt')
        cropped_image = image.crop((x1, y1, x2, y2))
        resized_image = cropped_image.resize((x2 - x1, y2 - y1))
        resized_image.show()

    def _sort_44(self, files, root_destination_folder):
        """Sorts files using 'sort44' selection."""
        for file_path in files:
            filename = os.path.basename(file_path)
            if filename.startswith('44'):
                destination_folder = os.path.join(root_destination_folder, '44')
            else:
                destination_folder = os.path.join(root_destination_folder, 'others')
            os.makedirs(destination_folder, exist_ok=True)
            shutil.move(file_path, os.path.join(destination_folder, filename))

    def _sort_by_file_type(self, files, root_destination_folder):
        """Sorts files based on their file type."""
        for file_path in files:
            filename = os.path.basename(file_path)
            file_type = os.path.splitext(filename)[1]
            destination_folder = os.path.join(root_destination_folder, file_type)
            os.makedirs(destination_folder, exist_ok=True)
            shutil.move(file_path, os.path.join(destination_folder, filename))

    def _move_folder_contents(self, source_folder, destination_folder):
        """Moves the contents of a folder to another folder."""
        for item in os.listdir(source_folder):
            item_path = os.path.join(source_folder, item)
            shutil.move(item_path, destination_folder)


# Example usage
source_folder = 'path/to/source/folder'
selection = 'sort44'
destination_folder = 'path/to/destination/folder'

sorter = LibrarySorter(source_folder)
sorter.sort_by_selection(selection)
sorter.export_to_folder(destination_folder)
sorter.create_folder('path/to/new/folder')
sorter.pop_out_window('This is the text in the window.')
sorter.crop_and_reshape_window(100, 100, 400, 400)
