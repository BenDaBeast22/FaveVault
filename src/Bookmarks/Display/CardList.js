import { Grid, Card, CardMedia, CardContent, Box, Typography, Tooltip, IconButton } from "@mui/material";
import EditCollection from "../Actions/EditCollection";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

function CardList(props) {
  return (
    <Grid container spacing={2}>
      {props.collections.map((collection) => (
        <Grid item xs={4} sm={3} md={2} key={collection.id}>
          <Card
            sx={{
              height: "150px",
              display: "flex",
            }}
          >
            <Link to={`${collection.id}/${collection.name}`}>
              <CardMedia component="img" image={collection.img} alt={collection.img} />
            </Link>
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
            <Typography align="center">{collection.name}</Typography>
            <Box
              sx={{
                my: 1,
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <EditCollection collection={collection} editCollection={props.editCollection} />
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => props.handleDelete(collection.id)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Grid>
      ))}
    </Grid>
  );
}

export default CardList;
