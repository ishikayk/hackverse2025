import sys
import json
from fuzzywuzzy import fuzz

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

def check_answers(expected, user):
    """
    Evaluate the user's answers and provide feedback.
    Args:
        - expected: List of objects with `id` and `answer`.
        - user: List of objects with `id` and `answer`.
    Returns:
        - score: The user's final score out of 100.
    """
    score = 0
    feedback = []
    
    # Convert lists to dictionaries for easier lookup
    expected_dict = {item["id"]: item["answer"] for item in expected}
    user_dict = {item["id"]: item["answer"] for item in user}
    
    for q_id, correct_answer in expected_dict.items():
        user_answer = user_dict.get(q_id, "")  # Get the user's answer for this question ID
        answer_score = evaluate_answer(user_answer, correct_answer)
        score += answer_score
        
        # Provide feedback
        if answer_score == 1.0:
            feedback.append(f"Question {q_id}: Correct!")
        elif answer_score > 0:
            feedback.append(f"Question {q_id}: Partially correct. You scored {answer_score * 100:.0f}%. The correct answer is: {correct_answer}")
        else:
            feedback.append(f"Question {q_id}: Incorrect. The correct answer is: {correct_answer}")
    
    # Calculate the final score out of 100
    total_questions = len(expected_dict)
    final_score = (score / total_questions) * 100
    
    return {
        "score": final_score
    }

if __name__ == "__main__":
    # Read expected and user answers from command line arguments
    expected = json.loads(sys.argv[1])
    user = json.loads(sys.argv[2])
    
    # Check answers
    result = check_answers(expected, user)
    
    # Output the result as JSON
    print(json.dumps(result))