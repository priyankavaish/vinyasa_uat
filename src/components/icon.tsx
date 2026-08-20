// Every icon glyph on the site comes from this one file, traced from the
// Ionicons pack (ionicons.designerpack) so there's a single icon library in
// use throughout — no mixed emoji, unicode glyphs, or hand-drawn one-offs.
export type IconName =
  | "leaf-outline"
  | "star"
  | "star-outline"
  | "arrow-forward-outline"
  | "logo-whatsapp"
  | "menu-outline"
  | "close-outline"
  | "sparkles-outline"
  | "home-outline"
  | "calendar-outline"
  | "images-outline"
  | "camera-outline"
  | "people-outline"
  | "location-outline"
  | "trophy-outline"
  | "compass-outline"
  | "ribbon-outline"
  | "moon-outline"
  | "musical-notes-outline"
  | "sunny-outline";

const PATHS: Record<IconName, React.ReactNode> = {
  "leaf-outline": (
    <>
      <path
        d="M321.89,171.42C233,114,141,155.22,56,65.22c-19.8-21-8.3,235.5,98.1,332.7C231.89,468.92,352,461,392.5,392S410.78,228.83,321.89,171.42Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M173,253c86,81,175,129,292,147"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </>
  ),
  star: (
    <path
      fill="currentColor"
      d="M394,480a16,16,0,0,1-9.39-3L256,383.76,127.39,477a16,16,0,0,1-24.55-18.08L153,310.35,23,221.2A16,16,0,0,1,32,192H192.38l48.4-148.95a16,16,0,0,1,30.44,0l48.4,149H480a16,16,0,0,1,9.05,29.2L359,310.35l50.13,148.53A16,16,0,0,1,394,480Z"
    />
  ),
  "star-outline": (
    <path
      d="M480,208H308L256,48,204,208H32l140,96L118,464,256,364,394,464,340,304Z"
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="32"
    />
  ),
  "arrow-forward-outline": (
    <>
      <polyline
        points="268 112 412 256 268 400"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
      />
      <line x1="392" y1="256" x2="100" y2="256" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" />
    </>
  ),
  "logo-whatsapp": (
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M414.73,97.1A222.14,222.14,0,0,0,256.94,32C134,32,33.92,131.58,33.87,254A220.61,220.61,0,0,0,63.65,365L32,480l118.25-30.87a223.63,223.63,0,0,0,106.6,27h.09c122.93,0,223-99.59,223.06-222A220.18,220.18,0,0,0,414.73,97.1ZM256.94,438.66h-.08a185.75,185.75,0,0,1-94.36-25.72l-6.77-4L85.56,427.26l18.73-68.09-4.41-7A183.46,183.46,0,0,1,71.53,254c0-101.73,83.21-184.5,185.48-184.5A185,185,0,0,1,442.34,254.14C442.3,355.88,359.13,438.66,256.94,438.66ZM358.63,300.47c-5.57-2.78-33-16.2-38.08-18.05s-8.83-2.78-12.54,2.78-14.4,18-17.65,21.75-6.5,4.16-12.07,1.38-23.54-8.63-44.83-27.53c-16.57-14.71-27.75-32.87-31-38.42s-.35-8.56,2.44-11.32c2.51-2.49,5.57-6.48,8.36-9.72s3.72-5.56,5.57-9.26.93-6.94-.46-9.71-12.54-30.08-17.18-41.19c-4.53-10.82-9.12-9.35-12.54-9.52-3.25-.16-7-.2-10.69-.2a20.53,20.53,0,0,0-14.86,6.94c-5.11,5.56-19.51,19-19.51,46.28s20,53.68,22.76,57.38,39.3,59.73,95.21,83.76a323.11,323.11,0,0,0,31.78,11.68c13.35,4.22,25.5,3.63,35.1,2.2,10.71-1.59,33-13.42,37.63-26.38s4.64-24.06,3.25-26.37S364.21,303.24,358.63,300.47Z"
    />
  ),
  "menu-outline": (
    <>
      <line x1="80" y1="160" x2="432" y2="160" stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
      <line x1="80" y1="256" x2="432" y2="256" stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
      <line x1="80" y1="352" x2="432" y2="352" stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
    </>
  ),
  "close-outline": (
    <>
      <line x1="368" y1="368" x2="144" y2="144" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <line x1="368" y1="144" x2="144" y2="368" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
    </>
  ),
  "sparkles-outline": (
    <>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M328,96,300.6,178,224,208l76.6,30L328,320l27.4-82L432,208l-76.6-30L328,96Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="26"
        d="M136,304,118,357l-53,18,53,18,18,53,18-53,53-18-53-18-18-53Z"
      />
    </>
  ),
  "home-outline": (
    <>
      <path
        d="M80,212V448a16,16,0,0,0,16,16h96V328a24,24,0,0,1,24-24h80a24,24,0,0,1,24,24V464h96a16,16,0,0,0,16-16V212"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M480,256,266.89,52c-5-5.28-16.69-5.34-21.78,0L32,256"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <polyline
        points="400 179 400 64 352 64 352 133"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </>
  ),
  "calendar-outline": (
    <>
      <rect x="48" y="80" width="416" height="384" rx="48" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" />
      {[
        [296, 232], [376, 232], [296, 312], [376, 312],
        [136, 312], [216, 312], [136, 392], [216, 392], [296, 392],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="24" fill="currentColor" />
      ))}
      <line x1="128" y1="48" x2="128" y2="80" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <line x1="384" y1="48" x2="384" y2="80" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <line x1="464" y1="160" x2="48" y2="160" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" />
    </>
  ),
  "images-outline": (
    <>
      <path
        d="M432,112V96a48.14,48.14,0,0,0-48-48H64A48.14,48.14,0,0,0,16,96V352a48.14,48.14,0,0,0,48,48H80"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <rect x="96" y="128" width="400" height="336" rx="45.99" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="32" />
      <ellipse cx="372.92" cy="219.64" rx="30.77" ry="30.55" fill="none" stroke="currentColor" strokeWidth="32" />
      <path
        d="M342.15,372.17,255,285.78a30.93,30.93,0,0,0-42.18-1.21L96,387.64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M265.23,464,383.82,346.27a31,31,0,0,1,41.46-1.87L496,402.91"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </>
  ),
  "camera-outline": (
    <>
      <path
        d="M350.54,148.68l-26.62-42.06C318.31,100.08,310.62,96,302,96H210c-8.62,0-16.31,4.08-21.92,10.62l-26.62,42.06C155.85,155.23,148.62,160,140,160H80a32,32,0,0,0-32,32V384a32,32,0,0,0,32,32H432a32,32,0,0,0,32-32V192a32,32,0,0,0-32-32H373C364.35,160,356.15,155.23,350.54,148.68Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <circle cx="256" cy="272" r="80" fill="none" stroke="currentColor" strokeWidth="32" />
      <polyline points="124 158 124 136 100 136 100 158" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
    </>
  ),
  "people-outline": (
    <>
      <path
        d="M402,168c-2.93,40.67-33.1,72-66,72s-63.12-31.32-66-72c-3-42.31,26.37-72,66-72S405,126.46,402,168Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M336,304c-65.17,0-127.84,32.37-143.54,95.41-2.08,8.34,3.15,16.59,11.72,16.59H467.83c8.57,0,13.77-8.25,11.72-16.59C463.85,335.36,401.18,304,336,304Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="32"
      />
      <path
        d="M200,185.94C197.66,218.42,173.28,244,147,244S96.3,218.43,94,185.94C91.61,152.15,115.34,128,147,128S202.39,152.77,200,185.94Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M206,306c-18.05-8.27-37.93-11.45-59-11.45-52,0-102.1,25.85-114.65,76.2C30.7,377.41,34.88,384,41.72,384H154"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="32"
      />
    </>
  ),
  "location-outline": (
    <>
      <path
        d="M256,48c-79.5,0-144,61.39-144,137,0,87,96,224.87,131.25,272.49a15.77,15.77,0,0,0,25.5,0C304,409.89,400,272.07,400,185,400,109.39,335.5,48,256,48Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <circle cx="256" cy="192" r="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
    </>
  ),
  "trophy-outline": (
    <>
      <line x1="176" y1="464" x2="336" y2="464" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <line x1="256" y1="464" x2="256" y2="336" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <path
        d="M384,224c0-50.64-.08-134.63-.12-160a16,16,0,0,0-16-16l-223.79.26a16,16,0,0,0-16,15.95c0,30.58-.13,129.17-.13,159.79,0,64.28,83,112,128,112S384,288.28,384,224Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path d="M128,96H48v16c0,55.22,33.55,112,80,112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <path d="M384,96h80v16c0,55.22-33.55,112-80,112" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
    </>
  ),
  "compass-outline": (
    <>
      <path d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z" fill="none" stroke="currentColor" strokeWidth="32" />
      <path
        fill="currentColor"
        d="M350.67,150.93l-117.2,46.88a64,64,0,0,0-35.66,35.66l-46.88,117.2a8,8,0,0,0,10.4,10.4l117.2-46.88a64,64,0,0,0,35.66-35.66l46.88-117.2A8,8,0,0,0,350.67,150.93ZM256,280a24,24,0,1,1,24-24A24,24,0,0,1,256,280Z"
      />
    </>
  ),
  "ribbon-outline": (
    <>
      <circle cx="256" cy="160" r="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
      <path
        d="M143.65,227.82,48,400l86.86-.42a16,16,0,0,1,13.82,7.8L192,480l88.33-194.32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M366.54,224,464,400l-86.86-.42a16,16,0,0,0-13.82,7.8L320,480,256,339.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <circle cx="256" cy="160" r="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
    </>
  ),
  "moon-outline": (
    <path
      d="M160,136c0-30.62,4.51-61.61,16-88C99.57,81.27,48,159.32,48,248c0,119.29,96.71,216,216,216,88.68,0,166.73-51.57,200-128-26.39,11.49-57.38,16-88,16C256.71,352,160,255.29,160,136Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="32"
    />
  ),
  "musical-notes-outline": (
    <>
      <path
        d="M192,218v-6c0-14.84,10-27,24.24-30.59l174.59-46.68A20,20,0,0,1,416,154V176"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        d="M416,295.94v80c0,13.91-8.93,25.59-22,30l-22,8c-25.9,8.72-52-10.42-52-38h0a33.37,33.37,0,0,1,23-32l51-18.15c13.07-4.4,22-15.94,22-29.85V58a10,10,0,0,0-12.6-9.61L204,102a16.48,16.48,0,0,0-12,16v226c0,13.91-8.93,25.6-22,30l-52,18c-13.88,4.68-22,17.22-22,32h0c0,27.58,26.52,46.55,52,38l22-8c13.07-4.4,22-16.08,22-30v-80"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </>
  ),
  "sunny-outline": (
    <>
      {[
        [256, 48, 256, 96], [256, 416, 256, 464],
        [403.08, 108.92, 369.14, 142.86], [142.86, 369.14, 108.92, 403.08],
        [464, 256, 416, 256], [96, 256, 48, 256],
        [403.08, 403.08, 369.14, 369.14], [142.86, 142.86, 108.92, 108.92],
      ].map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
      ))}
      <circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="32" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" className={className} aria-hidden>
      {PATHS[name]}
    </svg>
  );
}
