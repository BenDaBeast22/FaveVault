import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const CircularProgressLabel = ({ progress, imageUploadSuccess, imageUploadFail }) => {
  let finishUpload;
  if (progress === 100) {
    if (imageUploadSuccess) {
      finishUpload = <CheckCircleOutlineIcon color="success" sx={{ mx: 1 }} />;
    } else if (imageUploadFail) {
      finishUpload = <CancelOutlinedIcon color="error" sx={{ mx: 1 }} />;
    }
  }
  return (
    <>
      {progress > 0 && !imageUploadSuccess && !imageUploadFail && (
        <Box sx={{ position: "relative", display: "inline-flex", mx: 1 }}>
          <CircularProgress variant="determinate" value={progress} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
      )}
      {finishUpload}
    </>
  );
};

export default CircularProgressLabel;
