import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [managerState, setManagerState] = useState("");
  const [playersState, setPlayersState] = useState([]);
  const [balanceState, setBalanceState] = useState("");
  const [valueState, setValueState] = useState(0);
  const [messageState, setMessageState] = useState("");

  // console.log(web3.version);
  // console.log("hello there!");

  const enterSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("submit sent");
    const accounts = await web3.eth.getAccounts();

    setMessageState(
      "sending your transactions, waiting to be successfully validated..."
    );

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(valueState, "ether"),
    });
    console.log("submit successfully");

    setMessageState("Transaction sent successfully!");
  };

  const pickWinnerHandler = async () => {
    // event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessageState("picking winner .......");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessageState("Winner pick!");
  };

  const InitStates = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setManagerState(manager);
    setPlayersState(players);
    setBalanceState(balance);
  };

  useEffect(() => {
    InitStates();
    console.log("useEffectCalled");
  }, []);

  return (
    <div className="App">
      <h1>check console</h1>
      <p>This lottery is manage by {managerState} </p>
      <p>
        Currently there are {playersState.length} people competing for{" "}
        {web3.utils.fromWei(balanceState)} ether!
      </p>
      <br></br>
      <br></br>
      <form onSubmit={enterSubmitHandler}>
        <h2>Want to try your luck?</h2>
        <div>
          <label>Amount of ether to enter</label>
          <br></br>
          <input
            value={valueState}
            onChange={(event) => setValueState(event.target.value)}
          ></input>
        </div>
        <br></br>
        <button>Enter</button>
      </form>

      <hr />
      <div>
        <h1>Ready to pick winner?</h1>
        <br></br>
        <button onClick={pickWinnerHandler}>Pick Winner</button>
      </div>

      <hr />
      <h1>{messageState}</h1>
    </div>
  );
}

export default App;
