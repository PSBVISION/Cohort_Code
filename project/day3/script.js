const colorInput = document.getElementById("colorInput");
const colorCode = document.getElementById("colorCode");
const copyButton = document.getElementById("copyButton");
const complementaryContainer = document.getElementById(
  "complementaryContainer"
);
const saveColorButton = document.getElementById("saveColorButton");
const favoritesContainer = document.getElementById("favoritesContainer");

colorInput.addEventListener("input", () => {
  const selectedColor = colorInput.value;
  updateColorCode(selectedColor);
  showComplementaryColor(selectedColor);
});

function updateColorCode(color) {
  colorCode.textContent = color;
}

function showComplementaryColor(color) {
  const complementaryColors = getComplementaryColor(color);
  complementaryContainer.innerHTML = ""; //clear previous color
  complementaryColors.forEach((compColor) => {
    const colorBox = document.createElement("div");
    colorBox.classList.add("color-box");
    colorBox.style.backgroundColor = compColor;
    complementaryContainer.appendChild(colorBox);
  });
}

function getComplementaryColor(color) {
  const base = parseInt(color.slice(1), 16);
  const complement = (0xffffff ^ base).toString(16).padStart(6, "0");
  return [`#${complement}`];
}

copyButton.addEventListener("click", () => {
  navigator.clipboard
    .writeText(colorCode.textContent)
    .then(() => alert("Color Code Copied"))
    .catch((err) => console.err("failed to Copy", err));
});

saveColorButton.addEventListener("click", () => {
  const color = colorCode.textContent;
  addFavoriteColor(color);
});

function addFavoriteColor(favColor) {
  const favColorBox = document.createElement("div");
  favColorBox.classList.add("color-box");
  favColorBox.style.backgroundColor = favColor;
  favColorBox.title = favColor;
  favoritesContainer.appendChild(favColorBox);
}
