import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import { useRef, useLayoutEffect } from "react";
import React from "react";


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
      const animation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current.querySelector("#clip"),
          start: "center center",
          end: "+=800 center",
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
        },
      });

      animation.to(".mask-clip-path", {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      });

      return () => {
        animation.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div id="about" ref={containerRef} className="min-h-screen w-screen bg">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">WDC</p>

        <AnimatedTitle
          title="Curre<b>e</b>nt world <br /> world <b>cham</b>pi <b>on</b>"
          containerClass="mt-5 !text-[#cacaca] text-center"
        />

        <div className="about-subtext text-white">
          <p className="uppercase"> Max Verstappen</p>
          <p className="text-gray-400">4 times champion of the world</p>
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
      <div className="relative px-5 py-32 mx-6">
        <p className="font-circular-web text-6xl text-[#cacaca] uppercase mb-6 font-bold">
          Into the world of Max Verstappen.
        </p>
        <p className="max-w-lg font-circular-web text-lg text-white/80 opacity-70">
          born 30 September 1997 is a Dutch and Belgian 4 racing driver, who
          competes under the Dutch flag in Formula One for Red Bull Racing.
          Verstappen has won four Formula One World Drivers' Championship
          titles, which he won consecutively from 2021 to 2024 with Red Bull,
          and has won 63 Grands Prix across 10 seasons.
        </p>
      </div>
    </div>
  );
};

export default About;
