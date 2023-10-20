import os
import shutil

# Function to get the Windows icon directory
def get_icon_directory():
    try:
        user_profile = os.environ['USERPROFILE']
        icon_directory = os.path.join(user_profile, 'AppData', 'Local', 'Microsoft', 'Windows', 'Themes')
        return icon_directory
    except Exception as e:
        print(f"Error: {e}")
        return None

# Function to install icons
def install_icons():
    icon_directory = get_icon_directory()
    if icon_directory:
        try:
            current_directory = os.getcwd()
            for folder in os.listdir(current_directory):
                folder_path = os.path.join(current_directory, folder)
                if os.path.isdir(folder_path):
                    icon_files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico'))]
                    if icon_files:
                        # Copy the first valid image file to the Windows icon directory
                        icon_file = icon_files[0]
                        shutil.copy2(os.path.join(folder_path, icon_file), os.path.join(icon_directory, icon_file))

                        # Set the folder icon to the copied image
                        os.system(f"attrib +S {os.path.join(icon_directory, icon_file)}")

            print("Icon folders installed and set successfully!")
        except Exception as e:
            print(f"Error: {e}")

# Call the install_icons function to automate the process
install_icons()
