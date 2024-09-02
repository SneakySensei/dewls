import { SVGProps } from "react";
const RankOne = ({
  profile_photo,
  ...props
}: SVGProps<SVGSVGElement> & {
  profile_photo: string;
}) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 81 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <rect
      x={1.5}
      y={1}
      width={78}
      height={78}
      rx={39}
      stroke="url(#a)"
      strokeWidth={2}
    />
    <rect x={4.5} y={4} width={72} height={72} rx={36} fill="url(#b)" />
    <rect
      x={40.314}
      y={67}
      width={16}
      height={16}
      rx={5}
      transform="rotate(45 40.314 67)"
      fill="url(#c)"
    />
    <path
      d="M41.505 75v8h-1.21v-6.79h-.048l-1.914 1.25v-1.155L40.33 75z"
      fill="#121215"
    />
    <defs>
      <linearGradient
        id="a"
        x1={40.5}
        y1={0}
        x2={40.5}
        y2={80}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCE19A" />
        <stop offset={1} stopColor="#BD9350" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={48.314}
        y1={67}
        x2={48.314}
        y2={83}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FCE19A" />
        <stop offset={1} stopColor="#BD9350" />
      </linearGradient>
      <pattern
        id="b"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#d" transform="scale(.01563)" />
      </pattern>
      <image id="d" width={64} height={64} href={profile_photo} />
    </defs>
  </svg>
);
export default RankOne;
