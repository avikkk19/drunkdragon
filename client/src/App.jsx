import React, { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";

// Component imports
import NavBar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import UserAuthForm from "./pages/UserAuthForm";

// Utils import
import { lookInSession } from "./common/session";

// Create context
export const UserContext = createContext({});

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
      <main>
        <Routes>
          <Route
            path="/"
            element={
              userAuth.access_token ? (
                <>
                  <Hero />
                  <About />
                  <Features />
                  <Story />
                  <Contact />
                </>
              ) : (
                <>
                  <Contact />
                </>
              )
            }
          />
          <Route path="/signin" element={<UserAuthForm type="signin" />} />
          <Route path="/signup" element={<UserAuthForm type="signup" />} />
        </Routes>
      </main>
      <NavBar />

      <Footer />
    </UserContext.Provider>
  );
};

export default App;
