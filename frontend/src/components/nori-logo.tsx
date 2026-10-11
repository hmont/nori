import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

/** Nori's mascot: a smiling onigiri wearing its strip of nori. */
export function NoriLogo({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* shadow */}
      <Ellipse cx="50" cy="92" rx="30" ry="4" fill="#000000" opacity={0.08} />
      {/* rice */}
      <Path
        d="M50 10 C58 10 64 16 70 28 L88 68 C92 78 86 88 76 88 L24 88 C14 88 8 78 12 68 L30 28 C36 16 42 10 50 10 Z"
        fill="#FFFFFF"
        stroke="#E8DDD3"
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {/* nori strip */}
      <Path
        d="M20 66 L80 66 L86 72 C88 80 84 88 76 88 L24 88 C16 88 12 80 14 72 Z"
        fill="#2F5D4A"
      />
      <Rect x="40" y="70" width="20" height="5" rx="2.5" fill="#3F7D63" opacity={0.7} />
      {/* face */}
      <Circle cx="39" cy="50" r="3.6" fill="#3B2F2F" />
      <Circle cx="61" cy="50" r="3.6" fill="#3B2F2F" />
      <Circle cx="40.2" cy="48.8" r="1.1" fill="#FFFFFF" />
      <Circle cx="62.2" cy="48.8" r="1.1" fill="#FFFFFF" />
      <Ellipse cx="31" cy="57" rx="5" ry="3.2" fill="#FF8FA8" opacity={0.55} />
      <Ellipse cx="69" cy="57" rx="5" ry="3.2" fill="#FF8FA8" opacity={0.55} />
      <Path
        d="M45 55 Q50 61 55 55"
        stroke="#3B2F2F"
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
      {/* sparkles */}
      <Path d="M84 18 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#FFC857" />
      <Path d="M14 30 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4 Z" fill="#FF8FA8" />
    </Svg>
  );
}
