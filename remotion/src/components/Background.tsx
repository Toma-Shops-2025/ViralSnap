import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../theme";

// Deterministic pseudo-random
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;

  const blob = (
    cx: number,
    cy: number,
    color: string,
    size: number,
    speed: number,
    phase: number,
  ) => {
    const x = cx + Math.sin(frame * speed + phase) * 60;
    const y = cy + Math.cos(frame * speed * 0.8 + phase) * 50;
    return {
      position: "absolute" as const,
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: "blur(40px)",
    };
  };

  // particles drifting upward
  const particles = new Array(34).fill(0).map((_, i) => {
    const px = rand(i) * 1080;
    const baseY = rand(i + 50) * 1920;
    const speed = 0.4 + rand(i + 100) * 0.9;
    const y = (baseY - frame * speed * 2) % 2000;
    const yy = y < -40 ? y + 2040 : y;
    const r = 1.5 + rand(i + 7) * 3.5;
    const op = 0.12 + rand(i + 11) * 0.25;
    const tw = 0.5 + 0.5 * Math.sin(frame * 0.06 + i);
    const c = i % 3 === 0 ? COLORS.gold : COLORS.coral;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: px,
          top: yy,
          width: r,
          height: r,
          borderRadius: "50%",
          background: c,
          opacity: op * tw,
          filter: "blur(0.5px)",
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep, overflow: "hidden" }}>
      {/* base vertical gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${COLORS.bg} 0%, ${COLORS.bgDeep} 55%, #05050c 100%)`,
        }}
      />
      <div style={blob(280, 360, "rgba(255,80,101,0.45)", 760, 0.012, 0)} />
      <div style={blob(820, 760, "rgba(243,186,37,0.32)", 720, 0.009, 2)} />
      <div style={blob(540, 1500, "rgba(255,111,138,0.3)", 820, 0.011, 4)} />
      <div style={blob(180, 1250, "rgba(255,138,61,0.22)", 600, 0.014, 6)} />
      {particles}
      {/* subtle vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 100%)",
          opacity: interpolate(t, [0, 1], [0.5, 0.8]),
        }}
      />
    </AbsoluteFill>
  );
};
