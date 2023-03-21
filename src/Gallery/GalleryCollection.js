import DisplayCollection from "../Display/DisplayCollection";
import AddImageDialog from "./Dialogs/AddImageDialog";
import AddImageToSubcollectionDialog from "./Dialogs/AddImageToSubcollectionDialog";
import EditImageDialog from "./Dialogs/EditImageDialog";
import ImageList from "../DisplayList/ImageList";

const GalleryCollection = () => {
  return (
    <DisplayCollection
      groupingName="Gallery"
      groupingType="images"
      AddItemDialog={AddImageDialog}
      AddItemToSubcollectionDialog={AddImageToSubcollectionDialog}
      EditItemDialog={EditImageDialog}
      CardList={ImageList}
    />
  );
};

export default GalleryCollection;
