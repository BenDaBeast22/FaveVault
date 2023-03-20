import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Paper,
  Button,
  ImageList as ImgList,
  ImageListItem,
  ImageListItemBar,
  Modal,
} from "@mui/material";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";
import Carousel from "react-material-ui-carousel";

function ImageList({ list, editCard, EditCardDialog, handleDelete, type }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const handleOpenDialog = (index) => {
    console.log(index);
    setDialogIndex(index);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <ImgList gap={15} cols={5} rowHeight={150}>
        {list.map((card, index) => (
          <ImageListItem key={card.id}>
            {/* <Card
              sx={{
                height: "150px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
            </Card> */}
            <img src={card.img} alt={card.img} onClick={() => handleOpenDialog(index)} />
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
            border: "2px solid #000",
            boxShadow: 24,
          }}
        >
          <Carousel index={dialogIndex} autoPlay={false} sx={{ height: "800px", width: 1200 }}>
            {list.map((card) => (
              <ImageListItem key={card.id} sx={{ width: 500 }}>
                <Card
                  sx={{
                    height: "700px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
                </Card>

                {/* <img src={card.img} alt={card.img} sx={{ height: "100%" }} /> */}
                <ImageListItemBar
                  title={card.name}
                  actionIcon={
                    <EditCardIcon card={card} editCard={editCard} EditCardDialog={EditCardDialog} type={type} />
                  }
                />
              </ImageListItem>
            ))}
          </Carousel>
        </Box>
      </Modal>
    </>

    // <Grid container spacing={2} sx={{ pb: 2, pr: 2 }}>
    //   {list.map((card) => (
    //     <Grid item xs={4} sm={3} md={2} key={card.id}>
    //       <Card
    //         sx={{
    //           height: "150px",
    //           display: "flex",
    //           display: "flex",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
    //       </Card>
    //       <CardContent
    //         sx={{
    //           py: 1,
    //           backgroundColor: "#121212",
    //           "&:last-child": {
    //             paddingBottom: 1,
    //           },
    //           backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
    //         }}
    //       >
    //         <Typography align="center">{card.name}</Typography>
    //         <Box
    //           sx={{
    //             my: 1,
    //             display: "flex",
    //             justifyContent: "space-evenly",
    //           }}
    //         >
    //           <EditCardIcon card={card} editCard={editCard} EditCardDialog={EditCardDialog} type={type} />
    //           <DeleteCardIcon handleDelete={handleDelete} type={type} card={card} />
    //         </Box>
    //       </CardContent>
    //     </Grid>
    //   ))}
    // </Grid>
  );
}

export default ImageList;
