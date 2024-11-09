<script lang="ts">
  import { get } from 'svelte/store';
  import { isPlaying, currentSong, currentVolume, playSong, stopSong, setVolume, currentAudio, audioDuration, currentTime } from '../module/player';
  import type { SongWithArtist } from '../type';

  let song: SongWithArtist | null = null;

  // 再生/一時停止の切り替え
  function togglePlay() {
    if (get(isPlaying)) {
      stopSong();
    } else if (song) {
      playSong(song);
    }
  }

  // 音量変更
  function changeVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    setVolume(Number(input.value) / 100);
  }

</script>

<div class="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
  <!-- 曲情報 -->
  <div class="flex items-center space-x-4">
    <img src={$currentSong?.image || '/img/song_default.webp'} alt="Album Art" class="w-16 h-16 object-cover" />
    <div>
      <div class="text-lg font-bold">{$currentSong?.title || '曲のタイトル'}</div>
      <div class="text-sm">{$currentSong?.artist?.name || 'アーティスト名'}</div>
    </div>
  </div>

  <!-- 再生コントロール -->
  <div class="flex items-center space-x-4">
    <button class="bg-white text-gray-800 rounded-full p-2" on:click={togglePlay}>
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d={$isPlaying ? "M6 4h4v16H6zM14 4h4v16h-4z" : "M8 5v14l11-7z"} />
      </svg>
    </button>
    <div class="flex items-center space-x-2">
      <span>
        {isNaN($currentTime) ? '0:00' : `${Math.floor($currentTime / 60)}:${Math.floor($currentTime % 60).toString().padStart(2, '0')}`} / 
        {isNaN($audioDuration) ? '0:00' : `${Math.floor($audioDuration / 60)}:${Math.floor($audioDuration % 60).toString().padStart(2, '0')}`}
      </span>
      <div class="relative w-40 h-1 bg-gray-500">
        <div class="absolute top-0 left-0 h-1 bg-white" style="width: {($currentTime / $audioDuration) * 100}%;"></div>
      </div>
    </div>
  </div>

  <!-- 音量コントロール -->
  <div class="flex items-center space-x-2">
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
    </svg>
    <input type="range" min="0" max="100" value={$currentVolume * 100} class="w-20" on:input={changeVolume} />
  </div>
</div>
