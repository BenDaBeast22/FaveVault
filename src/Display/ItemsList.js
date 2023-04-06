import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Config/firebase";
import { statusPriorityVal } from "../helpers";

const ItemsList = ({
  groupingName,
  groupingType,
  scoreType,
  uid,
  sortType,
  sortOrder,
  collectionId,
  EditItemDialog,
  CardList,
  collectionName,
  itemName,
  addListItemToSubcollection,
  friendView,
}) => {
  const [items, setItems] = useState([]);
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
    const q = query(collection(collectionsRef, collectionId, groupingType), orderBy(sortType, sortOrder));
    const unsub = onSnapshot(q, (snapshot) => {
      const itemsArr = [];
      snapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
    return () => unsub();
  }, [sortType, sortOrder]);
  return (
    <CardList
      uid={uid}
      list={items}
      type="bookmark"
      editCard={editItem}
      editListItem={editListItem}
      EditCardDialog={EditItemDialog}
      handleDelete={handleDelete}
      scoreType={scoreType}
      displayRating={scoreType !== "none"}
      collectionName={collectionName}
      itemName={itemName}
      groupingName={groupingName}
      friendView={friendView}
    />
  );
};

export default ItemsList;
