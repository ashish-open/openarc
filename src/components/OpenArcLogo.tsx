import React from 'react';

const OpenArcLogo = (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src="/logo.svg"
    alt="OpenArc Logo"
    style={{ display: 'block', margin: '8px auto' }}
    {...props}
  />
);

export default OpenArcLogo; 