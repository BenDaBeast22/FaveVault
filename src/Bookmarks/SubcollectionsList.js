import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CardList from "./Display/CardList";
import EditCardIcon from "./Actions/EditCardIcon";
import { db } from "../firebase";
import {
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import AddCardIcon from "./Actions/AddCardIcon";

const SubcollectionsList = ({ user, sortBy, collectionId }) => {
  const [subcollections, setSubcollections] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, "collections");
  const subcollectionsRef = collection(db, "data", uid, "collections", collectionId, "subcollections");
  const addBookmarkToSubcollection = async (bookmarks, subcollectionId) => {
    const bookmarkRef = await addDoc(collection(subcollectionsRef, subcollectionId, "bookmarks"), bookmarks);
    await setDoc(doc(collectionsRef, collectionId, "bookmarks", bookmarkRef.id), bookmarks);
  };
  const editBookmark = async (editedBookmark, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, "bookmarks", id), editedBookmark);
    await updateDoc(doc(collectionsRef, collectionId, "bookmarks", id), editedBookmark);
  };
  const editSubcollection = async (newSubcollectionName, id) => {
    await updateDoc(doc(subcollectionsRef, id), { name: newSubcollectionName });
  };
  const handleDelete = async (scId, id) => {
    await deleteDoc(doc(subcollectionsRef, scId, "bookmarks", id));
    await deleteDoc(doc(collectionsRef, collectionId, "bookmarks", id));
    // delete subcollection if there are no bookmarks within it
    const snapshot = await getDocs(collection(subcollectionsRef, scId, "bookmarks"));
    if (snapshot.empty) {
      await deleteDoc(doc(subcollectionsRef, scId));
    }
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
  }, [sortBy]);
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
    <div>
      {subcollections.map((subcollection) => (
        <Box key={subcollection.id}>
          <Box sx={{ mt: 2, display: "flex", mb: 3 }}>
            <Typography variant="h4" sx={{ mr: 1 }}>
              {subcollection.name}
            </Typography>
            <AddCardIcon submitCard={addBookmarkToSubcollection} id={subcollection.id} />
            <EditCardIcon
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
    </div>
  );
};

export default SubcollectionsList;
