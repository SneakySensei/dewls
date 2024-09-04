import { SVGProps } from "react";
const StarIcon = ({
  solid,
  ...props
}: SVGProps<SVGSVGElement> & { solid?: boolean }) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.50008 3.44119L6 0.965051L7.49992 3.44119C7.60436 3.61361 7.77382 3.73672 7.97008 3.78277L10.7885 4.44411L8.89708 6.63579C8.76537 6.7884 8.70064 6.98761 8.71749 7.18849L8.95947 10.0734L6.29057 8.95175C6.10473 8.87365 5.89527 8.87365 5.70943 8.95175L3.04053 10.0734L3.28251 7.18849C3.29936 6.98761 3.23463 6.7884 3.10292 6.63579L1.21148 4.44412L4.02992 3.78277C4.22618 3.73672 4.39564 3.61361 4.50008 3.44119Z"
      fill={solid ? "currentcolor" : "none"}
      stroke="currentcolor"
      strokeLinejoin="round"
    />
  </svg>
);
export default StarIcon;
