import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from "@mui/material";

const DeleteDialog = ({ name, handleDelete, close, open }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle align="center">Delete {name}</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this {name}?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button color="error" variant="contained" onClick={handleDelete} sx={{ mr: 1 }}>
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
