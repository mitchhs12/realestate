import React from "react";

export type IconProps = React.HTMLAttributes<SVGElement> & {
  width?: number;
  height?: number;
  color?: string;
};

type FeatureComponent = (props: IconProps) => JSX.Element;

export const featureIcons: Record<string, FeatureComponent> = {
  none: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="-5 -4 33 33"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  ),
  "air-conditioning": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M18.37,50.08H16.24a4.23,4.23,0,0,1-4.11-4.33V31.07a4.23,4.23,0,0,1,4.11-4.33H64.09a4.23,4.23,0,0,1,4.12,4.33V45.75a4.23,4.23,0,0,1-4.12,4.33H42.81"
      />
      <path className="cls-1" d="M54.29,50.08V45c0-2.14-1.15-3.88-2.58-3.88H20.94c-1.42,0-2.57,1.74-2.57,3.88v4.22" />
      <path
        fill={color}
        d="M34.09,48.4q4.23,3.83-.17,7.6a5,5,0,0,0-.77.68,11.14,11.14,0,0,0-1.37,1.84,10.65,10.65,0,0,0-.87,5.95c.46,4,2.88,7.25,7,7.62,1.92.18,1.91-2.83,0-3-3.81-.34-4.9-5.66-3.76-8.49C34.8,59,36.68,58,37.64,56.68a8.41,8.41,0,0,0,1.5-5.27C39,48,37,44.88,33.3,45.51c-1.9.33-1.1,3.22.79,2.89Z"
      />
      <path
        fill={color}
        d="M23.59,48.4q4.23,3.83-.17,7.6a5,5,0,0,0-.77.68,11.73,11.73,0,0,0-1.37,1.84,10.65,10.65,0,0,0-.87,5.95c.46,4,2.88,7.25,7,7.62,1.92.18,1.91-2.83,0-3-3.81-.34-4.9-5.66-3.76-8.49.65-1.59,2.52-2.56,3.48-3.92a8.41,8.41,0,0,0,1.5-5.27c-.12-3.39-2.19-6.53-5.84-5.9-1.9.33-1.1,3.22.79,2.89Z"
      />
    </svg>
  ),
  attic: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width} color={color}>
      <defs>
        <style>{`.cls-1,.cls-2{fill:none;stroke:#727070;stroke-linejoin:round;stroke-width:3px;}.cls-2{stroke-linecap:round;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M64.8,70.07,64.57,43c0-.45.11.22,0-.23h5.09L43.44,13.56,42,14.92l-24.19,27-.56.68h5.53c-.11.45-.22-.11.12.34V70.07"
      />
      <line className="cls-2" x1="59.26" y1="29.78" x2="59.26" y2="20.63" />
      <line className="cls-2" x1="22.9" y1="70.07" x2="64.8" y2="70.07" />
      <line className="cls-2" x1="37.44" y1="53.91" x2="45.05" y2="53.91" />
      <line className="cls-2" x1="37.44" y1="59.01" x2="37.44" y2="53.91" />
      <line className="cls-2" x1="45.46" y1="48.41" x2="53.06" y2="48.41" />
      <line className="cls-2" x1="45.46" y1="53.51" x2="45.46" y2="48.41" />
      <line className="cls-2" x1="53.06" y1="42.71" x2="66.43" y2="42.71" />
      <line className="cls-2" x1="53.06" y1="47.81" x2="53.06" y2="42.71" />
      <line className="cls-2" x1="21.26" y1="42.51" x2="40.58" y2="42.51" />
    </svg>
  ),
  balcony: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path className="cls-1" d="M56,49.64V25.91c0-6.62-4.42-12-9.82-12H31.33c-5.41,0-9.83,5.42-9.83,12V49.64" />
      <line className="cls-1" x1="10.24" y1="49.64" x2="67.91" y2="49.64" />
      <line className="cls-1" x1="10.24" y1="71.14" x2="67.91" y2="71.14" />
      <line className="cls-1" x1="18.39" y1="50.91" x2="18.39" y2="69.14" />
      <line className="cls-1" x1="29.37" y1="50.81" x2="29.37" y2="69.97" />
      <line className="cls-1" x1="40.28" y1="50.81" x2="40.28" y2="69.97" />
      <line className="cls-1" x1="50.68" y1="50.81" x2="50.68" y2="69.97" />
      <line className="cls-1" x1="61.82" y1="50.45" x2="61.82" y2="69.61" />
      <line className="cls-1" x1="38.98" y1="13.87" x2="38.98" y2="48.47" />
      <line className="cls-1" x1="15.93" y1="60.39" x2="20.86" y2="60.39" />
      <line className="cls-1" x1="26.91" y1="60.39" x2="31.83" y2="60.39" />
      <line className="cls-1" x1="37.58" y1="60.39" x2="42.51" y2="60.39" />
      <line className="cls-1" x1="48.21" y1="60.39" x2="53.14" y2="60.39" />
      <line className="cls-1" x1="59.35" y1="60.39" x2="64.28" y2="60.39" />
    </svg>
  ),
  basement: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M59.13,55,59,36.91c0-.34.09.17,0-.17H63l-21-22.07-1.17,1L21.53,36.14l-.45.51h4.43c-.09.35-.18-.08.09.26V55"
      />
      <polyline className="cls-1" points="61.28 47.13 70.33 47.13 70.33 66.96 13.77 66.96 13.77 47.13 24.81 47.13" />
      <line className="cls-1" x1="26.08" y1="47.12" x2="32.71" y2="47.12" />
      <line className="cls-1" x1="32.71" y1="51.52" x2="32.71" y2="47.12" />
      <line className="cls-1" x1="32.71" y1="51.9" x2="39.34" y2="51.9" />
      <line className="cls-1" x1="39.34" y1="56.3" x2="39.34" y2="51.9" />
      <line className="cls-1" x1="39.65" y1="56.3" x2="46.28" y2="56.3" />
      <line className="cls-1" x1="46.28" y1="60.69" x2="46.28" y2="56.3" />
      <line className="cls-1" x1="46.28" y1="60.69" x2="52.91" y2="60.69" />
      <line className="cls-1" x1="52.91" y1="65.09" x2="52.91" y2="60.69" />
    </svg>
  ),
  bbq: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <path className="cls-1" d="M59.94,31.88A19.41,19.41,0,0,1,40.3,51.06,19.41,19.41,0,0,1,20.67,31.88" />
      <line className="cls-1" x1="20.67" y1="31.88" x2="59.54" y2="31.88" />
      <line className="cls-1" x1="38.58" y1="51.06" x2="30.89" y2="61.75" />
      <line className="cls-1" x1="44.76" y1="51.84" x2="55.1" y2="66.82" />
      <path
        fill={color}
        d="M40.19,15.58c1,.82,1,1.67,0,2.55l-.81.62a4.18,4.18,0,0,0-1.12,1.64,5,5,0,0,0,0,3.61c.85,2.05,3.41,3.46,5.49,2.38,1.71-.89.2-3.48-1.52-2.59-.79.41-1.38-1.45-1.34-1.79.12-.83,1-1.4,1.57-1.91a4.5,4.5,0,0,0,1.42-3c.18-2.29-1.24-4.6-3.72-4.51-1.92.06-1.93,3.06,0,3Z"
      />
      <path
        fill={color}
        d="M49,19.48A1,1,0,0,1,48.93,21l-.8.63A3.77,3.77,0,0,0,47.19,23a4.38,4.38,0,0,0,.07,3.28A3.79,3.79,0,0,0,52.33,28a1.5,1.5,0,0,0-1.51-2.59c-.49.28-.88-.41-.91-.73-.07-.63.35-.88.74-1.26a4.14,4.14,0,0,0,1.57-2.69c.28-2-.93-4.3-3.21-4.21-1.92.07-1.93,3.07,0,3Z"
      />
      <path
        fill={color}
        d="M32.55,19.48A1,1,0,0,1,32.46,21l-.8.63a3.8,3.8,0,0,0-1,1.46,4.44,4.44,0,0,0,.07,3.15c.77,1.82,3.09,3,4.92,2.06s.2-3.48-1.51-2.59c.3,0,.21-.12-.28-.24a.86.86,0,0,1-.46-1c.07-.66.73-1,1.14-1.35a4,4,0,0,0,1.21-2.64c.15-2-1.09-4-3.24-3.95-1.93.07-1.94,3.07,0,3Z"
      />
      <line className="cls-1" x1="15.17" y1="34.01" x2="19.46" y2="34.01" />
      <line className="cls-1" x1="15.17" y1="34.01" x2="19.46" y2="34.01" />
      <line className="cls-1" x1="60.37" y1="34.01" x2="64.65" y2="34.01" />
      <ellipse className="cls-1" cx="25.89" cy="65.77" rx="4.04" ry="3.64" />
      <line className="cls-1" x1="27.7" y1="62.14" x2="50.77" y2="62.14" />
    </svg>
  ),
  "beach-access": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <path className="cls-1" d="M59.78,65.63C52.31,48.84,30.48,42.27,11,51" />
      <path
        fill={color}
        d="M36.28,49.32c2.53.61,3.68-.93,5.93-1.74C46.47,46,49.08,49.94,53,50c3.27,0,4.8-1.67,7.62-2.75s5.23,2.12,8.35,2.09a1.5,1.5,0,0,0,0-3c-2.53,0-4.15-2.69-6.91-2.64-3,.05-5,2.88-8,3.18-3.77.38-5.22-2.79-8.61-3.15-3-.31-5.87,3.33-8.42,2.71-1.87-.46-2.67,2.43-.8,2.89Z"
      />
      <path
        fill={color}
        d="M52.31,57.38c2.65.88,4.43-1.28,6.72-2.15s3.54.23,5.35,1.44a8.61,8.61,0,0,0,4.47,1.38c1.92.14,1.92-2.86,0-3-3.22-.24-4.87-3.44-8.23-3.29a7.57,7.57,0,0,0-2.72.72c-1.19.51-3.49,2.44-4.79,2-1.84-.61-2.62,2.28-.8,2.89Z"
      />
      <line className="cls-1" x1="33.12" y1="47.12" x2="26.13" y2="30.25" />
      <path className="cls-1" d="M12.44,34.65c-2.83-6.16.76-13.85,8-17.18s15.43-1,18.26,5.11" />
      <line className="cls-1" x1="38.71" y1="22.58" x2="12.71" y2="34.53" />
      <line className="cls-1" x1="20.44" y1="16.43" x2="19.3" y2="14.3" />
      <path className="cls-1" d="M53.7,29.86c0-1.65-3-4.09-6.68-4.09" />
      <path className="cls-1" d="M53.7,29.86c0-1.78,2.62-4.2,5.85-4.2" />
    </svg>
  ),
  "car-parking": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <line className="cls-1" x1="19.39" y1="63.02" x2="19.39" y2="23.48" />
      <rect className="cls-1" x="8.78" y="7.38" width="21.02" height="15.04" rx="3.32" />
      <path className="cls-1" d="M28.14,55.44V48.66c0-5,2.62-9.13,5.85-9.13h25.4c3.23,0,5.84,4.09,5.84,9.13v6.78" />
      <rect className="cls-1" x="28.14" y="55.8" width="6.98" height="7.37" />
      <rect className="cls-1" x="58.25" y="55.8" width="6.98" height="7.37" />
      <polygon className="cls-1" points="57.48 28.93 37.25 28.93 34.55 39.53 60.4 39.53 57.48 28.93" />
      <line className="cls-1" x1="29.83" y1="49.79" x2="38.26" y2="49.88" />
      <line className="cls-1" x1="63.55" y1="49.84" x2="57.14" y2="49.84" />
      <line className="cls-1" x1="32.86" y1="38.3" x2="26.01" y2="38.3" />
      <line className="cls-1" x1="60.4" y1="38.3" x2="67.37" y2="38.3" />
      <line className="cls-1" x1="28.14" y1="55.8" x2="63.91" y2="55.8" />
    </svg>
  ),
  elevator: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <rect className="cls-1" x="22.18" y="25.42" width="35.74" height="40.24" />
      <rect className="cls-1" x="32.91" y="18.06" width="13.66" height="7.36" />
      <line className="cls-1" x1="40.06" y1="9.32" x2="40.06" y2="17.42" />
      <path className="cls-1" d="M49.5,64.22V43A4.66,4.66,0,0,0,45,38.18h-9.8A4.65,4.65,0,0,0,30.74,43V64.22" />
      <line className="cls-1" x1="29.97" y1="32.1" x2="48.58" y2="32.1" />
      <line className="cls-1" x1="17.9" y1="18.24" x2="22.34" y2="13.79" />
      <line className="cls-1" x1="26.46" y1="18.17" x2="22.34" y2="13.79" />
      <line className="cls-1" x1="60.77" y1="14.16" x2="56.59" y2="18.61" />
      <line className="cls-1" x1="52.21" y1="14.23" x2="56.33" y2="18.61" />
    </svg>
  ),
  "exercise-equipment": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <rect className="cls-1" x="47.23" y="15.12" width="8.47" height="19.33" rx="3.32" />
      <rect className="cls-1" x="56.11" y="18.5" width="6.95" height="12.29" rx="2.72" />
      <rect className="cls-1" x="16.81" y="15.64" width="8.47" height="19.33" rx="3.32" />
      <rect className="cls-1" x="9.86" y="18.64" width="6.95" height="12.29" rx="2.72" />
      <rect className="cls-1" x="25.28" y="21.55" width="21.95" height="6.19" />
      <line className="cls-1" x1="27.5" y1="40.98" x2="27.5" y2="57.03" />
      <line className="cls-1" x1="46.11" y1="40.89" x2="46.11" y2="57.03" />
      <line className="cls-1" x1="27.5" y1="67.75" x2="27.5" y2="72.05" />
      <line className="cls-1" x1="46.11" y1="67.75" x2="46.11" y2="72.05" />
      <polygon className="cls-1" points="57.09 67.41 15.41 67.41 20.86 58.05 52.49 58.05 57.09 67.41" />
    </svg>
  ),
  "fire-pit": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <rect className="cls-1" x="14.58" y="48.12" width="55.61" height="18.39" />
      <line className="cls-1" x1="14.58" y1="54.34" x2="26.05" y2="54.34" />
      <line className="cls-1" x1="29.24" y1="61.88" x2="37.85" y2="61.88" />
      <line className="cls-1" x1="45.93" y1="54.34" x2="56.28" y2="54.34" />
      <line className="cls-1" x1="58.38" y1="59.37" x2="70.18" y2="59.37" />
      <path className="cls-1" d="M39.56,44.67c-9.24-2.26-12.74-11.28-3.89-19.4" />
      <path className="cls-1" d="M41.08,34.41c-4.12-1-6.79-3.76-4.84-9.14" />
      <path
        fill={color}
        d="M40.89,35.94c4.84.92,7.19-5.66,5.49-9.33-1.6-3.43-6.31-4.59-4.63-9.06.66-1.77,2.08-3.61.89-5.47-1-1.62-3.64-.12-2.59,1.51.46.73-1.48,3.43-1.72,4.33a5.62,5.62,0,0,0,.38,3.92,9.74,9.74,0,0,0,2.46,3.54c1.11,1,2.33,1.57,2.72,3.21.33,1.35-.71,4.74-2.2,4.46-1.89-.36-2.7,2.53-.8,2.89Z"
      />
      <path
        fill={color}
        d="M40.43,13.73c4.62,3.85,9.3,9,11.33,14.7,3,8.52-2.84,15.87-11.68,14.74-1.91-.24-1.89,2.76,0,3,7.92,1,14.69-3.63,15.54-11.9.9-8.78-6.82-17.45-13.07-22.66-1.48-1.23-3.61.89-2.12,2.12Z"
      />
    </svg>
  ),
  garage: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M61.71,69.51,61.48,41c0-.42.12.22,0-.21h5.16L40,13.47l-1.49,1.28L14,40.08l-.57.64h5.62c-.11.42-.23-.11.11.31V69.51"
      />
      <path className="cls-1" d="M27.61,64V59.21c0-3.56,1.86-6.45,4.15-6.45h18c2.29,0,4.15,2.89,4.15,6.45V64" />
      <rect className="cls-1" x="27.61" y="64.25" width="4.95" height="5.21" />
      <rect className="cls-1" x="48.98" y="64.25" width="4.95" height="5.21" />
      <polygon className="cls-1" points="48.43 45.27 34.08 45.27 32.16 52.76 50.51 52.76 48.43 45.27" />
      <line className="cls-1" x1="28.81" y1="60.01" x2="34.79" y2="60.07" />
      <line className="cls-1" x1="52.74" y1="60.04" x2="48.19" y2="60.04" />
      <line className="cls-1" x1="30.96" y1="51.89" x2="26.1" y2="51.89" />
      <line className="cls-1" x1="50.51" y1="51.89" x2="55.45" y2="51.89" />
      <line className="cls-1" x1="27.61" y1="64.25" x2="53" y2="64.25" />
    </svg>
  ),
  "garden-yard": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1,.cls-2{fill:none;stroke:#727070;stroke-width:3px;}.cls-1{stroke-linecap:round;stroke-linejoin:round;}.cls-2{stroke-miterlimit:10;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M43,46.39l0-2.58c0-.31.07.16,0-.15h3.32L29.11,23.43l-1,.94L12.33,43.11l-.37.47h3.62c-.07.31-.15-.08.07.23v21"
      />
      <line className="cls-1" x1="29.72" y1="64.83" x2="70.5" y2="64.83" />
      <line className="cls-1" x1="29.72" y1="57.02" x2="70.5" y2="57.02" />
      <line className="cls-1" x1="34.98" y1="51.39" x2="34.98" y2="63.53" />
      <line className="cls-1" x1="41.8" y1="51.39" x2="41.8" y2="63.53" />
      <line className="cls-1" x1="56.91" y1="44.13" x2="56.91" y2="63.53" />
      <line className="cls-1" x1="64.05" y1="41.85" x2="64.05" y2="63.53" />
      <ellipse fill={color} cx="64.05" cy="24.15" rx="3.73" ry="6.44" />
      <ellipse fill={color} cx="56.91" cy="43.89" rx="3.4" ry="5.31" />
      <line className="cls-1" x1="64.05" y1="23.75" x2="64.05" y2="41.08" />
      <line className="cls-1" x1="16.49" y1="64.83" x2="21.46" y2="64.83" />
      <line className="cls-1" x1="49.1" y1="51.39" x2="49.1" y2="63.53" />
    </svg>
  ),
  "heating-system": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <rect className="cls-1" x="19.46" y="35.49" width="6.47" height="29.38" rx="3.23" />
      <rect className="cls-1" x="25.93" y="35.49" width="6.47" height="29.38" rx="3.23" />
      <rect className="cls-1" x="32.39" y="35.49" width="6.47" height="29.38" rx="3.23" />
      <rect className="cls-1" x="38.86" y="35.49" width="6.47" height="29.38" rx="3.23" />
      <line className="cls-1" x1="12.77" y1="35.49" x2="12.65" y2="39.81" />
      <line className="cls-1" x1="19.46" y1="40.27" x2="12.71" y2="40.27" />
      <line className="cls-1" x1="45.33" y1="40.27" x2="50.88" y2="40.27" />
      <path
        fill={color}
        d="M38.42,19.8c1.56,1,1.53,1.86-.09,2.59l-.79.58a5.31,5.31,0,0,0-.94,1.18,5.53,5.53,0,0,0-.54,3.46,5.38,5.38,0,0,0,5.23,4.5c1.93.14,1.92-2.86,0-3a2.18,2.18,0,0,1-1.88-3.36c.47-.86,1-1,1.72-1.63A4.4,4.4,0,0,0,42.61,21a3.85,3.85,0,0,0-4.19-4.17c-1.89.25-1.91,3.25,0,3Z"
      />
      <path
        fill={color}
        d="M31.29,19.8c1.55,1,1.52,1.86-.09,2.59-.27.19-.54.38-.79.58a5.31,5.31,0,0,0-.94,1.18,5.53,5.53,0,0,0-.54,3.46,5.38,5.38,0,0,0,5.23,4.5c1.92.14,1.92-2.86,0-3a2.18,2.18,0,0,1-1.88-3.36c.47-.86,1-1,1.72-1.63A4.4,4.4,0,0,0,35.48,21a3.85,3.85,0,0,0-4.19-4.17c-1.89.25-1.91,3.25,0,3Z"
      />
      <path className="cls-1" d="M58.49,64.74c-7.07-1.74-9.74-8.63-3-14.83" />
      <path className="cls-1" d="M59.65,56.89c-3.15-.78-5.19-2.87-3.7-7" />
      <path
        fill={color}
        d="M59.81,58.46c3.81.37,5.68-4.47,4.33-7.47-1.1-2.47-4.65-3.51-3.82-6.6.44-1.64,1.66-3.07.63-4.75s-3.61-.13-2.59,1.52c.29.47-1.28,3.07-1.35,3.88a6.26,6.26,0,0,0,1.21,3.71c.93,1.45,3,2.29,3.31,4A2.28,2.28,0,0,1,61,54.73a3,3,0,0,0-1,.57c-.51.52-.57.57-.17.16-1.92-.19-1.91,2.81,0,3Z"
      />
      <path
        fill={color}
        d="M58.9,41.34a31.88,31.88,0,0,1,7.75,9.23c3.36,6.37,0,13.56-7.76,12.67-1.92-.22-1.9,2.78,0,3,6,.69,11.17-2.56,12.15-8.85,1.09-7.07-5-14-10-18.18-1.47-1.23-3.6.88-2.12,2.13Z"
      />
    </svg>
  ),
  "home-office": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M65.42,67.54l-.22-26.8c0-.44.11.23,0-.22h5L44.32,11.71l-1.45,1.34L19,39.74l-.56.67h5.47c-.11.44-.22-.11.11.33v26.8"
      />
      <line className="cls-1" x1="59.95" y1="27.74" x2="59.95" y2="18.69" />
      <rect className="cls-1" x="34.98" y="45.57" width="19.06" height="13.62" />
      <polygon className="cls-1" points="58.73 67.54 30.3 67.54 34.9 59.18 54.05 59.18 58.73 67.54" />
      <path className="cls-1" d="M38.06,30.07A9.12,9.12,0,0,1,51,29.86" />
      <path className="cls-1" d="M40.3,34.49a5.7,5.7,0,0,1,8-.52" />
      <path className="cls-1" d="M42.58,38.66a2.74,2.74,0,0,1,3.86,0" />
    </svg>
  ),
  "hot-tub": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <rect className="cls-1" x="17.03" y="40.5" width="50.11" height="22.6" rx="7.13" />
      <line className="cls-1" x1="13.43" y1="40.56" x2="71.21" y2="40.56" />
      <rect className="cls-1" x="46.78" y="40.56" width="10.71" height="10.63" />
      <path
        fill={color}
        d="M31.18,23.87c1.94-.07-.5,2.57-.85,2.9a4.11,4.11,0,0,0-1.09,1.6,4.83,4.83,0,0,0,.06,3.49c.84,2,3.33,3.33,5.35,2.28,1.71-.88.2-3.47-1.52-2.59-.7.36-1.23-1.35-1.19-1.63.11-.79,1-1.3,1.49-1.77a4.34,4.34,0,0,0,1.37-2.91c.18-2.23-1.22-4.45-3.62-4.37-1.93.07-1.94,3.07,0,3Z"
      />
      <path
        fill={color}
        d="M23.85,27.58a.94.94,0,0,1-.13,1.28l-.77.6A3.88,3.88,0,0,0,22,30.88a4.3,4.3,0,0,0,.08,3.06,3.67,3.67,0,0,0,4.8,2c1.72-.89.2-3.48-1.51-2.59.33,0,.26-.11-.21-.23a.76.76,0,0,1-.41-.89c.07-.61.7-.87,1.08-1.24A3.82,3.82,0,0,0,27,28.42c.15-1.93-1.07-3.91-3.16-3.84-1.93.07-1.94,3.07,0,3Z"
      />
      <line className="cls-1" x1="62.05" y1="40.56" x2="62.05" y2="19.81" />
      <line className="cls-1" x1="53.35" y1="19.81" x2="62.05" y2="19.81" />
      <line className="cls-1" x1="52.74" y1="25.04" x2="52.74" y2="19.81" />
    </svg>
  ),
  "indoor-fireplace": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}.cls-2{fill:#727070;}`}</style>
      </defs>
      <path className="cls-1" d="M37.34,63.25c-5.9-1.45-8.13-7.21-2.48-12.39" />
      <path className="cls-1" d="M38.32,56.69c-2.64-.65-4.35-2.4-3.1-5.83" />
      <path
        fill={color}
        d="M38.45,58.25a4.86,4.86,0,0,0,3.66-2,5.48,5.48,0,0,0,0-4.82c-1-1.85-3.89-2.92-2.79-5.24.63-1.33,1.75-2.54.86-4a1.5,1.5,0,0,0-2.59,1.51,9.37,9.37,0,0,0-1.71,2.77,4.66,4.66,0,0,0,.8,3.28c.76,1.3,2.55,2.14,2.91,3.55a1.63,1.63,0,0,1-.34,1.4,2.74,2.74,0,0,0-.89.52c-.48.46-.47.47,0,.06-1.92-.19-1.91,2.81,0,3Z"
      />
      <path
        fill={color}
        d="M38.08,44c3,2.42,6.23,4.81,7.22,8.75,1.33,5.28-2.16,9.65-7.62,9-1.92-.22-1.9,2.78,0,3a9.57,9.57,0,0,0,10.86-8c1.09-6.54-3.7-11.18-8.33-14.87-1.5-1.19-3.64.92-2.13,2.12Z"
      />
      <path className="cls-1" d="M53.62,67.39v-21c0-7.42-6.46-13.5-14.35-13.5h0c-7.9,0-14.36,6.08-14.36,13.5v21" />
      <line className="cls-1" x1="18.26" y1="67.39" x2="60.36" y2="67.39" />
      <line className="cls-1" x1="18.26" y1="67.39" x2="18.26" y2="24.46" />
      <line className="cls-1" x1="60.36" y1="67.39" x2="60.36" y2="23.33" />
      <line className="cls-1" x1="10.31" y1="22.76" x2="67.05" y2="22.76" />
    </svg>
  ),
  "lake-access": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1,.cls-3{fill:none;stroke:#727070;stroke-width:3px;}.cls-1{stroke-linecap:round;stroke-linejoin:round;}.cls-2{fill:#727070;}.cls-3{stroke-miterlimit:10;}`}</style>
      </defs>
      <line className="cls-1" x1="14.46" y1="47.61" x2="69.69" y2="47.61" />
      <path
        fill={color}
        d="M22.35,59.1c2.11.66,3.33-.32,5.07-1.54,2.07-1.46,2.39-2.47,5.58-.63.77.45,1.33,1.33,2.1,1.81A8.1,8.1,0,0,0,41,59.8c2.57-.43,3.75-2.34,6-3.17,2.66-1,4.1,1.55,6.66,2.19a6.91,6.91,0,0,0,5.75-1.1c1.48-.92,2.47-2.5,4.49-1.88.27.08,1.6,1.51,1.83,1.66,1.51,1,3.51,1.77,5.26,1.16s1-3.52-.8-2.89c-2.48.86-3.69-2.4-5.48-3.11-1.51-.61-2.82-.14-4.21.6-1.11.59-2,1.74-3.12,2.23-2.64,1.12-3.87-.37-6.15-1.56-1.25-.67-1.94-1.2-3.45-1-1.89.28-3.13,2-4.71,2.87-3.81,2.12-6,0-9.13-2a5.49,5.49,0,0,0-4.51-1c-1.84.48-4.39,4-6.27,3.44s-2.64,2.32-.8,2.89Z"
      />
      <path
        fill={color}
        d="M21.46,66.26c1.63.51,2.61.08,4.06-.78,2.27-1.35,2.94-3.6,6.84-1.37.69.4,1.19,1.33,1.89,1.79,3.83,2.55,7.19.52,10.66-1.24,4.38-2.22,8.19,3.43,13,.58.73-.42,1.3-1.44,2.05-1.75,1.69-.7,3.42.36,4.69,1.05,2.18,1.21,2.88,2,5.41,1.28a1.5,1.5,0,0,0-.8-2.89c-2.27.65-4.78-3.2-7.16-3.4a5,5,0,0,0-3.09.89c-.75.46-1.28,1.3-2,1.74-3.3,1.93-4.15.51-6.66-.84-1.34-.72-2.26-1.27-3.82-1-2.32.45-3.76,2.7-6,3.43-3.48,1.14-5.06-1.61-7.58-3.09A5.55,5.55,0,0,0,28.89,60c-1.91.4-4.85,4-6.63,3.41s-2.64,2.32-.8,2.89Z"
      />
      <line className="cls-1" x1="26.21" y1="47.61" x2="26.21" y2="24.89" />
      <ellipse className="cls-3" cx="26.21" cy="22.38" rx="6.51" ry="10.76" />
    </svg>
  ),
  "laundry-room": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:#727070;}.cls-2{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        fill={color}
        d="M29.72,55.06a5.45,5.45,0,0,1,5.74-.88c.83.36,1.8,1.71,2.57,2.23a7.86,7.86,0,0,0,4.18,1.45,10,10,0,0,0,5.32-1.09c1.5-.89,2-2.89,3.6-3.6,1.76-.79.24-3.37-1.51-2.59s-2.38,3-4.25,3.85c-3.53,1.64-6-1.25-8.65-3-3.23-2.25-5.64-1-8.51,1.09-1.53,1.14,0,3.75,1.51,2.59Z"
      />
      <rect className="cls-1" x="18.25" y="19.61" width="42.96" height="52.42" />
      <line className="cls-1" x1="18.25" y1="34.31" x2="61.21" y2="34.31" />
      <ellipse className="cls-1" cx="28.89" cy="27.71" rx="2.83" ry="2.54" />
      <ellipse className="cls-1" cx="39.94" cy="53.8" rx="10.95" ry="10.3" />
      <line className="cls-1" x1="47.64" y1="24.32" x2="54.14" y2="24.32" />
      <line className="cls-1" x1="47.64" y1="29.31" x2="54.14" y2="29.31" />
    </svg>
  ),
  "outdoor-dining-area": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <line className="cls-1" x1="41.34" y1="74.16" x2="41.34" y2="31.29" />
      <path className="cls-1" d="M21.46,31.29c0-7.71,8.9-14,19.88-14s19.89,6.25,19.89,14" />
      <line className="cls-1" x1="21.46" y1="31.29" x2="61.23" y2="31.29" />
      <line className="cls-1" x1="21.34" y1="48.76" x2="21.34" y2="73.47" />
      <line className="cls-1" x1="22.15" y1="64.66" x2="30.96" y2="64.66" />
      <line className="cls-1" x1="32" y1="73.47" x2="32" y2="64.66" />
      <line className="cls-1" x1="61.88" y1="47.97" x2="61.88" y2="73.47" />
      <line className="cls-1" x1="59.75" y1="64.66" x2="51.49" y2="64.66" />
      <line className="cls-1" x1="51.49" y1="74.16" x2="51.49" y2="64.66" />
      <line className="cls-1" x1="31.07" y1="57.32" x2="51.62" y2="57.32" />
    </svg>
  ),
  patio: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M46.84,42.8V37.16c0-.35.09.18,0-.18h4L30.34,14.23l-1.15,1.06L10.31,36.37l-.44.52h4.32c-.08.36-.17-.08.09.27V60.8"
      />
      <line className="cls-1" x1="24.82" y1="61.43" x2="66.5" y2="61.43" />
      <line className="cls-1" x1="24.82" y1="53.44" x2="66.5" y2="53.44" />
      <line className="cls-1" x1="31.58" y1="47.7" x2="31.58" y2="60.1" />
      <line className="cls-1" x1="38.54" y1="47.7" x2="38.54" y2="60.1" />
      <line className="cls-1" x1="46" y1="47.7" x2="46" y2="60.1" />
      <line className="cls-1" x1="53.06" y1="47.7" x2="53.06" y2="60.1" />
      <line className="cls-1" x1="60.77" y1="47.7" x2="60.77" y2="60.1" />
      <line className="cls-1" x1="14.35" y1="60.8" x2="19.43" y2="60.8" />
    </svg>
  ),
  pool: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:#727070;}.cls-2{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        fill={color}
        d="M10.63,53.71c2.81,1.45,3.77.22,6.4-.92,4.87-2.11,5.41,1.43,9.4,1.91,3.57.43,4.23-3.47,7.74-3.57,2.62-.08,4.17,2.4,6.56,2.89,2.23.46,3.46-.89,5.35-1.82,5-2.48,5.19,1.14,9.37,1.51,2.92.26,4.87-3.38,7.79-2.62,2.46.64,3.1,3.23,6.05,3.31,1.93.06,1.93-2.94,0-3-2.8-.08-4.18-3.75-7.17-3.75-3.45,0-4.48,4-8.22,2.15-1.95-.95-3-2.41-5.38-2.15-3.26.36-4.78,3.9-8.31,2.82-2.2-.66-3.51-2.31-6-2.34s-3.43,1.26-5.33,2.24c-3.76,2-4.52-1.41-8-1.93-2.9-.44-6.35,3.9-8.71,2.67-1.71-.88-3.23,1.71-1.51,2.6Z"
      />
      <path
        fill={color}
        d="M10.63,62.59c2.81,1.46,3.77.23,6.4-.92,4.87-2.11,5.41,1.44,9.4,1.92C30,64,30.66,60.12,34.17,60c2.62-.08,4.17,2.4,6.56,2.9,2.23.46,3.46-.89,5.35-1.82,5-2.49,5.19,1.14,9.37,1.51,2.92.25,4.87-3.39,7.79-2.63,2.46.64,3.1,3.23,6.05,3.32,1.93.06,1.93-2.94,0-3-2.8-.08-4.18-3.76-7.17-3.76-3.45,0-4.48,4-8.22,2.16-1.95-1-3-2.41-5.38-2.16-3.26.36-4.78,3.9-8.31,2.83-2.2-.67-3.51-2.31-6-2.35s-3.43,1.26-5.33,2.25c-3.76,2-4.52-1.42-8-1.94-2.9-.43-6.35,3.9-8.71,2.68-1.71-.89-3.23,1.7-1.51,2.59Z"
      />
      <line className="cls-2" x1="35.16" y1="26.53" x2="35.16" y2="43.54" />
      <line className="cls-2" x1="50.34" y1="26.53" x2="50.34" y2="43.54" />
      <line className="cls-2" x1="35.16" y1="32.13" x2="50.34" y2="32.13" />
      <line className="cls-2" x1="35.87" y1="39.36" x2="50.34" y2="39.36" />
      <path className="cls-2" d="M41.65,26c0-3,2-5.47,4.34-5.47S50.34,23,50.34,26" />
      <path className="cls-2" d="M26.47,26c0-3,2-5.47,4.35-5.47S35.16,23,35.16,26" />
    </svg>
  ),
  "security-system": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <path
        className="cls-1"
        d="M48,65.31H20.09a4.51,4.51,0,0,1-4.51-4.51V36.91a4.51,4.51,0,0,1,4.51-4.51H48a4.51,4.51,0,0,1,4.51,4.51h0"
      />
      <path className="cls-1" d="M24.73,30.53V28c0-6,4.19-10.95,9.32-10.95h0c5.12,0,9.32,4.93,9.32,11v2.71" />
      <ellipse className="cls-1" cx="33.2" cy="45.88" rx="3.93" ry="3.5" />
      <line className="cls-1" x1="33.2" y1="59.04" x2="33.2" y2="49.8" />
      <ellipse className="cls-1" cx="59.41" cy="52.77" rx="12.51" ry="12.61" />
      <line className="cls-1" x1="53.13" y1="53.77" x2="57.41" y2="58.75" />
      <line className="cls-1" x1="65.69" y1="48.23" x2="57.41" y2="58.75" />
    </svg>
  ),
  "ski-in-ski-out": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <ellipse className="cls-1" cx="29.28" cy="17.05" rx="4.47" ry="4.59" />
      <path
        className="cls-1"
        d="M20.39,68.73l35.5-11.86c1.9-.64,3.09-2.3,2.62-3.69h0c-.46-1.39-2.41-2-4.32-1.37L22.88,62.27"
      />
      <path
        className="cls-1"
        d="M19.84,68.91a3.33,3.33,0,0,1-4.38-1.55l-1.51-4a3.31,3.31,0,0,1,2.26-4.06l.86-.33a3.32,3.32,0,0,1,4.38,1.55l.61,1.6"
      />
      <line className="cls-1" x1="27.54" y1="21.68" x2="31.39" y2="33.54" />
      <line className="cls-1" x1="18.69" y1="32.65" x2="31.43" y2="33.74" />
      <line className="cls-1" x1="32.54" y1="37.83" x2="33.53" y2="40.12" />
      <line className="cls-1" x1="26.52" y1="42.1" x2="33.62" y2="40.46" />
      <line className="cls-1" x1="32.36" y1="56.64" x2="26.52" y2="42.1" />
      <line className="cls-1" x1="42.3" y1="39.8" x2="43.47" y2="42.52" />
      <line className="cls-1" x1="36.36" y1="44.16" x2="43.47" y2="42.52" />
      <line className="cls-1" x1="40.81" y1="55.5" x2="36.17" y2="44.33" />
      <line className="cls-1" x1="37.03" y1="34.33" x2="70.42" y2="40.79" />
      <path className="cls-1" d="M41.6,29.7c0-3.76-3.79-9.3-8.48-9.3" />
    </svg>
  ),
  "solar-panels": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <rect className="cls-1" x="13.37" y="27.95" width="56.15" height="33.08" rx="7.23" />
      <line className="cls-1" x1="27.24" y1="27.95" x2="27.24" y2="60.3" />
      <line className="cls-1" x1="41.45" y1="28.36" x2="41.45" y2="60.72" />
      <line className="cls-1" x1="56.12" y1="28.36" x2="56.12" y2="60.72" />
      <line className="cls-1" x1="13.37" y1="39.34" x2="69.27" y2="39.34" />
      <line className="cls-1" x1="13.37" y1="49.63" x2="69.27" y2="49.63" />
      <path className="cls-1" d="M31.79,22.76c0-5.37,4.7-9.73,10.5-9.73s10.5,4.36,10.5,9.73" />
      <line className="cls-1" x1="23.49" y1="22.76" x2="26.51" y2="22.76" />
      <line className="cls-1" x1="57.92" y1="22.76" x2="60.94" y2="22.76" />
      <line className="cls-1" x1="42.29" y1="8.3" x2="42.29" y2="5.28" />
      <line className="cls-1" x1="54.96" y1="12.46" x2="57.27" y2="10.5" />
      <line className="cls-1" x1="29.74" y1="11.57" x2="27.45" y2="9.6" />
    </svg>
  ),
  terrace: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1,.cls-2{fill:none;stroke:#727070;stroke-width:3px;}.cls-1{stroke-linecap:round;stroke-linejoin:round;}.cls-2{stroke-miterlimit:10;}`}</style>
      </defs>
      <rect className="cls-1" x="22.02" y="15.43" width="42.32" height="41.15" />
      <line className="cls-1" x1="15.77" y1="15.43" x2="69.62" y2="15.43" />
      <rect className="cls-1" x="31.93" y="33.16" width="9.89" height="9.89" />
      <rect className="cls-1" x="28.37" y="43.05" width="17.01" height="6.67" />
      <line className="cls-1" x1="28.37" y1="39.67" x2="28.37" y2="44.75" />
      <line className="cls-1" x1="45.38" y1="39.67" x2="45.38" y2="44.24" />
      <line className="cls-1" x1="55.39" y1="42.5" x2="55.39" y2="55.1" />
      <ellipse className="cls-2" cx="55.39" cy="41.22" rx="4.08" ry="6.21" />
      <line className="cls-1" x1="32.8" y1="50.57" x2="30.89" y2="55.52" />
      <line className="cls-1" x1="39.93" y1="50.34" x2="42.25" y2="55.98" />
      <line className="cls-1" x1="17.75" y1="56.59" x2="68.93" y2="56.59" />
      <line className="cls-1" x1="14.7" y1="61.47" x2="71.98" y2="61.47" />
    </svg>
  ),
  "walk-in-closet": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" height={height} width={width}>
      <defs>
        <style>{`.cls-1{fill:none;stroke:#727070;stroke-linecap:round;stroke-linejoin:round;stroke-width:3px;}`}</style>
      </defs>
      <rect className="cls-1" x="9.64" y="14.51" width="16.37" height="55.27" />
      <rect className="cls-1" x="26" y="14.51" width="41.93" height="55.27" />
      <line className="cls-1" x1="45.89" y1="30.06" x2="43.36" y2="22.31" />
      <path className="cls-1" d="M43.36,21.87a5.15,5.15,0,0,1,10.29,0" />
      <line className="cls-1" x1="45.66" y1="29.8" x2="33.47" y2="42.5" />
      <line className="cls-1" x1="58.3" y1="42.5" x2="46.1" y2="30.4" />
      <line className="cls-1" x1="33.47" y1="42.5" x2="58.3" y2="42.5" />
      <line className="cls-1" x1="20.39" y1="40.94" x2="20.39" y2="44.1" />
    </svg>
  ),
};
