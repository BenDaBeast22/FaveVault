import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Home from "./Home";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import Bookmarks from "./Bookmarks/Bookmarks";
import Rankings from "./Rankings";
import Backlog from "./Backlog";
import "./App.css";
import Collections from "./Bookmarks/Collections";

function App() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="bookmarks" />} />
          <Route path="bookmarks">
            <Route index element={<Bookmarks />} />
            <Route path=":id/:name" element={<Collections />} />
          </Route>
          <Route path="rankings" element={<Rankings />} />
          <Route path="backlog" element={<Backlog />} />
          <Route />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  );
}

export default App;
