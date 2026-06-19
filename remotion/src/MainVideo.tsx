import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Background } from "./components/Background";
import { Intro } from "./scenes/Intro";
import { FeatureScene } from "./scenes/FeatureScene";
import { Outro } from "./scenes/Outro";
import { COLORS, GRADIENT_FIRE } from "./theme";

const INTRO = 130;
const FEAT = 90;
const OUTRO = 200;
const TRANS = 16;
const NUM_FEAT = 8;

export const TOTAL_DURATION =
  INTRO + NUM_FEAT * FEAT + OUTRO - (NUM_FEAT + 1) * TRANS;

const shots: { src: string; dir: "left" | "right" | "up"; zoom: "in" | "out" }[] = [
  { src: "shots/01.png", dir: "right", zoom: "in" },
  { src: "shots/02.png", dir: "left", zoom: "out" },
  { src: "shots/03.png", dir: "right", zoom: "in" },
  { src: "shots/04.png", dir: "left", zoom: "out" },
  { src: "shots/05.png", dir: "up", zoom: "in" },
  { src: "shots/06.png", dir: "right", zoom: "out" },
  { src: "shots/07.png", dir: "left", zoom: "in" },
  { src: "shots/08.png", dir: "up", zoom: "out" },
];

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames], [0, 1080]);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 8,
        width: w,
        background: GRADIENT_FIRE,
        boxShadow: "0 0 16px rgba(255,80,101,0.7)",
      }}
    />
  );
};

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <Background />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO}>
          <Intro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {shots.map((s, i) => (
          <TransitionSeries.Sequence key={i} durationInFrames={FEAT}>
            <FeatureScene src={s.src} dir={s.dir} zoom={s.zoom} />
          </TransitionSeries.Sequence>
        )).flatMap((seq, i) =>
          i < shots.length - 1
            ? [
                seq,
                <TransitionSeries.Transition
                  key={`t${i}`}
                  presentation={slide({
                    direction: i % 2 === 0 ? "from-right" : "from-left",
                  })}
                  timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANS })}
                />,
              ]
            : [seq],
        )}

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        <TransitionSeries.Sequence durationInFrames={OUTRO}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Sequence>
        <ProgressBar />
      </Sequence>
    </AbsoluteFill>
  );
};
