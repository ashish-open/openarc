import React from 'react';

const OpenArcLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || 220}
    height={props.height || 70}
    viewBox="0 0 220 70"
    fill="none"
    style={{ display: 'block', margin: '8px auto' }}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Arc from O to c */}
    <defs>
      <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8B5FBF" />
        <stop offset="100%" stopColor="#663399" />
      </linearGradient>
    </defs>
    <path
      d="M28 38 Q110 -5 192 38"
      stroke="url(#arcGradient)"
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
    />
    {/* Single stylized name with color split */}
    <text
      x="28"
      y="65"
      fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
      fontWeight="700"
      fontSize="32"
      letterSpacing="1"
    >
      <tspan fill="#663399">Open</tspan>
      <tspan fill="#22223B">Arc</tspan>
    </text>
  </svg>
);

export default OpenArcLogo; 