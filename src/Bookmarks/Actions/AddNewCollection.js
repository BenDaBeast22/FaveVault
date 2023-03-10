import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, Button } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useAuthState } from "react-firebase-hooks/auth";
import FormDialog from "../Dialogs/FormDialog";

const NewCollection = ({ collection, submitCollection }) => {
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
          Upload new Collection
        </Button>
        <FormDialog
          title="Add new Collection"
          collection={{ name: "", img: "" }}
          user={user}
          open={open}
          close={handleClose}
          submit={submitCollection}
        />
      </Box>
    </div>
  );
};

export default NewCollection;
