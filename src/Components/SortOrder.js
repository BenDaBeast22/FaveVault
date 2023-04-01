import { FormControl, InputLabel, Select, Menu, MenuItem } from "@mui/material";
import React from "react";

const SortOrder = ({ handleOrderBy, subcollectionId }) => {
  return (
    <FormControl>
      <InputLabel>Order by</InputLabel>
      <Select
        sx={{
          height: "38px",
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))",
        }}
        label="order by"
        defaultValue="asc"
        onChange={(event) => handleOrderBy(event, subcollectionId)}
      >
        <MenuItem value="asc">Asc</MenuItem>
        <MenuItem value="desc">Desc</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortOrder;
