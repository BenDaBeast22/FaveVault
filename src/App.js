import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./Navbar/PrivateRoutes";
import Home from "./Navbar/Home";
import Login from "./Account/Login";
import CreateAccount from "./Account/CreateAccount";
import Bookmarks from "./Bookmarks/Bookmarks";
import Gallery from "./Gallery/Gallery";
import Lists from "./Lists/Lists";
import Backlog from "./Backlog/Backlog";
import Profile from "./Profile/Profile";
import BookmarksCollection from "./Bookmarks/BookmarksCollection";
import GalleryCollection from "./Gallery/GalleryCollection";
import RankingsCollection from "./Lists/ListsCollection";
import BacklogCollection from "./Backlog/BacklogCollection";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="bookmarks" />} />
          <Route path="bookmarks">
            <Route index element={<Bookmarks />} />
            <Route path=":id/:name/:subcollectionsEnabled" element={<BookmarksCollection />} />
          </Route>
          <Route path="gallery">
            <Route index element={<Gallery />} />
            <Route path=":id/:name/:subcollectionsEnabled" element={<GalleryCollection />} />
          </Route>
          <Route path="lists">
            <Route index element={<Lists />} />
            <Route path=":id/:name/:scoreType/:statusEnabled" element={<RankingsCollection />} />
          </Route>
          <Route path="backlog">
            <Route index element={<Backlog />} />
            <Route path=":id/:name/:subcollectionsEnabled" element={<BacklogCollection />} />
          </Route>
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  );
}

export default App;
