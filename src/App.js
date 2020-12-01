import "./App.css";
import Login from "./components/Login/Login";
import { auth } from "./fire";

function App() {
  return (
    <div className="app">
      <Login />
    </div>
  );
}

export default App;
