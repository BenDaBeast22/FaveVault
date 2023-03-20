import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { db } from "./firebase";
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
import AddCardIcon from "./Icons/AddCardIcon";
import EditCardIcon from "./Icons/EditCardIcon";
import DeleteCardIcon from "./Icons/DeleteCardIcon";
import EditSubcollectionDialog from "./Dialogs/EditSubcollectionDialog";

const SubcollectionsList = ({
  groupingName,
  groupingType,
  user,
  sortBy,
  collectionId,
  AddItemDialog,
  EditItemDialog,
  CardList,
}) => {
  const [subcollections, setSubcollections] = useState([]);
  const [items, setItems] = useState({});
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
  const addItemToSubcollection = async (items, subcollectionId) => {
    const itemRef = await addDoc(collection(subcollectionsRef, subcollectionId, groupingType), items);
    await setDoc(doc(collectionsRef, collectionId, groupingType, itemRef.id), items);
  };
  const editItem = async (editedItem, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, groupingType, id), editedItem);
    await updateDoc(doc(collectionsRef, collectionId, groupingType, id), editedItem);
  };
  const editSubcollection = async (newSubcollectionName, id) => {
    await updateDoc(doc(subcollectionsRef, id), { name: newSubcollectionName });
  };
  const deleteSubcollection = async (subcollectionId) => {
    const snapshot = await getDocs(collection(subcollectionsRef, subcollectionId, groupingType));
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        const item = { ...doc.data, id: doc.id };
        deleteItem(item.id, subcollectionId);
      });
    }
  };
  const deleteItem = async (itemId, subcollectionId) => {
    await deleteDoc(doc(subcollectionsRef, subcollectionId, groupingType, itemId));
    await deleteDoc(doc(collectionsRef, collectionId, groupingType, itemId));
    // delete subcollection if there are no items within it
    const snapshot = await getDocs(collection(subcollectionsRef, subcollectionId, groupingType));
    if (snapshot.empty) {
      await deleteDoc(doc(subcollectionsRef, subcollectionId));
    }
  };
  // Event listeners for subcollections
  useEffect(() => {
    const q = query(subcollectionsRef, orderBy("name", sortBy));
    const unsub = onSnapshot(q, (snapshot) => {
      const subcollectionsArr = [];
      snapshot.forEach((doc) => {
        subcollectionsArr.push({ ...doc.data(), id: doc.id });
      });
      setSubcollections(subcollectionsArr);
    });
    return () => unsub();
  }, [sortBy]);
  // Event listeners for items
  useEffect(() => {
    const unsubItemsArr = [];
    subcollections.forEach((subcollection) => {
      const q = query(collection(subcollectionsRef, subcollection.id, groupingType), orderBy("name"));
      const unsub = onSnapshot(q, (snapshot) => {
        const itemsArr = [];
        snapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id });
        });
        setItems((prevItems) => ({ ...prevItems, [subcollection.id]: itemsArr }));
      });
      unsubItemsArr.push(unsub);
    });
    return () => unsubItemsArr.forEach((unsub) => unsub());
  }, [subcollections]);
  return (
    <div>
      {subcollections.map((subcollection) => (
        <Box key={subcollection.id}>
          <Box sx={{ mt: 2, display: "flex", mb: 3 }}>
            <Typography variant="h4" sx={{ mr: 1 }}>
              {subcollection.name}
            </Typography>
            <AddCardIcon
              groupingType={groupingType}
              submitCard={addItemToSubcollection}
              subcollectionId={subcollection.id}
              AddItemDialog={AddItemDialog}
            />
            <EditCardIcon
              type="subcollection"
              card={subcollection}
              editCard={editSubcollection}
              EditCardDialog={EditSubcollectionDialog}
              tooltipName="Edit Subcollection"
            />
            <DeleteCardIcon handleDelete={deleteSubcollection} type="subcollection" card={subcollection} />
          </Box>
          {items[subcollection.id] && (
            <CardList
              list={items[subcollection.id]}
              type="bookmark"
              editCard={editItem}
              EditCardDialog={EditItemDialog}
              handleDelete={deleteItem}
            />
          )}
        </Box>
      ))}
    </div>
  );
};

export default SubcollectionsList;
