export type IconProps = React.HTMLAttributes<SVGElement> & {
  width?: number;
  height?: number;
  color?: string;
};

type IconComponent = (props: IconProps) => JSX.Element;

export const typeIcons: Record<string, IconComponent> = {
  house: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <path
        className="cls-1"
        d="M60.51,69.62l-.23-27.45c0-.46.12.22,0-.23h5.15L38.89,12.43,37.41,13.8,12.93,41.14l-.57.68H18c-.11.46-.23-.11.12.35V69.62"
      />
      <path className="cls-1" d="M48.73,69.62V51.2a5.61,5.61,0,0,0-5.6-5.6H35a6.1,6.1,0,0,0-6.06,6.06v18" />
      <line className="cls-1" x1="54.91" y1="28.84" x2="54.91" y2="19.57" />
      <line className="cls-1" x1="18.11" y1="69.62" x2="60.51" y2="69.62" />
    </svg>
  ),
  apartment: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <rect className="cls-1" x="28.47" y="13.25" width="23.08" height="56.75" rx="1.78" />
      <rect className="cls-1" x="10.45" y="49.31" width="18.03" height="20.69" rx="2.26" />
      <rect className="cls-1" x="51.56" y="30.67" width="15.95" height="39.33" rx="1.99" />
      <rect className="cls-1" x="35.83" y="55.55" width="8.38" height="14.45" rx="2.09" />
      <line className="cls-1" x1="36.16" y1="23.55" x2="36.16" y2="26.15" />
      <line className="cls-1" x1="43.88" y1="23.55" x2="43.88" y2="26.15" />
      <line className="cls-1" x1="36.16" y1="29.4" x2="36.16" y2="32" />
      <line className="cls-1" x1="43.88" y1="29.4" x2="43.88" y2="32" />
      <line className="cls-1" x1="36.16" y1="35.19" x2="36.16" y2="37.79" />
      <line className="cls-1" x1="43.88" y1="35.19" x2="43.88" y2="37.79" />
      <line className="cls-1" x1="12.54" y1="70" x2="66.91" y2="70" />
    </svg>
  ),
  cabin: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <path className="cls-1" d="M49.08,71.93V54.19c0-3-2-5.4-4.55-5.4H37.94c-2.69,0-4.92,2.65-4.92,5.84v17.3" />
      <line className="cls-1" x1="20.97" y1="47.85" x2="62.1" y2="47.85" />
      <line className="cls-1" x1="20.61" y1="39.36" x2="61.75" y2="39.36" />
      <line className="cls-1" x1="48.99" y1="56.49" x2="62.54" y2="56.49" />
      <line className="cls-1" x1="20.7" y1="56.49" x2="32.24" y2="56.49" />
      <line className="cls-1" x1="48.82" y1="64.23" x2="62.37" y2="64.23" />
      <line className="cls-1" x1="20.53" y1="64.23" x2="32.07" y2="64.23" />
      <polyline className="cls-1" points="70.52 39.2 41.02 15.71 11.75 39.63" />
      <path className="cls-1" d="M63,37.9,62.86,71a2.4,2.4,0,0,1-2.19,2.56H21.87A2.4,2.4,0,0,1,19.68,71V37.85" />
    </svg>
  ),
  "country-house": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <path
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        d="M50.83,48.92V40.65a4.46,4.46,0,0,0-4.46-4.45H39.92A4.85,4.85,0,0,0,35.11,41V53.35"
      />
      <path
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        d="M9.4,59a49.15,49.15,0,0,1,12,.27c5.63.91,8.18,2.54,9.81,3.81l.18.1a56.81,56.81,0,0,1,16.81-7.64A61.4,61.4,0,0,1,68,53.45"
      />
      <ellipse
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        cx={15.76}
        cy={50}
        rx={3.82}
        ry={6.81}
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1={15.76}
        y1={50.82}
        x2={15.76}
        y2={57.27}
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1={53.73}
        y1={24.94}
        x2={53.73}
        y2={17.58}
      />
      <polyline
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        points="26.02 54.05 26.02 32.75 43.38 15.49 59.91 32.75 59.91 47.73"
      />
    </svg>
  ),
  castle: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <path
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        d="M26.08,40.08H12.36A2.86,2.86,0,0,0,9.5,42.94V66.25a2.86,2.86,0,0,0,2.86,2.86h52.7a2.86,2.86,0,0,0,2.85-2.86V42.94a2.86,2.86,0,0,0-2.85-2.86H53.29"
      />
      <path
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        d="M27.3,33.1V22.84c0-2.23,1.36-4,3.05-4h17.1c1.68,0,3,1.8,3,4V33.1"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="19.28"
        y1="67.91"
        x2="27.3"
        y2="32.63"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="59.47"
        y1="68.43"
        x2="50.5"
        y2="32.63"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="11.75"
        y1="39.4"
        x2="11.75"
        y2="34.3"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="19.24"
        y1="38.92"
        x2="19.24"
        y2="34.3"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="58.15"
        y1="39.4"
        x2="58.15"
        y2="34.49"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="65.65"
        y1="38.94"
        x2="65.65"
        y2="34.49"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="30.79"
        y1="17.28"
        x2="30.79"
        y2="12.15"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="38.29"
        y1="16.8"
        x2="38.29"
        y2="12.15"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="46.58"
        y1="16.8"
        x2="46.58"
        y2="12.15"
      />
      <path
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        d="M47,68.65V57.94a7.36,7.36,0,0,0-7.31-7.41H38.1a7.37,7.37,0,0,0-7.31,7.41V68.65"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="27.93"
        y1="32.23"
        x2="36.39"
        y2="32.23"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="32.64"
        y1="26.49"
        x2="40.13"
        y2="26.49"
      />
      <line
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        x1="27.3"
        y1="38.05"
        x2="32.16"
        y2="38.05"
      />
    </svg>
  ),
  "commercial-building": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <rect className="cls-1" x="26.57" y="25.37" width="25.53" height="40.6" />
      <rect className="cls-1" x="31.93" y="16.26" width="14.81" height="8.6" />
      <line className="cls-1" x1="39.34" y1="9.28" x2="39.34" y2="16.26" />
      <rect className="cls-1" x="35.55" y="55.07" width="8.17" height="10" />
      <line className="cls-1" x1="34.81" y1="33.19" x2="34.81" y2="36" />
      <line className="cls-1" x1="42.85" y1="33.19" x2="42.85" y2="36" />
      <line className="cls-1" x1="34.78" y1="39.71" x2="34.78" y2="42.52" />
      <line className="cls-1" x1="42.83" y1="39.71" x2="42.83" y2="42.52" />
      <line className="cls-1" x1="34.81" y1="46.56" x2="34.81" y2="49.37" />
      <line className="cls-1" x1="42.85" y1="46.56" x2="42.85" y2="49.37" />
    </svg>
  ),
  container: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <rect className="cls-1" x="16.76" y="31.51" width="43.84" height="33.15" />
      <line className="cls-1" x1="27.32" y1="31.51" x2="39.83" y2="17.89" />
      <line className="cls-1" x1="51.32" y1="30.22" x2="40.4" y2="18.16" />
      <line className="cls-1" x1="43.41" y1="7.19" x2="43.41" y2="13.07" />
      <line className="cls-1" x1="27.81" y1="38.9" x2="27.81" y2="57.29" />
      <line className="cls-1" x1="34.74" y1="38.88" x2="34.74" y2="57.26" />
      <line className="cls-1" x1="42.49" y1="38.9" x2="42.49" y2="57.29" />
      <line className="cls-1" x1="49.55" y1="38.88" x2="49.55" y2="57.26" />
      <path className="cls-1" d="M43.41,13.46a4.34,4.34,0,1,1-8.67,0" />
    </svg>
  ),
  "cycladic-home": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <line className="cls-1" x1="61.96" y1="26.09" x2="61.96" y2="17.99" />
      <line className="cls-1" x1="45.73" y1="61.5" x2="51.1" y2="61.5" />
      <rect className="cls-1" x="24.62" y="26.09" width="37.34" height="39.68" />
      <path className="cls-2" d="M56.41,65.77V50.15c0-5.14-3.6-9.35-8-9.35h0c-4.39,0-8,4.21-8,9.35V64.81" />
      <line className="cls-3" x1="34.12" y1="33.46" x2="34.12" y2="36.27" />
    </svg>
  ),
  "eco-home": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <path
        className="cls-1"
        d="M64.38,68.69l-.23-27.3c0-.46.12.23,0-.23h5.12L42.88,11.81,41.4,13.18,17.06,40.37l-.57.68h5.57c-.11.45-.22-.12.12.34v27.3"
      />
      <line className="cls-1" x1="22.21" y1="68.69" x2="64.38" y2="68.69" />
      <path className="cls-1" d="M37.07,67.89c-.75-10,3.53-19.06,13.52-26.28" />
      <path className="cls-1" d="M35.33,47.33c0-3.87,7.16-7,16-7" />
      <path className="cls-1" d="M51.74,41.61c0,9.33-4,16.88-8.9,16.88" />
    </svg>
  ),
  farm: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <polyline className="cls-1" points="33.03 57.6 33.03 41.48 50.74 25.19 67.62 41.48 67.62 57.6" />
      <line className="cls-1" x1="13.78" y1="59.49" x2="71.67" y2="59.49" />
      <rect className="cls-1" x="44.07" y="47.11" width="12.82" height="12.34" />
      <path className="cls-1" d="M33,59.49V30.66c0-4.06-2.74-7.36-6.12-7.36H24c-3.38,0-6.11,3.3-6.11,7.36V59.49" />
      <line className="cls-1" x1="61.3" y1="26.8" x2="61.3" y2="35.14" />
      <line className="cls-1" x1="68.6" y1="59.52" x2="58.51" y2="67.61" />
      <line className="cls-1" x1="57.25" y1="58.96" x2="47.16" y2="67.05" />
      <line className="cls-1" x1="45.29" y1="59.52" x2="35.2" y2="67.61" />
      <line className="cls-1" x1="34.68" y1="60.21" x2="24.59" y2="68.31" />
      <line className="cls-1" x1="23.69" y1="59.52" x2="13.6" y2="67.61" />
    </svg>
  ),
  houseboat: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <path
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        d="M20.1,56.92a18.73,18.73,0,0,1-4.68-12.41h0a.45.45,0,0,1,.45-.44H61a.44.44,0,0,1,.44.44h0c0,4.76-1,8.62-3.94,11.92"
      />
      <polyline
        stroke={color}
        fill={"none"}
        strokeWidth={3}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        points="26.84 42.84 26.84 32.03 38.72 21.1 50.04 32.03 50.04 42.84"
      />
      <path className="cls-1" d="M42.58,44.07V35.4a2.51,2.51,0,0,0-2.5-2.51H36.8a2.51,2.51,0,0,0-2.51,2.51v8.67" />
      <path
        stroke={color}
        fill={color}
        d="M9.3,62.41c1.9,1,3.21.43,4.89-.8,1-.74,1.77-1.91,2.82-2.56,5.19-3.16,5.28,0,7.54,2.27,3.93,3.92,9.18,2.65,13.07-.62a33,33,0,0,1,2.58-2.29,5.1,5.1,0,0,1,4.17,1.81A21,21,0,0,0,47.44,62,6.54,6.54,0,0,0,54,61.1c1.14-.85,2-2.74,3.21-3.34,3.29-1.63,4.49,1.89,6.39,3.34s3.5,1.67,5.66.65c1.75-.83.23-3.41-1.51-2.59-2.27,1.07-5.65-4.65-8-5.16-1.85-.39-3.26.43-4.62,1.63-.82.73-1.48,2-2.38,2.59-4.67,3.16-5.71-.41-8.49-2.15-1.56-1-2.75-1.47-4.57-.77-3,1.15-4.37,4.52-7.69,5.3-4.85,1.14-5.5-2.84-8.47-5.06a5.5,5.5,0,0,0-5.56-.69c-1.52.6-5.89,5.62-7.12,5-1.71-.9-3.23,1.68-1.52,2.59Z"
      />
    </svg>
  ),
  land: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6,.cls-7{fill:none;stroke:${color};stroke-linecap:round;stroke-width:3px;}.cls-1,.cls-2,.cls-3,.cls-4,.cls-5,.cls-6{stroke-linejoin:round;}.cls-2{stroke-dasharray:2.6 3.46;}.cls-3{stroke-dasharray:3.17 4.23;}.cls-4{stroke-dasharray:2.94 3.92;}.cls-5{stroke-dasharray:3.14 4.19;}.cls-6{stroke-dasharray:3.39 4.52;}.cls-7{stroke-miterlimit:10;}`}</style>
      </defs>
      <line className="cls-1" x1="59.87" y1="34.3" x2="61.34" y2="34.57" />
      <line className="cls-2" x1="64.75" y1="35.18" x2="69.01" y2="35.94" />
      <polyline className="cls-1" points="70.72 36.24 72.19 36.51 71.42 37.79" />
      <line className="cls-3" x1="69.23" y1="41.4" x2="58.83" y2="58.58" />
      <polyline className="cls-1" points="57.74 60.38 56.96 61.67 55.46 61.72" />
      <line className="cls-4" x1="51.54" y1="61.86" x2="19.23" y2="62.99" />
      <polyline className="cls-1" points="17.27 63.06 15.77 63.12 16.09 61.65" />
      <line className="cls-5" x1="16.98" y1="57.55" x2="19.64" y2="45.27" />
      <polyline className="cls-1" points="20.08 43.22 20.4 41.75 21.74 41.08" />
      <polyline className="cls-6" points="25.78 39.04 41.59 31.04 45.3 31.7" />
      <line className="cls-1" x1="47.52" y1="32.1" x2="49" y2="32.36" />
      <path
        className="cls-7"
        d="M48.76,32c.27.15-.93-.82-1.12-5.32C47.39,21,51,16.3,55.13,16.3s7.5,4.65,7.5,10.37a11.91,11.91,0,0,1-1.48,5.4"
      />
      <line className="cls-1" x1="48.42" y1="31.39" x2="55.13" y2="42.56" />
      <line className="cls-1" x1="61.75" y1="31.02" x2="55.13" y2="42.56" />
      <ellipse className="cls-7" cx="55.13" cy="25.2" rx="2.79" ry="3.05" />
    </svg>
  ),
  mansion: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <polyline className="cls-1" points="23.94 34.4 23.94 71.33 55.63 71.33 55.63 34.4" />
      <line className="cls-1" x1="23.94" y1="34.4" x2="39.79" y2="15.11" />
      <line className="cls-1" x1="55.63" y1="34.4" x2="39.79" y2="15.11" />
      <line className="cls-1" x1="29.43" y1="27.72" x2="19.42" y2="27.72" />
      <line className="cls-1" x1="62.35" y1="27.98" x2="50.93" y2="27.98" />
      <line className="cls-1" x1="19.42" y1="27.72" x2="12.31" y2="35.46" />
      <line className="cls-1" x1="62.35" y1="27.98" x2="69.3" y2="36.46" />
      <line className="cls-1" x1="12.31" y1="35.46" x2="12.31" y2="71.33" />
      <line className="cls-1" x1="69.3" y1="36.46" x2="69.3" y2="71.33" />
      <line className="cls-1" x1="12.31" y1="71.33" x2="24.47" y2="71.33" />
      <line className="cls-1" x1="56.19" y1="71.33" x2="69.3" y2="71.33" />
      <path className="cls-1" d="M48,70.69V55.49a4.63,4.63,0,0,0-4.62-4.63H36.62a5,5,0,0,0-5,5V70.69" />
      <line className="cls-1" x1="62.75" y1="43.27" x2="62.75" y2="45.74" />
      <line className="cls-1" x1="62.75" y1="52.19" x2="62.75" y2="54.65" />
      <line className="cls-1" x1="62.75" y1="61.04" x2="62.75" y2="63.51" />
      <line className="cls-1" x1="18.13" y1="43.3" x2="18.13" y2="45.77" />
      <line className="cls-1" x1="18.13" y1="52.21" x2="18.13" y2="54.68" />
      <line className="cls-1" x1="18.13" y1="61.07" x2="18.13" y2="63.54" />
      <line className="cls-1" x1="12.92" y1="36.46" x2="23.54" y2="36.46" />
      <line className="cls-1" x1="56.26" y1="37.25" x2="68.93" y2="37.25" />
    </svg>
  ),
  "tiny-home": ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <polyline className="cls-1" points="23.22 60.5 23.22 35.02 36.81 22.52 49.77 35.02 49.77 60.5" />
      <path className="cls-1" d="M49.77,54.93V41.29a4.14,4.14,0,0,0-4.31-3.94H39.83a4.13,4.13,0,0,0-4.3,3.94V54.93" />
      <line className="cls-1" x1="18.85" y1="56.63" x2="53.74" y2="56.63" />
    </svg>
  ),
  tower: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <rect className="cls-1" x="32.22" y="29.08" width="19.93" height="37.93" />
      <line className="cls-1" x1="42.19" y1="14.54" x2="56.71" y2="28.21" />
      <line className="cls-1" x1="27.66" y1="28.21" x2="42.19" y2="14.54" />
      <line className="cls-1" x1="42.45" y1="35.95" x2="42.45" y2="36.97" />
      <line className="cls-1" x1="42.45" y1="43.48" x2="42.45" y2="44.51" />
      <line className="cls-1" x1="21.74" y1="67.01" x2="61.49" y2="67.01" />
      <line className="cls-1" x1="16.67" y1="71.9" x2="68.43" y2="71.9" />
    </svg>
  ),
  warehouse: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <defs>
        <style>{`.cls-1`}</style>
      </defs>
      <path
        className="cls-1"
        d="M58.36,45.37l0-3.17c0-.45.11.22,0-.23h5.08L37.19,12.81l-1.47,1.36-24.18,27-.57.68h5.54c-.11.45-.23-.11.11.34V69.32"
      />
      <line className="cls-1" x1="16.65" y1="69.32" x2="27.32" y2="69.32" />
      <rect className="cls-1" x="51.33" y="59.3" width="15.16" height="10.02" />
      <polyline className="cls-1" points="37.64 69.32 35.49 69.32 35.49 59.3 51.33 59.3 51.33 69.32 37.64 69.32" />
      <rect className="cls-1" x="46.78" y="49.73" width="16.64" height="9.12" />
      <polyline className="cls-1" points="49.85 42.1 49.85 35.87 24.09 35.87 24.09 69.32 27.32 69.32" />
    </svg>
  ),
  windmill: ({ color, width = 45, height = 45 }: IconProps) => (
    <svg id="TRAZOS" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 83" width={width} height={height}>
      <polyline className="cls-1" points="31.37 43.45 27.28 71.31 50.25 71.31 46.41 43.77" />
      <circle className="cls-1" cx="38.76" cy="34.79" r="3.79" />
      <polygon className="cls-1" points="38.76 35.67 41.85 32.87 59.52 48.06 55.09 52.95 38.76 35.67" />
      <polygon className="cls-1" points="38.12 31.89 40.46 35.35 22.9 50.67 18.69 45.58 38.12 31.89" />
      <polygon className="cls-1" points="39.43 32.24 36.13 34.78 19.72 18.25 24.52 13.73 39.43 32.24" />
      <polygon className="cls-1" points="42.06 34.29 39.43 31.05 55.54 14.22 60.19 18.91 42.06 34.29" />
      <ellipse
        className="cls-2"
        cx="38.76"
        cy="34.79"
        rx="1.03"
        ry="1.09"
        transform="translate(-11.82 47.21) rotate(-55.7)"
      />
    </svg>
  ),
};
