import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Alert } from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { v4 as uuid } from "uuid";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CircularProgressLabel from "../Components/CircularProgressLabel";

const SubcollectionDialog = ({ title, subcollection, user, open, submit, close }) => {
  const [subcollectionName, setSubcollectionName] = useState(subcollection.name);
  const [bookmarkName, setBookmarkName] = useState(subcollection.bookmarkName);
  const [bookmarkLink, setBookmarkLink] = useState(subcollection.bookmarkLink);
  const [imageUrl, setImageUrl] = useState(subcollection.img);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const uid = user.uid;
  let AddbookmarkToCollection = false;
  if (title === "Add Bookmark") {
    AddbookmarkToCollection = true;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    // If adding bookmark to existing subcollection
    if (AddbookmarkToCollection) {
      if (!bookmarkName) {
        setError("Bookmark name not set");
        return;
      } else if (!bookmarkName) {
        setError("Bookmark image not set");
        return;
      }
      console.log("subcollection = ", subcollection);
      const bookmarks = { name: bookmarkName, link: bookmarkLink, img: imageUrl, scId: subcollection.id };
      await submit(bookmarks, subcollection.id);
      handleClose();
      return;
    }
    if (!subcollectionName) {
      setError("Subcollection name not set");
      return;
    } else if (!bookmarkName) {
      setError("Bookmark name not set");
    } else if (!imageUrl) {
      setError("Subcollection image name not set");
      return;
    }
    // If adding bookmark to new subcollection
    const newCollection = {
      name: subcollectionName,
      bookmarks: {
        name: bookmarkName,
        link: bookmarkLink,
        img: imageUrl,
      },
    };
    await submit(newCollection, subcollection.id);
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
          {!AddbookmarkToCollection && (
            <TextField
              label="Subcollection Name"
              value={subcollectionName}
              sx={{ mt: 2 }}
              onChange={(e) => setSubcollectionName(e.target.value)}
              autoFocus
            />
          )}
          <TextField
            label="Bookmark Name"
            value={bookmarkName}
            sx={{ mt: 2 }}
            onChange={(e) => setBookmarkName(e.target.value)}
            autoFocus
          />
          <TextField
            label="Bookmark Link"
            value={bookmarkLink}
            sx={{ mt: 2 }}
            onChange={(e) => setBookmarkLink(e.target.value)}
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

export default SubcollectionDialog;
