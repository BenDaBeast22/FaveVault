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
  InputAdornment,
  Badge,
  Stack,
} from "@mui/material";
import { query, where, collection, getDocs, limit, deleteDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, auth } from "../Config/firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link as ReactRouterLink } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import PendingIcon from "@mui/icons-material/Pending";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Friends = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendsLoaded, setFriendsLoaded] = useState(false);
  const [filterFriends, setFilterFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [snackbar, setSnackbar] = useState("");
  const [timer, setTimer] = useState(null);
  const [authUser] = useAuthState(auth);
  const uid = authUser.uid;

  const handleCloseSnackbar = () => {
    setSnackbar("");
  };
  const querySuggestions = async (email) => {
    const q = query(
      collection(db, "users"),
      where("email", ">=", email),
      where("email", "<=", email + "\uf8ff"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    let suggestions = [];
    querySnapshot.forEach((snapshot) => {
      const suggestion = snapshot.data();
      // Don't push friends and yourself to suggestions
      if (!friends.some((friend) => friend.email === suggestion.email) && suggestion.email !== user.email) {
        suggestions.push(suggestion);
      }
    });
    setSuggestions(suggestions);
  };
  const handleUpdateEmail = async (event) => {
    const email = event.target.value;
    setEmail(email);
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (email === "") setFilterFriends(friends);
      else setFilterFriends(friends.filter((friend) => friend.email.includes(email)));
      querySuggestions(email);
    }, 500);
    setTimer(newTimer);
  };
  const sendFriendRequest = async (suggestion) => {
    await setDoc(doc(db, "requests", uid, "Outgoing", suggestion.email), suggestion);
    await setDoc(doc(db, "requests", suggestion.uid, "Incoming", user.email), user);
    setSnackbar(`Sent friend request to ${suggestion.email}`);
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
  };
  useEffect(() => {
    //Get user
    const unsubArr = [];
    const userRef = doc(db, "users", uid);
    const unsubUser = onSnapshot(userRef, (snapshot) => {
      const user = snapshot.data();
      setUser(user);
    });
    unsubArr.push(unsubUser);
    // Get friend requests
    const requestsRef = collection(db, "requests", uid, "Incoming");
    const unsubRequests = onSnapshot(requestsRef, (snapshot) => {
      const incomingRequests = [];
      snapshot.forEach((doc) => {
        incomingRequests.push(doc.data());
      });
      setIncomingRequests(incomingRequests);
    });
    unsubArr.push(unsubRequests);
    // Get pending requests
    const pendingRef = collection(db, "requests", uid, "Outgoing");
    const unsubPending = onSnapshot(pendingRef, (snapshot) => {
      const pendingRequests = [];
      snapshot.forEach((doc) => {
        pendingRequests.push(doc.data());
      });
      setPendingRequests(pendingRequests);
    });
    unsubArr.push(unsubPending);
    // Get friends
    const friendsRef = collection(db, "friends", uid, "friends");
    const unsubFriends = onSnapshot(friendsRef, (snapshot) => {
      const friends = [];
      snapshot.forEach((doc) => {
        friends.push(doc.data());
      });
      setFriends(friends);
      setFilterFriends(friends);
    });
    unsubArr.push(unsubFriends);
    return () => unsubArr.forEach((unsub) => unsub());
  }, []);

  useEffect(() => {
    if (friends.length !== 0) {
      querySuggestions("");
    }
  }, [friends]);

  return (
    <Container maxWidth="xl">
      <Container
        maxWidth="sm"
        sx={{ backgroundColor: "background.secondary.main", borderRadius: "15px", py: 2, mt: 5 }}
      >
        <Typography align="center" variant="h4" component="h2" sx={{ pb: 2 }}>
          Friends
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              placeholder: "Enter Email",
            }}
            autoFocus
            onChange={handleUpdateEmail}
            sx={{ width: 350 }}
          />
        </Box>
        {/* <Badge badgeContent={1000} color="primary" sx={{ display: "inline" }} / */}
        <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
          <Typography component="p" variant="subtitle1" sx={{ my: 2, ml: 1, fontSize: "18px" }}>
            Friends
          </Typography>
          {Count(filterFriends.length)}
        </Box>
        {filterFriends.map((friend) => (
          <Box
            key={friend.email}
            sx={{
              display: "flex",
              alignItems: "center",
              "& > *": { mx: "8px !important", mb: 2 },
            }}
          >
            <Avatar alt="profile-pic" src={friend.profilePic} sx={{ width: 45, height: 45 }} />
            <Typography>{friend.email}</Typography>
            <Button variant="outlined" startIcon={<VisibilityIcon />} component={ReactRouterLink} to={`${friend.uid}`}>
              View
            </Button>
          </Box>
        ))}
        <Box sx={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
          <Typography component="p" variant="subtitle1" sx={{ my: 2, ml: 1, fontSize: "18px" }}>
            Suggestions
          </Typography>
          {Count(suggestions.length)}
        </Box>

        {suggestions.map((suggestion) => (
          <Box
            key={suggestion.email}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              "& > *": { mx: "8px !important" },
            }}
          >
            <Avatar alt="profile-pic" src={suggestion.profilePic} sx={{ width: 45, height: 45 }} />
            <Typography>{suggestion.email}</Typography>
            {pendingRequests.some((pending) => pending.email === suggestion.email) ? (
              <Button variant="outlined" color="warning" startIcon={<PendingIcon />}>
                Pending
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="success"
                onClick={() => sendFriendRequest(suggestion)}
                startIcon={<PersonAddIcon />}
              >
                Add
              </Button>
            )}
          </Box>
        ))}
        {/* <Box component="form" onSubmit={handleAddFriend} sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "center", "& > *": { mx: "5px !important" } }}>
            <TextField label="Email" value={email} size="small" />
            <Button type="submit" variant="contained" sx={{ minWidth: "80px" }}>
              Submit
            </Button>
          </Box>
        </Box> */}

        {/* <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
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
        </Box> */}
      </Container>
      {incomingRequests.length !== 0 && (
        <Container
          maxWidth="sm"
          sx={{ backgroundColor: "background.secondary.main", borderRadius: "15px", py: 2, mt: 5 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
            <Typography align="center" variant="h5" component="h2">
              Friend Requests
            </Typography>
            {Count(incomingRequests.length)}
          </Box>
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
      )}
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

  function Count(count) {
    return (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: 20,
          width: 20,
          backgroundColor: "#7f8182",
          borderRadius: "15%",
          ml: 1,
          px: "3px",
          textAlign: "center",
          textShadow: "1px 1px 2px rgba(0,0,0, 0.5)",
        }}
      >
        {count}
      </Box>
    );
  }
};

export default Friends;
