import csv

# USED WITH THE SPECIFIC PERSON'S EMAILS TO EXTRACT MATCHING EMAILS FROM  THE MASTER LIST

def extract_matching_emails(csv_file, emails_file, output_file):
    # Read emails from the text file
    with open(emails_file, 'r') as f:
        emails_to_find = set(email.strip() for email in f.readlines())

    # Open the CSV file and create a new output CSV
    with open(csv_file, 'r', encoding='utf-8') as csvfile:
        csvreader = csv.DictReader(csvfile)
        matching_rows = []

        # Iterate through the CSV and find matching emails
        for row in csvreader:
            if row['CORREO'] in emails_to_find:
                matching_rows.append({'NOMBRES': row['NOMBRES'], 'CORREO': row['CORREO']})

    # Write the matching rows to a new CSV file
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['NOMBRES', 'CORREO']
        csvwriter = csv.DictWriter(csvfile, fieldnames=fieldnames)

        csvwriter.writeheader()
        csvwriter.writerows(matching_rows)

    print(f"Matching emails have been written to {output_file}.")

# Example usage
csv_file = 'master_list.csv'  # Path to your CSV file with NOMBRES and CORREO columns
emails_file = 'emails.txt'  # Path to the text file with emails
output_file = 'matching_emails.csv'  # Output CSV file

extract_matching_emails(csv_file, emails_file, output_file)
