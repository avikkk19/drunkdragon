import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPannel from "./UserNavigation";

const navItems = ["", "features", "about", "story", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [userNavPannel, setUserNavPannel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userNavRef = useRef(null);
  const audioElementRef = useRef(null);
  const location = useLocation();

  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  const handleUserNavPannel = () => {
    setUserNavPannel((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (userNavRef.current && !userNavRef.current.contains(event.target)) {
      setUserNavPannel(false);
    }
  };

  const toggleAudioIndicator = () => {
    if (audioElementRef.current) {
      setIsAudioPlaying((prev) => !prev);
      setIsIndicatorActive((prev) => !prev);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;

    if (isAudioPlaying) {
      audioElement.play().catch(() => {
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      });
    } else {
      audioElement.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const renderAuthButtons = () => {
    if (access_token) {
      return (
        <div className="relative" ref={userNavRef}>
          <div
            className="w-12 ml-0 h-12 mt-1 cursor-pointer "
            onClick={handleUserNavPannel}
          >
            {profile_img ? (
              <img
                src={profile_img}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="w-full h-full rounded-full flex items-center justify-center">
                No Image
              </span>
            )}
          </div>
          {userNavPannel && <UserNavigationPannel />}
        </div>
      );
    }

    return (
      <Link className="btn-dark py-2 -mt-3" to="/signin">
        Sign in to continue
      </Link>
    );
  };

  const renderNavLink = (item) => {
    if (!item) {
      return (
        <Link
          to="/"
          className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent text-black"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </Link>
      );
    }

    if (item === "features" || item === "story") {
      return (
        <Link
          to={`/${item}`}
          className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent text-black"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item}
        </Link>
      );
    }

    if (item === "about" || item === "Contact") {
      if (location.pathname === "/") {
        return (
          <a
            href={`#${item.toLowerCase()}`}
            className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent text-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item}
          </a>
        );
      }
      return (
        <Link
          to={`/#${item.toLowerCase()}`}
          className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent text-black"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item}
        </Link>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-16 border-[#18181b] bg-white/10 backdrop-blur-sm rounded-xl mx-3 mt-2">
      <header className="w-full h-full">
        <nav className="flex items-center justify-between h-full px-4">
          <Link to="/">
            <img
              src="/img/lewislogopng.png"
              alt="logo"
              className="w-8 md:w-10"
            />
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-white"
            aria-label="Toggle menu"
          >
            <div
              className={clsx("w-6 h-0.5 bg-black transition-all", {
                "transform rotate-45 translate-y-2": isMobileMenuOpen,
              })}
            ></div>
            <div
              className={clsx("w-6 h-0.5 bg-black my-1.5", {
                "opacity-0": isMobileMenuOpen,
              })}
            ></div>
            <div
              className={clsx("w-6 h-0.5 bg-black transition-all", {
                "transform -rotate-45 -translate-y-2": isMobileMenuOpen,
              })}
            ></div>
          </button>

          <div className={clsx("hidden md:flex gap-6 mt-4 ")}>
            {navItems.map((item, index) => (
              <span key={index}>{renderNavLink(item)}</span>
            ))}
            {renderAuthButtons()}
          </div>
          {/* mobile open */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full mt-2 shadow-lg bg-black/80 rounded-lg backdrop-blur-3xl">
              {navItems.map((item, index) => (
                <div key={index}>{renderNavLink(item)}</div>
              ))}
              <div className="ml-10 mb-3">{renderAuthButtons()}</div>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
