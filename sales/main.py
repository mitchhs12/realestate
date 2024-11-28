import base64
import os
import pickle
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

def authenticate_gmail():
    creds = None
    pickle_path = "token.pickle"
    if os.path.exists(pickle_path):  # Check if the token.pickle file exists
        with open(pickle_path, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open(pickle_path, 'wb') as token:
            pickle.dump(creds, token)
    return build('gmail', 'v1', credentials=creds)

def create_email(sender, recipient, subject, body, hubspot_bcc):
    message = MIMEMultipart()
    message['to'] = recipient
    message['from'] = sender
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
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw_message}

def send_email(service, message):
    try:
        sent_message = service.users().messages().send(userId='me', body=message).execute()
        print("Email sent successfully.")
        return sent_message
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    service = authenticate_gmail()
    sender = "mitchell@vivaideal.com"
    recipient = "mitchell@vivaideal.com"
    subject = "Test Email with HubSpot Tracking"
    body = "Hello, this is a test email sent with tracking."
    hubspot_bcc = "47448944@bcc.hubspot.com"  # Replace with your actual HubSpot BCC address

    email = create_email(sender, recipient, subject, body, hubspot_bcc)
    send_email(service, email)

if __name__ == '__main__':
    main()
