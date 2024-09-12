import "./App.css";
import Recorder from "./components/Recorder";
import VoiceToText from "./components/Interview";
import TextToVoice from "./components/TextToVoice";
import Speech from "react-speech";
import Interview from "./components/Interview";
import { useState } from "react";
import Chat from "./components/Chat";
// import TypeWriter from "./components/TypeWriter"


function App() {
  const [start, setStart] = useState(false);

  return (
    <>
      {!start ? (
        <button onClick={() => setStart(true)}>start interview</button>
      ) : (
        <Interview />
      )}
    {/* <TypeWriter text={"Hello there lorem I have altered my voice That's awesome, Jayanth! It's always great to see someone who's willing to dive into new technologies.  So, tell me, what was the most challenging part of learning that new language or technology"}/> */}
      {/* <Recorder /> */}
      {/* <TextToVoice /> */}
      {/* <TextToVoice
        text="I have altered my voice That's awesome, Jayanth! It's always great to see someone who's willing to dive into new technologies.  So, tell me, what was the most challenging part of learning that new language or technology"
      /> */}
      {/* <Chat /> */}
    </>
  );
}

export default App;
