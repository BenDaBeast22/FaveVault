import { Container, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, query, doc, orderBy, addDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import CardList from "./Display/CardList";
import FormDialog from "./Dialogs/FormDialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Bookmarks = () => {
  const [user] = useAuthState(auth);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("asc");
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const uid = user.uid;
  const addCollection = async (newCollection) => {
    await addDoc(collection(db, "data", uid, "collections"), newCollection);
  };
  const editCollection = async (editedCollection, id) => {
    await updateDoc(doc(db, "data", uid, "collections", id), editedCollection);
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "data", uid, "collections", id));
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
  useEffect(() => {
    const collectionsRef = collection(db, "data", uid, "collections");
    const q = query(collectionsRef, orderBy("name", sortBy));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collectionsArr = [];
      querySnapshot.forEach((doc) => {
        collectionsArr.push({ ...doc.data(), id: doc.id });
      });
      console.log(collectionsArr);
      setCollections(collectionsArr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [sortBy]);
  return (
    <div className="Bookmarks">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Container maxWidth="xs" sx={{ pb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            color="secondary"
            onClick={handleOpenAddDialog}
          >
            Add New Collection
          </Button>
          <FormDialog
            title="Add New Collection"
            collection={{ name: "", img: "" }}
            user={user}
            open={addDialog}
            close={handleCloseAddDialog}
            submit={addCollection}
          />
          {/* <AddNewCard submitCard={submitCollection} type="collection" /> */}
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
        </Container>
        {!loading && (
          <CardList
            list={collections}
            editCard={editCollection}
            handleDelete={handleDelete}
            type="collection"
          ></CardList>
        )}
      </Container>
    </div>
  );
};

export default Bookmarks;
