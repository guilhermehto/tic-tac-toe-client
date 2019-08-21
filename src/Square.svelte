<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { gameStore } from "./stores/gameStore";

  export let player = 0;
  export let id = 0;
  export let socket;
  export let canPlay = false;

  const dispatch = createEventDispatcher();
  let played = false;

  $: text = $gameStore.moves[id].player;

  function dispatchClick() {
    if (!canPlay || played || text) {
      return;
    }
    played = true;
    dispatch("played", {
      id
    });
  }
</script>

<style>
  div {
    width: 48px;
    height: 48px;
    background-color: #ebebeb;
    margin: 4px;
    border-radius: 5px;
    display: inline-flex;
    user-select: none;
    -moz-user-select: none;
    font-size: 2em;
  }

  p {
    margin: auto;
    line-height: 0px;
  }
</style>

<div in:fade out:fade on:click={dispatchClick}>
  {#if text}
    <p in:fly={{ y: 100, duration: 500 }}>{text}</p>
  {/if}
</div>
