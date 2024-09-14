import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFileUpload() {


  const handleSubmit = async (selectedFiles) => {
    if (!selectedFiles.length) {
      console.warn("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFiles[0]);

    try {
      const response = await fetch("http://localhost:8000/upload_resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading file(s)");
      }

      console.log("File(s) uploaded successfully:", await response.json());
    } catch (error) {
      console.error("Failed to upload file(s):", error);
    } finally {

    }
  };
  const handleFileChange = (event) => {
    const files = event.target.files;
    handleSubmit(files);
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload resume
      <VisuallyHiddenInput type="file" onChange={handleFileChange} single />
    </Button>
  );
}
