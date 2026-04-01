import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "ERR_01: NEON_DECAY", artist: "SYS.OP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "ERR_02: CYBER_VOID", artist: "SYS.OP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "ERR_03: NULL_PTR", artist: "SYS.OP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const playNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const playPrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  return (
    <div className="border-4 border-[#ff00ff] bg-black p-6 w-full max-w-sm font-terminal text-[#00ffff] shadow-[8px_8px_0px_#00ffff] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#00ffff] opacity-50 animate-pulse"></div>
      
      <div className="text-xl mb-2 text-[#ff00ff] border-b-2 border-[#ff00ff] pb-1 tracking-widest">AUDIO_SUBSYS_V1.9</div>
      
      <div className="my-8">
        <div className="text-2xl font-pixel truncate mb-2" title={currentTrack.title}>
          {currentTrack.title}
        </div>
        <div className="text-xl opacity-70">AUTHOR: {currentTrack.artist}</div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-b-2 border-[#00ffff] py-4 my-6">
        <button onClick={playPrev} className="text-2xl hover:text-[#ff00ff] hover:bg-[#00ffff]/20 px-2 py-1 transition-colors">
          [PREV]
        </button>
        <button onClick={togglePlay} className="font-pixel text-2xl text-[#ff00ff] hover:text-[#00ffff] transition-colors">
          {isPlaying ? '|| PAUSE' : '> PLAY'}
        </button>
        <button onClick={playNext} className="text-2xl hover:text-[#ff00ff] hover:bg-[#00ffff]/20 px-2 py-1 transition-colors">
          [NEXT]
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {TRACKS.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-6 flex-1 border-2 border-[#00ffff] ${idx === currentTrackIndex ? 'bg-[#ff00ff] border-[#ff00ff]' : 'bg-transparent'}`}
          />
        ))}
      </div>

      <audio ref={audioRef} src={currentTrack.url} onEnded={playNext} />
    </div>
  );
}
