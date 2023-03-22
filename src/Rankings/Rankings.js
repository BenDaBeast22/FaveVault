import React from "react";
import DisplayCollections from "../Display/DisplayCollections";
import AddRankingCollectionDialog from "./Dialogs/AddRankingCollectionDialog";
import EditRankingCollectionDialog from "./Dialogs/EditRankingCollectionDialog";

const Rankings = () => {
  return (
    <DisplayCollections
      groupingName="Rankings"
      groupingType="rankings"
      AddCollectionDialog={AddRankingCollectionDialog}
      EditCollectionDialog={EditRankingCollectionDialog}
    />
  );
};

export default Rankings;
