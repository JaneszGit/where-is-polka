"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const WIDTH = 340;
const HEIGHT = 220;
const GROUND_Y = HEIGHT - 40;
const GRAVITY = 0.9;
const JUMP_VELOCITY = -12;

interface Obstacle {
  x: number;
  width: number;
  height: number;
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);

  const state = useRef({
    polkaY: GROUND_Y - 24,
    velocity: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    speed: 3.2,
    frame: 0,
    scoreCounter: 0,
  });

  function resetGame() {
    state.current = {
      polkaY: GROUND_Y - 24,
      velocity: 0,
      isJumping: false,
      obstacles: [],
      speed: 3.2,
      frame: 0,
      scoreCounter: 0,
    };
    setScore(0);
    setGameOver(false);
    setRunning(true);
  }

  function jump() {
    if (!running) {
      resetGame();
      return;
    }
    const s = state.current;
    if (!s.isJumping) {
      s.velocity = JUMP_VELOCITY;
      s.isJumping = true;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    function loop() {
      if (!ctx) return;
      const s = state.current;

      if (running && !gameOver) {
        s.frame += 1;

        s.velocity += GRAVITY;
        s.polkaY += s.velocity;
        if (s.polkaY > GROUND_Y - 24) {
          s.polkaY = GROUND_Y - 24;
          s.velocity = 0;
          s.isJumping = false;
        }

        if (s.frame % 70 === 0) {
          s.obstacles.push({ x: WIDTH, width: 14, height: 22 });
        }
        s.obstacles.forEach((o) => (o.x -= s.speed));
        s.obstacles = s.obstacles.filter((o) => o.x + o.width > 0);

        const polkaBox = { x: 30, y: s.polkaY, width: 26, height: 24 };
        for (const o of s.obstacles) {
          const oBox = { x: o.x, y: GROUND_Y - o.height, width: o.width, height: o.height };
          const hit =
            polkaBox.x < oBox.x + oBox.width &&
            polkaBox.x + polkaBox.width > oBox.x &&
            polkaBox.y < oBox.y + oBox.height &&
            polkaBox.y + polkaBox.height > oBox.y;
          if (hit) {
            setGameOver(true);
            setRunning(false);
            setBest((b) => Math.max(b, Math.floor(s.scoreCounter)));
            if (Math.floor(s.scoreCounter) > 0) {
              supabase
                .from("game_scores")
                .insert({ player_name: "Polka", score: Math.floor(s.scoreCounter) })
                .then(() => {});
            }
          }
        }

        s.scoreCounter += 0.08;
        s.speed = 3.2 + s.scoreCounter * 0.01;
        setScore(Math.floor(s.scoreCounter));
      }

      ctx.fillStyle = "#F7F4EE";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = "#E4DFD3";
      ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);

      ctx.fillStyle = "#C17A55";
      ctx.fillRect(30, s.polkaY, 26, 24);
      ctx.fillStyle = "#232220";
      ctx.fillRect(48, s.polkaY + 4, 5, 5);

      ctx.fillStyle = "#9CCB3B";
      s.obstacles.forEach((o) => {
        ctx.fillRect(o.x, GROUND_Y - o.height, o.width, o.height);
      });

      if (!running && !gameOver) {
        ctx.fillStyle = "#232220";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Koppints / szóköz az ugráshoz", WIDTH / 2, HEIGHT / 2);
      }
      if (gameOver) {
        ctx.fillStyle = "#232220";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Vége! Koppints az újrakezdéshez", WIDTH / 2, HEIGHT / 2);
      }

      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, [running, gameOver]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        onClick={jump}
        className="rounded-lg border border-line"
      />
      <div className="mt-4 flex gap-8 text-center">
        <div>
          <p className="font-serif text-xl text-ink">{score}</p>
          <p className="text-xs text-ink/45">pont</p>
        </div>
        <div>
          <p className="font-serif text-xl text-ink">{best}</p>
          <p className="text-xs text-ink/45">legjobb</p>
        </div>
      </div>
    </div>
  );
}
