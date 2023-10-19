@echo off
setlocal EnableDelayedExpansion

rem Define the list of required libraries
set libraries=numpy pandas matplotlib scikit-learn

rem Loop through the list of libraries and install each one
for %%i in (%libraries%) do (
    pip install %%i
)
