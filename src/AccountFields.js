import React from "react";
import { Container, Typography, Button, TextField, Box, Avatar, Link, CssBaseline } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";

function CreateAccount(props) {
  return props.action === "login" ? (
    <Typography align="center">
      No account?{" "}
      <Link component={ReactRouterLink} to="/create-account">
        Register
      </Link>
    </Typography>
  ) : (
    <></>
  );
}

function AccountFields(props) {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    navigate("/");
  };
  return (
    <div className="Login" style={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            {props.action === "login" ? "Login" : "Create Account"}
          </Typography>
          <Button variant="outlined" startIcon={<GoogleIcon sx={{ color: "secondary.main" }} />}>
            Continue With Google
          </Button>
          <Typography align="center" sx={{ mt: 1 }}>
            or
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField variant="outlined" label="Email Address *" id="email" name="email" margin="normal" autoComplete="email" fullWidth autoFocus />
            <TextField variant="outlined" label="Password *" margin="normal" name="password" id="password" type="password" autoComplete="current-password" fullWidth />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
              {props.action}
            </Button>
          </Box>
          <CreateAccount {...props} />
        </Box>
      </Container>
    </div>
  );
}

export default AccountFields;
