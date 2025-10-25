// SkinContext.tsx
import React, { createContext, useContext, useState } from "react";
import { SKINS } from "../data/skins";

const SkinContext = createContext({
  skin: SKINS.default,
  setSkin: (name) => {},
});

export const SkinProvider = ({ children }) => {
  const [active, setActive] = useState("default");

  return (
    <SkinContext.Provider
      value={{
        skin: SKINS[active],
        setSkin: setActive,
      }}
    >
      {children}
    </SkinContext.Provider>
  );
};

export const useSkin = () => useContext(SkinContext);
