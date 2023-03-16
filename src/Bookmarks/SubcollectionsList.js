import React from "react";

const SubcollectionsList = () => {
  return (
    <div>
      {displaySubcollections &&
        subcollections.map((subcollection) => (
          <Box key={subcollection.id}>
            <Box sx={{ mt: 2, display: "flex", mb: 3 }}>
              <Typography variant="h4" sx={{ mr: 1 }}>
                {subcollection.name}
              </Typography>
              <AddCardIcon submitCard={addBookmarkToSubcollection} id={subcollection.id} />
              <EditCardIcon
                type="subcollection"
                card={subcollection}
                editCard={editSubcollection}
                tooltipName="Edit Subcollection"
              />
            </Box>
            {bookmarks[subcollection.id] && (
              <CardList
                list={bookmarks[subcollection.id]}
                type="bookmark"
                editCard={editBookmark}
                handleDelete={handleDelete}
              />
            )}
          </Box>
        ))}
    </div>
  );
};

export default SubcollectionsList;
