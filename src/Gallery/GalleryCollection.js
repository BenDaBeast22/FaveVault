import DisplayCollection from "../DisplayCollection";
import AddImageDialog from "./Dialogs/AddImageDialog";
import AddImageToSubcollectionDialog from "./Dialogs/AddImageToSubcollectionDialog";
import EditImageDialog from "./Dialogs/EditImageDialog";
import EditSubcollectionDialog from "../Dialogs/EditSubcollectionDialog";

const GalleryCollection = () => {
  return (
    <DisplayCollection
      groupingName="Gallery"
      groupingType="images"
      AddItemDialog={AddImageDialog}
      AddItemToSubcollectionDialog={AddImageToSubcollectionDialog}
      EditItemDialog={EditImageDialog}
      EditSubcollectionDialog={EditSubcollectionDialog}
    />
  );
};

export default GalleryCollection;
