import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/navbar/Navbar.js";
import HomePage from "./pages/homepage/HomePage.js"
import Generate from './pages/generate/Generate.js';
import Dashboard from './pages/dashboard/Dashboard.js';
import AboutUs from './pages/aboutus/AboutUs.js';
import TestPage from './pages/tempPage/testPage.js';
import Footer from './components/footer/Footer.js';
import User from './pages/user/User.js';
import MultipleChoice from './pages/question/MultipleChoice.js';
import TrueFalse from './pages/question/TrueFalse.js';
import Summmary from './pages/summary/Summary.js';
import FolderDetails from './pages/dashboard/FolderDetails.js';


function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/user/:nickname" element={<User />} />
          <Route path="/multiple-choice" element={<MultipleChoice />} />
          <Route path="/true-false" element={<TrueFalse />} />
          <Route path="/summarize" element={<Summmary />} />
          <Route path="/folder-details/:folderName" element={<FolderDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;