import React, { useEffect, useState } from "react";
import "./Screen.css";
import cameraImg from "../assets/icons/camera.png";
import micImg from "../assets/icons/mic.png";
import phoneImg from "../assets/icons/phone.png";

const constraints = {
  video: {
    width: {
      min: 730,
      ideal: 1920,
      max: 1920,
    },
    width: {
      min: 480,
      ideal: 1000,
      max: 1000,
    },
    audio: false,
  },
};

export default function Screen({ startListening, stopListening }) {
  const [localStream, setLocalStream] = useState(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const camerInput = async () => {
      const ls = await navigator.mediaDevices.getUserMedia(constraints);
      document.getElementById("user-2").srcObject = ls;
      setLocalStream(ls);
    };
    if (!localStream) {
      camerInput();
    }
  });

  const toggleCam = async () => {
    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById("user-2").style.display = "none";
      document.getElementById("camera-btn").style.backgroundColor = "#f52d59";
    } else {
      videoTrack.enabled = true;
      document.getElementById("user-2").style.display = "block";
      document.getElementById("camera-btn").style.backgroundColor = "#b366f9e6";
    }
  };

  const toggleMic = () => {
    if (listening) {
      document.getElementById("mic-btn").style.backgroundColor = '#f52d59';
      stopListening();
    } else {
      document.getElementById("mic-btn").style.backgroundColor = '#b366f9e6';      
      startListening();
    }
    setListening((prev) => !prev);
  };

  return (
    <>
      <div id="videos">
        {/* <video
          src=""
          id="user-1"
          className="video-player"
          autoPlay
          playsInline
        ></video> */}

        <video
          src=""
          id="user-2"
          className="video-player smallFrame"
          autoPlay
          playsInline
        ></video>
      </div>

      <div id="controls">
        <div className="control-container" id="camera-btn" onClick={toggleCam}>
          <img src={cameraImg} alt="" />
        </div>
        <div
          className={`mic control-container ${listening ? "listening" : ""}`}
          id="mic-btn"
          onClick={toggleMic}
        >
          <img src={micImg} alt="" />
        </div>
        <a href="">
          <div className="control-container" id="leave-btn">
            <img src={phoneImg} alt="" />
          </div>
        </a>
      </div>
    </>
  );
}
