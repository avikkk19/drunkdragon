import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPannel from "./UserNavigation";

const navItems = ["", "features", "about", "story", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [userNavPannel, setUserNavPannel] = useState(false);
  const userNavRef = useRef(null);
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (userNavRef.current && !userNavRef.current.contains(event.target)) {
      setUserNavPannel(false);
    }
  };

  // Toggle audio and visual indicator
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

  // Manage audio playback
  useEffect(() => {
    const audioElement = audioElementRef.current;
    if (!audioElement) return;

    if (isAudioPlaying) {
      audioElement.play().catch(() => {
        // Handle autoplay restrictions
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

  const renderAuthButtons = () => {
    if (access_token) {
      return (
        <>
          {/* <Link to="/dashboard/notifications">
            <div className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10 flex items-center justify-center">
              <i className="fi fi-rr-bell text-2xl block mt-1"></i>
            </div>
          </Link> */}

          <div className="relative" ref={userNavRef}>
            <div
              className="w-12 ml-10 h-12 mt-1 cursor-pointer"
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
          signin
        </Link>
      </>
    );
  };

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <img src="/img/lewislogo.jpg" alt="logo" className="w-10" />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="ml-10 flex items-center space-x-0.5 ">
              <div onClick={toggleAudioIndicator} className="cursor-grab">
                <audio
                  ref={audioElementRef}
                  className="hidden mr-10"
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
