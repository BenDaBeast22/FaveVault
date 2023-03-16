import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from "@mui/material";

const DeleteDialog = ({ type, scId, id, handleDelete, close, open }) => {
  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle align="center">Delete {capitalize(type)}</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this {type}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button color="error" variant="contained" onClick={() => handleDelete(scId, id)} sx={{ mr: 1 }}>
          Yes
        </Button>
        <Button variant="contained" onClick={close} sx={{ ml: 1 }}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
