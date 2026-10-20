import { useEffect, useRef, useState } from "react";
import { sound } from "./music.js";
import { saveGuidePref } from "./guide.js";

/**
 * Sound and guidance settings, in one popover.
 * Both persist across visits; neither ever needs to be set before playing.
 */

export default function SoundControls({ guide, onGuide }) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(sound().settings);
  const ref = useRef(null);

  useEffect(() => sound().subscribe(setSettings), []);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const set = (patch) => sound().set(patch);
  const setGuide = (g) => {
    saveGuidePref(g);
    onGuide?.(g);
  };

  return (
    <div className="ty-sound" ref={ref}>
      <button
        type="button"
        className="ty-iconbtn"
        aria-label={settings.music ? "Mute music" : "Play music"}
        title={settings.music ? "Mute music" : "Play music"}
        onClick={() => set({ music: !settings.music })}
      >
        <i className={`fas ${settings.music ? "fa-music" : "fa-volume-xmark"}`} aria-hidden="true" />
      </button>
      <button type="button" className="ty-iconbtn" aria-label="Sound and guidance settings" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <i className="fas fa-sliders" aria-hidden="true" />
      </button>

      {open && (
        <div className="ty-sound__panel" role="dialog" aria-label="Settings">
          <label className="ty-switch">
            <input type="checkbox" checked={settings.music} onChange={(e) => set({ music: e.target.checked })} />
            <span>Music</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.musicVolume}
            onChange={(e) => set({ musicVolume: Number(e.target.value) })}
            aria-label="Music volume"
            disabled={!settings.music}
          />
          <label className="ty-switch">
            <input type="checkbox" checked={settings.sfx} onChange={(e) => set({ sfx: e.target.checked })} />
            <span>Sound effects</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.sfxVolume}
            onChange={(e) => set({ sfxVolume: Number(e.target.value) })}
            aria-label="Effects volume"
            disabled={!settings.sfx}
          />

          <fieldset className="ty-seg">
            <legend>Key sound</legend>
            {[
              ["musical", "Musical"],
              ["click", "Click"],
              ["off", "Off"],
            ].map(([id, label]) => (
              <label key={id} className={settings.keySound === id ? "is-on" : ""}>
                <input type="radio" name="keysound" checked={settings.keySound === id} onChange={() => set({ keySound: id })} />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="ty-seg">
            <legend>Keyboard guidance</legend>
            {[
              ["auto", "Auto"],
              ["full", "Always"],
              ["hint", "On pause"],
              ["blind", "Hidden"],
            ].map(([id, label]) => (
              <label key={id} className={guide === id ? "is-on" : ""}>
                <input type="radio" name="guide" checked={guide === id} onChange={() => setGuide(id)} />
                {label}
              </label>
            ))}
          </fieldset>
          <p className="ty-sound__note">
            Auto fades the on-screen keyboard as you progress, so you learn to type without looking.
          </p>
        </div>
      )}
    </div>
  );
}
