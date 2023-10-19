import os
import subprocess
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
from tkinter.ttk import Progressbar
import ast
import sys
import json
import threading
import traceback

# Function to scan for Python files and install missing libraries
def scan_project_folders():
    local_path = selected_directory.get()
    required_libraries = set()

    python_paths = set()
    git_paths = set()
    github_paths = set()

    for root, dirs, files in os.walk(local_path):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                check_libraries(file_path, required_libraries)

            if file == "requirements.txt":
                requirements_path = os.path.join(root, file)
                check_requirements(requirements_path, required_libraries)

            if file == "config.json":
                config_path = os.path.join(root, file)
                check_config(config_path)

            if ".git" in dirs:
                git_paths.add(os.path.join(root, ".git"))

    python_env_label.config(text=f"Python Paths: {', '.join(python_paths)}")
    git_env_label.config(text=f"Git Paths: {', '.join(git_paths)}")
    github_env_label.config(text=f"GitHub Paths: {', '.join(github_paths)}")

    if required_libraries:
        install_libraries(list(required_libraries))

    log_message("Scan and Fix completed successfully!")

# Function to check and install missing libraries for a Python file
def check_libraries(file_path, required_libraries):
    try:
        with open(file_path, 'r') as file:
            code = file.read()
            required_libraries.update(get_required_libraries(code))
    except Exception as e:
        log_message(f"Error checking libraries in file: {file_path}\n{str(e)}")

# Function to check requirements.txt files
def check_requirements(requirements_path, required_libraries):
    try:
        with open(requirements_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line:
                    required_libraries.add(line)
    except Exception as e:
        log_message(f"Error checking requirements in file: {requirements_path}\n{str(e)}")

# Function to check config.json files
def check_config(config_path):
    try:
        with open(config_path, 'r') as file:
            config_data = json.load(file)
            github_username = config_data.get("github_username")
            github_password = config_data.get("github_password")
            if github_username and github_password:
                github_paths.add(config_path)
    except Exception as e:
        log_message(f"Error checking config in file: {config_path}\n{str(e)}")

# Function to extract required libraries from Python code
def get_required_libraries(code):
    required_libraries = set()
    tree = ast.parse(code)
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for n in node.names:
                required_libraries.add(n.name)
        elif isinstance(node, ast.ImportFrom):
            module_name = node.module
            for n in node.names:
                required_libraries.add(f"{module_name}.{n.name}")
    return required_libraries

# Function to install missing libraries
def install_libraries(libraries):
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + list(libraries),
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        log_message(f"Error installing libraries: {str(e)}")

# Function to perform directory overhaul
def reorganize_directories():
    # Implement directory overhaul logic here
    log_message("Overhauling project directories...")

# Function to handle exceptions and log detailed error messages
def handle_exception():
    log_text.config(state=tk.NORMAL)
    log_message("An error occurred during the scan and fix process. See below for details:")

    # Log the complete traceback of the exception
    exception_text = traceback.format_exc()
    log_message(exception_text)

    # Display an error message box
    messagebox.showerror("Error", "An error occurred during the scan and fix process. Check the log for details.")

    # Re-enable the buttons for user interaction
    select_button.config(state=tk.NORMAL)
    edit_config_button.config(state=tk.NORMAL)
    scan_button.config(state=tk.NORMAL)

# Function to log messages
def log_message(message):
    log_text.config(state=tk.NORMAL)
    log_text.insert(tk.END, message + "\n")
    log_text.config(state=tk.DISABLED)

# Function to select a directory
def select_directory():
    directory = filedialog.askdirectory(title="Select Directory")
    if directory:
        selected_directory.set(directory)

# Function to edit and save the config.json file
def edit_config():
    config = {
        "local_path": selected_directory.get(),
        "github_username": github_username_entry.get(),
        "github_password": github_password_entry.get(),
        "logging": {
            "level": "INFO",
            "filename": "logfile.log",
            "filemode": "a",
            "console": True,
            "console_level": "INFO"
        }
    }

    config_path = os.path.join(selected_directory.get(), "config.json")

    with open(config_path, "w") as f:
        json.dump(config, f, indent=4)

    messagebox.showinfo("Configuration Updated", "Configuration has been updated and saved successfully!")

# Function to initiate the scan process
def start_scan():
    log_text.config(state=tk.NORMAL)
    log_text.delete(1.0, tk.END)  # Clear the log text
    log_message("Scanning and fixing missing libraries...")

    # Disable the buttons during the scan
    select_button.config(state=tk.DISABLED)
    edit_config_button.config(state=tk.DISABLED)
    scan_button.config(state=tk.DISABLED)

    try:
        # Start the scan in a separate thread to keep the GUI responsive
        scan_thread = threading.Thread(target=scan_project_folders)
        scan_thread.start()
    except Exception as e:
        handle_exception()

# Create the main window
window = tk.Tk()
window.title("Python/GitHub Directory Fixer")
window.geometry("800x400")

# Create a label and entry to display the selected directory
selected_directory = tk.StringVar()
directory_label = tk.Label(window, text="Selected Directory:")
directory_label.pack()
directory_entry = tk.Entry(window, textvariable=selected_directory, state='readonly', width=50)
directory_entry.pack()

# Create a button to select a directory
select_button = tk.Button(window, text="Select Directory", command=select_directory)
select_button.pack()

# Create a button to edit and save the config.json file
edit_config_button = tk.Button(window, text="Edit config.json", command=edit_config)
edit_config_button.pack()

# Create a button to initiate the scan
scan_button = tk.Button(window, text="Scan and Fix", command=start_scan)
scan_button.pack()

# Create a progress bar (indeterminate mode, as it's not used for progress tracking here)
progressbar = Progressbar(window, mode="indeterminate", length=200)
progressbar.pack()

# Create an entry for GitHub username
github_username_label = tk.Label(window, text="GitHub Username:")
github_username_label.pack()
github_username_entry = tk.Entry(window, width=50)
github_username_entry.pack()

# Create an entry for GitHub password
github_password_label = tk.Label(window, text="GitHub Password:")
github_password_label.pack()
github_password_entry = tk.Entry(window, show="*", width=50)
github_password_entry.pack()

# Create a log text box
log_text = scrolledtext.ScrolledText(window, state=tk.DISABLED, width=70, height=10)
log_text.pack()

# Create labels to display Python, Git, and GitHub paths
python_env_label = tk.Label(window, text="Python Paths:")
python_env_label.pack()
git_env_label = tk.Label(window, text="Git Paths:")
git_env_label.pack()
github_env_label = tk.Label(window, text="GitHub Paths:")
github_env_label.pack()

# Start the GUI event loop
window.mainloop()
