const PLAYMATS = [
  "playmat1.jpg",
  "playmat2.jpg",
  "playmat3.jpg",
  "playmat4.jpg"
];

const DEFAULT_CASTLE = 50;

const state = {
  top: {
    name: "Jugador Arriba",
    initialCastle: DEFAULT_CASTLE,
    castle: DEFAULT_CASTLE,
    playmat: PLAYMATS[0]
  },
  bottom: {
    name: "Jugador Abajo",
    initialCastle: DEFAULT_CASTLE,
    castle: DEFAULT_CASTLE,
    playmat: PLAYMATS[1]
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

  playerTopMat: document.getElementById("playerTopMat"),
  playerBottomMat: document.getElementById("playerBottomMat"),

  playerTopCard: document.getElementById("playerTopCard"),
  playerBottomCard: document.getElementById("playerBottomCard"),

  resetMatch: document.getElementById("resetMatch")
};

function clampCastle(value) {
  return Math.max(0, value);
}

function sanitizeInitialValue(value) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return DEFAULT_CASTLE;
  }

  return parsed;
}

function sanitizeDamageValue(value) {
  const parsed = Number(value);

  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function sanitizePlaymat(value) {
  if (PLAYMATS.includes(value)) {
    return value;
  }

  return PLAYMATS[0];
}

function getRivalKey(attackerKey) {
  return attackerKey === "top" ? "bottom" : "top";
}

function setPlaymat(playerKey, playmatFile) {
  const validPlaymat = sanitizePlaymat(playmatFile);
  state[playerKey].playmat = validPlaymat;
}

function applyPlaymats() {
  elements.playerTopCard.style.backgroundImage = `url("${state.top.playmat}")`;
  elements.playerBottomCard.style.backgroundImage = `url("${state.bottom.playmat}")`;
}

function render() {
  elements.playerTopName.value = state.top.name;
  elements.playerBottomName.value = state.bottom.name;

  elements.playerTopInitial.value = state.top.initialCastle;
  elements.playerBottomInitial.value = state.bottom.initialCastle;

  elements.playerTopCastle.textContent = state.top.castle;
  elements.playerBottomCastle.textContent = state.bottom.castle;

  elements.playerTopMat.value = state.top.playmat;
  elements.playerBottomMat.value = state.bottom.playmat;

  applyPlaymats();
}

function applyDamageFromPlayer(attackerKey, damageValue) {
  const damage = sanitizeDamageValue(damageValue);

  if (damage === null) {
    return;
  }

  const rivalKey = getRivalKey(attackerKey);
  state[rivalKey].castle = clampCastle(state[rivalKey].castle - damage);

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
        ...parsedState.top,
        playmat: sanitizePlaymat(parsedState.top.playmat || state.top.playmat)
      };

      state.bottom = {
        ...state.bottom,
        ...parsedState.bottom,
        playmat: sanitizePlaymat(parsedState.bottom.playmat || state.bottom.playmat)
      };
    }
  } catch (error) {
    console.error("No se pudo cargar el estado guardado:", error);
  }
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

  elements.playerTopMat.addEventListener("change", (event) => {
    setPlaymat("top", event.target.value);
    saveState();
    render();
  });

  elements.playerBottomMat.addEventListener("change", (event) => {
    setPlaymat("bottom", event.target.value);
    saveState();
    render();
  });

  elements.applyTopDamage.addEventListener("click", () => {
    applyDamageFromPlayer("top", elements.damageTopInput.value);
    elements.damageTopInput.value = "";
  });

  elements.applyBottomDamage.addEventListener("click", () => {
    applyDamageFromPlayer("bottom", elements.damageBottomInput.value);
    elements.damageBottomInput.value = "";
  });

  document.querySelectorAll(".quick-buttons button").forEach((button) => {
    button.addEventListener("click", () => {
      const attacker = button.dataset.attacker;
      const damage = button.dataset.damage;
      applyDamageFromPlayer(attacker, damage);
    });
  });

  elements.resetMatch.addEventListener("click", () => {
    resetMatch();
  });
}

function init() {
  loadState();
  bindEvents();
  render();
}

init();