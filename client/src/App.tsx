import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSmartAccountContext } from "./contexts/SmartAccountContext";
import { useWeb3AuthContext } from "./contexts/SocialLoginContext";
import Button from "./components/Button";
import { ethers } from "ethers";
import { CircularProgress } from "@material-ui/core";
import { useState, useEffect } from "react";
import abi from "./contracts/abi.json";
import MagicNumberContract from "./contracts/address.json";

const App: React.FC = () => {
  const classes = useStyles();
  const {
    address,
    loading: eoaLoading,
    connect,
    disconnect,
    ethersProvider,
  } = useWeb3AuthContext();
  const {
    selectedAccount,
    wallet,
    loading: scwLoading,
    setSelectedAccount,
  } = useSmartAccountContext();

  const [amount, setAmount] = useState<string>("0");
  const [isLoading, setLoading] = useState<boolean>(false);

  const [magicSum, setMagicSum] = useState<string>("0");
  const [participantCount, setParticipantCount] = useState<string>("0");
  const [magicNum, setMagicNum] = useState<string>("0");

  const setNumberInterface = new ethers.utils.Interface([
    "function setNumber(uint256 _magicNumber)",
  ]);

  const data = setNumberInterface.encodeFunctionData("setNumber", [
    ethers.utils.parseEther(amount),
  ]);

  const tx = {
    to: MagicNumberContract.address,
    data,
  };

  useEffect(() => {
    const getStats = async () => {
      if (ethersProvider && selectedAccount) {
        const magicNumberContract = new ethers.Contract(
          MagicNumberContract.address,
          abi.abi,
          ethersProvider
        );

        const stats = await magicNumberContract.getMagicStats();
        setMagicSum(stats[0].toString());
        setParticipantCount(stats[1].toString());
        const magicNum = await magicNumberContract.magicNumber(
          selectedAccount.smartAccountAddress
        );
        setMagicNum(magicNum.toString());
      }
    };
    setTimeout(getStats, 10000);
  }, [ethersProvider, isLoading, selectedAccount]);

  const sendTransaction = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    // Sending gasless transaction
    if (wallet) {
      try {
        const txResponse = await wallet.sendTransaction({
          transaction: tx,
        });
        const txReceipt = await txResponse.wait();
        alert(`Transaction sent with hash:\n ${txReceipt.transactionHash}`);
      } catch (err) {
        alert(`Transaction failed with message:\n ${err}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className={classes.bgCover}>
      <main>
        <div className={classes.cover}>
          {address && (
            <div className={classes.container}>
              <form onSubmit={sendTransaction}>
                <div className={classes.container}>
                  <label className={classes.field}>
                    What's Your Magic Number?
                  </label>
                  <input
                    type="number"
                    id="magicNumber"
                    required
                    placeholder="Type a number here"
                    min="0.000000000000000001"
                    step="0.000000000000000001"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {isLoading ? (
                    <>
                      <CircularProgress
                        style={{
                          width: 25,
                          height: 25,
                          marginTop: 10,
                          marginBottom: 10,
                          color: "#fff",
                        }}
                      />{" "}
                      {"Please wait for the transaction to go through."}
                      <p>For metamask users, please sign the metamask popup.</p>
                    </>
                  ) : (
                    <button className={classes.btn}>Contribute</button>
                  )}
                </div>
              </form>
              <div className={classes.container}>
                <div className={classes.info}>
                  <div className={classes.container}>
                    <h3>Current Magic Sum</h3>
                    <h3>{ethers.utils.formatEther(magicSum)}</h3>
                  </div>
                  <div className={classes.container}>
                    <h3>No. of Participants</h3>
                    <h1>{participantCount}</h1>
                  </div>
                  <div className={classes.container}>
                    <h3>Your Magic No.</h3>
                    <h3>{ethers.utils.formatEther(magicNum)}</h3>
                  </div>
                </div>
                <p>Stats take around 10 secs to update after contribution</p>
              </div>
            </div>
          )}

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
            <p>Put your magic number and see the sum of all magic numbers!</p>
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
  btn: {
    width: "max-content",
    background: "#21325E",
    position: "relative",
    cursor: "pointer",
    borderRadius: 5,
    outline: "none",
    marginTop: 20,
    border: 0,
    boxShadow: "2px 2px #3E497A",
    height: 40,
    lineHeight: "36px",
    padding: "0px 12px",
    display: "flex",
    alignItems: "center",
    color: "#CDF0EA",
    transition: "0.3s",
    fontWeight: "bold",
    fontSize: 15,

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      // backgroundColor: "#FFC4C4",
      boxShadow: "1px 1px 0px #3E497A",
      // transform: "translate(5px, 5px)",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },

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
    minHeight: "30vh",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: "30vh",
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
  field: {
    marginBottom: 20,
    fontSize: 30,
    fontWeight: "bold",
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
