let PreviousSlideNumber;
let PhotoNumber = 2;
let start = false;

function slider(Choice) { //zminia slajd na wybrany przez uzytkownika 
    clearTimeout(AutoSTimeout); 
    PhotoNumber = Choice;
    AutoSlider();
}

function AutoSlider() {
    AutoSTimeout = setTimeout(AutoSlider, 6000) //uruchamia funkcje autoslajd po 6s 
    if (start) { // dzieki temu pierwsze zdjecie nie jest od razu pomijane
        DecreseOpacity(PhotoNumber); //zmniejsza przezroczystosc
        PhotoNumber++;
        if (PhotoNumber === 13) {
            PhotoNumber = 1;
        }
        return;
    } else {
        start = true
    }
}

function SlideRight()
{
    slider(PhotoNumber);
}

function SlideLeft()
{
    if(PhotoNumber === 2)
    {
        slider(12);
    }
    else if(PhotoNumber === 1)
    {
        slider(11);
    }
    else{
        PhotoNumber -= 2;
        slider(PhotoNumber);
    }
}

function ChangePhoto(PhotoNum) {
    let path = `photos/${PhotoNum}.jpg`;
    document.getElementById("image").src = path;

    var img = document.createElement("img");
    img.src = path;
    img.onload = function () {
        //zmiana koloru tła
        rgb = getAverageColor(img);
        document.body.style.background = "linear-gradient( rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + "), rgb(" + rgb.r1 + "," + rgb.g1 + "," + rgb.b1 + "))";

        //Zmiana koloru tekstu nad zdjęciem 
        let TextColor = document.getElementsByClassName("YourChoiceButton");
        let SlideRightLeftColor = document.getElementsByClassName("SlideRightLeft");
        if (rgb.r < 70 || rgb.g < 70 || rgb.b < 70) {
            for (let i = 0; i < TextColor.length; i++) {
                TextColor[i].style.color = "white";
            }
            for (let i = 0; i < SlideRightLeftColor.length; i++) {
                SlideRightLeftColor[i].style.color = "white";
            } 
        } else {
            for (let i = 0; i < TextColor.length; i++) {
                TextColor[i].style.color = "black";
            }
            for (let i = 0; i < SlideRightLeftColor.length; i++) {
                SlideRightLeftColor[i].style.color = "black";
            } 
        }
    };
    //zaznacza ktory slajd jest obecnie wyswietlany
    let CurText = document.getElementsByClassName("YourChoiceButton")[PhotoNum - 1];
    CurText.style.textDecoration = "line-through"
    CurText.style.transform = "translateY(-3px)";

    //jesli nastapi wiecej niz jedna zmiana slajdu to cofa zaznaczenie obecnego slajdu
    if (PreviousSlideNumber > 0) {
        let PrevText = document.getElementsByClassName("YourChoiceButton")[PreviousSlideNumber - 1];
        PrevText.style.textDecoration = "none";
        PrevText.style.transform = "translateY(0px)";
    }
    PreviousSlideNumber = PhotoNum;
    IncreseOpacity();
}

let fps = 1000 / 120;

let opacityI = 1;
function IncreseOpacity() {

    document.body.style.opacity = opacityI / 100;
    opacityI++;
    if (opacityI < 100) {
        setTimeout(IncreseOpacity, fps)
    } else {
        opacityI = 1;
    }
}

let opacityD = 100;
function DecreseOpacity(PhotoNum) {
    opacityD--;
    document.body.style.opacity = opacityD / 100;
    if (opacityD > 0) {
        setTimeout(DecreseOpacity, fps, PhotoNum);
    } else {
        opacityD = 100;
        ChangePhoto(PhotoNum); //po zmniejszeniu przezroczystosci podmienia zdjecie
    }
}



// Author:matkl
// https://github.com/matkl/average-color/blob/gh-pages/average-color.js
function getAverageColor(img) {
    let blocksize = 1;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let width = canvas.width = img.naturalWidth;
    let height = canvas.height = img.naturalHeight;
    let r = 0;
    let g = 0;
    let b = 0;
    let r1 = 0;
    let g1 = 0;
    let b1 = 0;

    let LastRowCount = 0;
    let FirstRowCount = 0;

    ctx.drawImage(img, 0, 0);

    try {
        var imageData = ctx.getImageData(0, 0, width, height);
    } catch (e) {
        console.error(e);
        return {
            r: 0,
            g: 0,
            b: 0,
            r1: 0,
            g1: 0,
            b1: 0

        };
    }
    let data = imageData.data;

    //zebranie kolorów z pierwszego wiersza pixeli
    for (let k = 0; k <= width * 4; k += blocksize * 4) {
        FirstRowCount++;
        r += data[k];
        g += data[k + 1];
        b += data[k + 2];
    }

    //zebranie kolorów z ostatniego wiersza pixeli 
    for (let j = data.length; j >= data.length - (width * 4); j -= blocksize * 4) {
        LastRowCount++;
        r1 += data[j - 4];
        g1 += data[j - 3];
        b1 += data[j - 2];

    }
    r1 = Math.floor(r1 / LastRowCount);
    g1 = Math.floor(g1 / LastRowCount);
    b1 = Math.floor(b1 / LastRowCount);

    r = Math.floor(r / FirstRowCount);
    g = Math.floor(g / FirstRowCount);
    b = Math.floor(b / FirstRowCount);

    return {
        r: r,
        g: g,
        b: b,
        r1: r1,
        g1: g1,
        b1: b1
    };
}