import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaPlay, FaPause } from "react-icons/fa";
import styles from "../../styles/MusicDetails.module.css";

interface MusicDetailsProps {
  title: string;
  artist: string;
  album: string;
  year: string;
  isFavorited: boolean;
  imageUrl: string;
  onFavoriteClick: () => void;
  coverArt: string;
  audioSrc: string;
}

const MusicDetails: React.FC<MusicDetailsProps> = ({
  title,
  artist,
  album,
  year,
  isFavorited,
  imageUrl,
  onFavoriteClick,
  coverArt,
  audioSrc,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const progressPercentage = clickX / rect.width;
      audioRef.current.currentTime = progressPercentage * duration;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.albumCover}>
        <img
          src={`/assets/images/${coverArt}`}
          alt={album}
          className={styles.image}
        />
      </div>
      <div className={styles.details}>
        <div className={styles.topSection}>
          <div className={styles.playButton}>
            {isPlaying ? (
              <FaPause onClick={handlePlayPause} className={styles.playIcon} />
            ) : (
              <FaPlay onClick={handlePlayPause} className={styles.playIcon} />
            )}
          </div>
          <div className={styles.songInfo}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.artist}>
              {artist} | {album} | {year}
            </p>
          </div>
          <FaHeart
            onClick={onFavoriteClick}
            className={styles.heartIcon}
            style={{ color: isFavorited ? "red" : "white" }}
          />
        </div>
        <div className={styles.progressBarContainer}>
          <span>{formatTime(currentTime)}</span>
          <div className={styles.progressBar} onClick={handleProgressClick}>
            <div
              className={styles.progress}
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
        <audio ref={audioRef} src={audioSrc}></audio>
      </div>
    </div>
  );
};

export default MusicDetails;
