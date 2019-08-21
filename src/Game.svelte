<script>
  import { createEventDispatcher } from "svelte";
  import { gameStore } from "./stores/gameStore";
  import Grid from "./Grid.svelte";

  export let socket;
  export let roomId;
  export let gameStarted;
  export let myTurn;

  const dispatch = createEventDispatcher();

  let moves = [];

  for (let i = 0; i < 9; i++) {
    moves.push({
      player: ""
    });
  }

  gameStore.update(store => (store = { ...store, moves }));

  function handlePlayed(event) {
    const move = { ...event.detail };
    gameStore.update(store => {
      const moves = store.moves;
      $gameStore.moves[move.id] = {
        player: myTurn
      };
      return {
        ...store,
        moves,
        player: store.player === "X" ? "O" : "X"
      };
    });
    socket.emit("play", $gameStore);
    checkVictory();
  }

  function checkVictory() {
    const winner = getWinningPlayer();
    if (winner) {
      dispatch("gameEnded", {
        winner
      });
    }
  }

  function getWinningPlayer() {
    const rows = [0, 1, 2];
    const validMoves = $gameStore.moves.filter(move => move.player);
    const winningPlayer =
      getWinnerFromRows() ||
      getWinnerFromColumns() ||
      getWinnerFromCross() ||
      (validMoves.length === 9 ? "Tie" : "");
    console.log(`Valid moves: ${validMoves.length}`);
    return winningPlayer;
  }

  function getWinnerFromRows() {
    const rows = [0, 1, 2];
    let winner = null;
    rows.forEach(index => {
      if (!$gameStore.moves[index].player) {
        return;
      }
      for (let i = 1; i < 3; i++) {
        const moveIndex = index + i * 3;
        if (
          $gameStore.moves[moveIndex].player != $gameStore.moves[index].player
        ) {
          break;
        } else if (i == 2) {
          winner = $gameStore.moves[moveIndex].player;
        }
      }
    });
    return winner;
  }

  function getWinnerFromColumns() {
    const columns = [0, 3, 6];
    let winner = null;
    columns.forEach(index => {
      if (!$gameStore.moves[index].player) {
        return;
      }
      for (let i = 1; i < 3; i++) {
        const moveIndex = index + i;
        if (
          $gameStore.moves[moveIndex].player != $gameStore.moves[index].player
        ) {
          break;
        } else if (i == 2) {
          winner = $gameStore.moves[moveIndex].player;
        }
      }
    });

    return winner;
  }

  function getWinnerFromCross() {
    let winner = null;
    if (
      $gameStore.moves[0].player &&
      $gameStore.moves[0].player == $gameStore.moves[4].player &&
      $gameStore.moves[0].player == $gameStore.moves[8].player
    ) {
      winner = $gameStore.moves[0].player;
      console.log("found cross");
    } else if (
      $gameStore.moves[2].player &&
      $gameStore.moves[2].player == $gameStore.moves[4].player &&
      $gameStore.moves[2].player == $gameStore.moves[6].player
    ) {
      winner = $gameStore.moves[2].player;
      console.log("found cross");
    }
    console.log(winner);
    return winner;
  }

  socket.on("play", gameState => {
    gameStore.update(store => (store = gameState));
    checkVictory();
  });
</script>

{#if gameStarted}
  <Grid
    on:played={handlePlayed}
    {socket}
    canPlay={myTurn == $gameStore.player} />
{/if}
