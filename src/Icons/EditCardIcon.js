import React, { useState } from "react";
import { auth } from "../Config/firebase";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import EditIcon from "@mui/icons-material/Edit";
import { maxLength } from "../Config/config";

const EditCardIcon = ({ card, editCard, EditCardDialog, tooltipName, displayStatus, scoreType, name }) => {
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
        <Tooltip title={tooltipName}>
          <IconButton color="info" onClick={handleOpen}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <EditCardDialog
          title={`Edit ${name}`}
          editName={name}
          user={user}
          card={card}
          open={open}
          close={handleClose}
          submit={editCard}
          displayStatus={displayStatus}
          scoreType={scoreType}
          maxLength={maxLength}
        />
      </Box>
    </div>
  );
};

EditCardIcon.defaultProps = { tooltipName: "Edit" };

export default EditCardIcon;
