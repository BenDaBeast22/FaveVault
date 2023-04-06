import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogContentText, TextField, Alert } from "@mui/material";
import PublishRoundedIcon from "@mui/icons-material/PublishRounded";

const EditSubcollectionDialog = ({ title, card, open, submit, close, maxLength }) => {
  const [subcollectionName, setSubcollectionName] = useState(card.name);
  const [error, setError] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subcollectionName) {
      setError("Subcollection name not set");
      return;
    }
    await submit(subcollectionName, card.id);
    handleClose();
  };
  const handleClose = () => {
    close();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <DialogContentText align="center">{title}</DialogContentText>
          <TextField
            label="Subcollection Name"
            value={subcollectionName}
            sx={{ mt: 2 }}
            onChange={(e) => setSubcollectionName(e.target.value)}
            inputProps={{ maxLength: maxLength }}
            autoFocus
          />
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

export default EditSubcollectionDialog;
