import { AppBar, Button, Toolbar, IconButton, Typography, CssBaseline } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const Navbar = () => {
  return (
    <CssBaseline>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" component="h4" sx={{ flexGrow: 1 }}>
            BookMarkz
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </CssBaseline>
  );
};

export default Navbar;
