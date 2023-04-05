import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SortType = ({ list, handleSortBy, subcollectionId }) => {
  return (
    <FormControl>
      <InputLabel>Sort by</InputLabel>
      <Select
        sx={{
          height: "38px",
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
        }}
        label="sort by"
        defaultValue={list[0].value}
        onChange={(event) => handleSortBy(event, subcollectionId)}
      >
        {list.map((item) => (
          <MenuItem key={item.name} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SortType;
