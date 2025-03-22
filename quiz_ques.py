import google.generativeai as genai
import re
import json
import sys
import os
from dotenv import load_dotenv

load_dotenv('.env.local')

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
def parse_quiz_response(response):
    """
    Parse the AI's response to extract quiz questions and answers.
    """
    quiz = []
    lines = response.split("\n")
    
    for line in lines:
        # Match short-answer questions
        sa_match = re.match(r"^\d+\.\s*(.+)\s*:\s*(.+)$", line)
        if sa_match:
            question = sa_match.group(1).strip()
            answer = sa_match.group(2).strip()
            quiz.append({
                "question": question,
                "answer": answer
            })
    
    return quiz

def generate_quiz(roadmap):
    """
    Generate a quiz using the Gemini API.
    Args:
        roadmap (list): List of topics with resources.
    Returns:
        - questions: List of questions.
        - answers: List of expected answers.
    """
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Extract relevant information from the roadmap
    roadmap_summary = []
    for topic in roadmap:
        topic_info = {
            "title": topic["title"],
            "resources": [resource["title"] for resource in topic["resources"]]
        }
        roadmap_summary.append(topic_info)
    
    # Convert roadmap summary to a string for the prompt
    roadmap_str = json.dumps(roadmap_summary, indent=2)
    
    prompt = f"""
    Create a quiz based on the following roadmap:
    
    {roadmap_str}
    
    **Quiz Requirements:**
    - The quiz should have 5 questions.
    - All questions should be short-answer questions.
    - For each question, provide the correct answer.
    
    **Output Format:**
    Return the quiz as a numbered list of questions, where:
    - Short-answer questions are formatted as: "1. What is 2 + 2? : 4"
    """
    
    try:
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content(prompt)
        
        # Parse the response to extract questions and answers
        quiz = parse_quiz_response(response.text.strip())
        
        # Separate questions and answers into lists
        questions = [q["question"] for q in quiz]
        answers = [q["answer"] for q in quiz]
        
        return { "questions": questions, "answers": answers }
    except Exception as e:
        return { "error": f"Unable to generate quiz. {e}" }

if __name__ == "__main__":
    # Read the roadmap from the command line
    roadmap = json.loads(sys.argv[1])
    
    # Generate the quiz
    result = generate_quiz(roadmap)
    
    # Output the result as JSON
    print(json.dumps(result))