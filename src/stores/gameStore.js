import { writable } from "svelte/store";

export const gameStore = writable({
    player: "O",
    roomId: -1,
    moves: []
});
