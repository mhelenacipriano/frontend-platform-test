import React from "react";
import Link from "next/link";
import styles from "../../styles/OtherAlbums.module.css";

interface Album {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
}

interface OtherAlbumsProps {
  albums: Album[];
}

const OtherAlbums: React.FC<OtherAlbumsProps> = ({ albums }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Other albums</h3>
      <div className={styles.albumGrid}>
        {albums.map((album) => (
          <Link href={`/album/${album.id}`} key={album.id} passHref>
            <div className={styles.albumCard}>
              <img
                src={`/assets/images/${album.coverArt}`}
                alt={album.title}
                className={styles.albumImage}
              />
              <div className={styles.albumInfo}>
                <h4 className={styles.albumTitle}>{album.title}</h4>
                <p className={styles.albumArtist}>{album.artist}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OtherAlbums;
