import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import axios from "axios";
import { useVoiceToText } from "react-speakup";
import TextToVoice from "./TextToVoice";
import Screen from "./Screen";

const Interview = () => {
  const { startListening, stopListening, transcript, reset } = useVoiceToText({
    continuous: true,
    lang: "en-US",
  });

  const [qcount, setQcount] = useState(0);

  const [url, setUrl] = useState("");

  const [conversation, setConversation] = useState("");
  const [question, setQuestion] = useState("");
  const audioRef = useRef();

  const updateAudio = (source) => {
    setUrl(source);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const fetchQ = async () => {
      const res = await axios.post("http://localhost:8000/get-question", {
        conversation,
      });
      setConversation((prev) => {
        return prev + "interviewer: " + res.data.question;
      });
      // handleSpeak(res.data.question);
      // updateAudio("http://localhost:8000/stream-mp3");
      setQuestion(res.data.question);
    };
    setTimeout(() => fetchQ(), 2000);
  }, []);

  function handleStopAndSpeak() {
    // console.log(transcript);
  
    const fetchData = async () => {
      const res = await axios.post("http://localhost:8000/get-question", {
        conversation: `${conversation} Interviewee: ${transcript}`,
      });
      setConversation((prev) => {
        return (
          prev +
          "Interviewee: " +
          transcript +
          "\nInterviewer: " +
          res.data.question
        );
      });
      if (qcount < 2) {
        setQuestion(res.data.question);
      }
      else {
        setQuestion(await axios.post("http://localhost:8000/get-score", {
          conversation: `${conversation}`
        }))}
      setQcount(prev => prev + 1);
      // handleSpeak(res.data.question)
      // updateAudio("http://localhost:8000/stream-mp3");
      reset();
    };
    stopListening();  
    if(transcript){
      fetchData();
    }
  }
  console.log(conversation);

  return (
    <div>
      {/* <audio controls ref={audioRef}>
        <source src={url} type="audio/mpeg" />
      </audio> */}
      <TextToVoice text={question} />
      <Screen
        startListening={startListening}
        stopListening={handleStopAndSpeak}
      />
      {/* <div className="bro">
        <div className="circle"></div>
        <p>{transcript}</p>
        <TypeWriter text={transcript}/>
      </div> */}
      <div className="interviewer">
        <h1>{question}</h1>{" "}
        {/* <ReactTypingEffect text={[question]} /> */}
        {/* <TypeWriter content={question}/> */}
        {/* <div className="circle"></div> */}
      </div>
    </div>
  );
};

export default Interview;
