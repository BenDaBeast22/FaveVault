import DisplayCollection from "../DisplayCollection";
import AddBookmarkDialog from "./Dialogs/AddBookmarkDialog";
import AddBookmarkToSubCollectionDialog from "./Dialogs/AddBookmarkToSubcollectionDialog";
import EditBookmarkDialog from "./Dialogs/EditBookmarkDialog";
import BookmarkList from "../Display/BookmarkList";

const BookmarksCollection = () => {
  return (
    <DisplayCollection
      groupingName="Bookmarks"
      groupingType="bookmarks"
      AddItemDialog={AddBookmarkDialog}
      AddItemToSubcollectionDialog={AddBookmarkToSubCollectionDialog}
      EditItemDialog={EditBookmarkDialog}
      CardList={BookmarkList}
    />
  );
};

export default BookmarksCollection;
