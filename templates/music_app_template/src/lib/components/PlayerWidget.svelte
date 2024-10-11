<script lang="ts">
  import { isPlaying, playSong, stopSong, currentSong, playbackTime, setVolume, audioDuration } from '../module/player';
  import type { Song } from '@prisma/client';

  // 再生状態を監視
  $: playing = $isPlaying;
  $: song = $currentSong;
  $: elapsedTime = $playbackTime;
  $: duration = $audioDuration;
  let volume = 1.0; // 音量の初期値

  function handlePlayPause(): void {
    if (playing) {
      stopSong();
    } else if (song) {
      playSong(song);
    }
  }

  function formatTime(time: number): string {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }
</script>

{#if song}
<div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      <img src={song.image} alt="アルバムアート" class="w-16 h-16 mr-4">
      <div>
        <div class="text-lg font-bold">{song.title}</div>
        <div class="text-sm">{song.artist.name}</div>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <button on:click={handlePlayPause} class="p-2 rounded-full bg-white text-gray-800 hover:bg-gray-200">
        {#if playing}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-6.586-3.794A1 1 0 007 8.382v7.236a1 1 0 001.166.97l6.586-3.794a1 1 0 000-1.736z" />
          </svg>
        {/if}
      </button>
      <div class="flex items-center">
        <div class="mr-4">
          <span class="text-sm">{formatTime(elapsedTime)}</span>
          <span class="text-sm">/</span>
          <span class="text-sm">{formatTime(duration)}</span>
        </div>
        <div class="w-40">
          <div class="h-1 bg-gray-400 rounded-full">
            <div class="h-1 bg-white rounded-full" style="width: {(elapsedTime / duration) * 100}%;"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9v6h4l5 5V4L7 9H3z" />
      </svg>
      <input type="range" min="0" max="1" step="0.01" bind:value={volume} on:input={() => setVolume(volume)} class="w-20 ml-4">
    </div>
  </div>
</div>
{/if}
