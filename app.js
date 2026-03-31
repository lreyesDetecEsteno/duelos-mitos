const state = {
  top: {
    name: "Jugador Arriba",
    initialCastle: 50,
    castle: 50
  },
  bottom: {
    name: "Jugador Abajo",
    initialCastle: 50,
    castle: 50
  }
};

const elements = {
  playerTopName: document.getElementById("playerTopName"),
  playerBottomName: document.getElementById("playerBottomName"),

  playerTopInitial: document.getElementById("playerTopInitial"),
  playerBottomInitial: document.getElementById("playerBottomInitial"),

  playerTopCastle: document.getElementById("playerTopCastle"),
  playerBottomCastle: document.getElementById("playerBottomCastle"),

  damageTopInput: document.getElementById("damageTopInput"),
  damageBottomInput: document.getElementById("damageBottomInput"),

  applyTopDamage: document.getElementById("applyTopDamage"),
  applyBottomDamage: document.getElementById("applyBottomDamage"),

  resetMatch: document.getElementById("resetMatch")
};

function clampCastle(value) {
  return Math.max(0, value);
}

function render() {
  elements.playerTopName.value = state.top.name;
  elements.playerBottomName.value = state.bottom.name;

  elements.playerTopInitial.value = state.top.initialCastle;
  elements.playerBottomInitial.value = state.bottom.initialCastle;

  elements.playerTopCastle.textContent = state.top.castle;
  elements.playerBottomCastle.textContent = state.bottom.castle;
}

function applyDamage(playerKey, damage) {
  const parsedDamage = Number(damage);

  if (Number.isNaN(parsedDamage) || parsedDamage < 0) {
    return;
  }

  state[playerKey].castle = clampCastle(state[playerKey].castle - parsedDamage);
  saveState();
  render();
}

function resetMatch() {
  state.top.initialCastle = sanitizeInitialValue(elements.playerTopInitial.value);
  state.bottom.initialCastle = sanitizeInitialValue(elements.playerBottomInitial.value);

  state.top.castle = state.top.initialCastle;
  state.bottom.castle = state.bottom.initialCastle;

  saveState();
  render();
}

function sanitizeInitialValue(value) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return 50;
  }

  return parsed;
}

function bindEvents() {
  elements.playerTopName.addEventListener("input", (event) => {
    state.top.name = event.target.value || "Jugador Arriba";
    saveState();
  });

  elements.playerBottomName.addEventListener("input", (event) => {
    state.bottom.name = event.target.value || "Jugador Abajo";
    saveState();
  });

  elements.playerTopInitial.addEventListener("change", (event) => {
    state.top.initialCastle = sanitizeInitialValue(event.target.value);
    saveState();
    render();
  });

  elements.playerBottomInitial.addEventListener("change", (event) => {
    state.bottom.initialCastle = sanitizeInitialValue(event.target.value);
    saveState();
    render();
  });

  elements.applyTopDamage.addEventListener("click", () => {
    applyDamage("top", elements.damageTopInput.value);
    elements.damageTopInput.value = "";
  });

  elements.applyBottomDamage.addEventListener("click", () => {
    applyDamage("bottom", elements.damageBottomInput.value);
    elements.damageBottomInput.value = "";
  });

  document.querySelectorAll(".quick-buttons button").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;
      const damage = button.dataset.damage;
      applyDamage(target, damage);
    });
  });

  elements.resetMatch.addEventListener("click", () => {
    resetMatch();
  });
}

function saveState() {
  localStorage.setItem("mitos_duelo_state", JSON.stringify(state));
}

function loadState() {
  const rawState = localStorage.getItem("mitos_duelo_state");

  if (!rawState) {
    return;
  }

  try {
    const parsedState = JSON.parse(rawState);

    if (parsedState.top && parsedState.bottom) {
      state.top = {
        ...state.top,
        ...parsedState.top
      };

      state.bottom = {
        ...state.bottom,
        ...parsedState.bottom
      };
    }
  } catch (error) {
    console.error("No se pudo cargar el estado guardado:", error);
  }
}

function init() {
  loadState();
  bindEvents();
  render();
}

init();