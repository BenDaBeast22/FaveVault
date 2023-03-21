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
} from "@mui/material";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";
import Carousel from "react-material-ui-carousel";

function ImageList({ list, editCard, EditCardDialog, handleDelete, type }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);

  const handleOpenDialog = (index) => {
    setDialogIndex(index);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleKeydown = useCallback(
    (event) => {
      // left key
      if (event.keyCode === 37) {
        setDialogIndex((index) => {
          return index - 1 < 0 ? list.length - 1 : index - 1;
        });
        // right key
      } else if (event.keyCode === 39) {
        setDialogIndex((index) => {
          return index + 1 > list.length - 1 ? 0 : index + 1;
        });
      }
    },
    [list]
  );
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });
  return (
    <>
      <ImgList gap={15} cols={5}>
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
            <ImageListItemBar
              title={card.name}
              actionIcon={
                <Box
                  sx={{
                    my: 1,
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <EditCardIcon card={card} editCard={editCard} EditCardDialog={EditCardDialog} type={type} />
                  <DeleteCardIcon handleDelete={handleDelete} type={type} card={card} />
                </Box>
              }
            />
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
            boxShadow: 24,
          }}
        >
          <Carousel
            index={dialogIndex}
            next={() => setDialogIndex((index) => index + 1)}
            prev={() => setDialogIndex((index) => index - 1)}
            autoPlay={false}
            duration={250}
            navButtonsAlwaysVisible
            sx={{ height: "750px", width: "1200px" }}
          >
            {list.map((card, i) => (
              <Container
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "1200px",
                  height: "700px",
                }}
              >
                <img
                  src={card.img}
                  alt={card.img}
                  style={{ objectFit: "contain", maxHeight: "650px", maxWidth: "1200px" }}
                  loading="lazy"
                />
              </Container>
            ))}
          </Carousel>
        </Box>
      </Modal>
    </>
  );
}

export default ImageList;
