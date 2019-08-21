<script>
  import Square from "./Square.svelte";
  import { createEventDispatcher } from "svelte";

  export let socket;
  export let canPlay = false;

  const dispatch = createEventDispatcher();

  let player = 0;

  function handleClick(event) {
    player += 1;
    dispatch("played", {
      id: event.detail.id
    });
  }
</script>

<div class="center-text">
  <Square on:played={handleClick} {player} {canPlay} {socket} id={0} />
  <Square on:played={handleClick} {player} {canPlay} {socket} id={1} />
  <Square on:played={handleClick} {player} {canPlay} {socket} id={2} />
</div>
<div class="center-text">
  <Square on:played={handleClick} {player} {canPlay} {socket} id={3} />
  <Square on:played={handleClick} {player} {canPlay} {socket} id={4} />
  <Square on:played={handleClick} {player} {canPlay} {socket} id={5} />
</div>
<div class="center-text">
  <Square on:played={handleClick} {player} {canPlay} {socket} id={6} />
  <Square on:played={handleClick} {player} {canPlay} {socket} id={7} />
  <Square on:played={handleClick} {player} {canPlay} {socket} id={8} />
</div>

<div class="center-text">
  {#if canPlay}
    <h3>Your turn</h3>
  {:else}
    <h3>Waiting for opponent...</h3>
  {/if}
</div>
