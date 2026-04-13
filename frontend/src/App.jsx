import { useState } from "react";
import SongList from "./components/SongList";
import UploadSong from "./components/UploadSong";
import { Music3 } from "lucide-react";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Increment the key to trigger a re-fetch in SongList
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      <div className="header">
        <Music3 size={40} color="#a855f7" /> 
        <span>Music Library</span>
      </div>
      <UploadSong onUploadSuccess={handleUploadSuccess} />
      <SongList key={refreshKey} />
    </div>
  );
}

export default App;