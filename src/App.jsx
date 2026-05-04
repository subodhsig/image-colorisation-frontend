import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import About from "./pages/About.jsx";
import Colorize from "./pages/Colorize.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <Layout>
      <div className="p-6">
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/colorize" element={<Colorize />} />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          }/>
        </Routes>

      </div>
    </Layout>
  );
}
