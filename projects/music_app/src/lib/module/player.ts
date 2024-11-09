import { get, writable, type Writable } from 'svelte/store';
import type { SongWithArtist } from '$lib/type';

export const isPlaying: Writable<boolean> = writable(false);
export const currentSong: Writable<SongWithArtist | null> = writable(null);
export const currentAudio: Writable<HTMLAudioElement | null> = writable(null);
export const currentTime: Writable<number> = writable(0);
export const audioDuration: Writable<number> = writable(0);
export const currentVolume: Writable<number> = writable(1);

export async function playSong(song: SongWithArtist) {
  currentSong.set(song);
  const audio = new Audio(song.audio);
  currentAudio.set(audio);

  audio.addEventListener('loadedmetadata', () => {
    audioDuration.set(audio.duration);
  });

  audio.addEventListener('ended', () => {
    isPlaying.set(false);
  });

  audio.addEventListener('timeupdate', () => {
    currentTime.set(audio.currentTime);
  });

  audio.volume = get(currentVolume);
  audio.play();
  isPlaying.set(true);

  // 再生数をインクリメントするAPIを呼び出す
  await fetch(`/api/songs/${song.id}`, {
    method: 'PUT'
  });
}

export function stopSong() {
  const audio = get(currentAudio);
  if (audio) {
    audio.pause();
    isPlaying.set(false);
  }
}

export function setVolume(volume: number) {
  currentVolume.set(volume);
  const audio = get(currentAudio);
  if (audio) {
    audio.volume = volume;
  }
}
