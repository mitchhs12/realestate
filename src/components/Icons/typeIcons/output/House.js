import * as React from "react";
const SvgHouse = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="house_svg__TRAZOS"
    viewBox="0 0 78 83"
    {...props}
  >
    <defs>
      <style>
        {
          ".house_svg__cls-3{fill:none;stroke:#727070;stroke-width:3px;stroke-linejoin:round;stroke-linecap:round}"
        }
      </style>
    </defs>
    <path
      d="m60.51 69.62-.23-27.45c0-.46.12.22 0-.23h5.15L38.89 12.43l-1.48 1.37-24.48 27.34-.57.68H18c-.11.46-.23-.11.12.35v27.45"
      style={{
        fill: "none",
        stroke: "#727070",
        strokeWidth: 3,
        strokeLinejoin: "round",
      }}
    />
    <path
      d="M48.73 69.62V51.2a5.61 5.61 0 0 0-5.6-5.6H35a6.1 6.1 0 0 0-6.06 6.06v18"
      style={{
        fill: "none",
        stroke: "#727070",
        strokeWidth: 3,
        strokeMiterlimit: 10,
      }}
    />
    <path
      d="M54.91 28.84v-9.27M18.11 69.62h42.4"
      className="house_svg__cls-3"
    />
  </svg>
);
export default SvgHouse;
