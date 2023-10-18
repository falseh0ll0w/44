import os

def combine_code(output_file, *input_files):
    """Combines the contents of multiple code files into one."""
    combined_code = ''
    for input_file in input_files:
        with open(input_file, 'r') as file:
            code = file.read()
            combined_code += code + '\n\n'
    
    with open(output_file, 'w') as file:
        file.write(combined_code)

# Example usage
combine_code('combined_code.py', 'file1.py', 'file2.py')
print("Code combined successfully!")
