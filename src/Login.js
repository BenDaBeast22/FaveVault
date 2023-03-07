import React, { useEffect, useState } from "react";
import { Container, Typography, Button, TextField, Box, Avatar, Link, CssBaseline, Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { auth, loginWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Login() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await loginWithEmailAndPassword(email, password);
      navigate("/");
    } catch (err) {
      setError("Failed to login");
    }
  };
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);
  return (
    <div className="Login" style={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Login
          </Typography>
          <Button
            variant="outlined"
            onClick={signInWithGoogle}
            startIcon={<GoogleIcon sx={{ color: "secondary.main" }} />}
          >
            Sign in with Google
          </Button>
          <Typography align="center" sx={{ mt: 1 }}>
            or
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email *"
              id="email"
              name="email"
              margin="normal"
              autoComplete="email"
              autoFocus
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
            <Button disabled={loading} type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 2 }}>
              Login
            </Button>
            {error && (
              <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
          <Typography align="center">
            No account?{" "}
            <Link component={ReactRouterLink} to="/create-account">
              Register
            </Link>
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
