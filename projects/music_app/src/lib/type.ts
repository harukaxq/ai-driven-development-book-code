import type { Prisma } from "@prisma/client";

export type SongWithArtist = Prisma.SongGetPayload<{
    include: {
        artist: true;
    };
}>;


export type ArtistWithSongs = Prisma.ArtistGetPayload<{
    include: {
        songs: true;
    };
}>;
