import { Rating, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff3d47",
  },
  "& .MuiRating-iconHover": {
    color: "#ff6d75",
  },
});

function StarRating(score, readOnly, handleRatingChange, card) {
  return (
    <Rating
      name="score-preview"
      precision={0.5}
      value={score / 2}
      size="medium"
      readOnly={readOnly}
      onChange={(e, newScore) => (handleRatingChange ? handleRatingChange(newScore, card) : undefined)}
    />
  );
}
function HeartsRating(score, readOnly, handleRatingChange, card) {
  return (
    <StyledRating
      name="score-preview"
      precision={0.5}
      value={score / 2}
      size="medium"
      icon={<FavoriteIcon fontSize="inherit" />}
      emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
      readOnly={readOnly}
      onChange={(e, newScore) => (handleRatingChange ? handleRatingChange(newScore, card) : undefined)}
    />
  );
}
function PercentRating(score) {
  return <Typography> {`${(score * 100) / 10}%`}</Typography>;
}
function OutOfTenRating(score) {
  return <Typography> {`${score}/10`}</Typography>;
}
function OutOfHunderedRating(score) {
  return <Typography> {`${score * 10}/100`}</Typography>;
}

export { StarRating, HeartsRating, PercentRating, OutOfTenRating, OutOfHunderedRating };
