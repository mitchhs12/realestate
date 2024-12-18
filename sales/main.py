import argparse
import base64
import csv
import os
import time
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
CSV_FILE="csv.csv"

SENDER_INFO = {
    'majo': {
        'name': "Mariajose",
        'email': "mariajose@vivaideal.com",
        "title": "Coordinadora de Relaciones Corporativas",
        "signature": """
                    <br><br>Saludos cordiales,<br>
                    Mariajosé Sotomayor Ugarte-Quiroz (CRC)<br><br>
                    <span style="color: #6AA84F;">VIVA IDEAL PTY LTD</span><br>
                    <span style="color: #6AA84F;">Móvil: (+51) 944 711 588</span><br>
                    <span style="color: #6AA84F;">Dirección: 68 Circular Road, #02-01, Singapur</span><br>
                    <span style="color: #6AA84F;">Correo electrónico: <a href="mailto:mariajose@vivaideal.com">mariajose@vivaideal.com</a></span><br>
                    <span style="color: #6AA84F;">Sitio web: <a href="https://www.vivaideal.com" target="_blank">www.vivaideal.com</a></span><br>
                    """
    },
    'marie': {
        'name': "Marie",
        'email': "mariesophia@vivaideal.com",
        "title": "Coordinadora de Operaciones",
        "signature": """
                    <br><br>Saludos cordiales,<br>
                    Marie Sophia Córdova (Coordinadora de Operaciones)<br><br>
                    <span style="color: #6AA84F;">VIVA IDEAL PTY LTD</span><br>
                    <span style="color: #6AA84F;">Móvil: (+51) 932 238 296</span><br>
                    <span style="color: #6AA84F;">Dirección: 68 Circular Road, #02-01, Singapur</span><br>
                    <span style="color: #6AA84F;">Correo electrónico: <a href="mailto:mariesophia@vivaideal.com">mariesophia@vivaideal.com</a></span><br>
                    <span style="color: #6AA84F;">Sitio web: <a href="https://www.vivaideal.com" target="_blank">www.vivaideal.com</a></span><br>
                    """
    },
    "adriana": {
        'name': "Adriana",
        'email': "adriana@vivaideal.com",
        "title": "Coordinadora de Desarrollo Empresarial",
        "signature": """
                    <br><br>Saludos cordiales,<br>
                    Adriana Maticorena  (Coordinadora de desarrollo empresarial)<br><br>
                    <span style="color: #6AA84F;">VIVA IDEAL PTY LTD</span><br>
                    <span style="color: #6AA84F;">Móvil: (+51) 959 115 127</span><br>
                    <span style="color: #6AA84F;">Dirección: 68 Circular Road, #02-01, Singapur</span><br>
                    <span style="color: #6AA84F;">Correo electrónico: <a href="mailto:adriana@vivaideal.com">adriana@vivaideal.com</a></span><br>
                    <span style="color: #6AA84F;">Sitio web: <a href="https://www.vivaideal.com" target="_blank">www.vivaideal.com</a></span><br>
                    """
    },
    "mitchell": {
        'name': "Mitchell",
        'email': "mitchell@vivaideal.com",
        "title": "Director de Negocios",
        "signature":"""
                    <br><br>Saludos cordiales,<br>
                    Mitchell Spencer (Fundador)<br><br>
                    <span style="color: #6AA84F;">VIVA IDEAL PTY LTD</span><br>
                    <span style="color: #6AA84F;">Móvil: (+51) 958 751 401</span><br>
                    <span style="color: #6AA84F;">Dirección: 68 Circular Road, #02-01, Singapur</span><br>
                    <span style="color: #6AA84F;">Correo electrónico: <a href="mailto:mitchell@vivaideal.com">mitchell@vivaideal.com</a></span><br>
                    <span style="color: #6AA84F;">Sitio web: <a href="https://www.vivaideal.com" target="_blank">www.vivaideal.com</a></span><br>
                    """
    },
}

def authenticate_gmail(user_email):
    """Authenticate as a service account and impersonate a user."""
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    delegated_credentials = credentials.with_subject(user_email)
    return build('gmail', 'v1', credentials=delegated_credentials)

def create_email(sender_name, sender_email, sender_signature, recipient, subject, body, hubspot_bcc, attachment_path=None):
    """Create an email with tracking."""
    sender_with_name = f"{sender_name} de Viva Ideal <{sender_email}>"
    message = MIMEMultipart()
    message['to'] = recipient
    message['from'] = sender_with_name
    message['subject'] = subject
    message['bcc'] = hubspot_bcc  # Add HubSpot BCC address

    body_with_signature = body.format(name=recipient, signature=sender_signature)
    # HTML body with HubSpot tracking pixel
    html_body = f"""
    <html>
        <body>
            {body_with_signature}
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

def send_email(service, message, max_retries=3, retry_delay=5):
    """Send an email."""
    retries = 0
    while retries < max_retries:
        try:
            sent_message = service.users().messages().send(userId='me', body=message).execute()
            print("Email sent successfully.")
            return sent_message
        except Exception as e:
            retries += 1
            print(f"Attempt {retries} failed: {e}")
            if retries < max_retries:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print("All retry attempts failed.")
                return None

def bulk_send_emails(sender_key):
    sender_info = SENDER_INFO.get(sender_key)
    if not sender_info:
        print(f"Invalid sender key: {sender_key}")
        return

    sender_name = sender_info['name']
    sender_title = sender_info['title']
    sender_signature = sender_info['signature'] 
    sender_email = sender_info['email']
    subject_template = """Hola {name}, ¡Únete a nuestra comunidad y lleva tus propiedades al mundo!"""
    body_template = """
    Saludos Cordiales {name},<br><br>
    Mi nombre es {sender_name} y soy {sender_title} en Viva Ideal, una startup dedicada a conectar propiedades en todo el mundo. Nuestro objetivo es ayudarte a ampliar las fronteras de tu negocio, haciendo que tus propiedades lleguen a una audiencia global de manera efectiva y accesible.<br><br>
    Imagina esto: si alguien en Canadá sueña con vivir en Colombia y disfrutar de las mejores playas del mundo, nosotros hacemos posible que ese sueño se convierta en realidad, y queremos que tú formes parte de esta misión. Pero lo más importante, que nos dejes formar parte de tu futuro.<br><br>
    Te invitamos a unirte a nuestra comunidad exclusiva, donde podrás:
    <ul>
        <li>Promocionar tus propiedades a nivel internacional en +15 idiomas.</li>
        <li>Acceder a herramientas innovadoras para alcanzar nuevos mercados.</li>
        <li>Beneficiarte de +25 tipos de cambio para facilitar las transacciones.</li>
    </ul>    
    Además, como parte de nuestra oferta de fin de año, los próximos 5 días ofreceremos a las primeras 7 personas que se suscriban a cualquiera de nuestros planes, la posibilidad de grabar contenido profesional para sus propiedades (aplican condiciones).<br><br>
    Te adjuntamos un brochure con más información sobre nuestros servicios y beneficios. Si deseas coordinar una reunión virtual para conocer más detalles, estaremos encantados de conversar contigo. Escríbenos al correo ({sender_email}) y comencemos a trabajar juntos.<br><br>
    Cordialmente,
    {sender_signature}
    """
    hubspot_bcc = "47448944@bcc.hubspot.com"  # Replace with your actual HubSpot BCC address
    attachment_path="viva-ideal.pdf"

    # Authenticate as the service account and impersonate the sender
    service = authenticate_gmail(sender_email)

    # Create and send the email
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            for row_number, row in enumerate(csv_reader, start=1):  # Start numbering from 1
                if sender_key != row["ENCARGADA"]: 
                    print(f"Skipping row {row_number}: {sender_key} does not match {row['ENCARGADA']}")
                    continue
                name = row['NOMBRE']  # Extract the name
                recipient_email = row['CORREO']
                
                # Personalize the email body
                body = body_template.format(name=name, sender_name=sender_name, sender_title=sender_title, sender_signature=sender_signature, sender_email=sender_email)
                subject = subject_template.format(name=name)
                # Create and send the email
                print(f"Processing row {row_number}: Sending email to {recipient_email} ({name})...")
                email = create_email(sender_name, sender_email, sender_signature, recipient_email, subject, body, hubspot_bcc, attachment_path)
                send_email(service, email)

    except FileNotFoundError:
        print(f"CSV file not found: {CSV_FILE}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Send bulk emails from CSV.")
    parser.add_argument('sender_key', type=str, help="The key to identify the sender (e.g., 'majo')")
    args = parser.parse_args()

    bulk_send_emails(args.sender_key)
