
import React from 'react';

// Simplified Link component for SPA behavior mock
const Link = ({ href, children, ...props }: any) => {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

export default Link;
