import DisplayCollection from "../Display/DisplayCollection";
import AddBacklogItemDialog from "./Dialogs/AddBacklogDialog";
import AddBookmarkToSubCollectionDialog from "../Bookmarks/Dialogs/AddBookmarkToSubcollectionDialog";
import EditBookmarkDialog from "../Bookmarks/Dialogs/EditBookmarkDialog";
import BookmarkList from "../DisplayList/BookmarkList";

const BacklogCollection = () => {
  return (
    <DisplayCollection
      groupingName="Bookmarks"
      groupingType="bookmarks"
      AddItemDialog={AddBacklogItemDialog}
      AddItemToSubcollectionDialog={AddBookmarkToSubCollectionDialog}
      EditItemDialog={EditBookmarkDialog}
      CardList={BookmarkList}
    />
  );
};

export default BacklogCollection;
