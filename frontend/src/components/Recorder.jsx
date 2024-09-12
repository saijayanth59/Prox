import axios from "axios";

let gumStream = null;
let recorder = null;
let audioContext = null;

function Recorder() {
  const handleSpeak = (txt) => {
    console.log(txt);
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(txt);
    utterance.voice = synth
      .getVoices()
      .find(
        (voice) =>
          voice.lang === "en-GB" && voice.name === "Google UK English Male"
      );
    utterance.rate = 0.9; // Adjust speaking rate
    utterance.pitch = 1.0; // Adjust pitch
    utterance.volume = 1.0; // Adjust volume

    synth.speak(utterance);
  };
  const startRecording = () => {
    let constraints = {
      audio: true,
      video: false,
    };

    audioContext = new window.AudioContext();
    console.log("sample rate: " + audioContext.sampleRate);

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        console.log("initializing Recorder.js ...");

        gumStream = stream;

        let input = audioContext.createMediaStreamSource(stream);

        recorder = new window.Recorder(input, {
          numChannels: 1,
        });

        recorder.record();
        console.log("Recording started");
      })
      .catch(function (err) {
        console.log(err.message);
        //enable the record button if getUserMedia() fails
      });
  };

  const stopRecording = () => {
    console.log("stopButton clicked");

    recorder.stop(); //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    recorder.exportWAV(onStop);
  };

  const onStop = (blob) => {
    console.log("uploading...");

    let data = new FormData();
    data.append("wavfile", blob, "recording.wav");

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    console.dir(data.get("wavfile"));
    // const audio = new Audio();
    // audio.src = URL.createObjectURL(blob);
    // audio.play();
    const get_response = async (data, config) => {
      const res = await axios.post(
        "http://localhost:8000/upload",
        data,
        config
      );
      handleSpeak(res.data.text);
    };
    get_response(data, config);
  };

  return (
    <div>
      <button onClick={startRecording} type="button">
        Start
      </button>
      <button onClick={stopRecording} type="button">
        Stop
      </button>
    </div>
  );
}

export default Recorder;
