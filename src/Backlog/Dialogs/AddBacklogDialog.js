import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import { v4 as uuid } from "uuid";
import { storage } from "../../Config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import ImageUpload from "../../Components/ImageUpload";

const AddBacklogItemDialog = ({ title, user, open, submit, close }) => {
  const [itemName, setItemName] = useState("");
  const [itemStatus, setItemStatus] = useState("planning to start");
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
      setError("Item name not set");
      return;
    }
    const item = { name: itemName, status: itemStatus, img: imageUrl, scId: "default" };
    await submit(item, "default");
    setItemName("");
    setItemStatus("planning to start");
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
            label="Item Name"
            value={itemName}
            sx={{ mt: 2 }}
            onChange={(e) => setItemName(e.target.value)}
            autoFocus
          />
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Item Status</InputLabel>
              <Select label="Progress Status" value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
                <MenuItem value="planning to start">Planning</MenuItem>
                <MenuItem value="in progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
          <ImageUpload
            disabled={imageUrl}
            handleUploadImage={handleUploadImage}
            handleImageChange={handleImageChange}
            progress={progress}
            imageUploadSuccess={imageUploadSuccess}
            imageUploadFail={imageUploadFail}
          ></ImageUpload>
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

export default AddBacklogItemDialog;
