import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, setDoc, collection } from "firebase/firestore";
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Button, Switch } from "@mui/material";

import AddBookmarkDialog from "./Dialogs/AddBookmarkDialog";
import AddBookmarkToSubCollectionDialog from "./Dialogs/AddBookmarkToSubcollectionDialog";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SubcollectionsList from "./SubcollectionsList";
import BookmarksList from "./BookmarksList";

const Collections = () => {
  const { id, name } = useParams();
  const [user] = useAuthState(auth);
  const [allBookmarks, setAllBookmarks] = useState([]);
  const [displaySubcollections, setDisplaySubcollections] = useState(true);
  const [_collection, _setCollection] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState("asc");
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, "collections");
  const subcollectionsRef = collection(db, "data", uid, "collections", id, "subcollections");
  const submitSubcollection = async (newSubcollection) => {
    const docRef = await addDoc(subcollectionsRef, {
      name: newSubcollection.name,
    });
    const bookmarks = { ...newSubcollection.bookmarks, scId: docRef.id };
    const bookmarkRef = await addDoc(collection(docRef, "bookmarks"), bookmarks);
    await setDoc(doc(collectionsRef, id, "bookmarks", bookmarkRef.id), bookmarks);
  };
  const addBookmarkToSubcollection = async (bookmarks, subcollectionId) => {
    await setDoc(doc(subcollectionsRef, subcollectionId), { name: "Main" });
    const bookmarkRef = await addDoc(collection(subcollectionsRef, subcollectionId, "bookmarks"), bookmarks);
    await setDoc(doc(collectionsRef, id, "bookmarks", bookmarkRef.id), bookmarks);
  };
  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };
  const handleOpenAddDialog = () => {
    setAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialog(false);
  };
  const toggleDisplaySubcollections = () => {
    setDisplaySubcollections((prevState) => !prevState);
  };

  return (
    <div className="Collection">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          {name}
        </Typography>
        <Container maxWidth="sm" sx={{ mb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {displaySubcollections ? (
            <>
              <Button
                startIcon={<CreateNewFolderIcon />}
                variant="contained"
                color="secondary"
                onClick={handleOpenAddDialog}
              >
                New Subcollection
              </Button>
              <AddBookmarkToSubCollectionDialog
                title="Add Bookmark to new Subcollection"
                subcollection={{ name: "", bookmarkName: "", bookmarkLink: "", img: "" }}
                user={user}
                open={addDialog}
                close={handleCloseAddDialog}
                submit={submitSubcollection}
              />
            </>
          ) : (
            <>
              <Button
                startIcon={<CreateNewFolderIcon />}
                variant="contained"
                color="secondary"
                onClick={handleOpenAddDialog}
              >
                New Bookmark
              </Button>
              <AddBookmarkDialog
                title="Add new Bookmark"
                subcollection={{ bookmarkName: "", bookmarkLink: "", img: "" }}
                user={user}
                open={addDialog}
                close={handleCloseAddDialog}
                submit={addBookmarkToSubcollection}
              />
            </>
          )}

          <FormControl>
            <InputLabel>Sort By</InputLabel>
            <Select
              sx={{
                height: "38px",
                backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
              }}
              label="sort by"
              defaultValue="asc"
              onChange={handleSortBy}
            >
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderColor: "secondary.main",
              borderRadius: "5px",
              "&:hover": {
                borderColor: "inherit",
              },
            }}
          >
            <InputLabel sx={{ pl: 1, color: "inherit" }}>Subcollections</InputLabel>
            <Switch color="secondary" defaultChecked onClick={toggleDisplaySubcollections} />
          </Box>
        </Container>
        {/* Subcollections */}
        {displaySubcollections ? (
          <SubcollectionsList user={user} sortBy={sortBy} collectionId={id} />
        ) : (
          <BookmarksList user={user} sortBy={sortBy} collectionId={id} />
        )}
      </Container>
    </div>
  );
};

export default Collections;
