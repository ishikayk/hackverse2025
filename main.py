# main.py

import google.generativeai as genai
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta
import os.path
from chatbot import Chatbot

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

def get_user_input():
    """
    Collect user input for skill, availability, and preferred study time.
    """
    skill = input("Enter the skill you want to learn (e.g., Python, Web Development): ")
    hours_per_day = input("How many hours can you study per day? (e.g., 2): ")
    days_per_week = input("How many days can you study per week? (e.g., 5): ")
    study_time = input("What time do you prefer to study? (e.g., 18:00 for 6:00 PM): ")
    
    return skill, hours_per_day, days_per_week, study_time

def generate_roadmap(skill, hours_per_day, days_per_week):
    """
    Generate a learning roadmap using the Gemini API.
    Ensure that topics under "Topics & Concepts" and "Practical Application" start with '-'.
    """
    # Configure the API
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Create a prompt for the API
    prompt = f"""
    Create a comprehensive and structured learning roadmap for mastering {skill}. The user can dedicate {hours_per_day} hours per day, {days_per_week} days per week to learning. The roadmap should be engaging, practical, and easy to follow—designed in a way that avoids overwhelming the learner while ensuring they cover everything necessary to gain true proficiency.
    
    **Constraints:**
    - The course must last between 6 to 8 weeks.
    - The total study hours must be between {int(hours_per_day) * int(days_per_week) * 6} and {int(hours_per_day) * int(days_per_week) * 8} hours.
    - Under "Topics & Concepts" and "Practical Application," list each topic or task with a '-' at the beginning (e.g., "- Variables, data types").
    
    If valid, the roadmap should include:
    - **Phases of Learning:** Break the journey into progressive phases (e.g., Foundation, Hands-on Practice, Mastery). Explain what the learner should focus on at each phase.
    - **Topics & Concepts:** Cover every key aspect of {skill} in a logical sequence, ensuring no critical topics are skipped while keeping the structure easy to digest. Each topic must start with '-'.
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

def create_calendar_events(roadmap, hours_per_day, days_per_week, study_time):
    """
    Create Google Calendar events based on the roadmap and user's preferred study time.
    Ensure events are scheduled only at the user's preferred time each day.
    """
    try:
        # Authenticate Google Calendar
        creds = authenticate_google_calendar()
        service = build("calendar", "v3", credentials=creds)
        
        # Parse the roadmap and create events
        lines = roadmap.split("\n")
        current_date = datetime.now().replace(hour=int(study_time.split(":")[0]), minute=int(study_time.split(":")[1]), second=0, microsecond=0)  # Start at user's preferred time
        event_count = 0
        
        for line in lines:
            # Look for lines starting with -
            if line.strip().startswith("-"):
                # Extract topic and time allocation
                topic = line.strip().lstrip("- ").strip()
                
                # Create event
                event = {
                    "summary": f"Study: {topic}",
                    "description": f"Topic: {topic}\nRoadmap: {roadmap}",
                    "start": {
                        "dateTime": current_date.isoformat(),
                        "timeZone": "UTC",
                    },
                    "end": {
                        "dateTime": (current_date + timedelta(hours=int(hours_per_day))).isoformat(),
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
                current_date = current_date.replace(hour=int(study_time.split(":")[0]), minute=int(study_time.split(":")[1]))  # Reset to user's preferred time
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
    # Step 1: Get user input
    skill, hours_per_day, days_per_week, study_time = get_user_input()
    
    # Step 2: Generate the roadmap
    print("\nGenerating your personalized learning roadmap...\n")
    roadmap = generate_roadmap(skill, hours_per_day, days_per_week)
    
    # Step 3: Display the roadmap
    print("=== Your Personalized Learning Roadmap ===")
    print(roadmap)
    
    # Step 4: Create Google Calendar events
    print("\nCreating Google Calendar events...\n")
    create_calendar_events(roadmap, hours_per_day, days_per_week, study_time)
    
    # Step 5: Chatbot interaction
    bot = Chatbot(GEMINI_API_KEY)
    print("\nWelcome to the Course Chatbot! Ask me anything about your course.")
    while True:
        question = input("\nYou: ")
        if question.lower() in ["exit", "quit", "bye"]:
            print("Chatbot: Goodbye! Have a great day.")
            break
        
        response = bot.respond(question, roadmap)
        print(f"Chatbot: {response}")

if __name__ == "__main__":
    main()