import pandas as pd

# USED TO FILTER THE MASTER_LIST AS FILTERED_LIST
# Load the CSV file
input_file = "master_list.csv"
output_file = "filtered_list.csv"

# Try reading the file with various delimiters
try:
    # Try reading as comma-separated first
    df = pd.read_csv(input_file, delimiter=',')
except:
    # Fallback to tab-separated
    df = pd.read_csv(input_file, delimiter='\t')

# Trim column names to remove any leading/trailing spaces or characters
df.columns = df.columns.str.strip()

# Check if NOMBRES and CORREO exist after trimming
if 'NOMBRES' in df.columns and 'CORREO' in df.columns:
    # Keep only the columns "NOMBRES" and "CORREO"
    filtered_df = df[['NOMBRES', 'CORREO']]

    # Write the filtered DataFrame to a new CSV file
    filtered_df.to_csv(output_file, index=False)
    print(f"Filtered CSV saved as {output_file}")
else:
    print("Error: 'NOMBRES' or 'CORREO' columns not found in the file.")
