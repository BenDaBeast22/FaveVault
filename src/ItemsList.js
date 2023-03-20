import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const ItemsList = ({ groupingName, groupingType, user, sortBy, collectionId, EditItemDialog, CardList }) => {
  const [items, setItems] = useState([]);
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
  const editItem = async (editedItem, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, groupingType, id), editedItem);
    await updateDoc(doc(collectionsRef, collectionId, groupingType, id), editedItem);
  };
  const handleDelete = async (id, scId) => {
    await deleteDoc(doc(subcollectionsRef, scId, groupingType, id));
    await deleteDoc(doc(collectionsRef, collectionId, groupingType, id));
    // delete subcollection if there are no items within it
    const snapshot = await getDocs(collection(subcollectionsRef, scId, groupingType));
    if (snapshot.empty) {
      await deleteDoc(doc(subcollectionsRef, scId));
    }
  };
  // Listener for items
  useEffect(() => {
    const q = query(collection(collectionsRef, collectionId, groupingType), orderBy("name", sortBy));
    const unsub = onSnapshot(q, (snapshot) => {
      const itemsArr = [];
      snapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    return () => unsub();
  }, [sortBy]);
  return (
    <CardList
      user={user}
      list={items}
      type="bookmark"
      editCard={editItem}
      EditCardDialog={EditItemDialog}
      handleDelete={handleDelete}
    />
  );
};

export default ItemsList;
