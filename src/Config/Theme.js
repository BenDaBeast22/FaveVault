import { createTheme } from "@mui/material/styles";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#426a6f",
//     },
//     secondary: {
//       main: "#e0286e",
//     },
//   },
// });

const theme = createTheme({
  palette: {
    mode: "dark",
    secondary: {
      main: "#9e38d1",
    },
    background: {
      secondary: {
        main: "#1c1b1b",
        light: "#242222",
      },
    },
    notification: {
      main: "#c93e3e",
    },
  },
});

export default theme;
