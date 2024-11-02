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
