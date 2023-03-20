import DisplayCollection from "../DisplayCollection";
import AddImageDialog from "./Dialogs/AddImageDialog";
import AddImageToSubcollectionDialog from "./Dialogs/AddImageToSubcollectionDialog";
import EditImageDialog from "./Dialogs/EditImageDialog";
import ImageList from "../Display/ImageList";

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
