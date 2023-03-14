import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuthState } from "react-firebase-hooks/auth";
import FormDialog from "../Dialogs/FormDialog";
import SubcollectionDialog from "../Dialogs/SubcollectionDialog";

const AddNewCard = ({ submitCard, type, id }) => {
  const [user] = useAuthState(auth);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  let buttonText;
  if (type === "collection") buttonText = "Add New Collection";
  else if (type === "subcollection") buttonText = "Add Bookmark to New Subcollection";
  else buttonText = "Add Bookmark";
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {type !== "bookmark" ? (
          <Button startIcon={<AddCircleOutlineIcon />} variant="contained" color="secondary" onClick={handleOpen}>
            {buttonText}
          </Button>
        ) : (
          <Tooltip title="Add bookmark">
            <IconButton color="secondary" variant="outlined" onClick={handleOpen}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
        {type === "collection" ? (
          <FormDialog
            title="Add new Collection"
            collection={{ name: "", img: "" }}
            user={user}
            open={open}
            close={handleClose}
            submit={submitCard}
          />
        ) : type === "subcollection" ? (
          <SubcollectionDialog
            title="Add Bookmark to new Subcollection"
            subcollection={{ name: "", bookmarkName: "", bookmarkLink: "", img: "" }}
            user={user}
            open={open}
            close={handleClose}
            submit={submitCard}
          />
        ) : (
          <SubcollectionDialog
            title="Add Bookmark"
            subcollection={{ name: "", bookmarkName: "", bookmarkLink: "", img: "", id: id }}
            user={user}
            open={open}
            close={handleClose}
            submit={submitCard}
          />
        )}
      </Box>
    </div>
  );
};

export default AddNewCard;
