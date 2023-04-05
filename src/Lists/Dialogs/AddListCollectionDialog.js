import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Alert,
  InputLabel,
  Switch,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { v4 as uuid } from "uuid";
import { storage } from "../../Config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CircularProgressLabel from "../../Components/CircularProgressLabel";

const AddListCollectionDialog = ({ groupingName, card, user, open, submit, close }) => {
  const [name, setName] = useState("");
  const [scoreType, setScoreType] = useState("stars");
  const [statusEnabled, setStatusEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageUploadFail, setImageUploadFail] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const uid = user.uid;
  const toggleStatusEnabled = () => {
    setStatusEnabled((prevState) => !prevState);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      setError(`${groupingName} name not set`);
      return;
    } else if (!imageUrl) {
      setError("Image name not set");
      return;
    }
    const newCollection = {
      name: name,
      img: imageUrl,
      scoreType: scoreType,
      statusEnabled: statusEnabled,
    };
    await submit(newCollection);
    setName("");
    setImageUrl("");
    setStatusEnabled(false);
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
          <DialogContentText align="center">{`Add New ${groupingName}`}</DialogContentText>
          <TextField
            label={`${groupingName} Name`}
            value={name}
            sx={{ mt: 2 }}
            onChange={(e) => setName(e.target.value)}
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
            <Button
              variant="contained"
              onClick={handleUploadImage}
              color="info"
              startIcon={<CloudUploadIcon />}
              disabled={Boolean(imageUrl)}
            >
              upload
            </Button>
            <CircularProgressLabel
              progress={progress}
              imageUploadSuccess={imageUploadSuccess}
              imageUploadFail={imageUploadFail}
            />
          </Button>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Score Type</InputLabel>
              <Select label="Score Type" value={scoreType} onChange={(e) => setScoreType(e.target.value)}>
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="stars">Stars</MenuItem>
                <MenuItem value="hearts">Hearts</MenuItem>
                <MenuItem value="percent">Percent</MenuItem>
                <MenuItem value="10">Out of 10</MenuItem>
                <MenuItem value="100">Out of 100</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "5px",
              pt: 2,
              "&:hover": {
                borderColor: "inherit",
              },
            }}
          >
            <InputLabel sx={{ color: "inherit" }}>Progress Status</InputLabel>
            <Switch checked={statusEnabled} onChange={toggleStatusEnabled} />
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

export default AddListCollectionDialog;
