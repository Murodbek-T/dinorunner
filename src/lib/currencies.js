import { useState, useEffect } from "react";
const STORAGE_KEY = "dinoCoins";

export let _coins = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
let leftoverScore = 0;
const coinManager = {
  get value() {
    return _coins;
  },

  set value(newValue) {
    _coins = newValue;
    localStorage.setItem(STORAGE_KEY, _coins);
    this.notifyListeners();
    window.dispatchEvent(new Event("coinsUpdated")); 
  },

  listeners: new Set(),

  notifyListeners() {
   this.listeners.forEach((listener) => {
    
     listener(_coins);
   });
  },
};

export function useCoins() {
  const [currentCoins, setCurrentCoins] = useState(coinManager.value);

  useEffect(() => {

    coinManager.listeners.add(setCurrentCoins);


    const handleStorageChange = () => {
      const newCoins = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
      setCurrentCoins(newCoins);
    };

    const handleCoinsUpdated = () => {
      setCurrentCoins(coinManager.value);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("coinsUpdated", handleCoinsUpdated);

     return () => {
       coinManager.listeners.delete(setCurrentCoins);
       window.removeEventListener("storage", handleStorageChange);
       window.removeEventListener("coinsUpdated", handleCoinsUpdated);
     };
  }, []);

  return [currentCoins];
}

export function getCoins() {
  return coinManager.value;
}

export function spendCoins(amount) {
  if (amount <= 0) return false;
  if (coinManager.value < amount) return false;

  coinManager.value -= amount;
  return true;
}

export function addCoinsFromScore(scoreIncrement) {
  leftoverScore += scoreIncrement;
  const coinsToAdd = Math.floor(leftoverScore / 100);

  if (coinsToAdd > 0) {
    coinManager.value += coinsToAdd;
    leftoverScore -= coinsToAdd * 100;
  }
}


export function addCoins(amount) {
  coinManager.value += amount;
  return true;
}

export function setUnlimitedCoins() {
  coinManager.value = 9999999;
  return true;
}

// Global access
if (typeof window !== "undefined") {
  window.addCoins = addCoins;
  window.setUnlimitedCoins = setUnlimitedCoins;
  window.getCoins = getCoins;
}
