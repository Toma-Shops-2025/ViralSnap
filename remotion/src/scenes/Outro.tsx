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
import { GooglePlayBadge } from "../components/GooglePlayBadge";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head1 = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const head2 = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 90 } });
  const badgeIn = spring({ frame: frame - 26, fps, config: { damping: 14, stiffness: 110 } });
  const qrIn = spring({ frame: frame - 40, fps, config: { damping: 15, stiffness: 90 } });
  const qrGlow = 0.5 + 0.5 * Math.sin(frame * 0.07);
  const badgePulse = 1 + 0.025 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 60 }}>
      {/* headline */}
      <div
        style={{
          fontFamily: serif,
          fontWeight: 900,
          fontSize: 108,
          lineHeight: 1.0,
          textAlign: "center",
          letterSpacing: -2,
        }}
      >
        <div
          style={{
            color: COLORS.white,
            opacity: head1,
            transform: `translateY(${interpolate(head1, [0, 1], [40, 0])}px)`,
          }}
        >
          Start
        </div>
        <div
          style={{
            opacity: head2,
            transform: `translateY(${interpolate(head2, [0, 1], [40, 0])}px)`,
            background: GRADIENT_FIRE,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          earning today.
        </div>
      </div>

      {/* badge */}
      <div
        style={{
          marginTop: 60,
          marginBottom: 70,
          opacity: badgeIn,
          transform: `translateY(${interpolate(badgeIn, [0, 1], [40, 0])}px)`,
        }}
      >
        <GooglePlayBadge scale={badgePulse} />
      </div>

      {/* QR card */}
      <div
        style={{
          opacity: qrIn,
          transform: `scale(${interpolate(qrIn, [0, 1], [0.8, 1])})`,
          width: 560,
          height: 600,
          borderRadius: 48,
          background: COLORS.white,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${50 + qrGlow * 60}px rgba(255,80,101,${0.35 + qrGlow * 0.3}), 0 24px 70px rgba(0,0,0,0.5)`,
        }}
      >
        <Img
          src={staticFile("brand/qr.png")}
          style={{ width: "84%", height: "84%", objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          marginTop: 34,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 38,
          color: COLORS.muted,
          opacity: qrIn,
        }}
      >
        Scan to join · viralsnap.online
      </div>
    </AbsoluteFill>
  );
};
