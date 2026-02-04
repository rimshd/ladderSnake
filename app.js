const { createApp, computed, ref } = Vue;

const snakes = [
  { from: 99, to: 54 },
  { from: 95, to: 72 },
  { from: 88, to: 36 },
  { from: 62, to: 18 },
  { from: 48, to: 26 },
  { from: 32, to: 10 },
];

const ladders = [
  { from: 3, to: 22 },
  { from: 6, to: 25 },
  { from: 20, to: 38 },
  { from: 28, to: 55 },
  { from: 36, to: 57 },
  { from: 51, to: 79 },
  { from: 71, to: 92 },
  { from: 80, to: 98 },
];

createApp({
  setup() {
    const players = ref([
      { id: 1, name: "Player 1", position: 1, color: "#ff6b6b" },
      { id: 2, name: "Player 2", position: 1, color: "#4dabf7" },
    ]);
    const currentIndex = ref(0);
    const lastRoll = ref(null);
    const isRolling = ref(false);
    const winner = ref(null);

    const boardCells = computed(() => {
      const rows = [];
      let ascending = true;
      for (let row = 0; row < 10; row += 1) {
        const start = 100 - row * 10;
        const rowCells = [];
        for (let offset = 0; offset < 10; offset += 1) {
          const id = start - offset;
          rowCells.push(id);
        }
        if (!ascending) {
          rowCells.reverse();
        }
        ascending = !ascending;
        rows.push(...rowCells);
      }

      return rows.map((id) => {
        const ladder = ladders.find((item) => item.from === id);
        const snake = snakes.find((item) => item.from === id);
        const label = ladder
          ? `⬆ ${ladder.to}`
          : snake
            ? `⬇ ${snake.to}`
            : "";
        return { id, label };
      });
    });

    const currentPlayer = computed(() => players.value[currentIndex.value]);

    const roll = () => {
      if (isRolling.value || winner.value) return;
      isRolling.value = true;
      const rollValue = Math.floor(Math.random() * 6) + 1;
      lastRoll.value = rollValue;

      setTimeout(() => {
        movePlayer(rollValue);
        isRolling.value = false;
      }, 500);
    };

    const movePlayer = (steps) => {
      const player = currentPlayer.value;
      const target = Math.min(player.position + steps, 100);
      player.position = target;

      const ladder = ladders.find((item) => item.from === player.position);
      if (ladder) {
        player.position = ladder.to;
      }

      const snake = snakes.find((item) => item.from === player.position);
      if (snake) {
        player.position = snake.to;
      }

      if (player.position === 100) {
        winner.value = player;
        return;
      }

      currentIndex.value = (currentIndex.value + 1) % players.value.length;
    };

    const reset = () => {
      players.value.forEach((player) => {
        player.position = 1;
      });
      currentIndex.value = 0;
      lastRoll.value = null;
      winner.value = null;
      isRolling.value = false;
    };

    const cellClass = (id) => {
      const snake = snakes.find((item) => item.from === id);
      const ladder = ladders.find((item) => item.from === id);
      return {
        snake: Boolean(snake),
        ladder: Boolean(ladder),
      };
    };

    return {
      boardCells,
      players,
      snakes,
      ladders,
      currentPlayer,
      lastRoll,
      isRolling,
      winner,
      roll,
      reset,
      cellClass,
    };
  },
}).mount("#app");
