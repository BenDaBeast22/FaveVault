import { Grid, Card, CardMedia, CardContent, Box, Typography, Link, Rating } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff3d47",
  },
  "& .MuiRating-iconHover": {
    color: "#ff6d75",
  },
});

function ListsList({ list, scoreType, editCard, EditCardDialog, handleDelete, type, displayStatus }) {
  const handleRatingChange = (e, newScore, card) => {
    editCard({ score: newScore * 2 }, card.scId, card.id);
  };
  return (
    <Grid container spacing={2} sx={{ pb: 2, pr: 2 }}>
      {list.map((card) => (
        <Grid item xs={4} sm={3} md={2.4} lg={2} xl={1.5} key={card.id}>
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
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
              {scoreType === "hearts"
                ? HeartsRating(card)
                : scoreType === "percent"
                ? `${(card.score * 100) / 10}%`
                : scoreType === "10"
                ? `${card.score}/10`
                : scoreType === "100"
                ? `${card.score * 10}/100`
                : StarRating(card)}
            </Box>
            <Box
              sx={{
                my: 1,
                display: "flex",
                justifyContent: "space-evenly",
                p: 0,
              }}
            >
              <EditCardIcon
                card={card}
                editCard={editCard}
                EditCardDialog={EditCardDialog}
                type={type}
                scoreType={scoreType}
                displayStatus={displayStatus}
              />
              <DeleteCardIcon handleDelete={handleDelete} type={type} card={card} />
            </Box>
          </CardContent>
        </Grid>
      ))}
    </Grid>
  );

  function StarRating(card) {
    return (
      <Rating
        name="score-preview"
        precision={0.5}
        value={card.score / 2}
        size="medium"
        onChange={(e, newScore) => handleRatingChange(e, newScore, card)}
      />
    );
  }
  function HeartsRating(card) {
    return (
      <StyledRating
        name="score-preview"
        precision={0.5}
        value={card.score / 2}
        size="medium"
        icon={<FavoriteIcon fontSize="inherit" />}
        emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        onChange={(e, newScore) => handleRatingChange(e, newScore, card)}
      />
    );
  }
}

export default ListsList;
