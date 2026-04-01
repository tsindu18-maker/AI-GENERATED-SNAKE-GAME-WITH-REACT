/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#00ffff] font-terminal overflow-hidden flex flex-col relative crt">
      <div className="noise"></div>
      
      <header className="relative z-10 p-6 flex justify-center items-center border-b-4 border-[#ff00ff] bg-black">
        <h1 
          className="text-2xl md:text-4xl font-pixel text-[#00ffff] uppercase glitch-container"
          data-text="SYS.TERMINAL // SNAKE"
        >
          SYS.TERMINAL // SNAKE
        </h1>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center p-6 gap-12 lg:gap-24">
        <div className="w-full max-w-md flex justify-center lg:justify-end">
          <MusicPlayer />
        </div>
        
        <div className="w-full max-w-lg flex justify-center lg:justify-start">
          <SnakeGame />
        </div>
      </main>
    </div>
  );
}
