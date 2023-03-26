import DisplayCollection from "../Display/DisplayCollection";
import AddListItemDialog from "./Dialogs/AddListItemDialog";
import AddListItemToSubcollectionDialog from "./Dialogs/AddListItemToSubcollectionDialog";
import EditListItemDialog from "./Dialogs/EditListItemDialog";
import ListsList from "../DisplayList/ListsList";

const ListsCollection = () => {
  return (
    <DisplayCollection
      groupingName="Lists"
      groupingType="items"
      AddItemDialog={AddListItemDialog}
      AddItemToSubcollectionDialog={AddListItemToSubcollectionDialog}
      EditItemDialog={EditListItemDialog}
      CardList={ListsList}
    />
  );
};

export default ListsCollection;
