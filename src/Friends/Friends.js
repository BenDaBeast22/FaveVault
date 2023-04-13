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
  Stack,
} from "@mui/material";
import { query, where, collection, getDocs, limit, deleteDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState, useRef } from "react";
import { db, auth } from "../Config/firebase";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link as ReactRouterLink } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MailIcon from "@mui/icons-material/Mail";
import DeleteFriendDialog from "./Dialogs/DeleteFriendDialog";

const Friends = () => {
  const [user, setUser] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(null);
  const [friends, setFriends] = useState(null);
  const [filterFriends, setFilterFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const [deleteFriend, setDeleteFriend] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const friendsAndUserLoaded = useRef(false);
  const [authUser] = useAuthState(auth);
  const uid = authUser.uid;

  const handleCloseSnackbar = () => {
    setSnackbar(null);
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
      if (friends.length === 0 && suggestion.email !== user.email) {
        suggestions.push(suggestion);
      } else if (!friends.some((friend) => friend.email === suggestion.email) && suggestion.email !== user.email) {
        suggestions.push(suggestion);
      }
    });
    setSuggestions(suggestions);
  };
  const handleUpdateEmail = async (event) => {
    const email = event.target.value;
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (email === "") setFilterFriends(friends);
      else setFilterFriends(friends.filter((friend) => friend.email.includes(email)));
      querySuggestions(email);
    }, 500);
    setTimer(newTimer);
  };
  const sendFriendRequest = async (suggestion) => {
    await setDoc(doc(db, "requests", suggestion.uid, "Incoming", user.email), user);
    await setDoc(doc(db, "requests", uid, "Outgoing", suggestion.email), suggestion);
    setSnackbar({ message: `Sent friend request to ${suggestion.email}`, color: "success" });
  };
  const cancelFriendRequest = async (suggestion) => {
    await deleteDoc(doc(db, "requests", uid, "Outgoing", suggestion.email));
    await deleteDoc(doc(db, "requests", suggestion.uid, "Incoming", user.email));
    setSnackbar({ message: `Cancelled friend request to ${suggestion.email}`, color: "success" });
  };
  const acceptFriendRequest = async (friend) => {
    await setDoc(doc(db, "friends", uid, "friends", friend.email), friend);
    await deleteDoc(doc(db, "requests", uid, "Incoming", friend.email));
    setSnackbar({ message: `Added ${friend.email} as friend`, color: "success" });
  };
  const friendRequestAccepted = async (friend) => {
    await deleteDoc(doc(db, "requests", uid, "Outgoing", friend.email));
    await setDoc(doc(db, "friends", uid, "friends", friend.email), friend);
    setSnackbar({ message: `${friend.email} accepted your friend request`, color: "info" });
  };
  const rejectFriendRequest = async (stranger) => {
    await deleteDoc(doc(db, "requests", uid, "Incoming", stranger.email));
    setSnackbar({ message: `Rejected friend request from ${stranger.email}`, color: "success" });
  };
  const friendRequestRejected = async (stranger) => {
    await deleteDoc(doc(db, "requests", uid, "Outgoing", stranger.email));
    setSnackbar({ message: `${stranger.email} rejected your friend request`, color: "info" });
  };
  const handleUnfriend = (friend) => {
    setDeleteFriend(friend);
    setDeleteOpen(true);
  };
  const wereUnfriended = async (friend) => {
    await deleteDoc(doc(db, "friends", uid, "friends", friend.email));
    setSnackbar({ message: `Unfriended by ${friend.email}`, color: "info" });
  };
  const unfriend = async (friend) => {
    await deleteDoc(doc(db, "friends", uid, "friends", friend.email));
    setSnackbar({ message: `Unfriended ${friend.email}`, color: "success" });
    setDeleteOpen(false);
  };
  // Getting state
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
      if (incomingRequests.length > 0) setSnackbar({ message: "Received friend requests", color: "success" });
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
        const friend = doc.data();
        friends.push(friend);
      });
      setFriends(friends);
      setFilterFriends(friends);
    });
    unsubArr.push(unsubFriends);
    return () => unsubArr.forEach((unsub) => unsub());
  }, []);
  // For dealing with when friend accepts/rejects your request
  useEffect(() => {
    if (!pendingRequests) return;
    const unsubArr = [];
    pendingRequests.forEach((request) => {
      // Event listener for when incoming request is dealt with by friend
      const incomingRef = collection(db, "requests", request.uid, "Incoming");
      const iq = query(incomingRef, where("uid", "==", uid), limit(1));
      const unsubIncoming = onSnapshot(iq, (querySnapshot) => {
        if (!querySnapshot.empty) return;
        // if outgoing request is accepted add friend otherwise if rejected delete the request
        const friendsRef = collection(db, "friends", request.uid, "friends");
        const fq = query(friendsRef, where("uid", "==", uid), limit(1));
        getDocs(fq).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            friendRequestAccepted(request);
          } else {
            friendRequestRejected(request);
          }
        });
      });
      unsubArr.push(unsubIncoming);
    });
    return () => unsubArr.forEach((unsub) => unsub());
  }, [pendingRequests]);
  // For removing friend when they remove you
  useEffect(() => {
    if (!friends) return;
    function unsubAll(unsubArr) {
      unsubArr.forEach((unsub) => unsub());
    }
    let unsubArr = [];
    friends.forEach((friend) => {
      unsubAll(unsubArr);
      unsubArr = [];
      // Add event listener to friends outgoing requests to ensure they accepted your request
      const outgoingRef = collection(db, "requests", friend.uid, "Outgoing");
      const oq = query(outgoingRef, where("uid", "==", uid), limit(1));
      const unsub = onSnapshot(oq, (querySnapshot) => {
        if (!querySnapshot.empty) return;
        // Add event listener to check if friend removed you if so remove them
        const unfriendRef = collection(db, "friends", friend.uid, "friends");
        const uq = query(unfriendRef, where("uid", "==", uid), limit(1));
        const unsub = onSnapshot(uq, (querySnapshot) => {
          if (querySnapshot.empty) {
            wereUnfriended(friend);
          }
        });
        unsubArr.push(unsub);
      });
      unsubArr.push(unsub);
    });
    return () => unsubArr.forEach((unsub) => unsub());
  }, [friends]);
  // Populating suggestions onload to add to friends
  useEffect(() => {
    if (!user || !friends) return;
    // query default suggestions that are not in your friends
    if (!friendsAndUserLoaded.current) {
      querySuggestions("");
      friendsAndUserLoaded.current = true;
    }
    // When new friend is added you can no longer send them friend requests
    setSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => !suggestionInFriends(suggestion.email)));
  }, [friends, user]);

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
              justifyContent: "left",
              flexWrap: "wrap",
              "& > *": { mx: "8px !important" },
              mb: 2,
              rowGap: 2,
            }}
          >
            <Avatar alt="profile-pic" src={friend.profilePic} sx={{ width: 45, height: 45 }} />
            <Typography>{friend.email}</Typography>
            <Box sx={{ "& > *": { mr: "8px !important" } }}>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                component={ReactRouterLink}
                to={`${friend.uid}`}
              >
                View
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<PersonRemoveIcon />}
                onClick={() => handleUnfriend(friend)}
              >
                Remove
              </Button>
            </Box>
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
              flexWrap: "wrap",
              "& > *": { mx: "8px !important" },
              mb: 2,
              rowGap: 2,
            }}
          >
            <Avatar alt="profile-pic" src={suggestion.profilePic} sx={{ width: 45, height: 45 }} />
            <Typography>{suggestion.email}</Typography>
            {alreadySentRequest(suggestion.email) ? (
              <Button
                onClick={() => cancelFriendRequest(suggestion)}
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
              >
                Cancel
              </Button>
            ) : alreadyRecievedRequest(suggestion.email) ? (
              <Button variant="outlined" startIcon={<MailIcon />}>
                Recieved
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
      {snackbar && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center", width: "100%" }}
          open={Boolean(snackbar)}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert variant="filled" severity={snackbar.color} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
      <DeleteFriendDialog
        open={deleteOpen}
        close={() => setDeleteOpen(false)}
        friend={deleteFriend}
        handleDelete={unfriend}
      />
    </Container>
  );

  function suggestionInFriends(suggestionEmail) {
    return friends.some((friend) => friend.email === suggestionEmail);
  }
  function alreadySentRequest(suggestionEmail) {
    return pendingRequests.some((pending) => pending.email === suggestionEmail);
  }
  function alreadyRecievedRequest(suggestionEmail) {
    return incomingRequests.some((incoming) => incoming.email === suggestionEmail);
  }

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
