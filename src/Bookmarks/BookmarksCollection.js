import DisplayCollection from "../Display/DisplayCollection";
import AddBookmarkDialog from "./Dialogs/AddBookmarkDialog";
import AddBookmarkToSubcollectionDialog from "./Dialogs/AddBookmarkToSubcollectionDialog";
import EditBookmarkDialog from "./Dialogs/EditBookmarkDialog";
import BookmarkList from "../DisplayList/BookmarkList";

const BookmarksCollection = () => {
  return (
    <DisplayCollection
      groupingName="Bookmarks"
      groupingType="bookmarks"
      AddItemDialog={AddBookmarkDialog}
      AddItemToSubcollectionDialog={AddBookmarkToSubcollectionDialog}
      EditItemDialog={EditBookmarkDialog}
      CardList={BookmarkList}
    />
  );
};

export default BookmarksCollection;
