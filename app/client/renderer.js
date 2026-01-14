//Preview au démarrage
document.addEventListener('DOMContentLoaded', function() {
    showPreview();
}, false);

//Tab
document.getElementById('editor').addEventListener('keydown', function(e) {
  if (e.key == 'Tab') {
    e.preventDefault();
    var start = this.selectionStart;
    var end = this.selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    this.value = this.value.substring(0, start) +
      "\t" + this.value.substring(end);

    // put caret at right position again
    this.selectionStart =
      this.selectionEnd = start + 1;
  }
});

//Show the preview
const showPreview = () => {
    const md = document.getElementById("editor").value
    const html = markdown.parse(md)
    document.getElementById("preview").innerHTML = html
}

//Preview lorsqu'on écrit
document.getElementById("editor").addEventListener('input', showPreview, false);
