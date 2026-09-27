'use client';

import { useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import { OPEN_STORY_VIDEO } from './WatchStoryLink';

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
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    void videoRef.current?.play().catch(() => undefined);
  };

  // De "Watch"-knoppen in de hero en verderop openen dezelfde dialog
  useEffect(() => {
    const onOpen = () => open();
    window.addEventListener(OPEN_STORY_VIDEO, onOpen);
    return () => window.removeEventListener(OPEN_STORY_VIDEO, onOpen);
  }, []);

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
        className="m-auto w-[min(56rem,calc(100vw-2rem),calc((100svh-2rem)*16/9))] overflow-hidden rounded-panel bg-[#0b1114] p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
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
            className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-black/55 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
      </dialog>
    </>
  );
}
