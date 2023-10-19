import os
import shutil
import subprocess

# Set the destination directory for all Git repositories
DESTINATION_DIR = os.path.join(os.path.expanduser("~"), "git")

# Create the destination directory if it doesn't exist
if not os.path.exists(DESTINATION_DIR):
    os.makedirs(DESTINATION_DIR)

# Find all Git directories
GIT_DIRS = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], cwd=os.path.expanduser("~"), stderr=subprocess.STDOUT, shell=True)
GIT_DIRS = GIT_DIRS.decode("utf-8").strip().split("\n")

# Loop through all Git directories
for GIT_DIR in GIT_DIRS:
    # Get the parent directory of the Git directory
    PARENT_DIR = os.path.dirname(GIT_DIR)
    # Get the name of the Git directory
    GIT_NAME = os.path.basename(PARENT_DIR)

    # Check if the Git directory is already in the destination directory
    if os.path.abspath(GIT_DIR) == os.path.abspath(os.path.join(DESTINATION_DIR, GIT_NAME)):
        continue

    # Check if the Git directory is being moved to a subdirectory of itself
    if os.path.abspath(PARENT_DIR).startswith(os.path.abspath(os.path.join(DESTINATION_DIR, GIT_NAME))):
        continue

    # Check if a directory with the same name already exists in the destination directory
    if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME)) and not os.path.isdir(os.path.join(DESTINATION_DIR, GIT_NAME)):
        os.remove(os.path.join(DESTINATION_DIR, GIT_NAME))

    # Check if a directory with the same name is a Git repository in the destination directory
    if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME, ".git")):
        shutil.rmtree(os.path.join(DESTINATION_DIR, GIT_NAME))

    # Check if a directory with the same name is a Git submodule in the destination directory
    if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME, ".gitmodules")):
        shutil.rmtree(os.path.join(DESTINATION_DIR, GIT_NAME))

    # Move the Git directory to the destination directory
    shutil.move(PARENT_DIR, os.path.join(DESTINATION_DIR, GIT_NAME))

    # Check if Git is installed
    if shutil.which("git") is None:
        print("Git is not installed.")
        continue

    # Handle Git submodules with nested submodules
    try:
        subprocess.check_output(["git", "submodule", "update", "--init", "--recursive"], cwd=os.path.join(DESTINATION_DIR, GIT_NAME))
        subprocess.check_output(["git", "submodule", "foreach", "--recursive", "git", "submodule", "update", "--init", "--recursive"], cwd=os.path.join(DESTINATION_DIR, GIT_NAME))
    except subprocess.CalledProcessError as e:
        print(f"Error running Git command: e")

    # Check if Git LFS is installed
    if os.path.exists(os.path.join(os.environ["ProgramFiles"], "Git", "mingw64", "libexec", "git-core", "git-lfs.exe")):
        subprocess.check_output(["git", "lfs", "install"], cwd=os.path.join(DESTINATION_DIR, GIT_NAME))
        if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME, ".gitattributes")):
            subprocess.check_output(["git", "config", "lfs.url", "https://custom-lfs-endpoint.com"], cwd=os.path.join(DESTINATION_DIR, GIT_NAME))
            subprocess.check_output(["git", "lfs", "pull"], cwd=os.path.join(DESTINATION_DIR, GIT_NAME))
    else:
        print("Git LFS is not installed.")

    # Handle Git hooks with custom hooks
    if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME, ".githooks")):
        shutil.rmtree(os.path.join(DESTINATION_DIR, GIT_NAME, ".git", "hooks"))
        shutil.copytree(os.path.join(PARENT_DIR, ".githooks"), os.path.join(DESTINATION_DIR, GIT_NAME, ".git", "hooks"))

    # Handle Git aliases with custom aliases
    if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME, ".gitaliases")):
        with open(os.path.join(DESTINATION_DIR, GIT_NAME, ".gitconfig"), "a") as f:
            f.write("\n[include]\n path = ../.gitaliases")

    # Handle Git configuration files with custom configurations
    if os.path.exists(os.path.join(DESTINATION_DIR, GIT_NAME, ".gitconfig.custom")):
        shutil.move(os.path.join(PARENT_DIR, ".gitconfig.custom"), os.path.join(DESTINATION_DIR, GIT_NAME, ".gitconfig"))

    # Fix the Windows VCS registry
    if os.name == "nt":
        subprocess.check_output(["git", "config", "--global", "core.autocrlf", "false"])
        subprocess.check_output(["git", "config", "--global", "core.safecrlf", "false"])
        subprocess.check_output(["reg", "add", "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", "/v", "HideFileExt", "/t", "REG_DWORD", "/d", "0", "/f"])
