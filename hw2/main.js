
function switchPic(obj, src) {
    document.getElementById("preview").src = src;
    document.getElementById("preview_link").href = src;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
