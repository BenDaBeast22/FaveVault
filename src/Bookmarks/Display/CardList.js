import { Grid, Card, CardMedia, CardContent, Box, Typography, Tooltip, IconButton, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link as ReactRouterLink } from "react-router-dom";
import EditCard from "../Actions/EditCard";

function CardList({ list, editCard, handleDelete, type }) {
  return (
    <Grid container spacing={2}>
      {list.map((card) => (
        <Grid item xs={4} sm={3} md={2} key={card.id}>
          <Card
            sx={{
              height: "150px",
              display: "flex",
            }}
          >
            {type === "collection" ? (
              <ReactRouterLink to={`${card.id}/${card.name}`}>
                <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
              </ReactRouterLink>
            ) : (
              <Link href={card.link} target="_blank">
                <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
              </Link>
            )}
          </Card>
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
            <Box
              sx={{
                my: 1,
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <EditCard card={card} editCard={editCard} type={type}></EditCard>
              <Tooltip title="Delete">
                {type === "bookmark" ? (
                  <IconButton color="error" onClick={() => handleDelete(card.scId, card.id)}>
                    <DeleteIcon />
                  </IconButton>
                ) : (
                  <IconButton color="error" onClick={() => handleDelete(card.id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Tooltip>
            </Box>
          </CardContent>
        </Grid>
      ))}
    </Grid>
  );
}

export default CardList;
