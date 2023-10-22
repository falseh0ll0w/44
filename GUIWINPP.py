import tkinter as tk
from tkinter import filedialog
from tkinter import messagebox
from tkinter import ttk


class WebampGUI:
    """
    A class representing the Webamp GUI.

    Attributes:
        root (tkinter.Tk): The root window of the GUI.
        menu_bar (tkinter.Menu): The menu bar of the GUI.
        file_menu (tkinter.Menu): The file menu of the GUI.
        help_menu (tkinter.Menu): The help menu of the GUI.
        label (ttk.Label): The label of the GUI.
    """

    def __init__(self, root):
        """
        Initializes a new instance of the WebampGUI class.

        Args:
            root (tkinter.Tk): The root window of the GUI.

        Returns:
            None
        """
        self.new_method()
        self.root = root
        self.root.title("Webamp")
        self.root.geometry("400x300")

        # Create a menu bar
        self.menu_bar = tk.Menu(self.root)
        self.root.config(menu=self.menu_bar)

        # Create a File menu
        self.file_menu = tk.Menu(self.menu_bar, tearoff=0)
        self.menu_bar.add_cascade(label="File", menu=self.file_menu)
        self.file_menu.add_command(label="Open", command=self.open_file)
        self.file_menu.add_separator()
        self.file_menu.add_command(label="Exit", command=self.exit_app)

        # Create a Help menu
        self.help_menu = tk.Menu(self.menu_bar, tearoff=0)
        self.menu_bar.add_cascade(label="Help", menu=self.help_menu)
        self.help_menu.add_command(label="About", command=self.show_about)

        # Create a label
        self.label = ttk.Label(self.root, text="Welcome to Webamp!")
        self.label.pack(pady=50)

    def new_method(self, root):
        """
        Creates a new webamp GUI.

        Args:
            root (tkinter.Tk): The root window of the GUI.

        Returns:
            None
        """

    def open_file(self):
        """
        Function to open a file dialog and display the selected file path in a message box.
        """
        file_path = filedialog.askopenfilename(filetypes=[("All Files", "*.*")])
        messagebox.showinfo("Selected File", file_path)

    def exit_app(self):
        """
        Function to exit the application.
        """
        self.root.destroy()

    def show_about(self):
        """
        Function to display information about the application.
        """
        messagebox.showinfo("About", "Webamp - A simple web-based music player")


# Create the root window
root = tk.Tk()

# Create an instance of the WebampGUI class
webamp_gui = WebampGUI(root)

# Run the application
root.mainloop()
