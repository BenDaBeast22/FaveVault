import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Config/firebase";
import { statusPriorityVal } from "../helpers";

const ItemsList = ({
  groupingName,
  groupingType,
  scoreType,
  user,
  sortBy,
  collectionId,
  EditItemDialog,
  CardList,
  collectionName,
  addListItemToSubcollection,
}) => {
  const [items, setItems] = useState([]);
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
  const editItem = async (editedItem, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, groupingType, id), editedItem);
    await updateDoc(doc(collectionsRef, collectionId, groupingType, id), editedItem);
  };
  const editListItem = async (editedItem, statusChanged, subcollectionId, itemId) => {
    if (statusChanged) {
      handleDelete(itemId, subcollectionId);
      const newSubcollection = {
        name: editedItem.status,
        priority: statusPriorityVal(editedItem.status),
        items: editedItem,
      };
      addListItemToSubcollection(newSubcollection);
    } else {
      editItem(editedItem, subcollectionId, itemId);
    }
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
      editListItem={editListItem}
      EditCardDialog={EditItemDialog}
      handleDelete={handleDelete}
      scoreType={scoreType}
      collectionName={collectionName}
      groupingName={groupingName}
    />
  );
};

export default ItemsList;
