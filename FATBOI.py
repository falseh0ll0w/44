import tkinter as tk
from tkinter import filedialog
from typing import Optional

from sympy import latex
from sympy.parsing.sympy_parser import (
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)


def pdf_to_text(file_path: str) -> str:
    """
    Convert PDF to text.

    Args:
        file_path: The path to the PDF file.

    Returns:
        The text extracted from the PDF file.
    """
    import PyPDF2

    with open(file_path, "rb") as f:
        pdf_reader = PyPDF2.PdfFileReader(f)
        page = pdf_reader.getPage(0)
        text = page.extractText()
    return text


def text_to_latex(text: str) -> str:
    """
    Convert text to LaTeX.

    Args:
        text: The text to convert.

    Returns:
        The LaTeX representation of the text.
    """
    import tkinter as tk
    from tkinter import filedialog
    from typing import Optional

    from sympy import latex
    from sympy.parsing.sympy_parser import (
        implicit_multiplication_application,
        parse_expr,
        standard_transformations,
    )


    def pdf_to_text(file_path: str) -> str:
        """
        Convert PDF to text.

        Args:
            file_path: The path to the PDF file.

        Returns:
            The text extracted from the PDF file.
        """
        import PyPDF2

        with open(file_path, "rb") as f:
            pdf_reader = PyPDF2.PdfFileReader(f)
            page = pdf_reader.getPage(0)
            text = page.extractText()
        return text


    def text_to_latex(text: str) -> str:
        """
        Convert text to LaTeX.

        Args:
            text: The text to convert.

        Returns:
            The LaTeX representation of the text.
        """
        # Apply standard transformations to parse text as mathematical expressions
        transformations = standard_transformations + (implicit_multiplication_application,)
        expr = parse_expr(text, transformations=transformations)
        # Convert expression to LaTeX
        return latex(expr)


    class Application(tk.Frame):
        """
        A GUI application for converting PDF files to LaTeX format.

        Attributes:
            master: The root window of the application.
            select_file_button: A button for selecting a PDF file.
            convert_button: A button for converting the selected PDF file to LaTeX format.
            quit_button: A button for quitting the application.
            file_path_label: A label for displaying the path of the selected PDF file.
            latex_output_label: A label for displaying the LaTeX output.
        """

        def __init__(self, master: tk.Tk) -> None:
            """
            Initializes the Application object.

            Args:
                master: The root window of the application.
            """
            super().__init__(master)
            self.master = master
            self.pack()
            self.create_widgets()

        def create_widgets(self) -> None:
            """
            Creates the widgets for the application.
            """
            self.select_file_button = tk.Button(
                self, text="Select PDF file", command=self.select_file
            )
            self.select_file_button.pack(side="top", padx=10, pady=10)

            self.convert_button = tk.Button(
                self, text="Convert to LaTeX", command=self.convert_to_latex
            )
            self.convert_button.pack(side="top", padx=10, pady=10)

            self.quit_button = tk.Button(
                self, text="Quit", fg="red", command=self.master.destroy
            )
            self.quit_button.pack(side="bottom", padx=10, pady=10)

            self.file_path_label: tk.Label = tk.Label(self, text="")
            self.file_path_label.pack(side="top", padx=10, pady=10)

            self.latex_output_label: tk.Label = tk.Label(self, text="")
            self.latex_output_label.pack(side="top", padx=10, pady=10)

        def select_file(self) -> None:
            """
            Opens a file dialog for selecting a PDF file.
            """
            file_path = filedialog.askopenfilename()
            self.file_path_label.config(text=file_path)

        def convert_to_latex(self) -> None:
            """
            Converts the selected PDF file to LaTeX format and displays the output.
            """
            file_path = self.file_path_label.cget("text")
            if file_path:
                latex_output = self.pdf_to_latex(file_path)
                self.latex_output_label.config(text=latex_output)

        def pdf_to_latex(self, file_path: str) -> Optional[str]:
            """
            Converts a PDF file to LaTeX format.

            Args:
                file_path: The path of the PDF file to convert.

            Returns:
                The LaTeX output, or None if the conversion failed.
            """
            text = pdf_to_text(file_path)
            return text_to_latex(text)

        self.latex_output_label = tk.Label(self, text="")
        self.latex_output_label.pack(side="top", padx=10, pady=10)

    def select_file(self) -> None:
        """
        Opens a file dialog for selecting a PDF file.
        """
        file_path = filedialog.askopenfilename()
        self.file_path_label.config(text=file_path)

    def convert_to_latex(self) -> None:
        """
        Converts the selected PDF file to LaTeX format and displays the output.
        """
        file_path = self.file_path_label.cget("text")
        if file_path:
            latex_output = self.pdf_to_latex(file_path)
            self.latex_output_label.config(text=latex_output)

    def pdf_to_latex(self, file_path: str) -> Optional[str]:
        """
        Converts a PDF file to LaTeX format.

        Args:
            file_path (str): The path of the PDF file to convert.

        Returns:
            str: The LaTeX output, or None if the conversion failed.
        """
        text = pdf_to_text(file_path)
        return text_to_latex(text)
