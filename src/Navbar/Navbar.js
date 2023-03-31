import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Stack,
  Link,
  Badge,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import { logout } from "../Config/firebase";
import { Link as RouterLink } from "react-router-dom";
import { db, auth } from "../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot } from "firebase/firestore";

const pages = ["Bookmarks", "Gallery", "Lists"];
const settings = [
  { name: "profile", icon: <AccountCircleIcon /> },
  { name: "friends", icon: <PeopleIcon /> },
  { name: "logout", icon: <LogoutIcon />, onClick: logout },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [numFriendRequests, setNumFriendRequests] = useState(0);
  const [user] = useAuthState(auth);
  const uid = user.uid;
  const handleOpenNav = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseNav = () => {
    setAnchorEl(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  useEffect(() => {
    setProfilePic(user.photoURL);
    setUsername(user.displayName);
    // Get friend requests
    const requestsRef = collection(db, "requests", uid, "Incoming");
    const unsubRequests = onSnapshot(requestsRef, (snapshot) => {
      let numFriendRequests = 0;
      snapshot.forEach((doc) => {
        numFriendRequests++;
      });
      setNumFriendRequests(numFriendRequests);
    });
    return () => unsubRequests();
  }, []);
  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={handleOpenNav}
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Link
          variant="h5"
          component={RouterLink}
          to="/bookmarks"
          sx={{ display: { xs: "none", md: "flex" }, mr: 5, textDecoration: "none", color: "inherit" }}
        >
          FaveVault
        </Link>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Link component={RouterLink} variant="h4" to="/bookmarks" underline="none" color="inherit">
            FaveVault
          </Link>
        </Box>

        <Menu
          id="nav-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNav}
          MenuListProps={{ sx: { py: 0 } }}
          sx={{ display: { xs: "block", md: "none" } }}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          keepMounted
        >
          {pages.map((page) => (
            <MenuItem key={page} onClick={handleCloseNav} sx={{ p: 0 }}>
              <Link
                component={NavLink}
                to={page.toLowerCase()}
                sx={{
                  width: "100%",
                  p: 2,
                  textDecoration: "none",
                  color: "inherit",
                  "&.active": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                {page}
              </Link>
            </MenuItem>
          ))}
        </Menu>
        <Box sx={{ height: "100%", display: { xs: "none", md: "flex" }, flexGrow: 1 }}>
          {pages.map((page) => (
            <Link
              component={NavLink}
              to={page.toLowerCase()}
              sx={{
                py: 2.5,
                px: 2,
                color: "white",
                display: "flex",
                justifyContent: "center",
                textDecoration: "none",
                "&.active": {
                  backgroundColor: "secondary.main",
                },
                minWidth: 80,
              }}
              key={page}
            >
              {page}
            </Link>
          ))}
        </Box>
        <Typography sx={{ display: { sm: "block", xs: "none" } }}>{username}</Typography>
        <Box sx={{ ml: 2 }}>
          <Tooltip title="Open settings">
            <IconButton aria-label="settings" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Badge badgeContent={numFriendRequests} overlap="circular" color="notification">
                <Avatar alt="profile-pic" src={profilePic} sx={{ width: 45, height: 45 }} />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            id="settings-menu"
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            MenuListProps={{ sx: { py: 0 } }}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            keepMounted
          >
            {settings.map((setting) => (
              <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                <Link
                  component={RouterLink}
                  to={setting.name !== "logout" ? `${setting.name}` : null}
                  color="inherit"
                  underline="none"
                >
                  <Stack direction="row" spacing={1} onClick={setting.onClick}>
                    {setting.icon}
                    <Typography sx={{ textTransform: "capitalize" }}>{setting.name}</Typography>
                  </Stack>
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
