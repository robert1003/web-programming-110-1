
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function adjustHeight() {
    let headerHeight = 0;
    if (document.documentElement.clientWidth >= 800) {
        headerHeight = document.getElementById("header").offsetHeight;
        document.getElementById("left-col").style.top = `${headerHeight}px`;
    } else {
        headerHeight = document.getElementById("left-col").offsetHeight;
        document.getElementById("left-col").style.top = `0`;
    }
    document.getElementById("preview-div").style.top = `${headerHeight}px`;
}

window.onresize = adjustHeight; () => {
    let headerHeight = 0;
    if (document.documentElement.clientWidth >= 800) {
        headerHeight = document.getElementById("header").offsetHeight;
    } else {
        headerHeight = document.getElementById("left-col").offsetHeight;
    }
    console.log(headerHeight);
    document.getElementById("preview-div").style.top = `${headerHeight}px`;
    /*
    let divWidth = document.getElementById("preview-div").offsetWidth;
    let pic_width = document.getElementById("preview").offsetWidth;
    console.log(pic_width, divWidth);
    if (pic_width - divWidth > -50) {
        document.getElementById("preview").style.maxHeight = "none";
        document.getElementById("preview").style.width = "none";
        document.getElementById("preview").style.maxWidth = `${divWidth - 50}px`;
        document.getElementById("preview").style.height = "auto";
    } else {
        document.getElementById("preview").style.maxHeight = "350px";
        document.getElementById("preview").style.width = "auto";
        document.getElementById("preview").style.maxWidth = "none";
        document.getElementById("preview").style.height = "none";
    }
    */
};

var albumName = null;
var pictureSrc = null;

function renderPics() {
    let picture_root = document.getElementById("pictures_start");
    picture_root.innerHTML = "";
    // insert big preview area
    let headerHeight = 0;
    if (document.documentElement.clientWidth >= 800) {
        headerHeight = document.getElementById("header").offsetHeight;
    }
    const firstElemHTML = `
        <div class="col-12 preview" style="top: ${headerHeight}px" id="preview-div">
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
    const options = {
        mode: 'cors',
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    };
    fetch('http://cl6.csie.org:16384/wp1101/hw2/album_url.json', options)
        .then(res => res.json())
        .then(data => {
            if (name in data) {
                albumName = name;
                pictureSrc = data[name];
                renderPics();
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            } else {
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
    //document.body.scrollTop = 0;
    //document.documentElement.scrollTop = 0;
    // update selected image idx
    document.getElementById('curPicId').textContent = `current picture id : ${Number.parseInt(img.id.split('_')[1])+1}`;
}

async function addPic() {
    let url = prompt('enter picture url:');
    img = document.createElement('img');
    img.onload = () => {
        pictureSrc.unshift(url);
        renderPics();
    };
    img.onerror = () => {
        alert(`invalid image url: ${url}`);
    }
    img.src = url;
    img.remove();
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