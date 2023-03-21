import { Box, CssBaseline, Typography } from "@mui/material";
import React from "react";

function Loading(props) {
  return (
    <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <CssBaseline />
      <Typography variant="h3" component="h1">
        Loading...
      </Typography>
    </Box>
  );
}

export default Loading;
