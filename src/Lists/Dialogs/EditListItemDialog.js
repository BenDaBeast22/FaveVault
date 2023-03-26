import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Alert,
  Typography,
  Rating,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { v4 as uuid } from "uuid";
import { storage } from "../../Config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CircularProgressLabel from "../../Components/CircularProgressLabel";

const EditListItemDialog = ({ title, card, user, open, submit, close, scoreType, displayStatus }) => {
  const [itemName, setItemName] = useState(card.name);
  const [score, setScore] = useState(card.score);
  const [status, setStatus] = useState(card.status);
  const [imageUrl, setImageUrl] = useState(card.img);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const uid = user.uid;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!itemName) {
      setError("List Item name not set");
    } else if (!imageUrl) {
      setError("Subcollection image name not set");
      return;
    }
    const newItem = {
      name: itemName,
      img: imageUrl,
      score: score,
    };
    await submit(newItem, card.scId, card.id);
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
            label="List Item Name"
            value={itemName}
            sx={{ mt: 2 }}
            onChange={(e) => setItemName(e.target.value)}
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
          {scoreType !== "none" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Score"
                type="Number"
                InputProps={{ inputProps: { min: 0, max: 10 } }}
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                sx={{ mt: 2, width: "50%" }}
              />
              <Box
                sx={{
                  mt: 2,
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Typography component="legend">Score Preview</Typography>
                <Rating name="score-preview" precision={0.5} value={Number(score) / 2} size="medium" readOnly />
              </Box>
            </Box>
          )}
          {displayStatus && (
            <Box sx={{ pt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>List Item Status</InputLabel>
                <Select label="Progress Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="progress">In Progress</MenuItem>
                  <MenuItem value="finished">Finished</MenuItem>
                  <MenuItem value="dropped">Dropped</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
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

export default EditListItemDialog;
