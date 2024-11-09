import { writable } from 'svelte/store';

// お気に入りの曲IDリストを保持するSvelteのwritableストア
export const favoriteIds = writable<number[]>(typeof window !== 'undefined' ? getFavorite() : []);

// お気に入り追加機能
export function addToFavorite(songId: number): void {
  if (typeof window !== 'undefined') {
    const currentFavorites = getFavorite();
    if (!currentFavorites.includes(songId)) {
      currentFavorites.push(songId);
      localStorage.setItem('favoriteSongs', JSON.stringify(currentFavorites));
      favoriteIds.set(currentFavorites);
    }
  }
}

// お気に入り削除機能
export function removeFromFavorite(songId: number): void {
  if (typeof window !== 'undefined') {
    const currentFavorites = getFavorite();
    const updatedFavorites = currentFavorites.filter(id => id !== songId);
    localStorage.setItem('favoriteSongs', JSON.stringify(updatedFavorites));
    favoriteIds.set(updatedFavorites);
  }
}

// お気に入り取得機能
export function getFavorite(): number[] {
  if (typeof window !== 'undefined') {
    const storedFavorites = localStorage.getItem('favoriteSongs');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  }
  return [];
}
