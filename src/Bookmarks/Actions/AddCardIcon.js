import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuthState } from "react-firebase-hooks/auth";
import AddBookmarkDialog from "../Dialogs/AddBookmarkDialog";

const AddCardIcon = ({ submitCard, id }) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Tooltip title="Add Bookmark">
          <IconButton color="secondary" variant="outlined" onClick={handleOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        <AddBookmarkDialog
          title="Add New Bookmark"
          subcollection={{ bookmarkName: "", bookmarkLink: "", img: "", id: id }}
          user={user}
          open={open}
          close={handleClose}
          submit={submitCard}
        />
      </Box>
    </div>
  );
};

export default AddCardIcon;
