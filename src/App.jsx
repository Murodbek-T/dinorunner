import Buttons from "./components/Buttons";
import Dinogame from "./components/Dinogame";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-16">
      <Dinogame />
  
      <Buttons />
    </div>
  );
}

export default App;
