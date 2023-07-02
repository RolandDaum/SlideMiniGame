const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height=canvas.clientHeight * 4
canvas.width=canvas.clientWidth * 4
const cvheight = canvas.height;
const cvwidth = canvas.width;

let playerXpos = cvwidth/2;
let movetoright = true;
let movetoleft = false;

const fps = 1000;
const speed = 10
let startXcube = cvwidth/2
let Level = 0

let cubesList = []

// Zeichent den Slider
function drawslider() {
    ctx.beginPath();
    ctx.strokeStyle = '#111a23';
    ctx.lineWidth = cvheight/100*5;
    ctx.lineCap = 'round';
    ctx.moveTo(cvwidth/100*10, cvheight/2);
    ctx.lineTo(cvwidth/100*90, cvheight/2);
    ctx.stroke();
}
// Zeichnet den Kreis auf dem Slider
function drawplayer() {
    ctx.beginPath();
    ctx.fillStyle = '#00ffaf';
    ctx.arc(playerXpos, cvheight/2, (cvheight/100*5)/2, 0, 2 * Math.PI);
    ctx.fill();
}
// Ändert die Spielerposition
function sliderballposition() {
    if (playerXpos > cvwidth/100*90) {
        movetoright = false;
        movetoleft = true;
    }
    if (playerXpos < cvwidth/100*10) {
        movetoright = true;
        movetoleft = false;
    }
    if (movetoright) {
        playerXpos = playerXpos + speed
    }
    if (movetoleft) {
        playerXpos = playerXpos - speed
    }

}

// Guckt, ob 'Space' gedrückt wurde und ändert gegebenenfalls die Richtung
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (movetoright) {
            movetoright = false;
            movetoleft = true;
        }
        else {
            movetoright = true;
            movetoleft = false;
        }
    }
});
// Guckt, ob der Screen berührt wurde und ändert gegebenenfalls die Richtung
document.addEventListener('touchstart', function(event) {
    if (movetoright) {
        movetoright = false;
        movetoleft = true;
    }
    else {
        movetoright = true;
        movetoleft = false;
    }
});


// Zeichnet ein Quadrat an die gegebene Position mit entsprechneder Rotation
function drawCube(x,y,rotaion) {
    ctx.translate(x, y); // P(X|Y)
    ctx.rotate((rotaion * Math.PI) / 180); // 45° Rotation
    ctx.fillStyle = '#fdfdfe';
    ctx.fillRect(-(cvheight/100*5) / 2, -(cvheight/100*5) / 2, (cvheight/100*5), (cvheight/100*5));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
function addCubetoList() {
    const newCube = {
        m: null,
        b: null,
        x: 0,
        rotaion: getRandomNumber(0, 90),
    };

    // Nimmt einen Steigungs Faktor m für die lineare Funktion
    newCube.m = getRandomNumber(-5,5)
    while (newCube.m === 0) {
        newCube.m = getRandomNumber(-5,5)
    }

    // Berechnet einen randome Y-Achsenabschnitt (b) für die lineare Funktion
    if (newCube.m > 1) {
        newCube.b = getRandomNumber(0,-((newCube.m-1)*cvheight))
    }
    if (newCube.m <= -1) {
        newCube.b = getRandomNumber(cvheight, -cvheight*newCube.m)
    }
    if (newCube.m === 1) {
        newCube.b = 0
    }

    newCube.x = (-newCube.b/newCube.m)


    cubesList.push(newCube);
}
function deleteCubefromList(cubeNum) {
    cubesList.splice(cubeNum,1)
    console.log('deleted cube ' + cubeNum)
}
function calculateCubes() {
    if (cubesList == '') {
        addCubetoList()
    }

    for (i = 0; i < cubesList.length; i++) {
        drawCube(cubesList[i].x, (cubesList[i].m*cubesList[i].x+cubesList[i].b), cubesList[i].rotaion)
        if (cubesList[i].m > 0) {
            cubesList[i].x++
        }
        if (cubesList[i].m < 0) {
            cubesList[i].x--
        }
        if ((cubesList[i].m*cubesList[i].x+cubesList[i].b) > cvheight/3*2) {
            deleteCubefromList(i)
        }
    }
    if (cubesList.length === 5) {

    }
    else {
        addCubetoList()
        console.log('created new cube')
    }
}







// Führt alle Functionen mehrmals die Sekunde aus
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawslider()
    drawplayer()
    sliderballposition()

    calculateCubes()
}
setInterval(render, 1000/fps);




















function getRandomNumber(min, max) {
    // Math.random() gibt eine Zufallszahl im Bereich [0, 1) zurück
    // Multipliziere mit (max - min + 1), um den Zahlenbereich abzudecken
    // Verschiebe um min, um den minimalen Wert zu berücksichtigen
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }