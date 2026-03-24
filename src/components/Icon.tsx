import React from 'react';

interface IconProps {
  name: string | React.ReactNode;
  className?: string;
  type?: 'regular' | 'solid' | 'brand';
}

export default function Icon({ name, className = '', type = 'regular' }: IconProps) {
  if (typeof name !== 'string') {
    return <>{name}</>;
  }

  let maskUrl = `https://d3gk2c5xim1je2.cloudfront.net/lucide/v0.545.0/${name}.svg`;
  
  if (type === 'solid') {
    maskUrl = `https://d3gk2c5xim1je2.cloudfront.net/v7.1.0/solid/${name}.svg`;
  } else if (type === 'brand') {
    maskUrl = `https://d3gk2c5xim1je2.cloudfront.net/v7.1.0/brands/${name}.svg`;
  } else if (type === 'regular' && name.startsWith('fa-')) {
     const faName = name.replace('fa-', '');
     maskUrl = `https://d3gk2c5xim1je2.cloudfront.net/v7.1.0/regular/${faName}.svg`;
  }

  return (
    <div
      className={`inline-block shrink-0 bg-current transition-colors ${className}`}
      style={{
        WebkitMaskImage: `url(${maskUrl})`,
        maskImage: `url(${maskUrl})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}
