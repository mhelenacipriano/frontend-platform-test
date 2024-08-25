import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaSearch } from "react-icons/fa";
import styles from "../../styles/LibraryHeader.module.css";
import { Song } from "../types";

interface LibraryHeaderProps {
  totalSongs: number;
  setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onSortToggle: (isSortAZ: boolean) => void;
  onFavoriteClick: () => void;
  onSearch: (query: string) => void;
  suggestions: Song[];
  onSuggestionClick: (song: Song) => void;
  searchQuery: string;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  totalSongs,
  setShowFavorites,
  onSortToggle,
  onFavoriteClick,
  onSearch,
  suggestions = [],
  setSearchQuery,
  onSuggestionClick,
  searchQuery,
}) => {
  const [isSortAZ, setIsSortAZ] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSortToggle = () => {
    const newSortAZ = !isSortAZ;
    setIsSortAZ(newSortAZ);
    onSortToggle(newSortAZ);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
    setShowSuggestions(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.title}>Your Library</h2>
        <p className={styles.description}>
          You have {totalSongs} songs in your library
        </p>
      </div>
      <div className={styles.right}>
        <button
          className={styles.button}
          onClick={() => {
            setShowFavorites((prev) => !prev);
            onFavoriteClick();
          }}
        >
          <FaHeart className={styles.icon} />
          Favorites
        </button>
        <label className={styles.sortToggle}>
          Sort from A-Z
          <input
            type="checkbox"
            checked={isSortAZ}
            onChange={handleSortToggle}
            className={styles.toggleInput}
          />
          <span
            className={styles.toggleSlider}
            style={{ backgroundColor: isSortAZ ? "#4CAF50" : "#444" }}
          ></span>
        </label>
        <div className={styles.searchContainer} ref={searchRef}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search in your library"
            className={styles.searchInput}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestions}>
              {suggestions.map((song) => (
                <div
                  key={song.id}
                  className={styles.suggestionItem}
                  onClick={() => {
                    onSuggestionClick(song);
                    setShowSuggestions(false);
                  }}
                >
                  {song.song.title} - {song.song.artist}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
