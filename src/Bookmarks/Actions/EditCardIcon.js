import React, { useState } from "react";
import { auth } from "../../firebase";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import FormDialog from "../Dialogs/AddCollectionDialog";
import EditIcon from "@mui/icons-material/Edit";
import EditSubcollectionDialog from "../Dialogs/EditSubcollectionDialog";
import EditBookmarkDialog from "../Dialogs/EditBookmarkDialog";

const EditCardIcon = ({ card, editCard, type, tooltipName }) => {
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
        {type === "collection" ? (
          <FormDialog
            title="Edit Collection"
            collection={card}
            user={user}
            open={open}
            close={handleClose}
            submit={editCard}
          />
        ) : type === "subcollection" ? (
          <EditSubcollectionDialog
            title="Edit Subcollection"
            subcollection={card}
            user={user}
            open={open}
            close={handleClose}
            submit={editCard}
          />
        ) : type === "bookmark" ? (
          <EditBookmarkDialog
            title="Edit Bookmark"
            bookmark={card}
            user={user}
            open={open}
            close={handleClose}
            submit={editCard}
          />
        ) : (
          <></>
        )}
      </Box>
    </div>
  );
};

EditCardIcon.defaultProps = { tooltipName: "Edit" };

export default EditCardIcon;
