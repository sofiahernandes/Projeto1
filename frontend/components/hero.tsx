import Image from "next/image";
import React from "react";

import LiquidEther from "@/components/liquid-ether";
import heroBackground from "@/assets/hero-background.png";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative h-screen z-auto overflow-x-clip w-screen bg-primary">
      {/* <div className="absolute opacity-60 top-0 z-200 touch-none h-full w-full">
        <LiquidEther
          colors={["#fad8db", "#cd6184"]}
          mouseForce={60}
          cursorSize={70}
          isViscous={true}
          viscous={60}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={true}
          autoSpeed={1}
          autoIntensity={2.2}
          takeoverDuration={0}
          autoResumeDelay={0}
          autoRampDuration={0}
        />
      </div> */}
      <div className="relative pt-10 z-300 bg-transparent h-full mx-auto flex flex-col justify-between items-center">
        <div className="h-full flex flex-col justify-center gap-2 items-center">
          <h1 className="select-none changa-one-bold text-responsive text-5xl md:text-7xl text-white max-w-4xl text-center mx-auto">
            LIDERANÇAS
            <br />
            EMPÁTICAS
          </h1>
          <p className="select-none changa-one-regular text-2xl mt-0 text-white">
            + ARKANA
          </p>
        </div>
        <Link href="#public-graph"><p className="text-3xl z-300 text-white pb-10 animate-bounce">↓</p></Link>
      </div>
    </section>
  );
};

export default Hero;
