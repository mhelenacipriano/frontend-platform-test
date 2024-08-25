export interface SongDetails {
  album: {
    title: string;
    year: number;
  };
  artist: string;
  files: {
    coverArt: string;
    poster: string;
  };
  title: string;
}

export interface Song {
  id: number;
  song: SongDetails;
}
