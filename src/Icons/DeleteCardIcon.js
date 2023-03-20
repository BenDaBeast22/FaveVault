import React, { useState } from "react";
import { Tooltip, IconButton } from "@mui/material";
import DeleteDialog from "../Dialogs/DeleteDialog";
import DeleteIcon from "@mui/icons-material/Delete";

function DeleteCardIcon({ type, card, handleDelete }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={handleOpen}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <DeleteDialog
        scId={card.scId}
        id={card.id}
        handleDelete={() => handleDelete(card.id, card.scId)}
        open={open}
        close={handleClose}
        type={type}
      />
    </>
  );
}

export default DeleteCardIcon;
