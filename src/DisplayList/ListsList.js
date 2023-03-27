import { Grid, Card, CardMedia, CardContent, Box, Typography, Link, Select, MenuItem } from "@mui/material";
import EditCardIcon from "../Icons/EditCardIcon";
import DeleteCardIcon from "../Icons/DeleteCardIcon";
import { StarRating, HeartsRating, PercentRating, OutOfTenRating, OutOfHunderedRating } from "../Components/ScoreTypes";

function ListsList({
  list,
  scoreType,
  editCard,
  editListItem,
  EditCardDialog,
  handleDelete,
  type,
  displayStatus,
  collectionName,
  groupingName,
}) {
  const handleRatingChange = (newScore, card) => {
    editCard({ score: newScore * 2 }, card.scId, card.id);
  };
  const handleStatusChange = (newStatus, card) => {
    editListItem({ ...card, status: newStatus }, true, card.scId, card.id);
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
              {scoreType === "stars"
                ? StarRating(card.score, false, handleRatingChange, card)
                : scoreType === "hearts"
                ? HeartsRating(card.score, false, handleRatingChange, card)
                : scoreType === "percent"
                ? PercentRating(card.score)
                : scoreType === "10"
                ? OutOfTenRating(card.score)
                : scoreType === "100"
                ? OutOfHunderedRating(card.score)
                : ""}
            </Box>
            {displayStatus && (
              <Box sx={{ mt: 1 }}>
                <Select
                  value={card.status}
                  onChange={(e) => handleStatusChange(e.target.value, card)}
                  sx={{ height: "30px", width: "100%" }}
                >
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Finished">Finished</MenuItem>
                  <MenuItem value="Dropped">Dropped</MenuItem>
                </Select>
              </Box>
            )}

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
                editCard={groupingName === "Lists" ? editListItem : editCard}
                EditCardDialog={EditCardDialog}
                type={type}
                scoreType={scoreType}
                displayStatus={displayStatus}
                collectionName={collectionName}
              />
              <DeleteCardIcon handleDelete={handleDelete} type={type} card={card} />
            </Box>
          </CardContent>
        </Grid>
      ))}
    </Grid>
  );
}

export default ListsList;
