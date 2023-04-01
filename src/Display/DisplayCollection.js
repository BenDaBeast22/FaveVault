import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Config/firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, setDoc, collection, getDocs, query, where, limit } from "firebase/firestore";
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Button, Switch } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SubcollectionsList from "./SubcollectionsList";
import ItemsList from "./ItemsList";
import { capitalize, singularize } from "../helpers";
import { Link as ReactRouterLink } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
  const [sortBy, setSortBy] = useState("asc");
  const friendView = friendUid && true;
  const uid = friendUid ? friendUid : user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, id, "subcollections");
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
    setSortBy(event.target.value);
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
        {displayStatus ? `New ${capitalize(singularize(name))}` : "New Subcollection"}
      </Button>
      <AddItemToSubcollectionDialog
        title={
          displayStatus
            ? `Add New ${capitalize(singularize(name))}`
            : `Add ${capitalize(singularize(name))} To New Subcollection`
        }
        user={user}
        open={addDialog}
        close={handleCloseAddDialog}
        submit={displayStatus ? addListItemToSubcollection : addItemToNewSubcollection}
        scoreType={scoreType}
        collectionName={name}
      />
    </>
  );
  const addItemButton = (
    <>
      <Button startIcon={<CreateNewFolderIcon />} variant="contained" color="secondary" onClick={handleOpenAddDialog}>
        New {capitalize(singularize(name))}
      </Button>
      <AddItemDialog
        title={`Add New ${capitalize(singularize(name))}`}
        user={user}
        scoreType={scoreType}
        open={addDialog}
        close={handleCloseAddDialog}
        submit={groupingName === "Lists" ? addListItem : addItem}
        displayStatus={displayStatus}
        collectionName={name}
      />
    </>
  );
  const DisplayAddItemButton = displaySubcollections || displayStatus ? addToNewSubcollectionButton : addItemButton;
  return (
    <div className="Collection">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          {name}
        </Typography>
        <Container
          maxWidth="md"
          sx={{
            "& > *": { mx: "10px !important" },
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!friendView && DisplayAddItemButton}
          {groupingName !== "Lists" && (
            <>
              <FormControl>
                <InputLabel>Sort By</InputLabel>
                <Select
                  sx={{
                    height: "38px",
                    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
                  }}
                  label="sort by"
                  defaultValue="asc"
                  onChange={handleSortBy}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
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
            </>
          )}
          <Button
            variant="contained"
            color="secondary"
            component={ReactRouterLink}
            to={".."}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Container>
        {displaySubcollections || displayStatus ? (
          <SubcollectionsList
            groupingName={groupingName}
            groupingType={groupingType}
            scoreType={scoreType}
            uid={uid}
            sortBy={sortBy}
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
            scoreType={scoreType}
            uid={uid}
            sortBy={sortBy}
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
