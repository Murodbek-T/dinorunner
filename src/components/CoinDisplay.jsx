import { useState, useEffect } from "react";
import {  coins as coinStore } from "../lib/currencies";

const CoinsDisplay = () => {
  const [coins, setCoins] = useState(coinStore);

  useEffect(() => {
    const updateCoins = () => setCoins(coinStore);

    // Use a small interval or tie it to the game loop if you have one
    const interval = setInterval(updateCoins, 50);
    return () => clearInterval(interval);
  }, []);

  return <span className="coins font-mono text-g">Coins: <span className=" bg-yellow-300 rounded-full py-1 px-2">{coins}</span></span>;
};

export default CoinsDisplay;
