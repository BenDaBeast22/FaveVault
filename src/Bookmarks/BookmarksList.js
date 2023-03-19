import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import CardList from "./Display/CardList";

const BookmarksList = ({ groupingName, groupingType, user, sortBy, collectionId }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
  const editBookmark = async (editedBookmark, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, groupingType, id), editedBookmark);
    await updateDoc(doc(collectionsRef, collectionId, groupingType, id), editedBookmark);
  };
  const handleDelete = async (scId, id) => {
    await deleteDoc(doc(subcollectionsRef, scId, groupingType, id));
    await deleteDoc(doc(collectionsRef, collectionId, groupingType, id));
    // delete subcollection if there are no bookmarks within it
    const snapshot = await getDocs(collection(subcollectionsRef, scId, groupingType));
    if (snapshot.empty) {
      await deleteDoc(doc(subcollectionsRef, scId));
    }
  };
  // Listener for bookmarks
  useEffect(() => {
    const q = query(collection(collectionsRef, collectionId, groupingType), orderBy("name", sortBy));
    const unsub = onSnapshot(q, (snapshot) => {
      const bookmarksArr = [];
      snapshot.forEach((doc) => {
        bookmarksArr.push({ ...doc.data(), id: doc.id });
      });
      setBookmarks(bookmarksArr);
    });
    return () => unsub();
  }, [sortBy]);
  return <CardList list={bookmarks} type="bookmark" editCard={editBookmark} handleDelete={handleDelete} />;
};

export default BookmarksList;
