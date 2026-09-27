'use client';

import { useRef } from 'react';
import { Play, X } from 'lucide-react';

interface StoryVideoButtonProps {
  label: string;
  duration: string;
  /** Leeg zolang de video er nog niet is: de dialog toont dan `pending`. */
  videoSrc: string | null;
  pending: { title: string; text: string };
  closeLabel: string;
}

/** Afspeelknop + native <dialog> (focus-trap en Esc-sluiten zitten er standaard in). */
export function StoryVideoButton({ label, duration, videoSrc, pending, closeLabel }: StoryVideoButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
    void videoRef.current?.play().catch(() => undefined);
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="group mt-9 inline-flex items-center gap-4 rounded-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
      >
        {/* Vaste inkt: de cirkel is altijd wit, ook in dark mode */}
        <span className="grid size-14 place-items-center rounded-full bg-white text-[#101820] shadow-[0_10px_30px_rgb(0_0_0/0.35)] transition-transform duration-300 ease-soft group-hover:scale-105">
          <Play className="ml-0.5 size-5 fill-current" aria-hidden />
        </span>
        <span>
          <span className="block text-[15px] font-semibold text-white">{label}</span>
          <span className="block text-sm text-white/60">{duration}</span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={label}
        onClose={() => videoRef.current?.pause()}
        onClick={(event) => event.target === dialogRef.current && dialogRef.current.close()}
        className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-panel bg-[#0b1114] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative">
          {videoSrc ? (
            <video ref={videoRef} src={videoSrc} controls playsInline preload="none" className="aspect-video w-full" />
          ) : (
            <div className="grid aspect-video place-items-center p-8 text-center">
              <div>
                <p className="text-xl font-semibold">{pending.title}</p>
                <p className="mt-2 text-white/60">{pending.text}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </dialog>
    </>
  );
}
