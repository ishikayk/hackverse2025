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

GEMINI_API_KEY = os.getenv('VITE_API_KEY')
print(GEMINI_API_KEY)

# Replace with your actual API key for Gemini
GEMINI_API_KEY = "AIzaSyBrCCGmiDmZ3I1mAEynCDsto1-ILDxqjHo"

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
    # If there are no valid credentials, prompt the user to log in.
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
    - Under "Topics & Concepts" and "Practical Application," list each topic or task with a '-' at the beginning (e.g., "- Variables, data types").
    
    If valid, the roadmap should include:
    - **Phases of Learning:** Break the journey into progressive phases (e.g., Foundation, Hands-on Practice, Mastery). Explain what the learner should focus on at each phase.
    - **Topics & Concepts:** Cover every key aspect of {topic} in a logical sequence, ensuring no critical topics are skipped while keeping the structure easy to digest. Each topic must start with '-'.
    - **Practical Application:** Suggest exercises, projects, or real-world applications at each stage to reinforce learning. Each task must start with '-'.
    - **Learning Methodology:** Describe the best way to approach learning each section—whether it’s through visualization, problem-solving, hands-on work, or real-world examples.
    - **Review & Mastery:** Include checkpoints or mini-assessments to test knowledge and refine skills before moving forward. Offer revision strategies to ensure retention.
    - **Resources & Guidance:** Recommend types of resources (books, online courses, tools, or communities) that would be helpful at different stages.
    
    The final roadmap should feel structured yet flexible, keeping the learner motivated and making the process feel achievable. Avoid overwhelming the learner with excessive details while ensuring depth where necessary. Present the roadmap in a step-by-step format that feels natural and engaging.
    """
    
    try:
        # Use the gemini-1.5-pro-latest model
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
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
    phases = []
    current_phase = None

    for line in roadmap.split("\n"):
        # Detect phase titles
        if line.strip().endswith(":"):
            if current_phase:
                phases.append(current_phase)
            current_phase = {
                "id": len(phases) + 1,
                "title": line.strip().rstrip(":"),
                "resources": [],
            }
        # Detect resources (lines starting with '-')
        elif line.strip().startswith("-"):
            resource = line.strip().lstrip("- ").strip()
            resource_type = "Written"  # Default type
            duration = "30 min"  # Default duration
            if "video" in resource.lower():
                resource_type = "Video"
            elif "exercise" in resource.lower():
                resource_type = "Exercises"
            elif "project" in resource.lower():
                resource_type = "Project"
            current_phase["resources"].append({
                "id": f"r{len(current_phase['resources']) + 1}",
                "title": resource,
                "type": resource_type,
                "duration": duration,
            })
    
    if current_phase:
        phases.append(current_phase)
    
    return phases

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
                print(f"Event created: {event.get('htmlLink')}")
                
                # Update current date
                current_date += timedelta(days=1)  # Move to the next day
                current_date = current_date.replace(hour=int(studyTime.split(":")[0]), minute=int(studyTime.split(":")[1]))  # Reset to user's preferred time
                event_count += 1
        
        print(f"\nTotal {event_count} events created in Google Calendar.")
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
    input_data = json.loads(sys.argv[1])
    topic = input_data.get("topic")
    timeCommitment = input_data.get("timeCommitment")
    studyDays = input_data.get("studyDays")
    studyTime = input_data.get("studyTime")
    
    # Step 1: Generate the roadmap
    roadmap = generate_roadmap(topic, timeCommitment, studyDays)
    
    # Step 2: Parse the roadmap into structured data
    phases = parse_roadmap(roadmap)
    
    # Step 3: Create Google Calendar events
    create_calendar_events(phases, timeCommitment, studyDays, studyTime)
    
    # Return the structured roadmap as JSON
    print(json.dumps(phases))

if __name__ == "__main__":
    main()