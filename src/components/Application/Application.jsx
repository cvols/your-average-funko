import React from "react";
import { useDataLayerValue } from "../../context/DataLayer";
import { auth } from "../../fire";

function Application() {
  const [{ user }, dispatch] = useDataLayerValue();

  return (
    <div className="application container">
      <div className="jumbotron">
        <h1>{`Logged in as ${user?.displayName}`}</h1>
        <button
          className="btn btn-danger"
          onClick={
            user?.providerId &&
            (() =>
              auth
                .signOut()
                .then(() => {
                  console.log("signed out succesfully");
                  dispatch({
                    type: "LOGOUT",
                  });
                })
                .catch((err) => {
                  console.log(err);
                }))
          }
        >
          LogOut
        </button>
      </div>
    </div>
  );
}

export default Application;
