import "./App.css";
import Interview from "./components/Interview";
import { useState } from "react";
import Button from "@mui/material/Button";
import InputFileUpload from "./components/InputFileUpload";

function App() {
  const [start, setStart] = useState(false);

  return (
    <>
      {!start ? (
        <div className="start">
          <InputFileUpload />
          <Button
            variant="contained"
            style={{
              fontSize: "1.3rem"
            }}
            onClick={() => setStart(true)}
          >
            Start interview
          </Button>
        </div>
      ) : (
        <Interview />
      )}
    </>
  );
}

export default App;
