import { Container, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import AddNewCard from "../Actions/AddNewCard";

function TopActions({ submitCollection, handleSortBy, type }) {
  return (
    <Container
      maxWidth="xs"
      sx={{
        pb: 4,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <AddNewCard submitCard={submitCollection} type={type} />
      <FormControl>
        <InputLabel>Sort By</InputLabel>
        <Select
          sx={{
            height: "38px",
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
          }}
          label="sort by"
          defaultValue="asc"
          onChange={handleSortBy}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
    </Container>
  );
}

export default TopActions;
