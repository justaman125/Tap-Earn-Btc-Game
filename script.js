const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const authMessage = document.getElementById("authMessage");

const authBox = document.getElementById("authBox");
const gameBox = document.getElementById("gameBox");

const tapBtn = document.getElementById("tapBtn");
const btcDisplay = document.getElementById("btcDisplay");
const upgradeBtn = document.getElementById("upgradeBtn");
const upgradeCostDisplay = document.getElementById("upgradeCost");
const multiplierDisplay = document.getElementById("multiplierDisplay");
const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;

// ===== STORAGE =====

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users")) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// ===== SIGN UP =====

signupBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  authMessage.textContent = "";

  if (!username || !password) {
    authMessage.textContent = "Fill all fields";
    return;
  }

  let users = getUsers();

  if (users[username]) {
    authMessage.textContent = "Account already exists";
    return;
  }

  users[username] = {
    password: password,
    btc: 0,
    multiplier: 1,
    upgradeCost: 0.00000002
  };

  saveUsers(users);

  authMessage.textContent = "Account created successfully";

  // AUTO LOGIN AFTER SIGNUP (IMPORTANT UX FIX)
  currentUser = username;
  loadGame();
});

// ===== LOGIN =====

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  authMessage.textContent = "";

  let users = getUsers();

  if (!users[username]) {
    authMessage.textContent = "This account does not exist";
    return;
  }

  if (users[username].password !== password) {
    authMessage.textContent = "Wrong password";
    return;
  }

  currentUser = username;
  authMessage.textContent = "Successfully signed in!";

  loadGame();
});

// ===== GAME =====

function loadGame() {
  authBox.style.display = "none";
  gameBox.style.display = "block";
  updateUI();
}

function updateUI() {
  const users = getUsers();
  const user = users[currentUser];

  if (!user) return;

  btcDisplay.textContent = "BTC: " + user.btc.toFixed(8);
  multiplierDisplay.textContent = "Multiplier: x" + user.multiplier;
  upgradeCostDisplay.textContent = user.upgradeCost.toFixed(8);
  welcome.textContent = "User: " + currentUser;
}

// TAP
tapBtn.addEventListener("click", () => {
  let users = getUsers();
  let user = users[currentUser];

  if (!user) return;

  user.btc += 0.00000001 * user.multiplier;

  saveUsers(users);
  updateUI();
});

// UPGRADE
upgradeBtn.addEventListener("click", () => {
  let users = getUsers();
  let user = users[currentUser];

  if (!user) return;

  if (user.btc < user.upgradeCost) {
    alert("Not enough BTC");
    return;
  }

  user.btc -= user.upgradeCost;
  user.multiplier += 1;
  user.upgradeCost *= 1.8;

  saveUsers(users);
  updateUI();
});

// LOGOUT
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  gameBox.style.display = "none";
  authBox.style.display = "block";

  usernameInput.value = "";
  passwordInput.value = "";
  authMessage.textContent = "";
});
