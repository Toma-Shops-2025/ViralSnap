import { COLORS } from "../theme";
import { sans } from "../fonts";

export const GooglePlayBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "26px 52px",
        borderRadius: 24,
        background: "#000",
        border: "2px solid rgba(255,255,255,0.22)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        transform: `scale(${scale})`,
      }}
    >
      {/* Play triangle */}
      <svg width="64" height="70" viewBox="0 0 512 560" fill="none">
        <path d="M40 20 L300 280 L40 540 Z" fill="#FF5065" />
        <path d="M40 20 L300 280 L180 400 Z" fill="#00C2FF" />
        <path d="M40 20 L180 160 L300 280 Z" fill="#00E58A" opacity="0.95" />
        <path d="M300 280 L420 210 L470 280 L420 350 Z" fill="#FFC02E" />
        <path d="M40 540 L300 280 L180 400 Z" fill="#FF5065" opacity="0.9" />
      </svg>
      <div style={{ fontFamily: sans, color: COLORS.white, lineHeight: 1.05 }}>
        <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: 2, opacity: 0.85 }}>
          GET IT ON
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: -0.5 }}>Google Play</div>
      </div>
    </div>
  );
};
