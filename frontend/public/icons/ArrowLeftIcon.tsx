import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const ArrowLeftIcon: React.FC<IconProps> = (props) => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
          <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
  );
};

export default ArrowLeftIcon;