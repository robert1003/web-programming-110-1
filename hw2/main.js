
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

var albumName = null;
var pictureSrc = null;

function renderPics() {
    let picture_root = document.getElementById("pictures_start");
    picture_root.innerHTML = "";
    // insert big preview area
    const firstElemHTML = `
        <div class="col-12 preview">
            <center>
                <a href="" id="preview_link">
                    <img src="" id="preview" style="transform: none;">
                </a>
            </center>
        </div>
    `;
    picture_root.appendChild(htmlToElement(firstElemHTML));
    // insert other pictures
    for (let i = 0; i < pictureSrc.length; i += 3) {
        let elemHTML = `
            <div class="col-12">
        `;
        for (let j = i; j < Math.min(i + 3, pictureSrc.length); j += 1) {
            elemHTML += `
                <a onclick="switchPic(this)">
                    <div class="col-4">
                        <img id="pic_${j}" src="${pictureSrc[j]}">
                    </div>
                </a>
            `;
        }
        elemHTML += `</div>`;
        picture_root.appendChild(htmlToElement(elemHTML));
    }
    // make addPic button visible
    document.getElementById('addPicBtn').style.visibility = "visible";
    document.getElementById('rmPicBtn').style.visibility = "visible";
    document.getElementById('picStatistic').style.visibility = "visible";
    // update picture count
    document.getElementById('picCnt').textContent = `picture count : ${pictureSrc.length}`;
    // click the first image
    document.getElementById('pic_0').click();
}

function loadPic(name) {
    console.log(name);
    fetch('album_url.json')
        .then(res => res.json())
        .then(data => {
            if (name in data) {
                albumName = name;
                pictureSrc = data[name];
                renderPics();
            } else {
                console.log(name);
                alert(`Album ${name} is empty!!!!!!`);
            }
        });
}

var pre_picture = null;
var pre_picture_id = null;
function switchPic(obj) {
    if (pre_picture != null) {
        let img = pre_picture.children[0].children[0];
        img.style.border = "";
    }

    pre_picture = obj;
    let img = obj.children[0].children[0];
    pre_picture_id = img.id;
    img.style.border = "5px solid red";

    let src = img.src;

    document.getElementById("preview").src = src;
    document.getElementById("preview_link").href = src;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    // update selected image idx
    document.getElementById('curPicId').textContent = `current picture id : ${Number.parseInt(img.id.split('_')[1])+1}`;
}

async function addPic() {
    let url = prompt('enter picture url:');
    let valid = await fetch(url).then(res => {
        return res.status === 200;
    });
    if (!valid) {
        alert(`invalid image url: ${url}`);
        return;
    }
    pictureSrc.push(url);
    renderPics();
}

function removeSelectedPic() {
    let idx = Number.parseInt(pre_picture_id.split('_')[1]);
    pictureSrc.splice(idx, 1);
    renderPics();
}

var pre_album = null;
function changeColor(obj) {
    if (pre_album != null) {
        pre_album.style.backgroundColor = "#f9e6ba";
    }
    pre_album = obj;
    obj.style.backgroundColor = "#f2cd75";
}