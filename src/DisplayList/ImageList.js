import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardMedia,
  Box,
  ImageList as ImgList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Container,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";
import Carousel from "react-material-ui-carousel";
import { useTheme } from "@emotion/react";
import CancelIcon from "@mui/icons-material/Cancel";

function ImageList({ list, editCard, EditCardDialog, handleDelete, itemName, friendView }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const handleOpenDialog = (index) => {
    setDialogIndex(index);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const decrementIndex = (index) => {
    return index - 1 < 0 ? list.length - 1 : index - 1;
  };
  const incrementIndex = (index) => {
    return index + 1 > list.length - 1 ? 0 : index + 1;
  };
  const handleKeydown = useCallback(
    (event) => {
      // left key
      if (event.keyCode === 37) {
        setDialogIndex((index) => decrementIndex(index));
        // right key
      } else if (event.keyCode === 39) {
        setDialogIndex((index) => incrementIndex(index));
      }
    },
    [list]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up("sm"));
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const lg = useMediaQuery(theme.breakpoints.up("lg"));
  const xl = useMediaQuery(theme.breakpoints.up("xl"));
  const cols = xl ? 6 : lg ? 5 : md ? 4 : sm ? 3 : 2;

  return (
    <Box>
      <ImgList gap={15} cols={cols}>
        {list.map((card, index) => (
          <ImageListItem sx={{ height: "100%" }} key={card.id}>
            <Card
              sx={{
                height: "200px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CardMedia
                height="100%"
                component="img"
                image={card.img}
                alt={card.img}
                onClick={() => handleOpenDialog(index)}
              />
            </Card>
            <ImageListItemBar title={card.name} actionIcon={!friendView ? Icons(card) : null} />
          </ImageListItem>
        ))}
      </ImgList>
      <Modal open={dialogOpen} onClose={handleCloseDialog}>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
          }}
        >
          <IconButton
            onClick={handleCloseDialog}
            area-label="close modal"
            size="large"
            color="error"
            sx={{ position: "absolute", zIndex: 1000, top: 0, right: 0, p: 0.5 }}
          >
            <CancelIcon fontSize="inherit" />
          </IconButton>
          <Carousel
            index={dialogIndex}
            next={() => setDialogIndex((index) => incrementIndex(index))}
            prev={() => setDialogIndex((index) => decrementIndex(index))}
            autoPlay={false}
            duration={250}
            navButtonsAlwaysVisible
            sx={{ height: "750px", width: { xl: "1500px", lg: "1100px", md: "800px", sm: "500px", xs: "400px" } }}
          >
            {list.map((card, i) => (
              <Container
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: { xl: "1500px", lg: "1100px", md: "800px", sm: "500px", xs: "400px" },
                  height: "700px",
                }}
              >
                <Box>
                  <img
                    src={card.img}
                    alt={card.img}
                    style={{
                      objectFit: "contain",
                      maxHeight: "650px",
                      maxWidth: { xl: "1500px", lg: "1100px", md: "800px", sm: "500px", xs: "400px" },
                      m: 0,
                      p: 0,
                    }}
                    loading="lazy"
                  />
                  <Typography variant="h5" align="center">
                    {card.name}
                  </Typography>
                </Box>
              </Container>
            ))}
          </Carousel>
        </Box>
      </Modal>
    </Box>
  );

  function Icons(card) {
    return (
      <Box
        sx={{
          my: 1,
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <EditCardIcon card={card} editCard={editCard} EditCardDialog={EditCardDialog} name={itemName} />
        <DeleteCardIcon handleDelete={handleDelete} name={itemName} card={card} />
      </Box>
    );
  }
}

export default ImageList;
