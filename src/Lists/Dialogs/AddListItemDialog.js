import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Alert, Typography } from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import { v4 as uuid } from "uuid";
import { storage } from "../../Config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ImageUpload from "../../Components/ImageUpload";
import {
  StarRating,
  HeartsRating,
  PercentRating,
  OutOfTenRating,
  OutOfHunderedRating,
} from "../../Components/ScoreTypes";
import { singularize } from "../../helpers";

const AddListItemDialog = ({
  title,
  user,
  open,
  submit,
  close,
  scoreType,
  subcollectionId,
  collectionName,
  maxLength,
}) => {
  const [itemName, setItemName] = useState("");
  const [score, setScore] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const uid = user.uid;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!itemName) {
      setError("List item name not set");
      return;
    }
    if (!subcollectionId) subcollectionId = "Planning";
    const newSubcollection = {
      name: "Planning",
      priority: 1,
      items: {
        name: itemName,
        img: imageUrl,
        score: score,
        status: "Planning",
      },
    };
    await submit(newSubcollection);
    setItemName("");
    setScore(0);
    setImageUrl("");
    handleClose();
    return;
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
            label={`${singularize(collectionName)} Name`}
            value={itemName}
            sx={{ mt: 2 }}
            onChange={(e) => setItemName(e.target.value)}
            inputProps={{ maxLength: maxLength }}
            autoFocus
          />
          <TextField
            disabled={imageUpload !== null}
            label="Image URL"
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <DialogContentText align="center" sx={{ mb: 1 }}>
            Or
          </DialogContentText>
          <ImageUpload
            disabled={imageUrl}
            handleUploadImage={handleUploadImage}
            handleImageChange={handleImageChange}
            progress={progress}
            imageUploadSuccess={imageUploadSuccess}
            imageUploadFail={imageUploadFail}
          ></ImageUpload>
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

export default AddListItemDialog;
