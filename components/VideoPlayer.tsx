"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { getEpisodeTime, removeProgress, saveProgress } from "@/lib/storage";

type Source = {
  id: string;
  kind: string;
  url: string | null;
  youtubeId: string | null;
};

type Meta = {
  slug: string;
  title: string;
  poster: string | null;
  episode: number;
};

export default function VideoPlayer({ sources, meta }: { sources: Source[]; meta: Meta }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const source = sources[0];

  // Attach HLS stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !source || source.kind !== "hls" || !source.url) return;

    // Safari plays HLS natively
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source.url;
      return;
    }

    if (!Hls.isSupported()) return;
    const hls = new Hls();
    hls.loadSource(source.url);
    hls.attachMedia(video);
    return () => hls.destroy();
  }, [source]);

  // Resume + save progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const { slug, title, poster, episode } = meta;
    const saved = getEpisodeTime(slug, episode);
    let lastSave = 0;
    let finished = false;

    const onLoaded = () => {
      if (saved > 5 && Number.isFinite(video.duration) && saved < video.duration - 10) {
        video.currentTime = saved;
      }
    };

    const save = (force = false) => {
      if (finished) return;
      const now = Date.now();
      if (!force && now - lastSave < 5000) return;
      if (!video.duration || Number.isNaN(video.duration)) return;
      lastSave = now;
      saveProgress({
        slug,
        title,
        poster,
        episode,
        time: video.currentTime,
        duration: video.duration,
        updatedAt: now,
      });
    };

    const onTime = () => save();
    const onPause = () => save(true);
    const onEnded = () => {
      finished = true;
      removeProgress(slug);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      save(true);
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [meta.slug, meta.title, meta.poster, meta.episode]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!source) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-900 text-neutral-400 ring-1 ring-white/5">
        Video coming soon
      </div>
    );
  }

  if (source.kind === "youtube" && source.youtubeId) {
    return (
      <iframe
        className="aspect-video w-full rounded-lg"
        src={`https://www.youtube.com/embed/${source.youtubeId}`}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      src={source.kind === "mp4" && source.url ? source.url : undefined}
      className="aspect-video w-full rounded-lg bg-black"
    />
  );
}