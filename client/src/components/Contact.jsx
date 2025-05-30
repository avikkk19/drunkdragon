import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";
import React from "react";


const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
    <img src={src} />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-20 min-h-96 w-screen  px-10">
      <div className="relative rounded-lg bg-[#131213] py-24 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox
            src="/img/landofeature.jpg"
            clipClass="contact-clip-path-1"
          />
          <ImageClipBox
            src="/img/leclercfeature.jpg"
            clipClass="contact-clip-path-2 lg:translate-y-40 translate-y-60 "
          />
        </div>

        <div className="absolute top-10 left-[1rem] w-72 sm:top-20  md:left-auto md:right-10  lg:top-20 lg:w-80 ">
          <ImageClipBox
            src="/img/leclercfeature.jpg"
            clipClass="absolute md:scale-125"
          />
          <ImageClipBox
            src="/img/leclercfeature.jpg"
            clipClass="sword-man-clip-path md:scale-125"
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="mb-10 font-general text-[10px] uppercase">
            capybara Org
          </p>

          <AnimatedTitle
            title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> f<b>1</b t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <a href="/contact">
            <Button title="contact us" containerClass="mt-10 cursor-pointer" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
