import { Grid, Card, CardMedia, CardContent, Box, Typography, Link } from "@mui/material";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";

function BookmarkList({ list, editCard, EditCardDialog, handleDelete, itemName, friendView }) {
  return (
    <Grid container spacing={2} sx={{ pb: 2, pr: 2 }}>
      {list.map((card) => (
        <Grid item xs={6} sm={4} md={3} lg={2} key={card.id}>
          <Link href={card.link} target="_blank">
            <Card
              sx={{
                height: "150px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box>
                <CardMedia height="100%" component="img" image={card.img} alt={card.img} />
              </Box>
            </Card>
          </Link>
          <CardContent
            sx={{
              p: 1,
              backgroundColor: "#121212",
              "&:last-child": {
                paddingBottom: 1,
              },
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", lineHeight: "1.5em", minHeight: "3em" }}>
              <Typography paragraph align="center" sx={{ width: "100%", m: 0 }}>
                {card.name}
              </Typography>
            </Box>
            {!friendView && Icons(card)}
          </CardContent>
        </Grid>
      ))}
    </Grid>
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

export default BookmarkList;
