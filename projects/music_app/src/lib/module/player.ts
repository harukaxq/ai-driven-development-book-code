import type { Song } from "@prisma/client";
import { writable } from 'svelte/store';

export const isPlaying = writable(false);
export const currentSong = writable<Song | null>(null);
export const currentAudio = writable<HTMLAudioElement | null>(null);
export const audioDuration = writable<number>(0);

export async function playSong(song: Song) {
    currentAudio.update(audio => {
        if (audio) {
            audio.pause();
        }
        const newAudio = new Audio(song.audio);
        
        // Set duration when metadata is loaded
        newAudio.addEventListener('loadedmetadata', () => {
            audioDuration.set(newAudio.duration);
        });

        newAudio.play();
        isPlaying.set(true);
        currentSong.set(song);

        // Add event listener for when playback ends
        newAudio.addEventListener('ended', () => {
            isPlaying.set(false);
            currentSong.set(null);
        });

        return newAudio;
    });

    // 再生数をインクリメントするAPIを呼び出す
    try {
        await fetch(`/api/song/${song.id}`, {
            method: 'PUT'
        });
    } catch (error) {
        console.error('再生数のインクリメント中にエラーが発生しました:', error);
    }
}

export function stopSong() {
    currentAudio.update(audio => {
        if (audio) {
            audio.pause();
            isPlaying.set(false);
        }
        return audio;
    });
}

export const playbackTime = writable(0);

currentAudio.subscribe(audio => {
    if (audio) {
        const interval = setInterval(() => {
            playbackTime.set(audio.currentTime);
        }, 1000);

        return () => clearInterval(interval);
    }
});

export const currentVolume = writable(1.0);

export function setVolume(volume: number) {
    currentAudio.update(audio => {
        if (audio) {
            audio.volume = volume;
        }
        return audio;
    });
}

export function seek(time: number) {
    currentAudio.update(audio => {
        if (audio) {
            audio.currentTime = time;
        }
        return audio;
    });
}
