import React, { createContext, useContext, useState } from "react";
import { SKINS } from "../data/skins";

const SkinContext = createContext({
  skin: SKINS.default,
  activeDino: "default",
  activeGround: "default",
  activeCactus: "default",
  setDinoSkin: () => {},
  setGroundSkin: () => {},
  setCactusSkin: () => {},
});

export const SkinProvider = ({ children }) => {
  const [activeDino, setActiveDino] = useState("default");
  const [activeGround, setActiveGround] = useState("default");
  const [activeCactus, setActiveCactus] = useState("default");

  const skin = {
    dino: SKINS[activeDino].dino,
    dinoRun1: SKINS[activeDino].dinoRun1,
    dinoRun2: SKINS[activeDino].dinoRun2,
    ground: SKINS[activeGround].ground,
    cactus1: SKINS[activeCactus].cactus1,
    cactus2: SKINS[activeCactus].cactus2,
    cactus3: SKINS[activeCactus].cactus3,
  };

  return (
    <SkinContext.Provider
      value={{
        skin,
        activeDino,
        activeGround,
        activeCactus,
        setDinoSkin: setActiveDino,
        setGroundSkin: setActiveGround,
        setCactusSkin: setActiveCactus,
      }}
    >
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => useContext(SkinContext);
