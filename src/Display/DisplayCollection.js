import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Config/firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, setDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { Container, Typography, Box, InputLabel, Button, Switch } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SubcollectionsList from "./SubcollectionsList";
import ItemsList from "./ItemsList";
import { capitalize, singularize } from "../helpers";
import SortType from "../Components/SortType";
import SortOrder from "../Components/SortOrder";
import { sortList, ratingSortList } from "../Config/sortLists";
import { maxLength } from "../Config/config";
import BackButton from "../Components/BackButton";

const DisplayCollection = ({
  groupingName,
  groupingType,
  AddItemDialog,
  AddItemToSubcollectionDialog,
  EditItemDialog,
  CardList,
}) => {
  const { id, name, scoreType, subcollectionsEnabled, statusEnabled, friendUid } = useParams();
  const [user] = useAuthState(auth);
  const [displaySubcollections, setDisplaySubcollections] = useState(subcollectionsEnabled === "true");
  const [displayStatus] = useState(statusEnabled === "true");
  const [addDialog, setAddDialog] = useState(false);
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const friendView = friendUid && true;
  const uid = friendUid ? friendUid : user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, id, "subcollections");
  const isLists = groupingName === "Lists";
  const itemName = isLists ? capitalize(singularize(name)) : capitalize(singularize(groupingType));
  const subcollectionName = isLists ? capitalize(singularize(name)) : "Subcollection";
  const addItemToNewSubcollection = async (newSubcollection) => {
    const subcollection = {
      name: newSubcollection.name,
    };
    if (newSubcollection.priority) subcollection.priority = newSubcollection.priority;
    const docRef = await addDoc(subcollectionsRef, subcollection);
    const items = { ...newSubcollection[groupingType], scId: docRef.id };
    const itemsRef = await addDoc(collection(docRef, groupingType), items);
    await setDoc(doc(collectionsRef, id, groupingType, itemsRef.id), items);
  };
  const addListItemToSubcollection = async (newSubcollection) => {
    const q = query(subcollectionsRef, where("name", "==", newSubcollection.name), limit(1));
    const querySnapshot = await getDocs(q);
    // if list status doesn't exist than create new one
    if (querySnapshot.empty) {
      addItemToNewSubcollection(newSubcollection);
      return;
    }
    const subcollectionId = querySnapshot.docs[0].id;
    const item = {
      ...newSubcollection.items,
      scId: subcollectionId,
    };
    const itemRef = await addDoc(collection(subcollectionsRef, subcollectionId, groupingType), item);
    await setDoc(doc(collectionsRef, id, groupingType, itemRef.id), item);
  };
  const addListItem = (subcollection) => {
    addListItemToSubcollection(subcollection);
  };
  const addItem = async (items, subcollectionId) => {
    await setDoc(doc(subcollectionsRef, subcollectionId), { name: "Default", priority: 0 });
    const itemsRef = await addDoc(collection(subcollectionsRef, subcollectionId, groupingType), items);
    await setDoc(doc(collectionsRef, id, groupingType, itemsRef.id), items);
  };
  const handleSortBy = (event) => {
    const newSortType = event.target.value;
    console.log("sort type = ", newSortType);
    if (newSortType !== sortType) {
      setSortType(newSortType);
      if (newSortType === "score") setSortOrder("desc");
      else setSortOrder("asc");
    }
  };
  const handleOrderBy = (event) => {
    setSortOrder(event.target.value);
  };
  const handleOpenAddDialog = () => {
    setAddDialog(true);
  };
  const handleCloseAddDialog = () => {
    setAddDialog(false);
  };
  const toggleDisplaySubcollections = () => {
    setDisplaySubcollections((prevState) => !prevState);
  };
  const addToNewSubcollectionButton = (
    <>
      <Button startIcon={<CreateNewFolderIcon />} variant="contained" color="secondary" onClick={handleOpenAddDialog}>
        {isLists ? `New ${capitalize(singularize(name))}` : "New Subcollection"}
      </Button>
      <AddItemToSubcollectionDialog
        title={isLists ? `Add new ${itemName} to ${subcollectionName}` : `Add ${itemName} To New Subcollection`}
        user={user}
        open={addDialog}
        close={handleCloseAddDialog}
        submit={displayStatus ? addListItemToSubcollection : addItemToNewSubcollection}
        scoreType={scoreType}
        collectionName={name}
        maxLength={maxLength}
      />
    </>
  );
  const addItemButton = (
    <>
      <Button startIcon={<CreateNewFolderIcon />} variant="contained" color="secondary" onClick={handleOpenAddDialog}>
        {`New ${itemName}`}
      </Button>
      <AddItemDialog
        title={`Add New ${itemName}`}
        user={user}
        scoreType={scoreType}
        open={addDialog}
        close={handleCloseAddDialog}
        submit={isLists ? addListItem : addItem}
        displayStatus={displayStatus}
        collectionName={name}
        maxLength={maxLength}
      />
    </>
  );
  const DisplayAddItemButton = displaySubcollections || displayStatus ? addToNewSubcollectionButton : addItemButton;
  return (
    <div className="Collection">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
          <BackButton />
          <Typography variant="h3" align="center" sx={{ ml: 2 }}>
            {name}
          </Typography>
        </Box>
        <Container
          maxWidth="md"
          sx={{
            "& > *": { mr: "15px !important" },
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            rowGap: 2,
          }}
        >
          {!friendView && DisplayAddItemButton}
          {!isLists && ToggleSubcollectionsButton(displaySubcollections, toggleDisplaySubcollections)}
          <Box sx={{ display: "flex", "& > *": { columnGap: "15px" } }}>
            {isLists && !displayStatus && <SortType list={ratingSortList} handleSortBy={handleSortBy} />}
            <SortOrder handleOrderBy={handleOrderBy} value={sortOrder} />
          </Box>
          {/* // {!isLists && (
          //   <SortType
          //     list={isLists ? ratingSortList : sortList}
          //     handleSortBy={isLists ? handleSortBy : handleOrderBy}
          //   />
          // )} */}
        </Container>
        {displaySubcollections || displayStatus ? (
          <SubcollectionsList
            groupingName={groupingName}
            groupingType={groupingType}
            itemName={itemName}
            scoreType={scoreType}
            uid={uid}
            sortOrder={sortOrder}
            collectionId={id}
            AddItemDialog={AddItemDialog}
            EditItemDialog={EditItemDialog}
            CardList={CardList}
            addListItemToSubcollection={addListItemToSubcollection}
            collectionName={name}
            friendView={friendView}
          />
        ) : (
          <ItemsList
            groupingName={groupingName}
            groupingType={groupingType}
            itemName={itemName}
            scoreType={scoreType}
            uid={uid}
            sortType={sortType}
            sortOrder={sortOrder}
            collectionId={id}
            EditItemDialog={EditItemDialog}
            CardList={CardList}
            addListItemToSubcollection={addListItemToSubcollection}
            collectionName={name}
            friendView={friendView}
          />
        )}
      </Container>
    </div>
  );
};

DisplayCollection.defaultProps = {
  groupingName: "Bookmarks",
  groupingType: "bookmarks",
};

export default DisplayCollection;
function ToggleSubcollectionsButton(displaySubcollections, toggleDisplaySubcollections) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.23)",
        backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
        borderRadius: "5px",
        "&:hover": {
          borderColor: "inherit",
        },
      }}
    >
      <InputLabel sx={{ pl: 1, color: "inherit" }}>Subcollections</InputLabel>
      <Switch color="secondary" checked={displaySubcollections} onChange={toggleDisplaySubcollections} />
    </Box>
  );
}
