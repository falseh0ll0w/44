import ctypes
import os
import shutil
import sys
import platform

# Function to inject icons into imageres.dll
def inject_icons():
    try:
        # Get the path to imageres.dll
        def get_icon_directory():
            # Get the path to imageres.dll
            system_root = os.environ.get('SystemRoot', 'C:\\Windows')
            return os.path.join(system_root, 'System32', 'imageres.dll')

        imageres_path = get_icon_directory()

        # Ensure the file exists
        if not os.path.isfile(imageres_path):
            print("imageres.dll not found.")
            return

        # Create a directory to store backup copies of imageres.dll
        backup_dir = os.path.join(os.getcwd(), 'backup')
        os.makedirs(backup_dir, exist_ok=True)

        # Function to backup imageres.dll
        def backup_imageres():
            try:
                backup_path = os.path.join(backup_dir, 'imageres.dll.backup')
                shutil.copy2(imageres_path, backup_path)
                print(f"Backed up imageres.dll to {backup_path}")
            except Exception as e:
                print(f"Error backing up imageres.dll: {str(e)}")
        backup_imageres()

        current_directory = os.getcwd()
        for folder in os.listdir(current_directory):
            folder_path = os.path.join(current_directory, folder)
            if os.path.isdir(folder_path):
                icon_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico'))]
                if icon_files:
                    # Copy the first valid image file to imageres.dll
                    icon_file = icon_files[0]
                    shutil.copy2(os.path.join(folder_path, icon_file), imageres_path)

                    print(f"Injected {icon_file} into imageres.dll.")

        print("Icon injection completed successfully!")

        # Notify Windows to reload icons
        if platform.system() == "Windows":
            ctypes.windll.user32.SystemParametersInfoW(0x0014, 0, imageres_path, 0x0002 | 0x0001)

    except Exception as e:
        print(f"Error: {str(e)}")
        return

# Function to display usage message
def usage(why):
    print(f"{why}\n")
    print("Usage: python inject_icons.py")

if __name__ == "__main__":
    # Check for administrative privileges
    if not ctypes.windll.shell32.IsUserAnAdmin():
        usage("Please run the script as an administrator.")
        sys.exit()

    # Call the inject_icons function to automate the process
    inject_icons()
