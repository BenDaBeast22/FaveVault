import React, { useEffect, useState } from "react";
import { Container, Typography, Button, TextField, Box, Avatar, Link, CssBaseline, Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { auth, registerWithEmailAndPassword } from "../Config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function CreateAccount() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, loading] = useAuthState(auth);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await registerWithEmailAndPassword(name, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setError("Failed to create account");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, loading]);
  return (
    <div className="AccountFields" style={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            CreateAccount
          </Typography>
          <Button variant="outlined" startIcon={<GoogleIcon sx={{ color: "secondary.main" }} />}>
            Register With Google
          </Button>
          <Typography align="center" sx={{ mt: 1 }}>
            or
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name *"
              id="name"
              name="name"
              margin="normal"
              autoComplete="name"
              fullWidth
              autoFocus
            />
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email *"
              id="email"
              name="email"
              margin="normal"
              autoComplete="email"
              fullWidth
            />
            <TextField
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password *"
              margin="normal"
              name="password"
              id="password"
              type="password"
              autoComplete="current-password"
              fullWidth
            />
            <Button type="submit" disabled={loading} variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
              Register
            </Button>
            {error && (
              <Alert severity="error" fullWidth>
                {error}
              </Alert>
            )}
            <Typography align="center">
              Already have an account?{" "}
              <Link component={ReactRouterLink} to="/login">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default CreateAccount;
