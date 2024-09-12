from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from gtts import gTTS



# from utils import get_text
import google.generativeai as genai

genai.configure(api_key="AIzaSyBTTtStGblJ0t6hgUlwOiqex1lSCEWB4dQ")
model = genai.GenerativeModel(model_name="gemini-1.5-flash")
resume_file = genai.upload_file("RESUME_JAY.pdf")
resume_text = model.generate_content(["Write a very detailed description of this resume.", resume_file])

start_question = model.generate_content(f"""Act as an Interviewer to hire a guy for a software engineer role.
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
question should have less than 240 characters
"""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.post('/upload')
# async def create_file(request: Request):
#     form = await request.form()
#     with open('audio.wav', 'wb') as f:
#         f.write(await form['wavfile'].read())
#     res = get_text()
#     return {'text': res}

@app.post('/get-response')
async def get_response(request: Request):
    text = await request.json()    
    return text

@app.post("/get-question")
async def get_question(request: Request):
    conversation = await request.json()
    if conversation['conversation'] == "":
        question = start_question
    else:
        question = model.generate_content(base_prompt + conversation['conversation'])
    isitovernow = model.generate_content(f"""Here's an interview conversation. Your task is to indentify whether it's over.
                                         if the interview has ended say "Yes", else "No". 
                                         Remember, your response should be either of those two words.
                                         
                                         {conversation}
                                         Interviewer: {question}""")
    # tts = gTTS(question.text, lang='en', tld="co.in")


    # tts.save("output.mp3")
    return {'question': question.text, 'ended': isitovernow.text.lower().strip() == "yes"}



MP3_FILE_PATH = "output.mp3"

@app.get("/stream-mp3")
async def stream_mp3():
    def iterfile():
        with open(MP3_FILE_PATH, mode="rb") as file:
            yield from file

    return StreamingResponse(iterfile(), media_type="audio/mpeg")