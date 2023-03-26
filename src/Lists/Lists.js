import React from "react";
import DisplayCollections from "../Display/DisplayCollections";
import AddListCollectionDialog from "./Dialogs/AddListCollectionDialog";
import EditListCollectionDialog from "./Dialogs/EditListCollectionDialog";

const Lists = () => {
  return (
    <DisplayCollections
      groupingName="Lists"
      groupingType="items"
      AddCollectionDialog={AddListCollectionDialog}
      EditCollectionDialog={EditListCollectionDialog}
    />
  );
};

export default Lists;
