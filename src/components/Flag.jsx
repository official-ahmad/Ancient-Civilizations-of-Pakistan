import React from "react";

export default function Flag() {
  return (
    <svg
      viewBox="0 0 30 20"
      className="w-9 h-6 rounded-sm shadow"
      aria-label="Flag of Pakistan"
    >
      <rect width="30" height="20" fill="#01411C" />
      <rect width="7.5" height="20" fill="#fff" />
      <circle cx="19.5" cy="10" r="4.6" fill="#fff" />
      <circle cx="20.9" cy="9.2" r="3.9" fill="#01411C" />
      <polygon
        fill="#fff"
        points="21.5,5.9 21.91,7.03 23.12,7.07 22.17,7.82 22.5,8.98 21.5,8.3 20.5,8.98 20.83,7.82 19.88,7.07 21.09,7.03"
      />
    </svg>
  );
}
