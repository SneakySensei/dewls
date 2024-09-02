import { SVGProps } from "react";
const RankTwo = ({
  profile_photo,
  ...props
}: SVGProps<SVGSVGElement> & {
  profile_photo: string;
}) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 65 74"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <rect
      x={1.5}
      y={1}
      width={62}
      height={62}
      rx={31}
      stroke="url(#a)"
      strokeWidth={2}
    />
    <rect x={4.5} y={4} width={56} height={56} rx={28} fill="url(#b)" />
    <rect
      x={32.314}
      y={51}
      width={16}
      height={16}
      rx={5}
      transform="rotate(45 32.314 51)"
      fill="url(#c)"
    />
    <path
      d="M29.697 66v-.875l2.707-2.805q.434-.456.714-.8.285-.348.426-.66a1.6 1.6 0 0 0 .14-.665q0-.398-.187-.687a1.23 1.23 0 0 0-.511-.45 1.6 1.6 0 0 0-.73-.16q-.43 0-.75.176a1.2 1.2 0 0 0-.493.496 1.56 1.56 0 0 0-.172.75H29.69q0-.73.336-1.277.335-.547.922-.848.585-.304 1.332-.304.753 0 1.328.3.578.298.902.813.324.512.324 1.156 0 .445-.168.871-.164.425-.574.95-.41.519-1.14 1.261l-1.59 1.664v.059h3.601V66z"
      fill="#121215"
    />
    <defs>
      <linearGradient
        id="a"
        x1={32.5}
        y1={0}
        x2={32.5}
        y2={64}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F1F8FF" />
        <stop offset={1} stopColor="#7C8186" />
      </linearGradient>
      <linearGradient
        id="c"
        x1={40.314}
        y1={51}
        x2={40.314}
        y2={67}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F1F8FF" />
        <stop offset={1} stopColor="#7C8186" />
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
export default RankTwo;
