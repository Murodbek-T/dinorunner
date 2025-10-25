import { useEffect, useRef, useState } from "react";
import { useSkin } from "./SkinContext";
import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "../lib/properties";
import { initWorldScaling } from "../lib/world";

const Dinogame = () => {
  const { skin } = useSkin();
  const lastTimeRef = useRef(null);
  const [isJumping, setIsJumping] = useState(false);

  // Terrain speed variables
  const SPEED = 0.05;
  const SPEED_SCALE_INC = 0.00001;
  let speedScale;

  // Jump variables
  const JUMP_SPEED = 0.45;
  const GRAVITY = 0.0015;

  // Dino variables
  let dinoFrame = 0;
  let currentFrameTime = 0;
  let yVelocity;
  const FRAME_TIME = 100;
  const DINO_FRAME_COUNT = 2;

  // Cactus variables
  let nextCactusTime;
  const CACTUS_SPEED = 0.05;
  const CACTUS_INTERVAL_MIN = 500;
  const CACTUS_INTERVAL_MAX = 2000;

  useEffect(() => {
    const groundElems = document.querySelectorAll(".ground");
    const dinoElement = document.querySelector(".dino");
    const worldElement = document.querySelector(".world");

    const preload = (...urls) =>
      urls.forEach((url) => {
        const img = new Image();
        img.src = url;
      });

    preload(skin.dino, skin.ground, skin.cactus1, skin.cactus2, skin.cactus3);

    initWorldScaling();

    const isJumpingRef = { current: false };

    // Dino functions
    function setupDino() {
      yVelocity = 0;
      setCustomProperty(dinoElement, "--bottom", 0);
      document.removeEventListener("keydown", onJump);
      document.addEventListener("keydown", onJump);
    }
    function handleRun(delta, speedScale) {
      if (isJumpingRef.current) {
        dinoElement.src = skin.dino;
        return;
      }

      const dinoFrames = [skin.dinoRun1, skin.dinoRun2];
      currentFrameTime += delta;

      if (currentFrameTime >= FRAME_TIME) {
        dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
        if (dinoElement) {
          dinoElement.src = dinoFrames[dinoFrame];
        }
        currentFrameTime -= FRAME_TIME;
      }
    }
    function getDinoRect() {
      return dinoElement.getBoundingClientRect();
    }
    function handleJump(delta) {
      if (!isJumpingRef.current) return;

      incrementCustomProperty(dinoElement, "--bottom", yVelocity * delta);

      if (getCustomProperty(dinoElement, "--bottom") <= 0) {
        setCustomProperty(dinoElement, "--bottom", 0);
        isJumpingRef.current = false;
      }

      yVelocity -= GRAVITY * delta;
    }
    function onJump(e) {
      if (e.code !== "Space" || isJumpingRef.current) return;
      yVelocity = JUMP_SPEED;
      isJumpingRef.current = true;
    }
    function updateDino(delta, speedScale) {
      handleRun(delta, speedScale);
      handleJump(delta);
    }

    // Ground functions
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
    function setupGround() {
      setCustomProperty(groundElems[0], "--left", 0);
      setCustomProperty(groundElems[1], "--left", 100);
    }
    function updateSpeedScale(delta) {
      speedScale += delta * SPEED_SCALE_INC;
    }
    function update(time) {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
        requestAnimationFrame(update);
        return;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      updateGround(deltaTime, speedScale);
      updateDino(deltaTime, speedScale);
      updateSpeedScale(deltaTime);
      updateCactus(deltaTime, speedScale);
      if (checkLose()) return handleLose();

      requestAnimationFrame(update);
    }

    // Cactus functions
    function setupCactus() {
      nextCactusTime = CACTUS_INTERVAL_MIN;
      document.querySelectorAll("[data-cactus]").forEach((cactus) => {
        cactus.remove();
      });
    }
    function getCactusRects() {
      return [...document.querySelectorAll("[data-cactus]")].map((cactus) => {
        return cactus.getBoundingClientRect();
      });
    }
    function createCactus() {
      const cactus = document.createElement("img");
      const cactusImages = [skin.cactus2, skin.cactus3];
      cactus.dataset.cactus = true;
      cactus.src = cactusImages[randomCactusNumber(0, cactusImages.length - 1)];
      cactus.classList.add("cactus");
      setCustomProperty(cactus, "--left", 100);
      worldElement.appendChild(cactus);
    }
    function randomCactusNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
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
      if (nextCactusTime <= 0) {
        createCactus();
        nextCactusTime =
          randomCactusNumber(CACTUS_INTERVAL_MIN, CACTUS_INTERVAL_MAX) /
          speedScale;
      }

      nextCactusTime -= delta;
    }
    // Lose game function
    function isCollision(rect1, rect2) {
      return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
      );
    }
    function checkLose() {
      const dinoRect = getDinoRect();
      return getCactusRects().some((rect) => isCollision(rect, dinoRect));
    }

    // Start
    function handleStart() {
      lastTimeRef.current = null;
      speedScale = 1;
      setupGround();
      setupCactus();
      setupDino();
      requestAnimationFrame(update);
    }

    // Stop
    function handleLose() {
      setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true });
      }, 100);
    }
    document.addEventListener("keydown", handleStart, { once: true });
  }, [skin]);

  return (
    <div className="world relative overflow-hidden">
      <img
        src={skin.dino}
        className="background-image absolute dino"
        alt="dino"
      />
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
    </div>
  );
};

export default Dinogame;
