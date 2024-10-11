import type { Song } from "@prisma/client";
import { readable, writable } from 'svelte/store';

export const isPlaying = writable(false);
export const currentSong = writable<Song | null>(null);
export const currentAudio = writable<HTMLAudioElement | null>(null);
export const audioDuration = writable<number>(0);

export function playSong(song: Song) {
    currentAudio.subscribe(audio => {
        if (audio) {
            audio.pause();
        }
    })();
    const newAudio = new Audio(song.audio);
    
    // Set duration when metadata is loaded
    newAudio.addEventListener('loadedmetadata', () => {
        audioDuration.set(newAudio.duration);
    });

    newAudio.play();
    isPlaying.set(true);
    currentSong.set(song);

    // 再生終了時のイベントリスナーを追加
    newAudio.addEventListener('ended', () => {
        isPlaying.set(false);
        currentSong.set(null);
    });

    currentAudio.set(newAudio);
}

export function stopSong() {
    currentAudio.subscribe(audio => {
        if (audio) {
            audio.pause();
            isPlaying.set(false);
        }
    })();
}

export function addToFavorite(songId: number) {
    let favoriteIds: number[] = [];
    const storedFavorite = localStorage.getItem("favorite");
    if (storedFavorite) {
        favoriteIds = JSON.parse(storedFavorite);
    }
    favoriteIds.push(songId);
    localStorage.setItem("favorite", JSON.stringify(favoriteIds));
    alert("お気に入りに追加しました");
}

export function removeFromFavorite(songId: number) {
    let favoriteIds: number[] = [];
    const storedFavorite = localStorage.getItem("favorite");
    if (storedFavorite) {
        favoriteIds = JSON.parse(storedFavorite);
    }
    favoriteIds = favoriteIds.filter(id => id !== songId);
    localStorage.setItem("favorite", JSON.stringify(favoriteIds));
}

export function getFavorite(): number[] {
    const storedFavorite = localStorage.getItem("favorite");
    if (storedFavorite) {
        return JSON.parse(storedFavorite);
    }
    return [];
}

export const playbackTime = readable(0, function start(set) {
    let audioElement: HTMLAudioElement | null = null;

    const unsubscribe = currentAudio.subscribe(audio => {
        audioElement = audio;
    });

    const interval = setInterval(() => {
        if (audioElement) {
            set(audioElement.currentTime);
        }
    }, 1000);

    return function stop() {
        clearInterval(interval);
        unsubscribe();
    };
});

export const currentVolume = writable(1.0);

export function setVolume(volume: number) {
    currentAudio.subscribe(audio => {
        if (audio) {
            audio.volume = volume;
        }
    })();
    currentVolume.set(volume);
}

export function seek(time: number) {
    currentAudio.subscribe(audio => {
        if (audio) {
            audio.currentTime = time;
        }
    })();
}
