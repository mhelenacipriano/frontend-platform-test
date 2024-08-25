import Head from "next/head";
import styles from "../styles/Home.module.css";
import { LibraryHeader } from "../src/components/LibraryHeader";
import { useCallback, useEffect, useState } from "react";
import { Header } from "../src/components/Header";
import { SongLibrary } from "../src/components/SongLibrary/SongLibrary";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [favoriteToggle, setFavoriteToggle] = useState(false);
  const [displayedSongs, setDisplayedSongs] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/songs");
        const data = await response.json();
        setSongs(data.songs);
        setDisplayedSongs(data.songs);

        localStorage.setItem("songs", JSON.stringify(data.songs));
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const onFavoriteClick = () => {
    if (favoriteToggle) {
      setDisplayedSongs(songs);
    } else {
      setDisplayedSongs(favoriteSongs);
    }
    setFavoriteToggle((prev) => !prev);
  };

  const sortSongs = useCallback((songs: any[]) => {
    return songs
      .slice()
      .sort((a, b) => a.song.title.localeCompare(b.song.title));
  }, []);

  const handleSortToggle = (isSortAZ: boolean) => {
    if (isSortAZ) {
      setDisplayedSongs(sortSongs(displayedSongs));
    } else {
      setDisplayedSongs(songs);
    }
  };

  const handleSearch = (query: string) => {
    const filteredSongs = songs.filter((song) =>
      song.song.title.toLowerCase().includes(query.toLowerCase())
    );
    setDisplayedSongs(filteredSongs);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <LibraryHeader
        onSearch={handleSearch}
        onSortToggle={handleSortToggle}
        onFavoriteClick={onFavoriteClick}
        totalSongs={songs.length}
        setShowFavorites={setShowFavorites}
      />
      <main>
        <SongLibrary
          showFavorites={showFavorites}
          favoriteSongs={favoriteSongs}
          setFavoriteSongs={setFavoriteSongs}
          songs={displayedSongs}
          sortSongs={sortSongs}
        />
      </main>

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
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
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
}
