import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import styles from "../../styles/SongCard.module.css";

interface SongCardProps {
  id: number;
  imageUrl: string;
  title: string;
  artist: string;
  isFavorited: boolean;
  onFavoriteClick: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  id,
  imageUrl,
  title,
  artist,
  isFavorited,
  onFavoriteClick,
}) => {
  return (
    <div className={styles.card}>
      <Link href={`/song/${id}`}>
        <img src={imageUrl} alt={title} className={styles.image} />
        <div className={styles.info}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.artist}>{artist}</p>
          </div>
        </div>
      </Link>
      {isFavorited ? (
        <FaHeart
          onClick={onFavoriteClick}
          className={styles.heartIcon}
          style={{ color: "red" }}
        />
      ) : (
        <FaRegHeart
          onClick={onFavoriteClick}
          className={styles.heartIcon}
          style={{ color: "white" }}
        />
      )}
    </div>
  );
};
