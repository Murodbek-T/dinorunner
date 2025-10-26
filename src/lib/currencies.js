import { useState, useEffect } from "react";
const STORAGE_KEY = "dinoCoins";

export let coins = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
let leftoverScore = 0; 


const listeners = new Set();
function notifyListeners() {
  listeners.forEach((listener) => listener(coins));
}
export function useCoins() {
  const [currentCoins, setCurrentCoins] = useState(coins);

  useEffect(() => {
    listeners.add(setCurrentCoins);
    return () => listeners.delete(setCurrentCoins);
  }, []);

  return [currentCoins];
}

export function spendCoins(amount) {
  if (amount <= 0) return false;
  if (coins < amount) return false;

  coins -= amount;
  localStorage.setItem(STORAGE_KEY, coins);
  notifyListeners();
  return true;
}

export function addCoinsFromScore(scoreIncrement) {
  leftoverScore += scoreIncrement; 
  const coinsToAdd = Math.floor(leftoverScore / 100);

  if (coinsToAdd > 0) {
    coins += coinsToAdd;
    leftoverScore -= coinsToAdd * 100; 
     localStorage.setItem(STORAGE_KEY, coins); 
     notifyListeners();
  }
}



