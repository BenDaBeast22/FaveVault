import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { db } from "../Config/firebase";
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
import AddCardIcon from "../Icons/AddCardIcon";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";
import EditSubcollectionDialog from "../Dialogs/EditSubcollectionDialog";
import { statusPriorityVal } from "../helpers";
import SortType from "../Components/SortType";
import SortOrder from "../Components/SortOrder";
import { sortList, ratingSortList } from "../Config/sortLists";

const SubcollectionsList = ({
  groupingName,
  groupingType,
  uid,
  sortOrder,
  collectionId,
  AddItemDialog,
  EditItemDialog,
  CardList,
  scoreType,
  addListItemToSubcollection,
  collectionName,
  itemName,
  friendView,
}) => {
  const [subcollections, setSubcollections] = useState([]);
  const [items, setItems] = useState({});
  const [itemsSortBy, setItemsSortBy] = useState(null);
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
  const isLists = groupingName === "Lists";
  const subcollectionsOrder = isLists ? "priority" : "name";
  const addItemToSubcollection = async (items, subcollectionId) => {
    const itemRef = await addDoc(collection(subcollectionsRef, subcollectionId, groupingType), items);
    await setDoc(doc(collectionsRef, collectionId, groupingType, itemRef.id), items);
  };
  const editItem = async (editedItem, scId, id) => {
    await updateDoc(doc(subcollectionsRef, scId, groupingType, id), editedItem);
    await updateDoc(doc(collectionsRef, collectionId, groupingType, id), editedItem);
  };
  const editListItem = async (editedItem, statusChanged, subcollectionId, itemId) => {
    if (statusChanged) {
      deleteItem(itemId, subcollectionId);
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
  const handleSortBy = (event, subcollectionId) => {
    const sortType = event.target.value;
    setItemsSortBy((prevState) => {
      const newItemsSortBy = {};
      for (const [key, value] of Object.entries(prevState)) {
        if (key === subcollectionId)
          newItemsSortBy[key] = { ...value, type: sortType, order: sortType === "name" ? "asc" : "desc" };
        else newItemsSortBy[key] = { ...value };
      }
      return newItemsSortBy;
    });
    // updateSetItemsSortBy("type", sortType, subcollectionId);
  };
  const handleOrderBy = (event, subcollectionId) => {
    const sortOrder = event.target.value;
    setItemsSortBy((prevState) => {
      const newItemsSortBy = {};
      for (const [key, value] of Object.entries(prevState)) {
        if (key === subcollectionId) newItemsSortBy[key] = { ...value, order: sortOrder };
        else newItemsSortBy[key] = { ...value };
      }
      return newItemsSortBy;
    });
  };
  // Event listeners for subcollections
  useEffect(() => {
    const q = query(subcollectionsRef, orderBy(subcollectionsOrder, sortOrder));
    const unsub = onSnapshot(q, (snapshot) => {
      const subcollectionsArr = [];
      const itemsSortBy = {};
      snapshot.forEach((doc) => {
        subcollectionsArr.push({ ...doc.data(), id: doc.id });
        itemsSortBy[doc.id] = { type: "name", order: "asc" };
      });
      setSubcollections(subcollectionsArr);
      setItemsSortBy(itemsSortBy);
    });
    return () => unsub();
  }, [sortOrder]);
  // Event listeners for items
  useEffect(() => {
    if (subcollections.length === 0 || !itemsSortBy) return;
    const unsubItemsArr = [];
    subcollections.forEach((subcollection) => {
      const q = query(
        collection(subcollectionsRef, subcollection.id, groupingType),
        orderBy(itemsSortBy[subcollection.id].type, itemsSortBy[subcollection.id].order)
      );
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
  }, [subcollections, itemsSortBy]);
  return (
    <div>
      {itemsSortBy &&
        subcollections.map((subcollection) => (
          <Box key={subcollection.id}>
            <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", rowGap: 2, mb: 3 }}>
              <Typography variant="h4" sx={{ mr: 2 }}>
                {subcollection.name}
              </Typography>
              {!isLists && !friendView && (
                <Box sx={{ display: "flex" }}>
                  <AddCardIcon
                    groupingType={groupingType}
                    submitCard={addItemToSubcollection}
                    subcollectionId={subcollection.id}
                    AddItemDialog={AddItemDialog}
                  />
                  <EditCardIcon
                    name="Subcollection"
                    card={subcollection}
                    editCard={editSubcollection}
                    EditCardDialog={EditSubcollectionDialog}
                    tooltipName="Edit Subcollection"
                  />
                  <DeleteCardIcon handleDelete={deleteSubcollection} name="Subcollection" card={subcollection} />
                </Box>
              )}
              <Box sx={{ display: "flex" }}>
                <SortType
                  list={isLists ? ratingSortList : sortList}
                  handleSortBy={isLists ? handleSortBy : handleOrderBy}
                  subcollectionId={subcollection.id}
                />
                {isLists && (
                  <Box sx={{ ml: 2 }}>
                    <SortOrder
                      handleOrderBy={handleOrderBy}
                      subcollectionId={subcollection.id}
                      value={itemsSortBy[subcollection.id].order}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            {items[subcollection.id] && (
              <CardList
                list={items[subcollection.id]}
                itemName={itemName}
                editCard={editItem}
                EditCardDialog={EditItemDialog}
                handleDelete={deleteItem}
                scoreType={scoreType}
                displayStatus={true}
                collectionName={collectionName}
                editListItem={editListItem}
                groupingName={groupingName}
                displayRating={subcollection.name === "Planning" ? false : true}
                friendView={friendView}
              />
            )}
          </Box>
        ))}
    </div>
  );
};

export default SubcollectionsList;
