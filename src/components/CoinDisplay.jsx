import { useCoins } from "../lib/currencies";

const CoinsDisplay = () => {
  const [coins] = useCoins();

  return (
    <span className="coins font-mono text-g">
      Coins:{" "}
      <span className="bg-yellow-300 rounded-full py-1 px-2">{coins}</span>
    </span>
  );
};

export default CoinsDisplay;
