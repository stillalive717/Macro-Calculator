import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const W = 1280;
const H = 720;
const CX = 640;
const CY = 390;
const OW = 220;
const OH = 130;

function useSpr(
  frame: number,
  delay: number,
  fps: number,
  duration = 22,
): number {
  return spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    durationInFrames: duration,
    config: { damping: 14, stiffness: 100 },
  });
}

function ArrowLine({
  x1,
  y1,
  x2,
  y2,
  color,
  progress,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  progress: number;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);
  const headSize = 14;
  const shaftEndX = x2 - Math.cos(angle) * headSize * 0.6;
  const shaftEndY = y2 - Math.sin(angle) * headSize * 0.6;

  const tipX = x2;
  const tipY = y2;
  const leftX = x2 - Math.cos(angle - 0.5) * headSize * 1.6;
  const leftY = y2 - Math.sin(angle - 0.5) * headSize * 1.6;
  const rightX = x2 - Math.cos(angle + 0.5) * headSize * 1.6;
  const rightY = y2 - Math.sin(angle + 0.5) * headSize * 1.6;

  const dashOffset = len * (1 - progress);
  const headOpacity = Math.max(0, (progress - 0.8) / 0.2);

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={shaftEndX}
        y2={shaftEndY}
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={dashOffset}
      />
      <polygon
        points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
        fill={color}
        opacity={headOpacity}
      />
    </g>
  );
}

function BoxLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        border: "3.5px solid #111",
        borderRadius: 6,
        padding: "5px 16px",
        fontSize: 30,
        fontWeight: 900,
        color: "#111",
        backgroundColor: "white",
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const CreatineAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleP = useSpr(frame, 0, fps, 20);
  const subtitleP = useSpr(frame, 15, fps, 20);
  const ovalP = useSpr(frame, 40, fps, 25);
  const brainArrowP = useSpr(frame, 65, fps, 28);
  const muscleArrowP = useSpr(frame, 68, fps, 28);
  const metaArrowP = useSpr(frame, 71, fps, 28);
  const brainBoxP = useSpr(frame, 90, fps, 22);
  const muscleBoxP = useSpr(frame, 97, fps, 22);
  const metaBoxP = useSpr(frame, 104, fps, 22);
  const medicalArrowP = useSpr(frame, 130, fps, 25);
  const medicalLabelP = useSpr(frame, 138, fps, 20);

  const titleY = interpolate(titleP, [0, 1], [22, 0]);
  const subtitleY = interpolate(subtitleP, [0, 1], [18, 0]);
  const brainX = interpolate(brainBoxP, [0, 1], [-18, 0]);
  const muscleX = interpolate(muscleBoxP, [0, 1], [18, 0]);
  const metaY = interpolate(metaBoxP, [0, 1], [18, 0]);

  // Arrow endpoints
  const BRAIN_X1 = CX - OW / 2 - 5;
  const BRAIN_Y1 = CY - 18;
  const BRAIN_X2 = 335;
  const BRAIN_Y2 = 312;

  const MUSCLE_X1 = CX + OW / 2 + 5;
  const MUSCLE_Y1 = CY - 18;
  const MUSCLE_X2 = 948;
  const MUSCLE_Y2 = 312;

  const META_X1 = CX;
  const META_Y1 = CY + OH / 2 + 5;
  const META_X2 = CX;
  const META_Y2 = 548;

  const MED_X1 = 318;
  const MED_Y1 = 468;
  const MED_X2 = CX - 58;
  const MED_Y2 = CY + 28;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        fontFamily: '"Arial Black", Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Whiteboard border */}
      <AbsoluteFill
        style={{
          border: "14px solid #ddd",
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleP,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 49,
            fontWeight: 900,
            color: "#111",
            lineHeight: 1.2,
            letterSpacing: -0.5,
          }}
        >
          Creatine Is <em style={{ fontStyle: "normal" }}>NOT</em> Just a
          Sports Supplement.
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: 106,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subtitleP,
          transform: `translateY(${subtitleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 45,
            fontWeight: 900,
            color: "#1a6fc4",
            lineHeight: 1.25,
          }}
        >
          It&apos;s a Multi-Faceted Medical Tool.
        </div>
      </div>

      {/* SVG layer — arrows + oval */}
      <svg
        width={W}
        height={H}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Center oval */}
        <ellipse
          cx={CX}
          cy={CY}
          rx={(OW / 2) * ovalP}
          ry={(OH / 2) * ovalP}
          fill="white"
          stroke="#1a6fc4"
          strokeWidth={4.5}
        />

        {/* Blue arrows */}
        <ArrowLine
          x1={BRAIN_X1}
          y1={BRAIN_Y1}
          x2={BRAIN_X2}
          y2={BRAIN_Y2}
          color="#1a6fc4"
          progress={brainArrowP}
        />
        <ArrowLine
          x1={MUSCLE_X1}
          y1={MUSCLE_Y1}
          x2={MUSCLE_X2}
          y2={MUSCLE_Y2}
          color="#1a6fc4"
          progress={muscleArrowP}
        />
        <ArrowLine
          x1={META_X1}
          y1={META_Y1}
          x2={META_X2}
          y2={META_Y2}
          color="#1a6fc4"
          progress={metaArrowP}
        />

        {/* Red arrow — Medical Tool */}
        <ArrowLine
          x1={MED_X1}
          y1={MED_Y1}
          x2={MED_X2}
          y2={MED_Y2}
          color="#e03020"
          progress={medicalArrowP}
        />
      </svg>

      {/* Center oval text */}
      <div
        style={{
          position: "absolute",
          left: CX - OW / 2,
          top: CY - OH / 2,
          width: OW,
          height: OH,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          opacity: ovalP,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 27,
            fontWeight: 900,
            color: "#1a6fc4",
            lineHeight: 1.3,
          }}
        >
          Creatine
          <br />
          Excellence
        </div>
      </div>

      {/* Brain box — top left */}
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 222,
          opacity: brainBoxP,
          transform: `translateX(${brainX}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <BoxLabel>Brain</BoxLabel>
          <span style={{ fontSize: 36 }}>🧠</span>
        </div>
        <div
          style={{
            fontSize: 23,
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.45,
          }}
        >
          • Neuroprotection
          <br />
          &nbsp;&nbsp;(TBI/Neuromuscular)
        </div>
      </div>

      {/* Muscle box — top right */}
      <div
        style={{
          position: "absolute",
          right: 52,
          top: 222,
          opacity: muscleBoxP,
          transform: `translateX(${muscleX}px)`,
          textAlign: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <BoxLabel>Muscle</BoxLabel>
          <span style={{ fontSize: 36 }}>💪</span>
        </div>
        <div
          style={{
            fontSize: 23,
            fontWeight: 700,
            color: "#111",
            lineHeight: 1.45,
          }}
        >
          • Metabolic Support
          <br />
          &nbsp;&nbsp;(Steroid side effects)
        </div>
      </div>

      {/* Metabolism box — bottom center */}
      <div
        style={{
          position: "absolute",
          left: CX - 200,
          top: 558,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: metaBoxP,
          transform: `translateY(${metaY}px)`,
        }}
      >
        <span style={{ fontSize: 34 }}>⚖️</span>
        <BoxLabel>Metabolism</BoxLabel>
      </div>

      {/* Medical Tool label — bottom left */}
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 462,
          opacity: medicalLabelP,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 900,
            color: "#e03020",
            lineHeight: 1,
          }}
        >
          Medical Tool
        </div>
      </div>
    </AbsoluteFill>
  );
};
