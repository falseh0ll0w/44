"""
This module provides functions for copying files.
"""
import sys
import os
import shutil

def get_script_directory():
    """
    Returns the directory of the script.
    """
    return os.path.dirname(os.path.abspath(__file__))


def write(payload):
    """
    Writes the payload to a file named poc.txt.
    :param payload: The payload to write to the file.
    :type payload: str
    """
    with open("poc.txt", "w", encoding="utf-8") as f:
        f.write(payload)


def copy_script(source, target):
    """
    Copies the script from source to target directory.
    :param source: The source directory of the script.
    :type source: str
    :param target: The target directory of the script.
    :type target: str
    """
    if not os.path.exists(target):
        os.makedirs(target)
    target_file = os.path.join(target, os.path.basename(source))
    shutil.copy(source, target_file)

def create_version():
    """
    Creates a new version of the script with a version number appended to the filename.
    """
    script_dir = get_script_directory()
    script_path = os.path.join(script_dir, os.path.basename(sys.argv[0]))
    version = 1
    while True:
        versioned_script_path = os.path.join(script_dir, f"{os.path.splitext(os.path.basename(sys.argv[0]))[0]}_{version}.py")
        if not os.path.exists(versioned_script_path):
            shutil.copy(script_path, versioned_script_path)
            break
        version += 1

script_dir = get_script_directory()
script_path = os.path.join(script_dir, os.path.basename(sys.argv[0]))
# Replace the following line with the path to the target directory
target_dir = os.path.join(get_script_directory(), "path/to/target_directory")

if not os.path.exists(script_path):
    create_version()
else:
    copy_script(script_path, target_dir)
