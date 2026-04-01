import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * TILE_SIZE;

type Point = { x: number; y: number };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const snake = useRef<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const dir = useRef<Point>({ x: 0, y: -1 });
  const nextDir = useRef<Point>({ x: 0, y: -1 });
  const food = useRef<Point>({ x: 5, y: 5 });
  const particles = useRef<Particle[]>([]);
  const lastTick = useRef<number>(0);
  const reqRef = useRef<number>(0);
  const isGameOver = useRef(false);

  const spawnParticles = useCallback((x: number, y: number, color: string) => {
    for (let i = 0; i < 20; i++) {
      particles.current.push({
        x: x * TILE_SIZE + TILE_SIZE / 2,
        y: y * TILE_SIZE + TILE_SIZE / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.0,
        color
      });
    }
  }, []);

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  }, []);

  const resetGame = () => {
    snake.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    dir.current = { x: 0, y: -1 };
    nextDir.current = { x: 0, y: -1 };
    food.current = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    particles.current = [];
    setScore(0);
    setGameOver(false);
    isGameOver.current = false;
    lastTick.current = performance.now();
    reqRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = useCallback((time: number) => {
    if (isGameOver.current) return;
    reqRef.current = requestAnimationFrame(gameLoop);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Update logic (tick)
    if (time - lastTick.current > 80) { // faster game
      dir.current = nextDir.current;
      const head = snake.current[0];
      const newHead = { x: head.x + dir.current.x, y: head.y + dir.current.y };

      // Collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        isGameOver.current = true;
        setGameOver(true);
        triggerShake();
        spawnParticles(head.x, head.y, '#ff00ff');
        return;
      }

      // Collision with self
      if (snake.current.some(s => s.x === newHead.x && s.y === newHead.y)) {
        isGameOver.current = true;
        setGameOver(true);
        triggerShake();
        spawnParticles(head.x, head.y, '#ff00ff');
        return;
      }

      snake.current.unshift(newHead);

      // Eat food
      if (newHead.x === food.current.x && newHead.y === food.current.y) {
        setScore(s => s + 10);
        triggerShake();
        spawnParticles(food.current.x, food.current.y, '#00ffff');
        food.current = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
      } else {
        snake.current.pop();
      }

      lastTick.current = time;
    }

    // Draw
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.current.x * TILE_SIZE, food.current.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

    // Draw Snake
    snake.current.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#ffffff' : '#00ffff';
      ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE - 2, TILE_SIZE - 2);
    });

    // Draw Particles
    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        particles.current.splice(i, 1);
      } else {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 6, 6);
        ctx.globalAlpha = 1.0;
      }
    }

  }, [spawnParticles, triggerShake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': if (dir.current.y !== 1) nextDir.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': case 's': if (dir.current.y !== -1) nextDir.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': case 'a': if (dir.current.x !== 1) nextDir.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': case 'd': if (dir.current.x !== -1) nextDir.current = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    reqRef.current = requestAnimationFrame(gameLoop);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(reqRef.current);
    };
  }, [gameLoop]);

  return (
    <div className={`flex flex-col items-center w-full max-w-[400px] ${isShaking ? 'shake' : ''}`}>
      <div className="w-full flex justify-between font-pixel text-[#00ffff] mb-4 text-sm md:text-base uppercase tracking-widest border-b-4 border-[#ff00ff] pb-2">
        <span>SCORE_{score.toString().padStart(4, '0')}</span>
        <span className="text-[#ff00ff] animate-pulse">SYS.READY</span>
      </div>
      <div className="relative border-4 border-[#00ffff] bg-black p-1 shadow-[8px_8px_0px_#ff00ff] w-full">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="block w-full aspect-square bg-[#050505]"
          style={{ imageRendering: 'pixelated' }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10">
            <h2 className="font-pixel text-2xl md:text-3xl text-[#ff00ff] mb-6 glitch-container" data-text="FATAL_ERR">FATAL_ERR</h2>
            <button
              onClick={resetGame}
              className="font-pixel text-[#00ffff] border-4 border-[#00ffff] px-6 py-3 hover:bg-[#00ffff] hover:text-black transition-colors uppercase shadow-[4px_4px_0px_#ff00ff] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
            >
              REBOOT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
