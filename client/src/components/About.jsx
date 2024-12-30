import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    // Create the timeline
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,

        // Add markers for debugging if needed
        // markers: true,
      },
    });

    // Add the animation
    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });

    // Cleanup function
    return () => {
      clipAnimation.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []); // Empty dependency array since we want this to run once

  return (
    <div id="about" className="min-h-screen w-screen bg">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          phew phew
        </p>

        <AnimatedTitle
          title="Curre<b>e</b>nt world <br /> world <b>cham</b>pi <b>on</b>"
          containerClass="mt-5 !text-black text-center"
        />

        <div className="about-subtext">
          <p>The Game of Max Verstappen</p>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Deserunt, nulla.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/maxcover.jpg"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
