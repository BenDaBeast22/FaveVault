import { Container, Button, Typography, Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, query, doc, orderBy, addDoc, onSnapshot, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../Config/firebase";
import CollectionList from "../DisplayList/CollectionList";
import AddCollectionDialog from "../Dialogs/AddCollectionDialog";
import EditCollectionDialog from "../Dialogs/EditCollectionDialog";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { singularize } from "../helpers";
import { useParams } from "react-router-dom";
import SortType from "../Components/SortType";
import { maxLength } from "../Config/config";

const sortList = [
  { name: "Ascending", value: "asc" },
  { name: "Descending", value: "desc" },
];

const DisplayCollections = ({ groupingName, groupingType, AddCollectionDialog, EditCollectionDialog }) => {
  const { friendUid } = useParams();
  const [user] = useAuthState(auth);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("asc");
  const [addDialog, setAddDialog] = useState(false);
  const friendView = friendUid && true;
  const uid = friendUid ? friendUid : user.uid;
  const collectionsRef = collection(db, "data", uid, groupingName);
  const collectionName = groupingName === "Bookmarks" ? `${groupingName} List` : singularize(groupingName);
  const addCollection = async (newCollection) => {
    await addDoc(collection(db, "data", uid, groupingName), newCollection);
  };
  const editCollection = async (editedCollection, id) => {
    await updateDoc(doc(collectionsRef, id), editedCollection);
  };
  const handleDelete = async (collectionId) => {
    const snapshot = await getDocs(collection(collectionsRef, collectionId, "subcollections"));
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        const subcollection = { ...doc.data, id: doc.id };
        deleteSubcollection(collectionId, subcollection.id);
      });
    }
    await deleteDoc(doc(db, "data", uid, groupingName, collectionId));
  };
  const deleteSubcollection = async (collectionId, subcollectionId) => {
    const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
    const snapshot = await getDocs(collection(subcollectionsRef, subcollectionId, groupingType));
    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        const item = { ...doc.data, id: doc.id };
        deleteItem(collectionId, subcollectionId, item.id);
      });
    }
  };
  const deleteItem = async (collectionId, subcollectionId, itemId) => {
    const subcollectionsRef = collection(collectionsRef, collectionId, "subcollections");
    await deleteDoc(doc(subcollectionsRef, subcollectionId, groupingType, itemId));
    await deleteDoc(doc(collectionsRef, collectionId, groupingType, itemId));
    // delete subcollection if there are no items within it
    const snapshot = await getDocs(collection(subcollectionsRef, subcollectionId, groupingType));
    if (snapshot.empty) {
      await deleteDoc(doc(subcollectionsRef, subcollectionId));
    }
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
  useEffect(() => {
    const collectionsRef = collection(db, "data", uid, groupingName);
    const q = query(collectionsRef, orderBy("name", sortBy));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collectionsArr = [];
      querySnapshot.forEach((doc) => {
        collectionsArr.push({ ...doc.data(), id: doc.id });
      });
      setCollections(collectionsArr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortBy]);
  return (
    <div className={groupingType}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Container
          maxWidth="xs"
          sx={{
            "& > *": { mx: "10px !important" },
            mb: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!friendView ? (
            <>
              <Button
                startIcon={<CreateNewFolderIcon />}
                variant="contained"
                color="secondary"
                onClick={handleOpenAddDialog}
              >
                {`New ${collectionName}`}
              </Button>
              <AddCollectionDialog
                collectionName={collectionName}
                collection={{ name: "", img: "" }}
                user={user}
                open={addDialog}
                close={handleCloseAddDialog}
                submit={addCollection}
                maxLength={maxLength}
              />
            </>
          ) : (
            <></>
          )}
          <SortType list={sortList} handleSortBy={handleSortBy} />
        </Container>
        {!loading && (
          <CollectionList
            list={collections}
            editCard={editCollection}
            EditCardDialog={EditCollectionDialog}
            handleDelete={handleDelete}
            collectionName={collectionName}
            friendView={friendView}
          ></CollectionList>
        )}
      </Container>
    </div>
  );
};

DisplayCollections.defaultProps = {
  groupingName: "collections",
  groupingType: "bookmarks",
  AddCollectionDialog: AddCollectionDialog,
  EditCollectionDialog: EditCollectionDialog,
};

export default DisplayCollections;
