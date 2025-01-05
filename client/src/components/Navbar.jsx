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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Added for mobile menu
  const userNavRef = useRef(null);
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const location = useLocation();

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const {
    userAuth,
    userAuth: { access_token, profile_img },
  } = useContext(UserContext);

  const handleUserNavPannel = () => {
    setUserNavPannel((prev) => !prev);
  };

  // Added for mobile menu toggle
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
    if (!navContainerRef.current) return;

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (navContainerRef.current) {
      gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.2,
      });
    }
  }, [isNavVisible]);

  // Added effect to close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const renderAuthButtons = () => {
    if (access_token) {
      return (
        <>
          <div className="relative" ref={userNavRef}>
            <div
              className="w-12 ml-0 h-12 mt-1 cursor-pointer"
              onClick={handleUserNavPannel}
            >
              {profile_img ? (
                <img
                  src={profile_img}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                  No Image
                </span>
              )}
            </div>
            {userNavPannel && <UserNavigationPannel />}
          </div>
        </>
      );
    }

    return (
      <>
        <Link className="btn-dark py-2" to="/signin">
          signin to continue
        </Link>
      </>
    );
  };

  const renderNavLink = (item) => {
    if (!item) {
      return (
        <Link
          to="/"
          className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent"
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
          className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent"
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
            className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item}
          </a>
        );
      }
      return (
        <Link
          to={`/#${item.toLowerCase()}`}
          className="nav-hover-btn block w-full p-2 hover:bg-gray-50 md:inline md:w-auto md:p-0 md:hover:bg-transparent"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {item}
        </Link>
      );
    }

    return null;
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-0 md:top-4 z-50 h-16 border-none transition-all duration-700 md:sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2  shadow-sm md:rounded-xl md:bg-black/80 md:backdrop-blur-sm">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <Link to="/">
              <img
                src="/img/lewislogo.jpg"
                alt="logo"
                className="w-8 md:w-10"
              />
            </Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-black/50"
            aria-label="Toggle menu"
          >
            <div
              className={clsx("w-6 h-0.5 bg-gray-900 transition-all", {
                "transform rotate-45 translate-y-2": isMobileMenuOpen,
              })}
            ></div>
            <div
              className={clsx("w-6 h-0.5 bg-gray-900 my-1.5", {
                "opacity-0": isMobileMenuOpen,
              })}
            ></div>
            <div
              className={clsx("w-6 h-0.5 bg-gray-900 transition-all", {
                "transform -rotate-45 -translate-y-2": isMobileMenuOpen,
              })}
            ></div>
          </button>

          {/* Mobile Menu */}
          <div
            className={clsx(
              "absolute top-[0px] left-0 right-0 bg-black/90 shadow-sm border-t transform transition-all duration-300 ease-in-out md:hidden",
              {
                "translate-y-0 opacity-100 visible": isMobileMenuOpen,
                "translate-y-4 opacity-0 invisible": !isMobileMenuOpen,
              }
            )}
          >
            <div className="py-2">
              {navItems.map((item, index) => (
                <div key={index} className="">
                  {renderNavLink(item)}
                </div>
              ))}
              <div className="p-2">{renderAuthButtons()}</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex h-full items-center gap-6">
            <div className="flex gap-6">
              {navItems.map((item, index) => (
                <span key={index}>{renderNavLink(item)}</span>
              ))}
            </div>

            <div className="flex items-center space-x-0.5">
              <div onClick={toggleAudioIndicator} className="cursor-grab mr-4">
                <audio
                  ref={audioElementRef}
                  className="hidden"
                  src="/audio/skyfall.mp3"
                  loop
                />
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={clsx("indicator-line", {
                      active: isIndicatorActive,
                    })}
                    style={{
                      animationDelay: `${bar * 0.1}s`,
                    }}
                  />
                ))}
              </div>
              {renderAuthButtons()}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
