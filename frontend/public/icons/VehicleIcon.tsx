import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const VehicleIcon: React.FC<IconProps> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
        {...props}
    >
        <path d="M4 3a2 2 0 00-2 2v1.5h16V5a2 2 0 00-2-2H4z" />
        <path d="M18 8.5H2v6a2 2 0 002 2h12a2 2 0 002-2v-6zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
    </svg>
);

export default VehicleIcon;
