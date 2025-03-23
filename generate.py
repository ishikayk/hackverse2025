import google.generativeai as genai
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import os
import sys
import json
from dotenv import load_dotenv

load_dotenv('.env.local')

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

# Google Calendar API scopes
SCOPES = ["https://www.googleapis.com/auth/calendar"]

def authenticate_google_calendar():
    """
    Authenticate and authorize access to Google Calendar.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            try:
                flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
                creds = flow.run_local_server(port=0)
            except FileNotFoundError:
                print("Error: 'credentials.json' file not found.")
                print("Please download the file from Google Cloud Console and place it in the same directory as this script.")
                exit(1)
            except Exception as e:
                print(f"Error: {e}")
                print("Make sure you have added your email as a test user in the Google Cloud Console.")
                exit(1)
        # Save the credentials for future use.
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    return creds

def generate_roadmap(topic, timeCommitment, studyDays):
    """
    Generate a learning roadmap using the Gemini API.
    """
    # Configure the API
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Calculate hours per day
    hours_per_day = int(timeCommitment) // int(studyDays)
    
    # Create a prompt for the API
    prompt = f"""
    Create a comprehensive and structured learning roadmap for mastering {topic}. The user can dedicate {hours_per_day} hours per day, {studyDays} days per week to learning. The roadmap should be engaging, practical, and easy to follow—designed in a way that avoids overwhelming the learner while ensuring they cover everything necessary to gain true proficiency.

    **Constraints:**
    - The course must last between 6 to 8 weeks.
    - The total study hours must be between {int(timeCommitment) * 6} and {int(timeCommitment) * 8} hours.
    - **Do not** deviate from the format below
    - Make sure it is exactly like the format
    - Do not give Examples
        **Output Format:**
        - Each topic should have a title and a list of resources.
        - Resources should include a title, type (e.g., Video, Written, Exercises, Project), and duration.
        - Example:
        Title: <Topic Title>
            Resources:
                <Resource Title> (Type: <Resource Type>, Duration: <Duration>)
                <Resource Title> (Type: <Resource Type>, Duration: <Duration>)
    """
    
    try:
        # Use the gemini-1.5-pro-latest model
        model = genai.GenerativeModel('models/gemini-1.5-flash')
        response = model.generate_content(prompt)
    except Exception as e:
        # Handle errors
        return f"Error: Unable to generate roadmap. {e}"
    
    # Extract the generated roadmap
    roadmap = response.text.strip()
    return roadmap

def parse_roadmap(roadmap):
    """
    Parse the roadmap into structured data.
    """
    topics = []
    current_topic = None

    for line in roadmap.split("\n"):
        line = line.strip()

        if line.startswith("Title:"):
            if current_topic:
                topics.append(current_topic)
            current_topic = {
                "id": len(topics) + 1,
                "title": line.replace("Title:", "").strip(),
                "resources": [],
            }
        # Detect resources (lines starting with a resource title and indented)
        elif line and not line.startswith("**") and current_topic:
            # Extract resource details
            if "(" in line and ")" in line:
                resource = line.split("(")[0].strip()
                type_duration = line.split("(")[1].rstrip(")").strip()
                type_duration_parts = type_duration.split(", Duration:")
                if len(type_duration_parts) == 2:
                    resource_type = type_duration_parts[0].replace("Type:", "").strip()
                    duration = type_duration_parts[1].strip()
                    current_topic["resources"].append({
                        "id": f"r{len(current_topic['resources']) + 1}",
                        "title": resource,
                        "type": resource_type,
                        "duration": duration,
                    })
    
    if current_topic:
        topics.append(current_topic)
    
    return topics

def create_calendar_events(phases, timeCommitment, studyDays, studyTime):
    """
    Create Google Calendar events based on the roadmap and user's preferred study time.
    """
    try:
        # Authenticate Google Calendar
        creds = authenticate_google_calendar()
        service = build("calendar", "v3", credentials=creds)
        
        # Parse the roadmap and create events
        current_date = datetime.now().replace(hour=int(studyTime.split(":")[0]), minute=int(studyTime.split(":")[1]), second=0, microsecond=0)  # Start at user's preferred time
        event_count = 0
        
        for phase in phases:
            for resource in phase["resources"]:
                # Create event
                event = {
                    "summary": f"Study: {resource['title']}",
                    "description": f"Phase: {phase['title']}\nResource: {resource['title']}",
                    "start": {
                        "dateTime": current_date.isoformat(),
                        "timeZone": "UTC",
                    },
                    "end": {
                        "dateTime": (current_date + timedelta(hours=int(timeCommitment) // int(studyDays))).isoformat(),
                        "timeZone": "UTC",
                    },
                    "reminders": {
                        "useDefault": True,
                    },
                }
                
                # Add event to Google Calendar
                event = service.events().insert(calendarId="primary", body=event).execute()
                
                # Update current date
                current_date += timedelta(days=1)  # Move to the next day
                current_date = current_date.replace(hour=int(studyTime.split(":")[0]), minute=int(studyTime.split(":")[1]))  # Reset to user's preferred time
                event_count += 1
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure the Google Calendar API is enabled in your Google Cloud project.")
        print("Enable it by visiting: https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=651618431959")
def main():
    """
    Main function to run the script.
    """
    # Read input from command line arguments
    if len(sys.argv) < 2:
        print("Error: No input data provided.")
        exit(1)
    
    # Parse input data
    try:
        input_data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input. {e}")
        print("Example of valid input: '{\"topic\": \"Python Programming\", \"timeCommitment\": \"20\", \"studyDays\": \"5\", \"studyTime\": \"10:00\"}'")
        exit(1)
    
    # Extract required fields
    topic = input_data.get("topic")
    timeCommitment = input_data.get("timeCommitment")
    studyDays = input_data.get("studyDays")
    studyTime = input_data.get("studyTime")
    
    # Validate required fields
    if not all([topic, timeCommitment, studyDays, studyTime]):
        print("Error: Missing required fields in input data.")
        print("Required fields: topic, timeCommitment, studyDays, studyTime")
        exit(1)
    
    # Step 1: Generate the roadmap
    roadmap = generate_roadmap(topic, timeCommitment, studyDays)
    
    # Step 2: Parse the roadmap into structured data
    phases = parse_roadmap(roadmap)
    
    # Step 3: Create Google Calendar events
    create_calendar_events(phases, timeCommitment, studyDays, studyTime)
    
    # Return the structured roadmap as JSON
    print(json.dumps(phases, indent=4))

if __name__ == "__main__":
    main()