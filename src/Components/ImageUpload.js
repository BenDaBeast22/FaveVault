import React from "react";
import { Button } from "@mui/material";
import CircularProgressLabel from "./CircularProgressLabel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageUpload = ({
  handleUploadImage,
  handleImageChange,
  progress,
  imageUploadSuccess,
  imageUploadFail,
  disabled,
}) => {
  return (
    <Button variant="outlined" component="div" sx={{ display: "flex", justifyContent: "space-evenly" }}>
      <input
        disabled={disabled}
        type="file"
        name="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ padding: "5px" }}
      />
      <Button variant="contained" onClick={handleUploadImage} color="info" startIcon={<CloudUploadIcon />}>
        upload
      </Button>
      <CircularProgressLabel
        progress={progress}
        imageUploadSuccess={imageUploadSuccess}
        imageUploadFail={imageUploadFail}
      />
    </Button>
  );
};

export default ImageUpload;
