import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Typography } from "@mui/material";
import AddNewSubcollection from "../Actions/AddNewSubcollection";

const Collections = () => {
  const { id, name } = useParams();
  const [user] = useAuthState(auth);
  const [subCollections, setSubcollections] = useState([]);
  const [_collection, _setCollection] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const uid = user.uid;
  const subCollectionsRef = collection(db, "data", uid, "collections", id, "subcollections");
  const submitSubcollection = async (newSubcollection) => {
    const docRef = await addDoc(subCollectionsRef, {
      name: newSubcollection.name,
    });
    await addDoc(collection(docRef, "bookmarks"), newSubcollection.bookmark);
  };
  console.log(id, name);
  useEffect(() => {
    const loadCollection = async () => {
      const docRef = doc(db, "data", uid, "collections", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        _setCollection(docSnap.data());
      } else {
        console.log("collection not found");
        setError(true);
      }
    };
    // Event listener for subcollections
    const q = query(subCollectionsRef, orderBy("name"));
    const unsubBookmarksArr = [];
    const unsubSubcollections = onSnapshot(q, (qSnapshot) => {
      // Get all subcollections
      const subCollectionsArr = [];
      qSnapshot.forEach((scDoc) => {
        const subCollection = { ...scDoc.data(), id: scDoc.id };
        const bq = query(collection(subCollectionsRef, subCollection.id, "bookmarks"));
        const unsubBookmarks = onSnapshot(bq, (bqSnapshot) => {
          console.log("bq");
          const bookmarksArr = [];
          bqSnapshot.forEach((bDoc) => {
            bookmarksArr.push({ ...bDoc.data(), id: bDoc.id });
          });
          subCollection.bookmarks = bookmarksArr;
          subCollectionsArr.push(subCollection);
        });
        unsubBookmarksArr.push(unsubBookmarks);

        // subCollectionsArr.push({ ...doc.data(), id: doc.id });
      });
      console.log(subCollectionsArr);

      // Event Listener for bookmarks
      // subCollectionsArr.forEach((subCollection) => {
      //   const bq = query(collection(subCollectionsRef, subCollection.id, "bookmarks"));
      //   const unsubBookmarks = onSnapshot(bq, (querySnapshot) => {
      //     const bookmarksArr = [];
      //     querySnapshot.forEach((doc) => {
      //       bookmarksArr.push({ ...doc.data(), id: doc.id });
      //     });
      //     subCollectionsArr[0].bookmarks = bookmarksArr;
      //   });
      //   unsubBookmarksArr.push(unsubBookmarks);
      // });

      // const bookmarksArr = [];
      // querySnapshot.forEach((doc) => {
      //   bookmarksArr.push({ ...doc.data(), id: doc.id });
      // });
      // console.log("On Change = ", bookmarksArr);
      // setSubcollections((prevSubCollections) => [...prevSubCollections, bookmarksArr]);
      // setLoading(false);
    });
    const unsubAll = () => {
      unsubBookmarksArr.forEach((unsubBookmark) => unsubBookmark());
      unsubSubcollections();
    };
    loadCollection();
    return unsubAll;
  }, []);

  return (
    <div className="Collection">
      <Typography variant="h3" align="center" sx={{ mt: 3 }} gutterBottom>
        {name}
      </Typography>
      <AddNewSubcollection submitSubcollection={submitSubcollection} />
    </div>
  );
};

export default Collections;
