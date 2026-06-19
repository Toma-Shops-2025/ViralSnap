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

type Props = {
  src: string;
  dir?: "left" | "right" | "up";
  zoom?: "in" | "out";
};

export const FeatureScene: React.FC<Props> = ({ src, dir = "left", zoom = "in" }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 90, mass: 1 } });
  const offset = interpolate(enter, [0, 1], [dir === "right" ? 220 : dir === "left" ? -220 : 0, 0]);
  const yOffset = dir === "up" ? interpolate(enter, [0, 1], [180, 0]) : 0;
  const rotate = interpolate(enter, [0, 1], [dir === "right" ? 4 : -4, 0]);

  // ken burns across the visible portion of the scene
  const p = frame / durationInFrames;
  const kb = zoom === "in" ? interpolate(p, [0, 1], [1.0, 1.09]) : interpolate(p, [0, 1], [1.09, 1.0]);
  const drift = Math.sin(p * Math.PI) * 14;

  // exit fade near the end
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  const W = 760;
  const H = (W * 1920) / 1080;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity,
          transform: `translateX(${offset}px) translateY(${yOffset}px) rotate(${rotate}deg)`,
        }}
      >
        <div
          style={{
            width: W,
            height: H,
            borderRadius: 54,
            padding: 5,
            background: GRADIENT_FIRE,
            boxShadow: `0 40px 120px rgba(255,80,101,0.28), 0 10px 50px rgba(0,0,0,0.6)`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 50,
              overflow: "hidden",
              background: COLORS.bgDeep,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${kb}) translateY(${drift}px)`,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
