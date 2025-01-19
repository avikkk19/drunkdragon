import React from "react";

const TwitterTimeline = ({
  username = "F1", // Default username
  theme = "dark", // light or dark
  height = "900", // Timeline height
  width = "100vw", // Timeline width
}) => {
  React.useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className=" relative w-full max-w-2xl mx-auto mt-24">
      <a
        className="twitter-timeline"
        data-theme={theme}
        data-height={height}
        data-width={width}
        href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
      >
        Loading tweets from {username}...
      </a>
    </div>
  );
};

export default TwitterTimeline;
