import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, Button } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useAuthState } from "react-firebase-hooks/auth";
import SubcollectionDialog from "../Dialogs/SubcollectionDialog";

const AddNewSubcollection = ({ collection, submitSubcollection }) => {
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
        <Button startIcon={<FileUploadRoundedIcon />} variant="contained" onClick={handleOpen}>
          Add bookmark to new Subcollection
        </Button>
        <SubcollectionDialog
          title="Add Bookmark to new Subcollection"
          collection={{ name: "", bookmarkName: "", bookmarkLink: "", img: "" }}
          user={user}
          open={open}
          close={handleClose}
          submit={submitSubcollection}
        />
      </Box>
    </div>
  );
};

export default AddNewSubcollection;
