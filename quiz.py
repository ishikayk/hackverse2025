# quiz.py

import google.generativeai as genai
import re
from fuzzywuzzy import fuzz

# Replace with your actual API key for Gemini
GEMINI_API_KEY = "AIzaSyDzmNv7kfxd8JBS3jra5HfpxgOG8dnesQI"

def load_roadmap():
    """
    Load the roadmap from the file.
    """
    try:
        with open("roadmap.txt", "r") as file:
            return file.read()
    except FileNotFoundError:
        return "Error: Roadmap file not found. Please generate the roadmap first."

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
                "type": "text",
                "question": question,
                "answer": answer
            })
    
    return quiz

def generate_quiz(roadmap):
    """
    Generate a quiz using the Gemini API.
    """
    genai.configure(api_key=GEMINI_API_KEY)
    
    prompt = f"""
    Create a quiz based on the following roadmap:
    
    {roadmap}
    
    **Quiz Requirements:**
    - The quiz should have 30 questions.
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
        return quiz
    except Exception as e:
        return f"Error: Unable to generate quiz. {e}"

def take_quiz(quiz):
    """
    Allow the user to take the quiz.
    """
    print("\n=== Quiz ===")
    user_answers = []
    
    for i, question in enumerate(quiz):
        print(f"\nQuestion {i+1}: {question['question']}")
        user_answer = input("Your answer: ").strip()
        user_answers.append(user_answer)
    
    print("\nQuiz completed!")
    return user_answers


def evaluate_answer(user_answer, correct_answer):
    """
    Evaluate the user's answer using keyword-based evaluation and fuzzy matching.
    """
    # Convert answers to lowercase for case-insensitive comparison
    user_answer = user_answer.lower()
    correct_answer = correct_answer.lower()
    
    # Fuzzy matching for exact phrases
    similarity = fuzz.ratio(user_answer, correct_answer)
    if similarity >= 70:  # Adjusted threshold for leniency
        return 1.0  # Full credit
    
    # Keyword-based evaluation for multi-part answers
    correct_keywords = correct_answer.split()
    user_keywords = user_answer.split()
    
    # Count matches, including synonyms or closely related terms
    matches = 0
    for word in user_keywords:
        if word in correct_keywords:
            matches += 1
        else:
            # Check for synonyms or closely related terms
            for correct_word in correct_keywords:
                if fuzz.ratio(word, correct_word) >= 70:  # Lenient fuzzy match
                    matches += 1
                    break
    
    if matches == 0:
        return 0.0  # No credit
    return min(matches / len(correct_keywords), 1.0)  # Cap partial credit at 100%

def calculate_tokens_granted(final_score):
    """
    Calculate the tokens granted based on the final score.
    """
    if final_score == 100:
        return 10
    elif final_score >= 95:
        return 9
    elif final_score >= 90:
        return 8
    elif final_score >= 85:
        return 7
    elif final_score >= 80:
        return 6
    elif final_score >= 75:
        return 5
    else:
        return 0

def evaluate_quiz(quiz, user_answers):
    """
    Evaluate the user's answers and provide feedback.
    """
    score = 0
    feedback = []
    
    for i, question in enumerate(quiz):
        user_answer = user_answers[i]
        correct_answer = question["answer"]
        
        # Evaluate the answer
        answer_score = evaluate_answer(user_answer, correct_answer)
        score += answer_score
        
        # Provide feedback
        if answer_score == 1.0:
            feedback.append(f"Question {i+1}: Correct!")
        elif answer_score > 0:
            feedback.append(f"Question {i+1}: Partially correct. You scored {answer_score * 100:.0f}%. The correct answer is: {correct_answer}")
        else:
            feedback.append(f"Question {i+1}: Incorrect. The correct answer is: {correct_answer}")
    
    # Calculate the final score out of 100
    total_questions = len(quiz)
    final_score = (score / total_questions) * 100
    
    # Calculate tokens granted
    tokens_granted = calculate_tokens_granted(final_score)
    
    # Display results
    print("\n=== Quiz Results ===")
    print(f"Your score: {final_score:.2f}/100")
    print(f"Tokens granted: {tokens_granted}")
    for fb in feedback:
        print(fb)
    
    return tokens_granted

def main():
    """
    Main function to run the quiz.
    """
    # Step 1: Load the roadmap
    roadmap = load_roadmap()
    if roadmap.startswith("Error"):
        print(roadmap)
        return
    
    # Step 2: Generate the quiz
    print("\nGenerating quiz...\n")
    quiz = generate_quiz(roadmap)
    if isinstance(quiz, str):  # If an error occurred
        print(quiz)
        return
    
    # Step 3: Take the quiz
    user_answers = take_quiz(quiz)
    
    # Step 4: Evaluate the quiz
    tokens_granted = evaluate_quiz(quiz, user_answers)
    
    # Step 5: Use tokens_granted as needed
    print(f"\nYou have earned {tokens_granted} tokens!")

if __name__ == "__main__":
    main()
