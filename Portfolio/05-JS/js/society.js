var myGamePiece = new Array();
var happySrc = "images/smiley.gif";
var sadSrc = "images/angry.gif";
var maxDist = 50; 

var myGameArea = {
  timer: 0,
  running: true,
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.context = this.canvas.getContext("2d");
    this.context.font = "12px serif";
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    setInterval(updateGameArea, 20);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

function flatlander(width, height, x, y, isHappy) {
  this.image = new Image();
  this.isHappy = isHappy;
  this.happyPoints = isHappy ? 1 : -1;
  this.image.src = isHappy ? happySrc : sadSrc;
  this.width = width;
  this.height = height;
  this.speedX = (Math.random() * 4) - 2; 
  this.speedY = (Math.random() * 4) - 2; 
  this.x = x;
  this.y = y;

  this.update = function () {
    var ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.fillText(this.happyPoints, this.x, this.y + 5);
  };

  this.newPos = function (canvasWidth, canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;

  
    if (this.x < 0 || this.x > canvasWidth - this.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvasHeight - this.height) this.speedY *= -1;
  };

  this.moreHappy = function () {
    this.happyPoints += 0.1;
    if (this.happyPoints > 1) {
      this.isHappy = true;
      this.image.src = happySrc;
    }
  };

  this.lessHappy = function () {
    this.happyPoints -= 0.1;
    if (this.happyPoints < 0) {
      this.isHappy = false;
      this.image.src = sadSrc;
    }
  };

  this.checkSurroundings = function (other) {
    var x = Math.pow(this.x - other.x, 2);
    var y = Math.pow(this.y - other.y, 2);
    return Math.sqrt(x + y);
  };
}

function startGame() {
  var n = parseInt(document.getElementById("num").value);
  var m = parseInt(document.getElementById("sad").value);
  if (isNaN(n) || isNaN(m) || m > n || n <= 0) {
    alert("Datos no válidos. Asegúrese de que el número de tristes no sea mayor que el de individuos y que sean positivos.");
    return;
  }

  var sad = 0;
  myGamePiece = []; 
  for (var i = 0; i < n; i++) {
    var nX = Math.random() * myGameArea.canvas.width;
    var nY = Math.random() * myGameArea.canvas.height;
    var gamePiece = new flatlander(30, 30, nX, nY, ++sad > m);
    myGamePiece.push(gamePiece);
  }
  myGameArea.start();
}

function updateGameArea() {
  if (myGameArea.running) {
    myGameArea.clear();
    for (var i = 0; i < myGamePiece.length; i++) {
      myGamePiece[i].newPos(myGameArea.canvas.width, myGameArea.canvas.height);
      myGamePiece[i].update();
    }

    var tmpFocus, d;
    var happy = 0;
    var sad = 0;

    for (var i = 0; i < myGamePiece.length; i++) {
      tmpFocus = myGamePiece[i];
      for (var j = i + 1; j < myGamePiece.length; j++) {
        d = tmpFocus.checkSurroundings(myGamePiece[j]);
        if (d < maxDist) {
          if (myGamePiece[j].isHappy) {
            tmpFocus.moreHappy();
          } else {
            tmpFocus.lessHappy();
          }
        }
      }
      if (tmpFocus.isHappy) {
        happy++;
      } else {
        sad++;
      }
    }

    myGameArea.timer++;
    document.getElementById("happyIndividuals").textContent = "Happy: " + happy;
    document.getElementById("sadIndividuals").textContent = "Sad: " + sad;
  } else return;

  if (happy === 0 || sad === 0) {
    var msg;
    myGameArea.running = false;
    if (happy == 0) msg = "Absolute sadness.... SAD!";
    else msg = "Absolute happiness reached.... Hurray!!";
    document.getElementById("timer").textContent =
      "Time: " + myGameArea.timer + "       " + msg;
  } else {
    document.getElementById("timer").textContent = "Time: " + myGameArea.timer;
  }
}
