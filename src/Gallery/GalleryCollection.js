import DisplayCollection from "../DisplayCollection";
import AddImageDialog from "./Dialogs/AddImageDialog";
import AddImageToSubcollectionDialog from "./Dialogs/AddImageToSubcollectionDialog";

const GalleryCollection = () => {
  return (
    <DisplayCollection
      groupingName="Gallery"
      groupingType="images"
      AddItemDialog={AddImageDialog}
      AddItemToSubcollectionDialog={AddImageToSubcollectionDialog}
    />
  );
};

export default GalleryCollection;
