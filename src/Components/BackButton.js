import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as ReactRouterLink } from "react-router-dom";

const BackButton = () => {
  return (
    <Box
      component={ReactRouterLink}
      to={".."}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "secondary.main",
        width: 45,
        height: 40,
        borderRadius: "50%",
        color: "white",
        "&:hover": {
          backgroundColor: "#7e14b3",
        },
      }}
    >
      <ArrowBackIcon
        sx={{
          fontSize: 20,
        }}
      />
    </Box>
  );
};

export default BackButton;
