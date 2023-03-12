import { useState } from "react";
import {
  AppBar,
  Button,
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
  Container,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { logout } from "./firebase";

const pages = ["Bookmarks", "Rankings", "Backlog"];
const settings = [
  { name: "Profile", icon: <AccountCircleIcon /> },
  { name: "User Settings", icon: <SettingsIcon /> },
  { name: "Logout", icon: <LogoutIcon />, onClick: logout },
];

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
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
        <Typography
          variant="h5"
          component="a"
          href="/"
          sx={{ display: { xs: "none", md: "flex" }, mr: 5, textDecoration: "none", color: "inherit" }}
        >
          FaveVault
        </Typography>
        <Typography
          variant="h4"
          component="a"
          href="/"
          textDecoration="none"
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: { xs: "flex", md: "none" },
            textDecoration: "none",
            color: "inherit",
          }}
        >
          FaveVault
        </Typography>
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
                    backgroundColor: "#9e38d1",
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
                display: "block",
                textDecoration: "none",
                "&.active": {
                  backgroundColor: "#9e38d1",
                },
              }}
              key={page}
            >
              {page}
            </Link>
          ))}
        </Box>
        <Box>
          <Tooltip title="Open settings">
            <IconButton aria-label="settings" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="profile-pic" src="/images/drake.jpeg" sx={{ width: 45, height: 45 }} />
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
                <Stack direction="row" spacing={1} onClick={setting.onClick}>
                  {setting.icon}
                  <Typography>{setting.name}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
