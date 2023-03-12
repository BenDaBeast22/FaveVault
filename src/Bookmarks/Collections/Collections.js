import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Typography, Box } from "@mui/material";
import AddNewSubcollection from "../Actions/AddNewSubcollection";
import CardList from "../Display/CardList";

const Collections = () => {
  const { id, name } = useParams();
  const [user] = useAuthState(auth);
  const [subcollections, setSubcollections] = useState([]);
  const [bookmarks, setBookmarks] = useState({});
  const [_collection, _setCollection] = useState(false);
  const [unsubArr, setUnsubArr] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const uid = user.uid;
  const subcollectionsRef = collection(db, "data", uid, "collections", id, "subcollections");
  const submitSubcollection = async (newSubcollection) => {
    const docRef = await addDoc(subcollectionsRef, {
      name: newSubcollection.name,
    });
    const bookmarks = { ...newSubcollection.bookmarks, scId: docRef.id };
    // setUnsubArr((prevUnsubArr) => prevUnsubArr.push(unsubBookmark));
    await addDoc(collection(docRef, "bookmarks"), bookmarks);
  };
  useEffect(() => {
    // Event listener for subcollections
    const sq = query(subcollectionsRef, orderBy("name"));
    const unsubSubcollections = onSnapshot(sq, (snapshot) => {
      const subcollectionsArr = [];
      snapshot.forEach((doc) => {
        subcollectionsArr.push({ ...doc.data(), id: doc.id });
      });
      setSubcollections(subcollectionsArr);
    });
    // setUnsubArr(unsubSubcollections);

    // const unsubAll = () => {
    //   unsubArr.forEach((unsub) => unsub());
    // };
    return;
  }, []);
  useEffect(() => {
    const bookmarksArr = [];
    subcollections.forEach((subcollection) => {
      const bq = query(collection(subcollectionsRef, subcollection.id, "bookmarks"), orderBy("name"));
      const unsubBookmark = onSnapshot(bq, (snapshot) => {
        const bookmarksArr = [];
        snapshot.forEach((doc) => {
          bookmarksArr.push({ ...doc.data(), id: doc.id });
        });
        setBookmarks((prevBookmarks) => ({ ...prevBookmarks, [subcollection.id]: bookmarksArr }));
      });
      // setUnsubArr((prevUnsubArr) => prevUnsubArr.push(unsubBookmark));
    });
  }, [subcollections]);

  return (
    <div className="Collection">
      <Typography variant="h3" align="center" sx={{ mt: 3 }} gutterBottom>
        {name}
      </Typography>
      <AddNewSubcollection submitSubcollection={submitSubcollection} />
      <Typography variant="h3">Bookmarks</Typography>
      {/* {bookmarks.map((bookmark) => (
        <Typography key={bookmark.id} variant="h6">
          {bookmark.name}
        </Typography>
      ))} */}

      {subcollections.map((subcollection) => (
        <Box key={subcollection.id}>
          <Typography variant="h3">{subcollection.name + " " + subcollection.id}</Typography>
          {
            bookmarks[subcollection.id] && <CardList collections={bookmarks[subcollection.id]} />
            // bookmarks[subcollection.id].map((bookmark) => (
            //   <Typography key={bookmark.id}>{bookmark.name + " " + bookmark.id}</Typography>
            // ))
          }
        </Box>
      ))}
    </div>
  );
};

export default Collections;
