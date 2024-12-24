import "./App.css";
import Presale from "./pages/Presale";
import FloatingSocialIcons from "./components/FloatingSocialIcons";

function App() {
  return (
    <div className="font-poppins text-white bg-[url('/bg.png')] bg-cover bg-center h-screen">
      <div className="bg-yellow-300/2 backdrop-blur-sm h-screen flex justify-center items-center">
        <Presale />
        <FloatingSocialIcons />
      </div>
    </div>
  );
}

export default App;
