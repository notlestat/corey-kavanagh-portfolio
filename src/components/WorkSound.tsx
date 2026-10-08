import { SoundEffects, SoundToggle } from "./sound";

// Only the Work folder and this sound switch have interface cues.
export default function WorkSound() {
  return (
    <SoundEffects scope="folder">
      <SoundToggle className="size-11 border-0 bg-transparent" />
    </SoundEffects>
  );
}
