import { describe, test, expect, beforeAll, vi } from 'vitest';
import { playSong, stopSong, addToFavorite, removeFromFavorite, getFavorite, setVolume, seek, isPlaying, currentSong, currentAudio, currentVolume, audioDuration } from './player';
import type { Song } from "@prisma/client";

describe('player module', () => {
    let song: Song;

    beforeAll(() => {
        song = {
            id: 1,
            title: 'Test Song',
            image: 'default.jpg',
            createdAt: new Date(),
            updatedAt: new Date(),
            artistId: 1,
            audio: 'test.mp3'
        };

        // Mock the Audio object
        global.Audio = vi.fn().mockImplementation(() => ({
            play: vi.fn(),
            pause: vi.fn(),
            addEventListener: vi.fn((event, callback) => {
                if (event === 'loadedmetadata') {
                    callback();
                }
            }),
            duration: 180,
            volume: 1,
            currentTime: 0,
        }));
    });

    test('playSong should play the song, set isPlaying to true, and set audioDuration', () => {
        playSong(song);
        isPlaying.subscribe(value => {
            expect(value).toBe(true);
        })();
        currentSong.subscribe(value => {
            expect(value).toEqual(song);
        })();
        audioDuration.subscribe(value => {
            expect(value).toBe(180);
        })();
    });

    test('stopSong should stop the song and set isPlaying to false', () => {
        playSong(song);
        stopSong();
        isPlaying.subscribe(value => {
            expect(value).toBe(false);
        })();
    });

    test('addToFavorite should add song to favorites', () => {
        addToFavorite(song.id);
        const favorites = getFavorite();
        expect(favorites).toContain(song.id);
    });

    test('removeFromFavorite should remove song from favorites', () => {
        addToFavorite(song.id);
        removeFromFavorite(song.id);
        const favorites = getFavorite();
        expect(favorites).not.toContain(song.id);
    });

    test('setVolume should set the volume of the current audio', () => {
        playSong(song);
        setVolume(0.5);
        currentVolume.subscribe(value => {
            expect(value).toBe(0.5);
        })();
    });

    test('seek should set the current time of the current audio', () => {
        playSong(song);
        seek(30);
        currentAudio.subscribe(audio => {
            if (audio) {
                expect(audio.currentTime).toBe(30);
            }
        })();
    });

    test('audioDuration should be set when playSong is called', () => {
        playSong(song);
        audioDuration.subscribe(value => {
            expect(value).toBe(180);
        })();
    });
});
