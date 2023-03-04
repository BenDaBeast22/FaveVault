import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import CreateAccount from "./CreateAccount";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  );
}

export default App;
