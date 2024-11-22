import { styles } from "../styles";
import React from "react";

import RoomCanvas from "./canvas/Room";

const useElapsedTime = (startDateStr) => {
  const [elapsedTime, setElapsedTime] = React.useState("");
  React.useEffect(() => {
    const startDate = new Date(startDateStr);
    const updateElapsedTime = () => {
      const now = new Date();
      const years = now.getFullYear() - startDate.getFullYear();
      const months = now.getMonth() - startDate.getMonth() + years * 12;
      setElapsedTime(`${years}y ${months % 12}m`);
    };
    const intervalId = setInterval(updateElapsedTime, 1000);
    return () => clearInterval(intervalId);
  }, [startDateStr]);
  return elapsedTime;
};

const Model3D = () => {
  const elapsedTime = useElapsedTime("2021-04-30T00:00:00");
  const elapsedTimeReact = useElapsedTime("2022-08-30T00:00:00");
  const elapsedTimeDevOps = useElapsedTime("2023-10-30T00:00:00");

  return (
    <section className="relative w-full h-[150vh] mx-auto">
      {" "}
      {/* Increased height */}
      <div
        className={`absolute inset-0 top-[100px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Moclaw</span>
          </h1>
          <p className={`${styles.Model3DSubText} mt-2 text-white-100`}>
            I am a Software Engineer specializing in{" "}
            <span className="text-[#915EFF]">.NET</span> with{" "}
            <span className="text-[#915EFF]">{elapsedTime}</span> of experience.
            <br />
            Currently working with <span className="text-[#915EFF]">
              React
            </span>{" "}
            and <span className="text-[#915EFF]">Angular</span> with{" "}
            <span className="text-[#915EFF]">{elapsedTimeReact}</span> of
            experience.
            <br />
            Looking forward to working with{" "}
            <span className="text-[#915EFF]">DevOps</span> with{" "}
            <span className="text-[#915EFF]">{elapsedTimeDevOps}</span> of
            experience.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center h-full">
        <RoomCanvas />
      </div>
    </section>
  );
};

export default Model3D;
