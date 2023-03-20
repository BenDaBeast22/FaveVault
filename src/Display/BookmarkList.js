import { Grid, Card, CardMedia, CardContent, Box, Typography, Link } from "@mui/material";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";

function BookmarkList({ list, editCard, EditCardDialog, handleDelete, type }) {
  return (
    <Grid container spacing={2} sx={{ pb: 2, pr: 2 }}>
      {list.map((card) => (
        <Grid item xs={4} sm={3} md={2} key={card.id}>
          <Card
            sx={{
              height: "150px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link href={card.link} target="_blank">
              <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
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
            <Typography align="center">{card.name}</Typography>
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
          </CardContent>
        </Grid>
      ))}
    </Grid>
  );
}

export default BookmarkList;
