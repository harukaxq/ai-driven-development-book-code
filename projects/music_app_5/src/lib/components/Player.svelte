<script lang="ts">
  import { writable } from 'svelte/store';

  // ストアの定義
  export const isPlaying = writable(false);
  export const currentSong = writable<{ title: string; artist: string; artwork: string } | null>(null);
  export const currentVolume = writable(50);
</script>

<div class="fixed bottom-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center">
  <!-- 曲情報 -->
  <div class="flex items-center space-x-4">
    <img src="/img/song_default.webp" alt="Album Art" class="w-16 h-16 object-cover" />
    <div>
      <div class="text-lg font-bold">曲のタイトル</div>
      <div class="text-sm">アーティスト名</div>
    </div>
  </div>

  <!-- 再生コントロール -->
  <div class="flex items-center space-x-4">
    <button class="bg-white text-gray-800 rounded-full p-2">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
    <div class="flex items-center space-x-2">
      <span>0:00 / 3:30</span>
      <div class="relative w-40 h-1 bg-gray-500">
        <div class="absolute top-0 left-0 h-1 bg-white" style="width: 0%;"></div>
      </div>
    </div>
  </div>

  <!-- 音量コントロール -->
  <div class="flex items-center space-x-2">
    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
    </svg>
    <input type="range" min="0" max="100" value="100" class="w-20" />
  </div>
</div>
