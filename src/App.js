import "./App.css";
import Login from "./components/Login/Login";
import { useDataLayerValue } from "./context/DataLayer";
import { auth } from "./fire";
import { useEffect } from "react";
import Application from "./components/Application/Application";

function App() {
  const [{ user }, dispatch] = useDataLayerValue();
  console.log({ user });

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        if (!user) {
          dispatch({
            type: "SET_USER",
            user: authUser.providerData[0],
          });
        }
      } else {
        // user is logged out
      }
    });
  }, [dispatch]);

  return <div className="app">{user ? <Application /> : <Login />}</div>;
}

export default App;
