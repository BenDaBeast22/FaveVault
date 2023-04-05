import { Grid, Card, CardMedia, CardContent, Box, Typography, Link } from "@mui/material";
import { Link as ReactRouterLink } from "react-router-dom";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";

function CollectionList({ list, editCard, EditCardDialog, handleDelete, type, friendView }) {
  return (
    <Grid container spacing={2} sx={{ pb: 2, pr: 2 }}>
      {list.map((card) => (
        <Grid item xs={4} sm={3} md={2.4} lg={2} xl={1.5} key={card.id}>
          <ReactRouterLink
            to={`${card.id}/${card.name}/${card.scoreType ? card.scoreType + "/" : ""}${
              card.scEnabled || card.statusEnabled || false
            }`}
          >
            <Card
              sx={{
                height: "150px",
                display: "flex",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box>
                <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
              </Box>
            </Card>
          </ReactRouterLink>
          <CardContent
            sx={{
              py: 1,
              backgroundColor: "#121212",
              "&:last-child": {
                paddingBottom: 1,
              },
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
            }}
          >
            <Typography align="center">{card.name}</Typography>
            {!friendView && (
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
            )}
          </CardContent>
        </Grid>
      ))}
    </Grid>
  );
}

export default CollectionList;
