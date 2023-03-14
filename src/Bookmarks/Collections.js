import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, updateDoc, deleteDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddNewCard from "./Actions/AddNewCard";
import CardList from "./Display/CardList";
import EditCard from "./Actions/EditCard";

const Collections = () => {
  const { id, name } = useParams();
  const [user] = useAuthState(auth);
  const [subcollections, setSubcollections] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const [_collection, _setCollection] = useState(false);
  const [sortBy, setSortBy] = useState("asc");
  const uid = user.uid;
  const subcollectionsRef = collection(db, "data", uid, "collections", id, "subcollections");
  const submitSubcollection = async (newSubcollection) => {
    const docRef = await addDoc(subcollectionsRef, {
      name: newSubcollection.name,
    });
    const bookmarks = { ...newSubcollection.bookmarks, scId: docRef.id };
    await addDoc(collection(docRef, "bookmarks"), bookmarks);
  };
  const addBookmarkToSubcollection = async (bookmarks, id) => {
    console.log("addBookmarktosubcoll");
    console.log("bookmarks = ", bookmarks);
    console.log("id = ", id);
    await addDoc(collection(subcollectionsRef, id, "bookmarks"), bookmarks);
  };
  const editBookmark = async (editedBookmark, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, "bookmarks", id), editedBookmark);
  };
  const editSubcollection = async (newSubcollectionName, id) => {
    await updateDoc(doc(subcollectionsRef, id), { name: newSubcollectionName });
  };
  const handleDelete = async (scId, id) => {
    let deleteSubcollection = false;
    if (bookmarks[scId].length === 1) {
      deleteSubcollection = true;
    }
    await deleteDoc(doc(subcollectionsRef, scId, "bookmarks", id));
    if (deleteSubcollection) {
      await deleteDoc(doc(subcollectionsRef, scId));
    }
  };
  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };
  // Event listeners for subcollections
  useEffect(() => {
    const sq = query(subcollectionsRef, orderBy("name", sortBy));
    const unsubSubcollections = onSnapshot(sq, (snapshot) => {
      const subcollectionsArr = [];
      snapshot.forEach((doc) => {
        subcollectionsArr.push({ ...doc.data(), id: doc.id });
      });
      setSubcollections(subcollectionsArr);
    });
    return () => unsubSubcollections();
  }, []);
  // Event listeners for bookmarks
  useEffect(() => {
    const unsubAllBookmarks = [];
    subcollections.forEach((subcollection) => {
      const bq = query(collection(subcollectionsRef, subcollection.id, "bookmarks"), orderBy("name"));
      const unsubBookmarks = onSnapshot(bq, (snapshot) => {
        const bookmarksArr = [];
        snapshot.forEach((doc) => {
          bookmarksArr.push({ ...doc.data(), id: doc.id });
        });
        setBookmarks((prevBookmarks) => ({ ...prevBookmarks, [subcollection.id]: bookmarksArr }));
      });
      unsubAllBookmarks.push(unsubBookmarks);
    });
    return () => unsubAllBookmarks.forEach((unsubBookmarks) => unsubBookmarks());
  }, [subcollections]);

  return (
    <div className="Collection">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          {name}
        </Typography>
        <Container maxWidth="sm" sx={{ pb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <AddNewCard submitCard={submitSubcollection} type="subcollection" />
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

        {/* Subcollections */}
        {subcollections.map((subcollection) => (
          <Box key={subcollection.id}>
            <Box sx={{ mt: 3, display: "flex", mb: 3 }}>
              <Typography variant="h4" sx={{ mr: 1 }}>
                {subcollection.name}
              </Typography>
              <AddNewCard type="bookmark" submitCard={addBookmarkToSubcollection} id={subcollection.id} />
              <EditCard
                type="subcollection"
                card={subcollection}
                editCard={editSubcollection}
                tooltipName="Edit Subcollection"
              />
            </Box>
            {bookmarks[subcollection.id] && (
              <CardList
                list={bookmarks[subcollection.id]}
                type="bookmark"
                editCard={editBookmark}
                handleDelete={handleDelete}
              />
            )}
          </Box>
        ))}
      </Container>
    </div>
  );
};

export default Collections;
