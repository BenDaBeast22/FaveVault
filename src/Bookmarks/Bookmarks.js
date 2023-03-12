import {
  CardMedia,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { collection, query, doc, orderBy, setDoc, addDoc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import AddNewCollection from "./Actions/AddNewCollection";
import EditCollection from "./Actions/EditCollection";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const Bookmarks = () => {
  const [user] = useAuthState(auth);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("asc");
  const uid = user.uid;
  const submitCollection = async (newCollection) => {
    await addDoc(collection(db, "data", uid, "collections"), newCollection);
  };
  const editCollection = async (editedCollection, id) => {
    await updateDoc(doc(db, "data", uid, "collections", id), editedCollection);
  };
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "data", uid, "collections", id));
  };
  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };
  useEffect(() => {
    const collectionsRef = collection(db, "data", uid, "collections");
    const q = query(collectionsRef, orderBy("name", sortBy));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const collectionsArr = [];
      querySnapshot.forEach((doc) => {
        collectionsArr.push({ ...doc.data(), id: doc.id });
      });
      console.log(collectionsArr);
      setCollections(collectionsArr);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [sortBy]);
  return (
    <div className="Bookmarks">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Container maxWidth="xs" sx={{ pb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <AddNewCollection submitCollection={submitCollection} />
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
        </Container>
        {!loading && (
          <Grid container spacing={2}>
            {collections.map((collection) => (
              <Grid item xs={4} sm={3} md={2} key={collection.id}>
                <Card sx={{ height: "150px", display: "flex" }}>
                  <Link to={`${collection.id}/${collection.name}`}>
                    <CardMedia component="img" image={collection.img} alt={collection.img} />
                  </Link>
                </Card>
                <CardContent
                  sx={{
                    py: 1,
                    backgroundColor: "#121212",
                    "&:last-child": {
                      paddingBottom: 1,
                    },
                    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
                  }}
                >
                  <Typography align="center">{collection.name}</Typography>
                  <Box sx={{ my: 1, display: "flex", justifyContent: "space-evenly" }}>
                    <EditCollection collection={collection} editCollection={editCollection} />
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(collection.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default Bookmarks;
