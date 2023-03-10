import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, Button, IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import FormDialog from "../Dialogs/FormDialog";
import EditIcon from "@mui/icons-material/Edit";

const EditCollection = ({ collection, editCollection }) => {
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
        <IconButton color="info" onClick={handleOpen}>
          <EditIcon />
        </IconButton>
        <FormDialog
          title="Edit Collection"
          collection={collection}
          user={user}
          open={open}
          close={handleClose}
          submit={editCollection}
        />
      </Box>
    </div>
  );
};

export default EditCollection;
