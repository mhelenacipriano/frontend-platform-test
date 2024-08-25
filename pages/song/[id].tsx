import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa"; // Import the arrow icon
import MusicDetails from "../../src/components/MusicDetails/MusicDetails";
import OtherAlbums from "../../src/components/OtherAlbums/OtherAlbums";
import styles from "../../src/styles/SongDetails.module.css";

interface Song {
  id: number;
  song: {
    files: {
      coverArt: string;
    };
    title: string;
    artist: string;
    album: {
      title: string;
      year: string;
    };
  };
}

interface Album {
  id: number;
  title: string;
  artist: string;
  coverArt: string;
}

const SongDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query as { id?: string };
  const [song, setSong] = useState<Song | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [otherAlbums, setOtherAlbums] = useState<Album[]>([]);

  useEffect(() => {
    if (id) {
      const savedSongs: Song[] = JSON.parse(
        localStorage.getItem("songs") || "[]"
      );

      const currentSong = savedSongs.find((s) => s.id === parseInt(id));
      setSong(currentSong || null);

      if (currentSong) {
        // Retrieve saved favorites from localStorage
        const savedFavorites: Song[] = JSON.parse(
          localStorage.getItem("favoriteSongs") || "[]"
        );
        const favoriteSong = savedFavorites.find(
          (fav) => fav.id === parseInt(id)
        );
        setIsFavorited(!!favoriteSong);

        // Filter other albums by the same artist, excluding the current album
        const albums = savedSongs
          .filter(
            (s) =>
              s.song.artist === currentSong.song.artist &&
              s.song.album.title !== currentSong.song.album.title
          )
          .map((s) => ({
            id: s.id,
            title: s.song.album.title,
            artist: s.song.artist,
            coverArt: s.song.files.coverArt,
          }))
          .reduce((uniqueAlbums, album) => {
            const isDuplicate = uniqueAlbums.some(
              (uniqueAlbum) => uniqueAlbum.title === album.title
            );
            if (!isDuplicate) {
              uniqueAlbums.push(album);
            }
            return uniqueAlbums;
          }, [] as Album[]);

        setOtherAlbums(albums);
      }
    }
  }, [id]);

  const toggleFavoriteSong = () => {
    if (!song) return;

    const savedFavorites: Song[] = JSON.parse(
      localStorage.getItem("favoriteSongs") || "[]"
    );
    let updatedFavorites: Song[];

    if (isFavorited) {
      updatedFavorites = savedFavorites.filter((fav) => fav.id !== song.id);
    } else {
      updatedFavorites = [...savedFavorites, song];
    }

    localStorage.setItem("favoriteSongs", JSON.stringify(updatedFavorites));

    setIsFavorited(!isFavorited);
  };

  if (!song) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <Link href="/" passHref>
        <div className={styles.returnIcon}>
          <FaArrowLeft />
        </div>
      </Link>
      <MusicDetails
        audioSrc={"/assets/audio/song-1.mp3"}
        imageUrl={`/assets/images/${song.song.files.coverArt}`}
        title={song.song.title}
        artist={song.song.artist}
        album={song.song.album.title}
        year={song.song.album.year}
        coverArt={song.song.files.coverArt}
        isFavorited={isFavorited}
        onFavoriteClick={toggleFavoriteSong}
      />
      {otherAlbums.length > 0 && <OtherAlbums albums={otherAlbums} />}
      <style jsx>{`
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Courier New, monospace;
        }
      `}</style>
      <style jsx global>{`
        @font-face {
          font-family: "Articulat";
          src: url("/assets/fonts/ArticulatCF-Medium.otf");
          font-weight: 600;
        }

        @font-face {
          font-family: "Articulat";
          src: url("/assets/fonts/ArticulatCF-Normal.otf");
          font-weight: 500;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 16px;
          font-weight: 500;
          line-height: 100%;
          font-family: "Articulat", helvetica, arial, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default SongDetails;
