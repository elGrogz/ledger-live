// @flow

import React from "react";

const Exchange = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path
      fill="currentColor"
      d="M9.34375 7.625L7.09375 6.96875C6.8125 6.875 6.59375 6.5625 6.59375 6.25C6.59375 5.84375 6.90625 5.5 7.25 5.5H8.65625C8.875 5.5 9.09375 5.5625 9.28125 5.6875C9.46875 5.8125 9.71875 5.78125 9.875 5.625L10.25 5.28125C10.5 5.0625 10.4688 4.6875 10.1875 4.5C9.75 4.1875 9.25 4.03125 8.75 4.03125V3.5C8.75 3.25 8.53125 3 8.25 3H7.75C7.46875 3 7.25 3.25 7.25 3.5V4C6.0625 4.03125 5.125 5.03125 5.125 6.25C5.125 7.21875 5.75 8.125 6.65625 8.375L8.90625 9.0625C9.1875 9.15625 9.375 9.4375 9.375 9.78125C9.375 10.1875 9.09375 10.5 8.71875 10.5H7.3125C7.09375 10.5 6.90625 10.4688 6.71875 10.3438C6.5 10.2188 6.25 10.25 6.09375 10.4062L5.71875 10.75C5.46875 10.9688 5.53125 11.3438 5.78125 11.5312C6.21875 11.8125 6.71875 12 7.25 12V12.5C7.25 12.7812 7.46875 13 7.75 13H8.25C8.5 13 8.75 12.7812 8.75 12.5V12C9.90625 12 10.875 11 10.875 9.78125C10.875 8.8125 10.25 7.90625 9.34375 7.625ZM8 0.25C3.71875 0.25 0.25 3.71875 0.25 8C0.25 12.2812 3.71875 15.75 8 15.75C12.2812 15.75 15.75 12.2812 15.75 8C15.75 3.71875 12.2812 0.25 8 0.25ZM8 14.25C4.53125 14.25 1.75 11.4688 1.75 8C1.75 4.5625 4.53125 1.75 8 1.75C11.4375 1.75 14.25 4.5625 14.25 8C14.25 11.4688 11.4375 14.25 8 14.25Z"
    />
  </svg>
);

export default Exchange;
