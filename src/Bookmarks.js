import {
  CardMedia,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Stack } from "@mui/system";
import FormDialog from "./FormDialog";
import React, { useEffect, useState } from "react";
import { collection, query, doc, getDocs, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "./firebase";

const bookmarks = [
  { id: 1, img: "drake.jpeg" },
  { id: 2, img: "melt.png" },
  { id: 3, img: "drake.jpeg" },
  { id: 4, img: "melt.png" },
  { id: 5, img: "drake.jpeg" },
  { id: 6, img: "drake.jpeg" },
  { id: 7, img: "melt.png" },
];
const Bookmarks = () => {
  const [user] = useAuthState(auth);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("asc");
  const submitCollection = (newCollection) => {
    setCollections([...collections, newCollection]);
  };
  const handleSortBy = (event) => {
    setSortBy(event.target.value);
  };
  useEffect(() => {
    const getData = async () => {
      const uid = user.uid;
      const collectionsRef = collection(db, "data", uid, "collections");
      const q = query(collectionsRef, orderBy("name", sortBy));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map((doc) => doc.data());
      setCollections(docs);
      setLoading(false);
    };
    getData();
  }, [sortBy]);
  return (
    <div className="Bookmarks">
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Container maxWidth="xs" sx={{ pb: 4, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <FormDialog submitCollection={submitCollection} />
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
            {collections.map((collection, index) => (
              <Grid item xs={4} sm={3} md={2} key={index}>
                <Card sx={{ height: "150px", display: "flex" }}>
                  <CardMedia component="img" image={collection.img} alt={collection.img} />
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
