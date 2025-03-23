import google.generativeai as genai
import sys
import json
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')


class Chatbot:
    def __init__(self, api_key):
        """
        Initialize the chatbot with the Gemini API key.
        """
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('models/gemini-1.5-flash')

    def respond(self, question, roadmap):
        """
        Generate a chatbot response based on the user's question and the roadmap.
        """
        prompt = f"""
        You are a helpful assistant that answers questions related to the following course roadmap:
        {roadmap}
        
        The user has asked: {question}
        
        If the question is related to the course, provide a clear and concise answer.
        If the question is unrelated to the course, respond with: "Sorry, I can only help with topics related to your course. Please ask a question about the course."
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error: Unable to generate response. {e}"

def main():
    """
    Main function to handle command-line arguments.
    """
    if len(sys.argv) != 3:
        print("Usage: python chatbot.py '<question>' '<roadmap_json>'")
        sys.exit(1)

    question = sys.argv[1]
    roadmap_json = sys.argv[2]

    try:
        roadmap = json.loads(roadmap_json)
    except json.JSONDecodeError:
        print("Error: Invalid JSON format for roadmap.")
        sys.exit(1)

    chatbot = Chatbot(api_key=GEMINI_API_KEY)

    response = chatbot.respond(question, roadmap)
    print(response)

if __name__ == '__main__':
    main()