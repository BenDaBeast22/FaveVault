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
import {
  StarRating,
  HeartsRating,
  PercentRating,
  OutOfTenRating,
  OutOfHunderedRating,
} from "../../Components/ScoreTypes";

const AddListItemToSubcollectionDialog = ({ title, user, open, submit, close, scoreType, collectionName }) => {
  const [itemName, setItemName] = useState("");
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Planning");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const uid = user.uid;
  const statusPriorityVal = (status) => {
    let ret;
    switch (status) {
      case "Planning":
        ret = 1;
        break;
      case "In Progress":
        ret = 2;
        break;
      case "Finished":
        ret = 3;
        break;
      case "Dropped":
        ret = 4;
        break;
      default:
        ret = 1;
    }
    return ret;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!itemName) {
      setError("List item name not set");
    } else if (!imageUrl) {
      setError("Image not set");
      return;
    }
    const newSubcollection = {
      name: status,
      priority: statusPriorityVal(status),
      items: {
        name: itemName,
        img: imageUrl,
        score: score,
        status: status,
      },
    };
    await submit(newSubcollection);
    setItemName("");
    setImageUrl("");
    handleClose();
  };
  const handleClose = () => {
    setImageUploadSuccess(false);
    setImageUploadFail(false);
    setError(false);
    setScore(0);
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
            label={`${collectionName} Name`}
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
                {scoreType === "stars"
                  ? StarRating(score, true)
                  : scoreType === "hearts"
                  ? HeartsRating(score, true)
                  : scoreType === "percent"
                  ? PercentRating(score)
                  : scoreType === "10"
                  ? OutOfTenRating(score)
                  : scoreType === "100"
                  ? OutOfHunderedRating(score)
                  : ""}
              </Box>
            </Box>
          )}
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>List Item Status</InputLabel>
              <Select label="Progress Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="Planning">Planning</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Finished">Finished</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
              </Select>
            </FormControl>
          </Box>
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

export default AddListItemToSubcollectionDialog;
