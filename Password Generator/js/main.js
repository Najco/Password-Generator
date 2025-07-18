const passwordOutput = document.getElementById("passwordOutput");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const notification = document.getElementById("customNotification");
const strengthBar = document.getElementById("strengthLevel");
const saveNameInput = document.getElementById("saveName");
const saveBtn = document.getElementById("saveBtn");
const passwordViewBtn = document.getElementById("passwordViewBtn");
const passwordView = document.getElementById("passwordView");
const passwordViewTable = document.getElementById("passwordViewTable");
const generatorView = document.getElementById("generatorView");
const arrow = document.getElementById("arrow");
const trash = document.getElementById("trash");
const passCounter = document.getElementById("passCounter");

let lozinke = [];

lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
});

generateBtn.addEventListener("click", () => {
  const length = parseInt(lengthRange.value);

  const hasUpper = uppercase.checked;
  const hasLower = lowercase.checked;
  const hasNumber = numbers.checked;
  const hasSymbol = symbols.checked;

  const password = generatePassword(
    length,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol
  );

  passwordOutput.value = password;
  updateStrength(password);
});

copyBtn.addEventListener("click", copyPassword);
function copyPassword() {
  navigator.clipboard
    .writeText(passwordOutput.value)
    .then(() => showNotification("Lozinka je kopirana", "success"));
}
function generatePassword(length, upper, lower, number, symbol) {
  const upperSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerSet = "abcdefghijklmnopqrstuvwxyz";
  const numberSet = "0123456789";
  const symbolSet = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  let allChars = "";

  if (upper) allChars += upperSet;
  if (lower) allChars += lowerSet;
  if (number) allChars += numberSet;
  if (symbol) allChars += symbolSet;
  if (!allChars) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * allChars.length);
    password += allChars[rand];
  }

  return password;
}

function updateStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const percent = Math.min(score * 20, 100);
  strengthBar.style.width = percent + "%";
  strengthBar.className = "progress-bar";

  if (percent <= 40) {
    strengthBar.classList.add("bg-danger");
  } else if (percent <= 80) {
    strengthBar.classList.add("bg-warning");
  } else {
    strengthBar.classList.add("bg-success");
  }
}

// password View

saveBtn.addEventListener("click", () => {
  const saveName = saveNameInput.value.trim();
  const password = passwordOutput.value;

  if (!saveName) {
    showNotification("Polje za Ime je prazno", "error");
    return;
  }
  if (!password) {
    showNotification("Lozinka nije generisana", "error");
    return;
  }

  let newPassword = {
    name: saveName,
    pass: password,
  };

  lozinke.push(newPassword);

  createTable();
  saveNameInput.focus();
});

function createTable() {
  let html = "";
  let couter = lozinke.length;

  for (let i = 0; i < lozinke.length; i++) {
    html += `
      <div class="col-lg-3 col-md-4 col-sm-12 rounded-1 mb-3 p-3 card shadow">
        <h4 class="card-title">${lozinke[i].name}</h4>
        <div class="d-flex justify-content-between">
          <p class="card-text">${lozinke[i].pass}</p>
          <i class="fa-solid fa-trash fs-5 delete" id="${i}"></i>
        </div>
      </div>
    `;
  }

  passCounter.innerHTML = `Ukupan broj lozinki: ${couter}`;

  passwordViewTable.innerHTML = html;

  localStorage.setItem("passwords", JSON.stringify(lozinke));

  const deleteBtns = document.querySelectorAll(".delete");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = parseInt(this.id);
      lozinke.splice(id, 1);
      createTable();
      saveMessage();
      showNotification("Lozinka obrisana", "warning");
    });
  });
}

passwordViewBtn.addEventListener("click", () => {
  generatorView.style.display = "none";
  passwordView.style.display = "block";
  saveMessage();
});
arrow.addEventListener("click", () => {
  generatorView.style.display = "block";
  passwordView.style.display = "none";
});
trash.addEventListener("click", () => {
  lozinke = [];
  localStorage.removeItem("passwords");
  createTable();
  saveMessage();
  showNotification("Sve lozinke su obrisane", "warning");
});

const saved = localStorage.getItem("passwords");

if (saved) {
  lozinke = JSON.parse(saved);
  createTable();
}

function saveMessage() {
  const textWrapper = document.createElement("div");
  textWrapper.textContent = "Sacuvajte lozinku";
  if (lozinke.length === 0) {
    passwordViewTable.innerHTML = "";
    passwordViewTable.appendChild(textWrapper);
  } else {
    if (passwordView.contains(textWrapper)) textWrapper.remove();
  }
}

function showNotification(msg, type = "info") {
  const noti = document.createElement("div");
  noti.classList.add("notification", type);

  noti.textContent = msg;

  notification.appendChild(noti);
  setTimeout(() => {
    noti.classList.add("show");
    notification.classList.add("show");
  }, 100);
  setTimeout(() => {
    noti.classList.remove("show");
    notification.classList.remove("show");
    setTimeout(() => {
      noti.remove();
    }, 500);
  }, 3000);
}
