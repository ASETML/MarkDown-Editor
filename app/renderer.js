document.getElementById('convertButton').addEventListener('click', () => {
    const md = document.getElementById("editor").value
    const html = markdown.parse(md)
    console.log(html);
    document.getElementById("preview").innerHTML = html
});
