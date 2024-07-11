import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddReport from "./components/AddReport";
import ViewReports from "./components/ViewReports";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/addreport" element={<AddReport />} />
          <Route path="/viewreports" element={<ViewReports />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
