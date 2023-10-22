import argparse
import logging
import os
import subprocess
import sys

# Set up logging
logging.basicConfig(filename="script.log", level=logging.DEBUG)


# Define functions
def check_python_version():
    """Checks the Python version to ensure compatibility with the virtual environment."""
    if sys.version_info < (3, 6):
        logging.error("Python version must be 3.6 or higher.")
        sys.exit(1)


def check_pip():
    """Checks if pip is installed."""
    try:
        subprocess.run(
            ["pip", "--version"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )
    except subprocess.CalledProcessError:
        logging.error("pip is not installed.")
        sys.exit(1)


def check_git():
    """Checks if Git is installed."""
    try:
        subprocess.run(
            ["git", "--version"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )
    except subprocess.CalledProcessError:
        logging.error("Git is not installed.")
        sys.exit(1)


def init_git(directory):
    """Initializes a new Git repository in the specified directory."""
    git_dir = os.path.join(directory, ".git")
    if not os.path.exists(git_dir):
        try:
            subprocess.run(["git", "init"], cwd=directory, check=True)
            logging.info("Git repository initialized successfully!")
        except subprocess.CalledProcessError:
            logging.exception("Failed to initialize Git repository.")
            sys.exit(1)
    else:
        logging.warning("A Git repository already exists in this directory.")


def init_python(directory):
    """Initializes a new Python virtual environment in the specified directory."""
    check_python_version()
    env_dir = os.path.join(directory, "env")
    if not os.path.exists(env_dir):
        try:
            subprocess.run(["python", "-m", "venv", "env"], cwd=directory, check=True)
            logging.info("Python virtual environment initialized successfully!")
        except subprocess.CalledProcessError:
            logging.exception("Failed to initialize Python virtual environment.")
            sys.exit(1)
    else:
        logging.warning(
            "A Python virtual environment already exists in this directory."
        )


def install_requirements(directory):
    """Installs the required Python packages from the requirements.txt file in the specified directory."""
    check_pip()
    requirements_file = os.path.join(directory, "requirements.txt")
    if os.path.isfile(requirements_file):
        try:
            subprocess.run(
                ["pip", "install", "-r", requirements_file], cwd=directory, check=True
            )
            logging.info("Python packages installed successfully!")
        except subprocess.CalledProcessError:
            logging.exception("Failed to install Python packages.")
            sys.exit(1)
    else:
        logging.warning("No requirements.txt file found in this directory.")


def check_installed_packages(directory):
    """Checks the current project's Python libraries for needed installation."""
    requirements_file = os.path.join(directory, "requirements.txt")
    if os.path.isfile(requirements_file):
        with open(requirements_file, "r") as f:
            required_packages = [line.strip() for line in f.readlines()]
        installed_packages = (
            subprocess.run(
                ["pip", "freeze"], cwd=directory, stdout=subprocess.PIPE, check=True
            )
            .stdout.decode()
            .split("\n")
        )
        for package in required_packages:
            if package not in installed_packages:
                logging.info(f"{package} is not installed.")
    else:
        logging.warning("No requirements.txt file found in this directory.")


# Define command line arguments
parser = argparse.ArgumentParser(
    description="Initialize Git and Python in a new project directory."
)
parser.add_argument(
    "--git", action="store_true", help="Initialize a new Git repository."
)
parser.add_argument(
    "--python", action="store_true", help="Initialize a new Python virtual environment."
)
parser.add_argument(
    "--requirements",
    action="store_true",
    help="Install required Python packages from requirements.txt file.",
)
parser.add_argument(
    "--check",
    action="store_true",
    help="Check the current project's Python libraries for needed installation.",
)

# Parse command line arguments
args = parser.parse_args()

# Set the project directory to the current working directory
directory = os.getcwd()

# Validate input values
if not os.path.exists(directory):
    logging.error("The current working directory does not exist.")
    sys.exit(1)
if not os.path.exists(os.path.join(directory, "requirements.txt")):
    logging.warning("No requirements.txt file found in this directory.")
if not any(vars(args).values()):
    logging.error(
        "No actions specified. Use --git, --python, --requirements, or --check to specify an action."
    )
    sys.exit(1)

# Initialize Git and/or Python
if args.git:
    check_git()
    init_git(directory)
if args.python:
    init_python(directory)
if args.requirements:
    install_requirements(directory)
if args.check:
    check_installed_packages(directory)

logging.info("Script execution complete.")
sys.exit(0)
