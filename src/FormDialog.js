import React, { useState } from "react";
import { db, auth } from "./firebase";
import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Typography } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";
import { useAuthState } from "react-firebase-hooks/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const FormDialog = (props) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [collectionImageUrl, setCollectionImageUrl] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (event) => {
    if (!collectionName || !collectionImageUrl) return;
    event.preventDefault();
    const uid = user.uid;
    const collection = {
      name: collectionName,
      img: collectionImageUrl,
    };
    await setDoc(doc(db, "data", uid, "collections", collectionName), collection);
    props.submitCollection(collection);
    handleClose();
  };
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button startIcon={<FileUploadRoundedIcon />} variant="contained" onClick={handleOpen}>
          Upload new Collection
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
              <DialogContentText align="center">Add New Collection</DialogContentText>
              <TextField
                label="Collection Name"
                value={collectionName}
                sx={{ mt: 2 }}
                onChange={(e) => setCollectionName(e.target.value)}
                autoFocus
              />
              <TextField
                label="Image URL"
                margin="normal"
                value={collectionImageUrl}
                onChange={(e) => setCollectionImageUrl(e.target.value)}
                autoFocus
              />
              <DialogContentText align="center" sx={{ mb: 1 }}>
                Or
              </DialogContentText>
              <Button variant="outlined">
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={(e) => console.log("new image")}
                  style={{ padding: "5px" }}
                />
              </Button>
              <Button startIcon={<PublishRoundedIcon />} variant="contained" type="submit" sx={{ mt: 2, mb: 1 }}>
                Submit
              </Button>
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
    </div>
  );
};

export default FormDialog;
