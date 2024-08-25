import React, { useEffect, useState, useMemo } from "react";
import styles from "../../styles/SongLibrary.module.css";
import { SongCard } from "../SongCard";

interface Song {
  id: number;
  song: {
    files: {
      coverArt: string;
    };
    title: string;
    artist: string;
  };
}
type SetFavoriteSongs = React.Dispatch<React.SetStateAction<Song[]>>;

interface SongLibraryProps {
  songs: Song[];
  favoriteSongs: Song[];
  setFavoriteSongs: SetFavoriteSongs;
  showFavorites: boolean;
  sortSongs: (songs: any[]) => any[];
}

export const SongLibrary: React.FC<SongLibraryProps> = ({
  songs,
  showFavorites,
}) => {
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteSongs") || "[]"
    ) as Song[];
    setFavoriteSongs(savedFavorites);
  }, []);

  const toggleFavoriteSong = (song: Song) => {
    setFavoriteSongs((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.some((fav) => fav.id === song.id)) {
        updatedFavorites = prevFavorites.filter((fav) => fav.id !== song.id);
      } else {
        updatedFavorites = [...prevFavorites, song];
      }
      localStorage.setItem("favoriteSongs", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const displayedSongs = useMemo(
    () => (showFavorites ? favoriteSongs : songs),
    [showFavorites, favoriteSongs, songs]
  );

  const songList = useMemo(
    () => (
      <div className={styles.container}>
        <h1>Song List</h1>
        <div className={styles.songList}>
          {displayedSongs.length > 0 ? (
            displayedSongs.map((item) => {
              const isFavorited = favoriteSongs.find(
                (fav) => fav.id === item.id
              );
              return (
                <SongCard
                  key={item.id}
                  id={item.id}
                  imageUrl={`/assets/images/${item.song.files.coverArt}`}
                  title={item.song.title}
                  artist={item.song.artist}
                  isFavorited={!!isFavorited}
                  onFavoriteClick={() => toggleFavoriteSong(item)}
                />
              );
            })
          ) : (
            <p>No songs available</p>
          )}
        </div>
        <h2>Favorites</h2>
        <ul>
          {favoriteSongs.map((song, index) => (
            <li key={index}>
              {song.song.title} by {song.song.artist}
            </li>
          ))}
        </ul>
      </div>
    ),
    [displayedSongs, favoriteSongs, toggleFavoriteSong]
  );

  return songList;
};
