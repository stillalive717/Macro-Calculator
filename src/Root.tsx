import { Composition, Still } from "remotion";
import { myCompSchema, PreviewCard } from "./PreviewCard";
import { CreatineAnimation } from "./CreatineAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still
        id="PreviewCard"
        component={PreviewCard}
        width={1200}
        height={627}
        schema={myCompSchema}
        defaultProps={{
          title: "Welcome to Remotion" as const,
          description: "Edit Video.tsx to change template" as const,
          color: "#0B84F3" as const,
        }}
      />
      <Composition
        id="CreatineAnimation"
        component={CreatineAnimation}
        width={1280}
        height={720}
        fps={30}
        durationInFrames={210}
      />
    </>
  );
};
