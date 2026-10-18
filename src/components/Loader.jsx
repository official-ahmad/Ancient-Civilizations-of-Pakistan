import React from "react";
import styled from "styled-components";

const Radar = styled.div`
  .loader {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    box-shadow: 25px 25px 75px rgba(0, 0, 0, 0.55);
    border: 1px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .loader::before {
    content: "";
    position: absolute;
    inset: 20px;
    border: 1px dashed #444;
    border-radius: 50%;
    box-shadow:
      inset -5px -5px 25px rgba(0, 0, 0, 0.25),
      inset 5px 5px 35px rgba(0, 0, 0, 0.25);
  }
  .loader::after {
    content: "";
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px dashed #444;
    box-shadow:
      inset -5px -5px 25px rgba(0, 0, 0, 0.25),
      inset 5px 5px 35px rgba(0, 0, 0, 0.25);
  }
  .loader span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 100%;
    transform-origin: top left;
    animation: radar81 2s linear infinite;
    border-top: 1px dashed #fff;
  }
  .loader span::before {
    content: "";
    position: absolute;
    inset: 0;
    background: seagreen;
    transform-origin: top left;
    transform: rotate(-55deg);
    filter: blur(30px) drop-shadow(20px 20px 20px seagreen);
  }
  @keyframes radar81 {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function Loader() {
  return (
    <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center gap-6 select-none">
      <Radar>
        <div className="loader">
          <span />
        </div>
      </Radar>
      <div className="text-center">
        <h2 className="text-emerald-400 font-extrabold text-xl tracking-wider">
          CIVILIZATIONS OF PAKISTAN
        </h2>
        <p className="text-slate-400 text-xs mt-1 animate-pulse">
          Connecting Google Satellite Engine & Historical Archives...
        </p>
      </div>
    </div>
  );
}
