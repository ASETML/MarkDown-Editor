//Preview au démarrage
document.addEventListener(
  "DOMContentLoaded",
  function () {
    showPreview();
  },
  false,
);

//Tab
document.getElementById("editor").addEventListener("keydown", function (e) {
  if (e.key == "Tab") {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    this.value =
      this.value.substring(0, start) + "\t" + this.value.substring(end);

    // put caret at right position again
    this.selectionStart = this.selectionEnd = start + 1;
  }
});

//Show the preview
const showPreview = () => {
  const md = document.getElementById("editor").value;
  const html = markdown.parse(md);
  document.getElementById("preview").innerHTML = html;
};

//Preview lorsqu'on écrit
document.getElementById("editor").addEventListener("input", showPreview, false);

//Logique de syncronisation de scroll entre preview et plaintext
const editor = document.getElementById("editor");
const preview = document.getElementById("preview");

let isScrolling = false;

//Il y a 99% chance que ce code n'est pas optimal,
//je pense pas que il y a besoin de 2 listeners ou 2 elements scroll
editor.addEventListener("scroll", () => {
  if (!isScrolling) {
    isScrolling = true;
    //Big formule stackoverflow
    const percentage =
      editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
    preview.scrollTop =
      percentage * (preview.scrollHeight - preview.clientHeight);
    setTimeout(() => {
      isScrolling = false;
    }, 1); //1ms de timeout pour eviter boucle
    //Enlevez ca si vous voulez armageddon
  }
});

//Meme chose pour autre scroll
preview.addEventListener("scroll", () => {
  if (!isScrolling) {
    isScrolling = true;
    const percentage =
      preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
    editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    setTimeout(() => {
      isScrolling = false;
    }, 1);
  }
});

const themesArray = themes.requestList();

for (const t of themesArray) {
  // Create a list item element
  const listItem = document.createElement("li");

  const div = document.createElement("div");

  // Create the theme name element
  const name = document.createElement("p");
  name.innerText = t.parsedYaml.name;

  div.appendChild(name);

  // Create a button element
  const button = document.createElement("button");
  button.innerText = "Use";

  // Bind the click event to applyTheme
  button.onclick = () => applyTheme(JSON.stringify(t));

  // Append the button to the list item
  div.appendChild(button);

  div.style =
    "display: flex; flex-direction: row; justify-content: space-between";

  listItem.appendChild(div);

  // Create and append the description paragraph
  const description = document.createElement("p");
  description.innerText = t.parsedYaml.description;
  listItem.appendChild(description);

  // Append the list item to the theme list
  document.getElementById("themeList").appendChild(listItem);
}

const applyTheme = (theme) => {
  theme = JSON.parse(theme);
  document.getElementById("themeStyle").innerHTML = theme.parsedYaml.style;
  themes.setLast(theme);
};

const lastTheme = themes.getLast();
if (lastTheme) {
  document.getElementById("themeStyle").innerHTML = lastTheme.parsedYaml.style;
}
