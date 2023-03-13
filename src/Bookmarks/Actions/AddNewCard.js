import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, Button } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { useAuthState } from "react-firebase-hooks/auth";
import FormDialog from "../Dialogs/FormDialog";
import SubcollectionDialog from "../Dialogs/SubcollectionDialog";

const AddNewCard = ({ submitCard, type }) => {
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
          {type === "collection" ? "Add New Collection" : "Add Bookmark to New Subcollection"}
        </Button>
        {type === "collection" ? (
          <FormDialog
            title="Add new Collection"
            collection={{ name: "", img: "" }}
            user={user}
            open={open}
            close={handleClose}
            submit={submitCard}
          />
        ) : (
          <SubcollectionDialog
            title="Add Bookmark to new Subcollection"
            subcollection={{ name: "", bookmarkName: "", bookmarkLink: "", img: "" }}
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
