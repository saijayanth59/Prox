import google.generativeai as genai

genai.configure(api_key="AIzaSyBTTtStGblJ0t6hgUlwOiqex1lSCEWB4dQ")
model = genai.GenerativeModel(model_name="gemini-1.5-flash")
resume_file = genai.upload_file("../../Downloads/skys_resume.pdf")
resume_text = model.generate_content(["Write a very detailed description of this resume.", resume_file])

question = model.generate_content(f"""Act as an Interviewer to hire a guy for a software engineer role.
                                  The interview has started. This is the guy's resume:
                                  
                                  {resume_text.text}
                                  
                                  Now, Ask him the very first question. Just the first question.
                                  Don't make the question too overwhelemed. Make it simple.""")

base_prompt = f"""
ZAHere's the conversation of an interview to hire software developer.
Your task is to act as the interviewer (an energetic person with a nice sense of humor)
The current conversation ended with the interviewee's answer now your task is to give him a follow-up question regarding his profile, and technical questions on his skills 
And don't stick on a topic for long time, just change the topic to the next step if you feel like you've gone too deep into that topic. But don't say explicitly that you're changing the topic
Remember, only ask him the question not even say that your are changing the topic also.
If the interview is already too long that is more than three one-to-one dialogues, don't ask a question, instead end the interview with a nice conclusion.
Remember when to end the Interview. It's very important
Also, If there are any inappropriate, irrelevent or vulgar answers from the interviewee, give him a warning and say goodbye to the interviewee or if you think the it's enough then stop the interview.
"""

conversation = ""

while True:
    try:
        print("\n\n" + question.text)
    except ValueError:
        print("\n\n\nMingey, Your are not born for this postiiton.")
        print(question)
        break
    answer = input("Your answer: ")
    conversation += f"""Interviewer: {question.text}
                    Interviewee: {answer}"""
    question = model.generate_content(base_prompt + conversation)
    isitovernow = model.generate_content(f"""Here's an interview conversation. Your task is to indentify whether it's over.
                                         if the interview has ended say "Yes", else "No". 
                                         Remember, your response should be either of those two words.
                                         
                                         {conversation}
                                         Interviewer: {question}""")
    # print("\n\n****" + isitovernow.text)
    if isitovernow.text.lower().strip() == 'yes':
        print("\n\n", question.text)
        print("\n\n\nThe interview has ended !")
        break