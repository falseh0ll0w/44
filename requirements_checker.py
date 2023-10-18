import os
import importlib

# Get the path to the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Define the path to the project directory
project_dir = os.path.join(os.path.expanduser("~"), "my_project")

# Check if the project directory exists, if not create it
if not os.path.exists(project_dir):
    os.makedirs(project_dir)

# Set the project directory as the current directory
os.chdir(project_dir)

# Define the path to the requirements file
requirements_file_name = "requirements.txt"
requirements_file = os.path.join(project_dir, requirements_file_name)

# Check if the requirements file exists, if not create it
if not os.path.exists(requirements_file):
    with open(requirements_file, "w") as f:
        f.write("library1\nlibrary2\nlibrary3")

# Open the requirements file and read the libraries
with open(requirements_file, "r") as f:
    libraries = f.read().splitlines()

# Loop through the libraries and import them
for library in libraries:
    try:
        importlib.import_module(library)
        print(f"{library} imported successfully")
    except ImportError:
        print(f"Failed to import {library}")

# Print a message if no requirements were found in the requirements file
if not libraries:
    print(f"No requirements found in {requirements_file_name}.")
