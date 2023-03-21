import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Config/firebase";
import { useParams } from "react-router-dom";
import { addDoc, doc, setDoc, collection } from "firebase/firestore";
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, Button, Switch } from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SubcollectionsList from "./SubcollectionsList";
import ItemsList from "./ItemsList";
import { capitalize, singularize } from "../helpers";

const DisplayCollection = ({
  groupingName,
  groupingType,
  AddItemDialog,
  AddItemToSubcollectionDialog,
  EditItemDialog,
  CardList,
}) => {
  const { id, name, subcollectionsEnabled } = useParams();
  const [user] = useAuthState(auth);
  const [displaySubcollections, setDisplaySubcollections] = useState(subcollectionsEnabled === "true");
  const [addDialog, setAddDialog] = useState(false);
  const [sortBy, setSortBy] = useState("asc");
  const uid = user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const subcollectionsRef = collection(collectionsRef, id, "subcollections");
  const addItemToSubcollection = async (newSubcollection) => {
    const docRef = await addDoc(subcollectionsRef, {
      name: newSubcollection.name,
    });
    const items = { ...newSubcollection[groupingType], scId: docRef.id };
    const ItemsRef = await addDoc(collection(docRef, groupingType), items);
    await setDoc(doc(collectionsRef, id, groupingType, ItemsRef.id), items);
  };
  const addItem = async (items, subcollectionId) => {
    await setDoc(doc(subcollectionsRef, subcollectionId), { name: "default" });
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
  return (
    <div className="Collection">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          {name}
        </Typography>
        <Container maxWidth="sm" sx={{ mb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {displaySubcollections ? (
            <>
              <Button
                startIcon={<CreateNewFolderIcon />}
                variant="contained"
                color="secondary"
                onClick={handleOpenAddDialog}
              >
                New Subcollection
              </Button>
              <AddItemToSubcollectionDialog
                title={`Add ${capitalize(singularize(groupingType))} to new Subcollection`}
                user={user}
                open={addDialog}
                close={handleCloseAddDialog}
                submit={addItemToSubcollection}
              />
            </>
          ) : (
            <>
              <Button
                startIcon={<CreateNewFolderIcon />}
                variant="contained"
                color="secondary"
                onClick={handleOpenAddDialog}
              >
                New {capitalize(singularize(groupingType))}
              </Button>
              <AddItemDialog
                title={`Add New ${capitalize(singularize(groupingType))}`}
                user={user}
                open={addDialog}
                close={handleCloseAddDialog}
                submit={addItem}
              />
            </>
          )}
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
        </Container>
        {displaySubcollections ? (
          <SubcollectionsList
            groupingName={groupingName}
            groupingType={groupingType}
            user={user}
            sortBy={sortBy}
            collectionId={id}
            AddItemDialog={AddItemDialog}
            EditItemDialog={EditItemDialog}
            CardList={CardList}
          />
        ) : (
          <ItemsList
            groupingName={groupingName}
            groupingType={groupingType}
            user={user}
            sortBy={sortBy}
            collectionId={id}
            EditItemDialog={EditItemDialog}
            CardList={CardList}
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
