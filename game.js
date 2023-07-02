const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height=canvas.clientHeight * 4
canvas.width=canvas.clientWidth * 4
const cvheight = canvas.height;
const cvwidth = canvas.width;

let playerXpos = cvwidth/2;
let movetoright = true;
let movetoleft = false;

const fps = 60;
const speed = 10
let startXcube = cvwidth/2
let Level = 0

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






// Würfel drehen
function summoncube() {

  startXcube = getRandomNumber(cvwidth/100*10,cvwidth/100*90)

  //   y=mx+b
  //
  //   if(startXcube < cvwith/2) {
  //     m = getRandomNumber(-1,-5)    -   1 ist 45° und oben bis slider ist quadrat und da nicht größer als 45, wenn nur kleiner aks größer 1 um steiler
  //   }
  //   if (startXcube > cvwith/2) {
  //     m = getRandomNumber(1,5)
  //   }
  //   0=m*startXcube+b | solve b
  //   0/startXcube = m+b
  //   0/startXcube-m = b
  //
  //   ctx.translate(x,m*x+(0/startXcube-m)) | x mit jedem Frame zunehmen lassen

  ctx.translate(cvwidth/2, cvheight/2); // P(X|Y)
  ctx.rotate((45 * Math.PI) / 180); // 45° Rotation
  ctx.fillStyle = '#fdfdfe';
  ctx.fillRect(-(cvheight/100*5) / 2, -(cvheight/100*5) / 2, (cvheight/100*5), (cvheight/100*5));
  ctx.setTransform(1, 0, 0, 1, 0, 0);

}








// Führt alle Functionen mehrmals die Sekunde aus
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawslider()
    drawplayer()
    sliderballposition()

    summoncube()

}
setInterval(render, 1000/fps);




















function getRandomNumber(min, max) {
    // Math.random() gibt eine Zufallszahl im Bereich [0, 1) zurück
    // Multipliziere mit (max - min + 1), um den Zahlenbereich abzudecken
    // Verschiebe um min, um den minimalen Wert zu berücksichtigen
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }