import DisplayCollection from "../DisplayCollection";
import AddBookmarkDialog from "./Dialogs/AddBookmarkDialog";
import AddBookmarkToSubCollectionDialog from "./Dialogs/AddBookmarkToSubcollectionDialog";

const BookmarksCollection = () => {
  return (
    <DisplayCollection
      groupingName="Bookmarks"
      groupingType="bookmarks"
      AddItemDialog={AddBookmarkDialog}
      AddItemToSubcollectionDialog={AddBookmarkToSubCollectionDialog}
    />
  );
};

export default BookmarksCollection;
