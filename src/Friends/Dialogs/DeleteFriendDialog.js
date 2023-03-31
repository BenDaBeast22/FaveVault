import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from "@mui/material";

const DeleteFriendDialog = ({ friend, handleDelete, open, close }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle align="center">Delete Friend</DialogTitle>
      <DialogContent>
        <DialogContentText>{`Are you sure you want to remove ${friend && friend.username}?`}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
        <Button color="error" variant="contained" onClick={() => handleDelete(friend)} sx={{ mr: 1 }}>
          Yes
        </Button>
        <Button variant="contained" onClick={close} sx={{ ml: 1 }}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteFriendDialog;
