if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(sw.js).then(registration => {
        console.log("SW Registered!");
        console.log(registration)
    } ).catch(error => {
        console.log("SW Registration failed!");
        console.log(error)
    })
}


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const resolutionMultiplier = 4
canvas.height=canvas.clientHeight * resolutionMultiplier
canvas.width=canvas.clientWidth * resolutionMultiplier
const cvheight = canvas.height;
const cvwidth = canvas.width;

let playerXpos = cvwidth/2;
let movetoright = false;
let movetoleft = false;

const fps = 60;
const speedPlayer = 15
const speedCubes = 2.5
const spawnDelayinSec = 1
const maxCubes = 7.5
const everyXcubeisApoint = 7.5

var sound_changeDirection = new Audio('./Sounds/chnageDirection.mp3')
var sound_collectedPoint = new Audio('./Sounds/collectedPoint.mp3')
var sound_gameOver = new Audio('./Sounds/gameOver.mp3')
var sound_SliderEnd = new Audio('./Sounds/SliderEnd.mp3')


let score = 0

let cubesList = []

let timeLastCubecreated = fps*spawnDelayinSec



                        // --- | Functions for the main Game | --- //
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
        sound_SliderEnd.play()
    }
    if (playerXpos < cvwidth/100*10) {
        movetoright = true;
        movetoleft = false;
        sound_SliderEnd.play()
    }
    if (movetoright) {
        playerXpos = playerXpos + speedPlayer
    }
    if (movetoleft) {
        playerXpos = playerXpos - speedPlayer
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
        sound_changeDirection.play()
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
    sound_changeDirection.play()
});
// Zeichnet ein Quadrat an die gegebene Position mit entsprechneder Rotation
function drawCube(x,y,rotaion, color) {
    ctx.translate(x, y); // P(X|Y)
    ctx.rotate((rotaion * Math.PI) / 180); // 45° Rotation
    if (color === undefined) {
        ctx.fillStyle = '#fdfdfe';
    }
    else {
        ctx.fillStyle = color;
    }
    ctx.fillRect(-(cvheight/100*5) / 2, -(cvheight/100*5) / 2, (cvheight/100*5), (cvheight/100*5));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
// Fügt einen neuen Cube zur Liste hinzu, wenn einer fehlt
function addCubetoList() {

    if (timeLastCubecreated === fps*spawnDelayinSec) {
        const newCube = {
            m: null,
            b: null,
            x: 0,
            rotaion: getRandomNumber(0, 90),
            Point: false,
        };
    
        // Generating m for a 2:3 ratio (1:1,5)
        newCube.m = getRandomNumber(-5,5)
        while (newCube.m === 0) {
            newCube.m = getRandomNumber(-5,5)
        }
        if (newCube.m > 0) {
            newCube.m = newCube.m + 0.5
            newCube.b = getRandomNumber(0,-(newCube.m - 1.5)*cvwidth)
        }
        if (newCube.m < 0) {
            newCube.m = newCube.m - 0.5
            newCube.b = getRandomNumber(cvheight/3*2,-newCube.m*cvwidth)
        }
    
        newCube.x = (-newCube.b/newCube.m)
    
        if (getRandomNumber(1,everyXcubeisApoint) === 1) {
            newCube.Point = true
        }
        cubesList.push(newCube);
        timeLastCubecreated = 0
    }
    else {
        timeLastCubecreated++
    }
}
// Löscht einen Cube x von der Liste
function deleteCubefromList(cubeNum) {
    cubesList.splice(cubeNum,1)
}
// Berechnet die Position der Cubes
function calculateCubes() {
    if (cubesList === '') {
        addCubetoList();
    }
    for (i = 0; i < cubesList.length; i++) {
        if (
            (
                (cubesList[i].m * cubesList[i].x + cubesList[i].b) >= cvheight / 2 - (cvheight / 100 * 5) / 2 &&
                (cubesList[i].m * cubesList[i].x + cubesList[i].b) <= cvheight / 2 + (cvheight / 100 * 5) / 2
            )
            &&
            (
                cubesList[i].x + (cvheight / 100 * 5) / 2 >= playerXpos - (cvheight / 100 * 5) / 2 &&
                cubesList[i].x - (cvheight / 100 * 5) / 2 <= playerXpos + (cvheight / 100 * 5) / 2
            )
        ) {
            if (cubesList[i].Point === true) {
                score++
                deleteCubefromList(i);
                sound_collectedPoint.play()
            }
            else if (cubesList[i].Point === false) {
                score = 0
                cubesList = []
                sound_gameOver.play()
            }
        }
        else {
            if (cubesList[i].Point === true) {
                drawCube(cubesList[i].x, (cubesList[i].m*cubesList[i].x+cubesList[i].b), cubesList[i].rotaion, '#00ffaf')
            }
            else if (cubesList[i].Point === false) {
                drawCube(cubesList[i].x, (cubesList[i].m*cubesList[i].x+cubesList[i].b), cubesList[i].rotaion)
            }
            if (cubesList[i].m > 0) {
                cubesList[i].x = cubesList[i].x + speedCubes
            }
            if (cubesList[i].m < 0) {
                cubesList[i].x = cubesList[i].x - speedCubes
            }
            if ((cubesList[i].m*cubesList[i].x+cubesList[i].b) > cvheight/3*2) {
                deleteCubefromList(i)
            }
        }
    }
    if (cubesList.length === maxCubes) {

    }
    else {
        addCubetoList();
    }
}


// Führt alle Functionen mehrmals die Sekunde aus
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawslider()
    drawplayer()
    sliderballposition()
    calculateCubes()

    drawText(score, cvwidth/2, cvheight/5*4)

}
setInterval(render, 1000/fps);



function drawText(text, x, y) {
    var fontSize = cvheight / 5;
    
    ctx.font = fontSize + "px 'Roboto'";
    ctx.fillStyle = "#fdfdfe";
    
    var textWidth = ctx.measureText(text).width;
    var centeredX = x - (textWidth / 2);
    
    ctx.fillText(text, centeredX, y);
}
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}