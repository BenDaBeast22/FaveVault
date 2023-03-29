import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { query, where, collection, getDocs, limit, deleteDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, auth } from "../Config/firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link as ReactRouterLink } from "react-router-dom";

const Friends = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [addFriend, setAddFriend] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [snackbar, setSnackbar] = useState("");
  const [authUser] = useAuthState(auth);
  const uid = authUser.uid;

  const handleCloseSnackbar = () => {
    setSnackbar("");
  };
  const handleAddFriend = async (event) => {
    event.preventDefault();
    const q = query(collection(db, "users"), where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return;
    const friend = querySnapshot.docs[0].data();
    if (friend.email === user.email) {
      setSnackbar({ message: "Cant add yourself as friend", severity: "success" });
    }
    setAddFriend(friend);
  };
  const sendFriendRequest = async (event) => {
    event.preventDefault();
    // Store request in user outgoing
    await setDoc(doc(db, "requests", uid, "Outgoing", addFriend.email), addFriend);
    // Store request in friend incoming
    await setDoc(doc(db, "requests", addFriend.uid, "Incoming", user.email), user);
    setSnackbar(`Sent friend request to ${addFriend.email}`);
  };
  const deleteFriendRequest = async (person) => {
    await deleteDoc(doc(db, "requests", uid, "Incoming", person.email));
    await deleteDoc(doc(db, "requests", person.uid, "Outgoing", user.email));
  };
  const rejectFriendRequest = async (stranger) => {
    await deleteFriendRequest(stranger);
    setSnackbar(`Rejected friend request from ${stranger.email}`);
  };
  const acceptFriendRequest = async (friend) => {
    await deleteFriendRequest(friend);
    await setDoc(doc(db, "friends", uid, "friends", friend.email), friend);
    await setDoc(doc(db, "friends", friend.uid, "friends", user.email), user);
    setAddFriend(null);
  };
  useEffect(() => {
    const unsubArr = [];
    const userRef = doc(db, "users", uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      const user = snapshot.data();
      setUser(user);
    });
    unsubArr.push(unsubUser);

    const requestsRef = collection(db, "requests", uid, "Incoming");
    const unsubRequests = onSnapshot(requestsRef, (snapshot) => {
      const incomingRequests = [];
      snapshot.forEach((doc) => {
        incomingRequests.push(doc.data());
      });
      setIncomingRequests(incomingRequests);
    });
    unsubArr.push(unsubRequests);

    const friendsRef = collection(db, "friends", uid, "friends");
    const unsubFriends = onSnapshot(friendsRef, (snapshot) => {
      const friends = [];
      snapshot.forEach((doc) => {
        friends.push(doc.data());
      });
      setFriends(friends);
    });
    unsubArr.push(unsubFriends);

    return () => unsubArr.forEach((unsub) => unsub());
  }, []);

  return (
    <Container maxWidth="xl">
      <Container
        maxWidth="sm"
        sx={{ backgroundColor: "background.secondary.main", borderRadius: "15px", py: 2, mt: 5 }}
      >
        <Typography align="center" variant="h5" component="h2" sx={{ pb: 2 }}>
          Add Friend
        </Typography>
        <Box component="form" onSubmit={handleAddFriend} sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "center", "& > *": { mx: "5px !important" } }}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} size="small" />
            <Button type="submit" variant="contained" sx={{ minWidth: "80px" }}>
              Submit
            </Button>
          </Box>
        </Box>
        {addFriend && (
          <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
            <Typography margin="normal" variant="h6" component="h4" align="center" sx={{ mb: 2 }}>
              Send Friend Request
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "& > *": { mx: "8px !important" },
              }}
              component="form"
              onSubmit={sendFriendRequest}
            >
              <Avatar alt="profile-pic" src={addFriend.profilePic} sx={{ width: 45, height: 45 }} />
              <Typography>{addFriend.email}</Typography>
              <Button type="submit" variant="outlined">
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Container>
      <Container
        maxWidth="sm"
        sx={{ backgroundColor: "background.secondary.main", borderRadius: "15px", py: 2, mt: 5 }}
      >
        <Typography align="center" variant="h5" component="h2">
          Friend Requests
        </Typography>
        {incomingRequests.map((stranger) => (
          <Box
            key={stranger.email}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "& > *": { mx: "8px !important" },
            }}
          >
            <Avatar alt="profile-pic" src={stranger.profilePic} sx={{ width: 45, height: 45 }} />
            <Typography>{stranger.email}</Typography>
            <Tooltip title="accept">
              <IconButton sx={{ p: 0.2 }} onClick={() => acceptFriendRequest(stranger)}>
                <CheckCircleIcon color="success" />
              </IconButton>
            </Tooltip>
            <Tooltip title="reject">
              <IconButton sx={{ p: 0.2 }} onClick={() => rejectFriendRequest(stranger)}>
                <CancelIcon color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Container>
      <Container
        maxWidth="sm"
        sx={{ backgroundColor: "background.secondary.main", borderRadius: "15px", py: 2, mt: 5 }}
      >
        <Typography align="center" variant="h5" component="h2">
          Friends
        </Typography>
        {friends.map((friend) => (
          <Box
            key={friend.email}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              "& > *": { mx: "8px !important" },
            }}
          >
            <Avatar alt="profile-pic" src={friend.profilePic} sx={{ width: 45, height: 45 }} />
            <Typography>{friend.email}</Typography>
            <Button variant="outlined" component={ReactRouterLink} to={`${friend.uid}`}>
              View
            </Button>
          </Box>
        ))}
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center", width: "100%" }}
        open={Boolean(snackbar)}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Friends;
