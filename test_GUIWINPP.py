import unittest
from unittest.mock import MagicMock, patch

import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk

from GUIWINPP import WebampGUI


class TestWebampGUI(unittest.TestCase):
    def setUp(self):
        self.root = tk.Tk()
        self.gui = WebampGUI(self.root)

    def tearDown(self):
        self.root.destroy()

    def test_init(self):
        self.assertIsInstance(self.gui.root, tk.Tk)
        self.assertEqual(self.gui.root.title(), "Webamp")
        self.assertEqual(self.gui.root.geometry(), "400x300")

        self.assertIsInstance(self.gui.menu_bar, tk.Menu)
        self.assertEqual(self.gui.root.cget("menu"), str(self.gui.menu_bar))

        self.assertIsInstance(self.gui.file_menu, tk.Menu)
        self.assertEqual(self.gui.file_menu.cget("tearoff"), 0)
        self.assertEqual(self.gui.menu_bar.index("File"), 0)
        self.assertEqual(self.gui.menu_bar.entrycget(0, "label"), "File")
        self.assertEqual(
            self.gui.menu_bar.nametowidget(".!menu.!cascade1").cget("menu"),
            str(self.gui.file_menu),
        )

        self.assertIsInstance(self.gui.help_menu, tk.Menu)
        self.assertEqual(self.gui.help_menu.cget("tearoff"), 0)
        self.assertEqual(self.gui.menu_bar.index("Help"), 1)
        self.assertEqual(self.gui.menu_bar.entrycget(1, "label"), "Help")
        self.assertEqual(
            self.gui.menu_bar.nametowidget(".!menu.!cascade2").cget("menu"),
            str(self.gui.help_menu),
        )

        self.assertIsInstance(self.gui.label, ttk.Label)
        self.assertEqual(self.gui.label.cget("text"), "Welcome to Webamp!")
        self.assertEqual(self.gui.label.master, self.gui.root)

    def test_open_file(self):
        with patch.object(filedialog, "askopenfilename", return_value="test.txt"):
            with patch.object(messagebox, "showinfo") as mock_showinfo:
                self.gui.open_file()
                mock_showinfo.assert_called_once_with("Selected File", "test.txt")

    def test_exit_app(self):
        with patch.object(self.gui.root, "destroy") as mock_destroy:
            self.gui.exit_app()
            mock_destroy.assert_called_once()

    def test_show_about(self):
        with patch.object(messagebox, "showinfo") as mock_showinfo:
            self.gui.show_about()
            mock_showinfo.assert_called_once_with(
                "About", "Webamp - A simple web-based music player"
            )
