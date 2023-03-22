import DisplayCollection from "../Display/DisplayCollection";
import AddRankingDialog from "./Dialogs/AddRankingDialog";
import AddRankingToSubcollectionDialog from "./Dialogs/AddRankingToSubcollectionDialog";
import EditRankingDialog from "./Dialogs/EditRankingDialog";
import RankingList from "../DisplayList/RankingList";

const RankingsCollection = () => {
  return (
    <DisplayCollection
      groupingName="Rankings"
      groupingType="rankings"
      AddItemDialog={AddRankingDialog}
      AddItemToSubcollectionDialog={AddRankingToSubcollectionDialog}
      EditItemDialog={EditRankingDialog}
      CardList={RankingList}
    />
  );
};

export default RankingsCollection;
