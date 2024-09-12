import speech_recognition as sr

recognizer = sr.Recognizer()

def get_text():
    with sr.AudioFile("audio.wav") as source:
        audio = recognizer.record(source)
        res = recognizer.recognize_google(audio, language="english")
    return res