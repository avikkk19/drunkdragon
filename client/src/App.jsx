import React, { useState, useEffect, createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Component imports
import NavBar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import UserAuthForm from "./pages/UserAuthForm";

//
import { lookInSession } from "./common/Session";
import TwitterTimeline from "./components/Twittertm";
import Contactme from "./pages/Contact";

// Create context
export const UserContext = createContext({});

// Home page component
const Home = () => (
  <>
    <Hero />
    <About />
    <Contact />

  </>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { userAuth } = React.useContext(UserContext);
  if (!userAuth.access_token) {
    return <Navigate to="/signin" />;
  }
  return children;
};

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const userInSession = lookInSession("user");
    if (userInSession) {
      try {
        setUserAuth(JSON.parse(userInSession));
      } catch (error) {
        console.error("Error parsing user session:", error);
        setUserAuth({ access_token: null });
      }
    } else {
      setUserAuth({ access_token: null });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <NavBar />
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<UserAuthForm type="signin" />} />
          <Route path="/signup" element={<UserAuthForm type="signup" />} />
          <Route path="/contact" element={<Contactme />} />
          <Route path="/features" element={<Features />} />
          <Route path="/story" element={<Story />} />
          <Route path="/TwitterTimeline" element={<TwitterTimeline />} />

          {/* Protected routes */}
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <Features />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story"
            element={
              <ProtectedRoute>
                <Story />
              </ProtectedRoute>
            }
          />
            <Route path="/twitter" element={<ProtectedRoute>
              <TwitterTimeline/>
            </ProtectedRoute>} />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </UserContext.Provider>
  );
};

export default App;
