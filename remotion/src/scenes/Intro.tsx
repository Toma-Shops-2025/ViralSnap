import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, GRADIENT_FIRE } from "../theme";
import { serif, sans } from "../fonts";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const logoScale = interpolate(logoIn, [0, 1], [0.4, 1]);
  const logoRot = interpolate(logoIn, [0, 1], [-25, 0]);
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.08);

  const wordIn = spring({ frame: frame - 14, fps, config: { damping: 16, stiffness: 90 } });
  const tagIn = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 80 } });

  const line = interpolate(frame, [40, 62], [0, 220], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale}) rotate(${logoRot}deg)`,
          width: 300,
          height: 300,
          borderRadius: 64,
          overflow: "hidden",
          boxShadow: `0 0 ${60 + glow * 70}px rgba(255,80,101,${0.45 + glow * 0.35}), 0 0 120px rgba(243,186,37,0.25)`,
          marginBottom: 70,
        }}
      >
        <Img src={staticFile("brand/logo.png")} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Wordmark */}
      <div
        style={{
          opacity: wordIn,
          transform: `translateY(${interpolate(wordIn, [0, 1], [40, 0])}px)`,
          fontFamily: serif,
          fontWeight: 900,
          fontSize: 130,
          letterSpacing: -2,
          lineHeight: 1,
        }}
      >
        <span style={{ color: COLORS.white }}>Viral</span>
        <span
          style={{
            background: GRADIENT_FIRE,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Snap
        </span>
      </div>

      {/* accent line */}
      <div
        style={{
          width: line,
          height: 6,
          borderRadius: 3,
          background: GRADIENT_FIRE,
          marginTop: 34,
          marginBottom: 34,
        }}
      />

      {/* tagline */}
      <div
        style={{
          opacity: tagIn,
          transform: `translateY(${interpolate(tagIn, [0, 1], [30, 0])}px)`,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 44,
          color: COLORS.muted,
          textAlign: "center",
        }}
      >
        Going viral isn&apos;t luck.
      </div>
    </AbsoluteFill>
  );
};
