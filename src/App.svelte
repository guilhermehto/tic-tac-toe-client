<script>
  import Square from "./Square.svelte";
  import Game from "./Game.svelte";
  import ioClient from "socket.io-client";
  import seedrandom from "seedrandom";
  import { gameStore } from "./stores/gameStore.js";

  let gameStarted = false;
  let gameEnded = false;
  let winner = "";
  let joinRoomId = "";
  let myTurn = "O";

  const rng = seedrandom(new Date().getTime());
  let roomId = (rng() * 9999).toFixed();
  const socketUrl = "https://multiplayer-tic-tac-toe-server.herokuapp.com";
  const socket = ioClient.connect(`${socketUrl}?roomId=${roomId}`);

  function onJoinClicked() {
    roomId = joinRoomId;
    socket.emit("join room", roomId);
    startGame(roomId);
    myTurn = "X";
  }

  function handleGameEnded(event) {
    gameStarted = false;
    gameEnded = true;
    winner = event.detail.winner;
  }

  socket.on("player joined", _roomId => {
    if (_roomId != roomId) {
      return;
    }
    startGame(roomId);
  });

  function startGame(roomId) {
    gameStore.update(store => (store = { ...store, roomId }));
    gameStarted = true;
  }
</script>

<style>
  .main {
    height: 100vh;
    padding: 0 5% 0 5%;
  }

  .row {
    display: flex;
    flex-direction: column;
  }

  .center {
    margin: auto;
  }

  :global(.center-text) {
    text-align: center;
  }

  :global(*) {
    margin: 0;
    padding: 0;
  }

  .form-input {
    border-radius: 5px;
    border-color: #ebebeb;
    max-width: 75%;
  }

  .inline {
    display: inline-block;
  }

  button {
    border-radius: 5px;
    background-color: blueviolet;
    color: white;
  }

  button:active {
    background-color: violet;
  }
</style>

<svelte:head>
  <link rel="stylesheet" href="./global.css" />
</svelte:head>

<div class="main row">
  <div class="center">
    <h2 class="center-text">Tic Tac Toe!</h2>
    <h4 class="center-text">Your room: {roomId}</h4>
    <div class="center-text">
      <label for="room-id">Room ID</label>
      <input
        name="room-id"
        id="room-id"
        type="text"
        class="form-input"
        bind:value={joinRoomId} />
      <button class="inline" on:click={onJoinClicked}>Join</button>
    </div>
    {#if gameEnded}
      {#if winner != 'Tie'}
        <h2 class="center-text">Game ended! {winner} won!</h2>
      {:else}
        <h2 class="center-text">Game ended! It's a tie!</h2>
      {/if}
    {/if}
    {#if gameStarted}
      <Game
        {roomId}
        {socket}
        {gameStarted}
        {myTurn}
        on:gameEnded={handleGameEnded} />
    {/if}
  </div>
</div>
