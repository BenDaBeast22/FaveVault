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
      {type === "bookmark" ? (
        <DeleteDialog
          scId={card.scId}
          id={card.id}
          handleDelete={() => handleDelete(card.scId, card.id)}
          open={open}
          close={handleClose}
          type={type}
        />
      ) : (
        <DeleteDialog
          id={card.id}
          handleDelete={() => handleDelete(card.id)}
          open={open}
          close={handleClose}
          type={type}
        />
      )}
    </>
  );
}

export default DeleteCardIcon;
