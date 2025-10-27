import { useEffect, useRef, useState } from "react";
import { useSkin } from "./SkinContext";
import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "../lib/properties";
import { initWorldScaling } from "../lib/world";
import { addCoinsFromScore } from "../lib/currencies";

const Dinogame = () => {
  const { skin } = useSkin();
  const lastTimeRef = useRef(null);
  const [gameState, setGameState] = useState("idle");
  const [countdown, setCountdown] = useState(null);
  const currentSkinRef = useRef(skin);
  const gameStateRef = useRef(gameState);
  const scoreRef = useRef(0);
  const pausedRef = useRef(false);


  const SPEED = 0.05;
  const SPEED_SCALE_INC = 0.00001;
  const JUMP_SPEED = 0.45;
  const GRAVITY = 0.0015;
  const FRAME_TIME = 100;
  const DINO_FRAME_COUNT = 2;
  const CACTUS_INTERVAL_MIN = 500;
  const CACTUS_INTERVAL_MAX = 2000;


  const speedScaleRef = useRef(1);
  const dinoFrameRef = useRef(0);
  const currentFrameTimeRef = useRef(0);
  const yVelocityRef = useRef(0);
  const nextCactusTimeRef = useRef(0);
  const isJumpingRef = useRef(false);

  useEffect(() => {
    gameStateRef.current = gameState;
    pausedRef.current = gameState === "paused";
  }, [gameState]);

  const resumeGameWithCountdown = () => {
    let count = 3;
    setCountdown(count);
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) setCountdown(count);
      else {
        clearInterval(timer);
        setCountdown(null);
        setGameState("playing");
        lastTimeRef.current = performance.now();
      }
    }, 1000);
  };

  useEffect(() => {
    const groundElems = document.querySelectorAll(".ground");
    const dinoElement = document.querySelector(".dino");
    const worldElement = document.querySelector(".world");

    currentSkinRef.current = skin;
    dinoElement.src = skin.dino;
    groundElems.forEach((ground) => (ground.src = skin.ground));
    initWorldScaling();

 
    [skin.dino, skin.ground, skin.cactus1, skin.cactus2, skin.cactus3].forEach(
      (url) => {
        const img = new Image();
        img.src = url;
      }
    );

    // Dino functions
    function setupDino() {
      yVelocityRef.current = 0;
      isJumpingRef.current = false;
      setCustomProperty(dinoElement, "--bottom", 0);
    }

    function handleRun(delta) {
      if (isJumpingRef.current) {
        dinoElement.src = currentSkinRef.current.dino;
        return;
      }

      const frames = [
        currentSkinRef.current.dinoRun1,
        currentSkinRef.current.dinoRun2,
      ];
      currentFrameTimeRef.current += delta;
      if (currentFrameTimeRef.current >= FRAME_TIME) {
        dinoFrameRef.current = (dinoFrameRef.current + 1) % DINO_FRAME_COUNT;
        dinoElement.src = frames[dinoFrameRef.current];
        currentFrameTimeRef.current -= FRAME_TIME;
      }
    }

    function handleJump(delta) {
      if (!isJumpingRef.current) return;
      incrementCustomProperty(
        dinoElement,
        "--bottom",
        yVelocityRef.current * delta
      );
      if (getCustomProperty(dinoElement, "--bottom") <= 0) {
        setCustomProperty(dinoElement, "--bottom", 0);
        isJumpingRef.current = false;
      }
      yVelocityRef.current -= GRAVITY * delta;
    }

    function onJump(e) {
      if (
        (e.type === "keydown" && e.code !== "Space") ||
        isJumpingRef.current ||
        gameStateRef.current !== "playing"
      ) {
        return;
      }
      yVelocityRef.current = JUMP_SPEED; 
      isJumpingRef.current = true;
    }

    // Ground functions
    function setupGround() {
      setCustomProperty(groundElems[0], "--left", 0);
      setCustomProperty(groundElems[1], "--left", 100);
    }

    function updateGround(delta, speedScale) {
      groundElems.forEach((ground) => {
        incrementCustomProperty(
          ground,
          "--left",
          delta * speedScale * SPEED * -1
        );
        if (getCustomProperty(ground, "--left") <= -100) {
          incrementCustomProperty(ground, "--left", 200);
        }
      });
    }

    // Cactus functions
    function setupCactus() {
      nextCactusTimeRef.current = CACTUS_INTERVAL_MIN;
      document.querySelectorAll("[data-cactus]").forEach((c) => c.remove());
    }

    function getCactusRects() {
      return [...document.querySelectorAll("[data-cactus]")].map((c) =>
        c.getBoundingClientRect()
      );
    }

    function createCactus() {
      const cactus = document.createElement("img");
      const images = [
        currentSkinRef.current.cactus1,
        currentSkinRef.current.cactus2,
        currentSkinRef.current.cactus3,
      ];
      cactus.dataset.cactus = true;
      cactus.src = images[Math.floor(Math.random() * images.length)];
      cactus.classList.add("cactus");
      setCustomProperty(cactus, "--left", 100);
      worldElement.appendChild(cactus);
    }

    function updateCactus(delta, speedScale) {
      document.querySelectorAll("[data-cactus]").forEach((cactus) => {
        incrementCustomProperty(
          cactus,
          "--left",
          delta * speedScale * SPEED * -1
        );
        if (getCustomProperty(cactus, "--left") <= -100) {
          cactus.remove();
        }
      });

      if (nextCactusTimeRef.current <= 0) {
        createCactus();
        nextCactusTimeRef.current =
          (Math.random() * (CACTUS_INTERVAL_MAX - CACTUS_INTERVAL_MIN) +
            CACTUS_INTERVAL_MIN) /
          speedScale;
      }
      nextCactusTimeRef.current -= delta;
    }

    // Update score
    function updateScore(delta) {
      const scoreElement = document.querySelector(".score");
      const multiplier = window.scoreMultiplier || 1;
      const increment = delta * 0.01 * multiplier;
      scoreRef.current += increment;
      addCoinsFromScore(increment);
      if (scoreElement) {
        scoreElement.textContent = Math.floor(scoreRef.current);
      }
    }

    // Lose logic
    function checkLose() {
      if (window.godMode) return false;
      const dinoRect = dinoElement.getBoundingClientRect();
      return getCactusRects().some((r) => isCollision(r, dinoRect));
    }

    function isCollision(r1, r2) {
      return (
        r1.left < r2.right &&
        r1.right > r2.left &&
        r1.top < r2.bottom &&
        r1.bottom > r2.top
      );
    }

    //Update loop
    function update(time) {
      if (pausedRef.current || gameStateRef.current !== "playing") {
        requestAnimationFrame(update);
        return;
      }

      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
        requestAnimationFrame(update);
        return;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      updateGround(delta, speedScaleRef.current);
      handleRun(delta);
      handleJump(delta);
      updateCactus(delta, speedScaleRef.current);
      updateScore(delta);

      speedScaleRef.current += delta * SPEED_SCALE_INC;

      if (checkLose()) return handleLose();

      requestAnimationFrame(update);
    }

    // Game flow
    function handleStart() {
      if (gameStateRef.current === "playing") return;
      setGameState("playing");
      lastTimeRef.current = null;
      speedScaleRef.current = 1;
      scoreRef.current = 0;
      setupGround();
      setupCactus();
      setupDino();
      requestAnimationFrame(update);
    }

    function handleLose() {
      setGameState("gameover");
      setTimeout(() => {
        document.addEventListener("keydown", handleRestart, { once: true });
        document.addEventListener("click", handleRestart, { once: true });
      }, 100);
    }

    function handleRestart() {
      setGameState("idle");
    }

    // Event setups
    document.addEventListener("keydown", onJump);
    document.addEventListener("mousedown", onJump);
    document.addEventListener("touchstart", onJump);

    if (gameState === "idle") {
      document.addEventListener("keydown", handleStart, { once: true });
      worldElement.addEventListener("click", handleStart, { once: true });
    }

    return () => {
      document.removeEventListener("keydown", onJump);
      document.removeEventListener("mousedown", onJump);
      document.removeEventListener("touchstart", onJump);
      document.removeEventListener("keydown", handleStart);
      worldElement.removeEventListener("click", handleStart);
    };
  }, [skin, gameState]);

  return (
    <div className="world relative overflow-hidden w-full h-full">
      <img src={skin.dino} className="absolute dino z-1" alt="dino" />
      <img
        src={skin.ground}
        className="h-3 absolute bottom-0 ground"
        alt="ground"
      />
      <img
        src={skin.ground}
        className="h-3 absolute bottom-0 ground"
        alt="ground"
      />

      <div className="absolute top-2 right-2 text-white text-xl font-bold bg-black bg-opacity-50 px-3 py-1 rounded z-20">
        Score: <span className="score">0</span>
      </div>

      {gameState === "playing" && (
        <button
          onClick={() => setGameState("paused")}
          className="absolute top-2 left-2 bg-gray-700 text-white px-3 py-1 rounded z-20"
        >
          Pause
        </button>
      )}

      {gameState === "paused" && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-20">
          <h2 className="text-white text-3xl mb-4">Game Paused</h2>
          <button
            onClick={resumeGameWithCountdown}
            className="bg-green-600 px-4 py-2 text-white rounded"
          >
            Resume
          </button>
        </div>
      )}

      {countdown && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <h1 className="text-white text-6xl font-bold">{countdown}</h1>
        </div>
      )}

      {gameState === "idle" && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">🦖 Dino Game</h2>
            <p className="text-xl mb-2">Tap to start the game</p>
            <p className="text-sm opacity-75">Press SPACE or click to jump</p>
          </div>
        </div>
      )}

      {gameState === "gameover" && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-2 text-red-500">Game Over</h2>
            <p className="text-2xl mb-4 font-mono">
              Score: {Math.floor(scoreRef.current)}
            </p>
            <p className="text-lg mb-4">Tap to play again</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dinogame;
