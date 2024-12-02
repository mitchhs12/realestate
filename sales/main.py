import base64
import os
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from google.oauth2 import service_account
from googleapiclient.discovery import build

# Define the required scope
SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# Path to your service account key file
SERVICE_ACCOUNT_FILE = 'credentials.json'  # Replace with your JSON file path
EMAILS_FILE="emails.txt"

def authenticate_gmail(user_email):
    """Authenticate as a service account and impersonate a user."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    delegated_credentials = credentials.with_subject(user_email)
    return build('gmail', 'v1', credentials=delegated_credentials)

def create_email(sender, recipient, subject, body, hubspot_bcc, attachment_path=None):
    """Create an email with tracking."""
    display_name = "Mariajose de Viva Ideal"  # Replace with the desired display name
    sender_with_name = f"{display_name} <{sender}>"
    message = MIMEMultipart()
    message['to'] = recipient
    message['from'] = sender_with_name
    message['subject'] = subject
    message['bcc'] = hubspot_bcc  # Add HubSpot BCC address

    # HTML body with HubSpot tracking pixel
    html_body = f"""
    <html>
        <body>
            {body}
            <img src="https://track.hubspot.com/__ptq.gif" style="display:none;" alt="">
        </body>
    </html>
    """
    message.attach(MIMEText(html_body, 'html'))

    # Add attachment if provided
    if attachment_path:
        try:
            file_size = os.path.getsize(attachment_path)
            if file_size > 25 * 1024 * 1024:
                print(f"Attachment size exceeds 25MB limit: {file_size / (1024 * 1024):.2f} MB")
                return None
            with open(attachment_path, 'rb') as attachment_file:
                attachment = MIMEBase('application', 'octet-stream')
                attachment.set_payload(attachment_file.read())
            encoders.encode_base64(attachment)
            attachment.add_header(
                'Content-Disposition',
                f'attachment; filename="{os.path.basename(attachment_path)}"'
            )
            message.attach(attachment)
        except FileNotFoundError:
            print(f"Attachment file not found: {attachment_path}")
            return None

    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}

def send_email(service, message):
    """Send an email."""
    try:
        sent_message = service.users().messages().send(userId='me', body=message).execute()
        print("Email sent successfully.")
        return sent_message
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def bulk_send_emails():
    sender = "mariajose@vivaideal.com"  # Email of the impersonated user
    subject = "Test Email with HubSpot / Brochure Tracking"
    body = "Hello, this is a test email sent with tracking."
    hubspot_bcc = "47448944@bcc.hubspot.com"  # Replace with your actual HubSpot BCC address
    attachment_path="viva-ideal.pdf"

    # Authenticate as the service account and impersonate the sender
    service = authenticate_gmail(sender)

    # Create and send the email
    try:
        with open(EMAILS_FILE, 'r') as file:
            for recipient in file.readlines():
                recipient = recipient.strip()
                if recipient:
                    print(f"Sending email to {recipient}...")
                    email = create_email(sender, recipient, subject, body, hubspot_bcc, attachment_path)
                    send_email(service, email)
    except FileNotFoundError:
        print(f"Email file not found: {EMAILS_FILE}")

if __name__ == '__main__':
    bulk_send_emails()
