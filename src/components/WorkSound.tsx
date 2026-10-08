import { SoundEffects, SoundToggle } from "./sound";

// One listener per Astro Work document; it also hears presses in other islands.
export default function WorkSound() {
  return (
    <SoundEffects>
      <SoundToggle className="size-11 border-0 bg-transparent" />
    </SoundEffects>
  );
}
