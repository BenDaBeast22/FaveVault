import React, { useState, useEffect } from "react";
import { db } from "../Config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Outlet, useParams } from "react-router-dom";
import { Avatar, Typography, Container, Button, ButtonGroup, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import BackButton from "../Components/BackButton";

const pages = ["Bookmarks", "Gallery", "Lists"];

const Friend = () => {
  const { friendUid } = useParams();
  const [friend, setFriend] = useState({});
  const friendRef = doc(db, "users", friendUid);
  useEffect(() => {
    const unsubFriend = onSnapshot(friendRef, (snapshot) => {
      const friend = snapshot.data();
      setFriend(friend);
    });
    return () => unsubFriend();
  }, []);
  return (
    <>
      <Container
        maxWidth="xs"
        sx={{
          "& > *": { mx: "10px !important" },
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Typography variant="h4" component="h2">
          {friend.username}
        </Typography> */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <BackButton />
          <Typography variant="h4" component="h2" align="center" sx={{ ml: 2 }}>
            {friend.username}
          </Typography>
        </Box>
        <Avatar src={friend.profilePic} alt={`${friend.username} profile pic`} />
      </Container>
      <Container
        sx={{
          mt: 3,
          mb: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonGroup variant="outlined" color="secondary">
          {pages.map((page) => (
            <Button
              key={page}
              component={NavLink}
              to={page.toLowerCase()}
              sx={{
                p: 2,
                textDecoration: "none",
                color: "inherit",
                "&.active": {
                  backgroundColor: "secondary.main",
                },
              }}
            >
              {page}
            </Button>
          ))}
        </ButtonGroup>
      </Container>
      <Outlet />
    </>
  );
};

export default Friend;
