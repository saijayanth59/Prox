from gtts import gTTS

# Create a gTTS object
tts = gTTS("Okay, that's great! So, you developed your skills in college.  Tell me, what kind of projects did you work on that really put those skills to the test?  What was the most challenging project you worked on, and what did you learn from it? ", lang='en')

# Save the audio file
tts.save("output.mp3")