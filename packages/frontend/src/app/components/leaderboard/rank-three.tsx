import { SVGProps } from "react";
const RankThree = ({
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
      stroke="url(#athree)"
      strokeWidth={2}
    />
    <rect x={4.5} y={4} width={56} height={56} rx={28} fill="url(#bthree)" />
    <rect
      x={32.314}
      y={51}
      width={16}
      height={16}
      rx={5}
      transform="rotate(45 32.314 51)"
      fill="url(#cthree)"
    />
    <path
      d="M32.31 66.11a3.55 3.55 0 0 1-1.438-.278 2.44 2.44 0 0 1-.996-.77 2.04 2.04 0 0 1-.39-1.148h1.226q.024.356.238.617.219.258.57.399.353.14.782.14.473 0 .836-.164.367-.165.574-.457.207-.297.207-.683 0-.403-.207-.707a1.35 1.35 0 0 0-.598-.485q-.39-.176-.945-.176h-.676v-.984h.676q.446 0 .781-.16a1.3 1.3 0 0 0 .532-.445q.19-.29.191-.676 0-.371-.168-.645a1.13 1.13 0 0 0-.469-.433 1.5 1.5 0 0 0-.71-.157q-.392 0-.731.145-.336.142-.547.406-.21.262-.226.63h-1.168q.02-.649.382-1.142.367-.492.97-.769a3.15 3.15 0 0 1 1.335-.277q.77 0 1.328.3.563.297.867.793.31.496.305 1.086.005.672-.375 1.14-.375.47-1 .63v.062q.797.122 1.234.633.442.512.438 1.27.004.66-.367 1.183a2.5 2.5 0 0 1-1.004.825q-.637.296-1.457.296"
      fill="#121215"
    />
    <defs>
      <linearGradient
        id="athree"
        x1={32.5}
        y1={0}
        x2={32.5}
        y2={64}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFDDC6" />
        <stop offset={1} stopColor="#9E7259" />
      </linearGradient>
      <linearGradient
        id="cthree"
        x1={40.314}
        y1={51}
        x2={40.314}
        y2={67}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFDDC6" />
        <stop offset={1} stopColor="#9E7259" />
      </linearGradient>
      <pattern
        id="bthree"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <use xlinkHref="#dthree" transform="scale(.01563)" />
      </pattern>
      <image id="dthree" width={64} height={64} href={profile_photo} />
    </defs>
  </svg>
);
export default RankThree;
