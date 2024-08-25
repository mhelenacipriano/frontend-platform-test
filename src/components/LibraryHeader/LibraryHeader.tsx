import React, { useState } from "react";
import { FaHeart, FaSearch } from "react-icons/fa"; // For icons
import styles from "../../styles/LibraryHeader.module.css";

interface LibraryHeaderProps {
  totalSongs: number;
  setShowFavorites: React.Dispatch<React.SetStateAction<boolean>>;
  onSortToggle: (isSortAZ: boolean) => void;
  onFavoriteClick: () => void;
  onSearch: (query: string) => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  totalSongs,
  setShowFavorites,
  onSortToggle,
  onFavoriteClick,
  onSearch,
}) => {
  const [isSortAZ, setIsSortAZ] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSortToggle = () => {
    const newSortAZ = !isSortAZ;
    setIsSortAZ(newSortAZ);
    onSortToggle(newSortAZ);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

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
        <div className={styles.searchContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search in your library"
            className={styles.searchInput}
          />
        </div>
      </div>
    </div>
  );
};
