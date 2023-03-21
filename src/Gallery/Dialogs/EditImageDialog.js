import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Alert } from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { v4 as uuid } from "uuid";
import { storage } from "../../Config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CircularProgressLabel from "../../Components/CircularProgressLabel";

const EditImageDialog = ({ title, card, user, open, submit, close }) => {
  const [imageName, setImageName] = useState(card.name);
  const [imageUrl, setImageUrl] = useState(card.img);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const uid = user.uid;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageName) {
      setError("Image name not set");
    } else if (!imageUrl) {
      setError("Subcollection image name not set");
      return;
    }
    const newImage = {
      name: imageName,
      img: imageUrl,
    };
    await submit(newImage, card.scId, card.id);
    handleClose();
  };
  const handleClose = () => {
    setImageUploadSuccess(false);
    setImageUploadFail(false);
    setError(false);
    setProgress(0);
    close();
  };
  const handleImageChange = (e) => {
    setProgress(0);
    setImageUploadSuccess(false);
    setImageUploadFail(false);
    setImageUpload(e.target.files[0]);
  };
  // Upload image to cloud storage
  const handleUploadImage = () => {
    if (imageUpload) {
      const imageRef = ref(storage, `${uid}/images/${imageUpload.name + uuid()}`);
      const uploadTask = uploadBytesResumable(imageRef, imageUpload);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log("Upload is" + progress + " % done");
        },
        (error) => {
          setImageUploadFail(true);
          setError("Image failed to upload");
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadSuccess(true);
            setImageUrl(downloadURL);
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <DialogContentText align="center">{title}</DialogContentText>
          <TextField
            label="Image Name"
            value={imageName}
            sx={{ mt: 2 }}
            onChange={(e) => setImageName(e.target.value)}
            autoFocus
          />
          <TextField
            disabled={imageUpload !== null}
            label="Image URL"
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            autoFocus
          />
          <DialogContentText align="center" sx={{ mb: 1 }}>
            Or
          </DialogContentText>
          <Button variant="outlined" component="div" sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <input
              disabled={imageUrl}
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
          {error && (
            <Alert variant="outlined" severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button startIcon={<PublishRoundedIcon />} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
            Submit
          </Button>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EditImageDialog;
