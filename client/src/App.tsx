import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSmartAccountContext } from "./contexts/SmartAccountContext";
import { useWeb3AuthContext } from "./contexts/SocialLoginContext";
import Button from "./components/Button";
import abi from "../contract/abi/abi.json";
import { ethers } from "ethers";

const App: React.FC = () => {
  const classes = useStyles();
  const {
    address,
    loading: eoaLoading,
    connect,
    disconnect,
  } = useWeb3AuthContext();

  const {
    selectedAccount,
    loading: scwLoading,
    setSelectedAccount,
  } = useSmartAccountContext();

  return (
    <div className={classes.bgCover}>
      <main>
        <div className={classes.cover}>
          <div className={classes.container}>Hello</div>
          <div className={classes.container}>
            <Button
              onClickFunc={
                !address
                  ? connect
                  : () => {
                      setSelectedAccount(null);
                      disconnect();
                    }
              }
              title={!address ? "Connect Wallet" : "Disconnect Wallet"}
            />
            <h1>What's your Magic Number</h1>
            <p>Put your magic number and see the sum of all magic numbers</p>
            <div>
              {eoaLoading && <h2>Loading EOA...</h2>}

              {address && (
                <div>
                  <h2>Your EOA Address</h2>
                  <p>{address}</p>
                </div>
              )}

              {scwLoading && <h2>Loading Smart Account...</h2>}

              {selectedAccount && address && (
                <div>
                  <h2>Your Smart Account Address</h2>
                  <p>{selectedAccount.smartAccountAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    backgroundColor: "#1a1e23",
    backgroundSize: "cover",
    width: "100%",
    minHeight: "100vh",
    color: "#fff",
    fontStyle: "italic",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minHeight: "80vh",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  cover: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: "80vh",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 50,
    fontSize: 60,
    background: "linear-gradient(90deg, #12ECB8 -2.21%, #00B4ED 92.02%)",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  },
  animateBlink: {
    animation: "$bottom_up 2s linear infinite",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  "@keyframes bottom_up": {
    "0%": {
      transform: "translateY(0px)",
    },
    "25%": {
      transform: "translateY(20px)",
    },
    "50%": {
      transform: "translateY(0px)",
    },
    "75%": {
      transform: "translateY(-20px)",
    },
    "100%": {
      transform: "translateY(0px)",
    },
  },
}));

export default App;
