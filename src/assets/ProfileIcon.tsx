import React from 'react';
import {SvgXml} from 'react-native-svg';

export const ProfileIcon = ({color}: {color?: string}) => {
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!-- Written by Treer (gitlab.com/Treer) -->
  <svg 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="30" 
      height="30"
      fill="white">
  
    <title>Abstract user icon</title>
  
    <defs>
      <clipPath id="circular-border">
        <circle cx="15" cy="15" r="14" />
      </clipPath>
      <clipPath id="avoid-antialiasing-bugs">
        <rect width="100%" height="24.5" />
      </clipPath>
    </defs>
    
    <circle cx="15" cy="15" r="14" fill="#3473da" clip-path="url(#avoid-antialiasing-bugs)" />
    <circle cx="15" cy="11.5" r="5.75" />
    <circle cx="15" cy="27.5" r="10" clip-path="url(#circular-border)" />
  </svg>`;
  return <SvgXml xml={xml} color="#3473da" />;
};
