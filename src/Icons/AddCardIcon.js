import React, { useState } from "react";
import { auth } from "../Config/firebase";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuthState } from "react-firebase-hooks/auth";
import { capitalize, singularize } from "../helpers";
import { maxLength } from "../Config/config";

const AddCardIcon = ({ groupingType, submitCard, subcollectionId, AddItemDialog }) => {
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
        <Tooltip title={`Add ${capitalize(singularize(groupingType))}`}>
          <IconButton color="secondary" variant="outlined" onClick={handleOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
        <AddItemDialog
          title={`Add New ${capitalize(singularize(groupingType))}`}
          subcollectionId={subcollectionId}
          user={user}
          open={open}
          close={handleClose}
          submit={submitCard}
          maxLength={maxLength}
        />
      </Box>
    </div>
  );
};

export default AddCardIcon;
