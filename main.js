// ID Binders
let mainDiv = document.getElementById('mainDiv')

// variables
const LETTERS = '0123456789ABCDEF'; // letters for random color generation
const SPIN_TIME = '2000'; // spin time in ms
var square = { // data for creation of a new square
  x: 0,
  y: 0,
  color: '',
  id: 0,
};
var isFirstLoop = true; // used to cancel first loop suppression of an old square
var transitionTimeout; // timeout for sync with transition
var removeQueue = []; // remove queue (wait until all square have finish spinning)

// Functions
function createSquare (ax, ay, bx, by) {
  // setup square data
  // computing position
  const positionTop = ay < by ? ay : by;
  const positionLeft = ax < bx ? ax : bx;
  // computing with and height
  const squareHeight = Math.abs(by - ay);
  const squareWidth = Math.abs(bx - ax);
  const squareBackgroundColor = square.color;

  // create square
  let newSquare = document.createElement('div');
  newSquare.id = square.id.toString();
  newSquare.classList.add('square');
  newSquare.style.top = positionTop;
  newSquare.style.left = positionLeft;
  newSquare.style.height = squareHeight;
  newSquare.style.width = squareWidth;
  newSquare.style.backgroundColor = squareBackgroundColor;
  newSquare.addEventListener('dblclick', handleDoubleClick); // add dbclick event for remove
  mainDiv.appendChild(newSquare);
};

function getRandomColor() {
  let color = '#';

  // picking 6 random letter/number in the string letter
  for (var i = 0; i < 6; i++) {
    color = color.concat(LETTERS[Math.floor(Math.random() * 16)]);
  }

  return color;
}

// Events Handlers
function handleMouseDown (evt) {
  // setup new square data
  square.color = getRandomColor();
  square.x = evt.x;
  square.y = evt.y;
  square.id = square.id + 1;

  // set new event mousemove for mouse tracking
  mainDiv.addEventListener('mousemove', handleMouseMove);
};

function handleMouseUp () {
  // remove mousemove listener when tracking is over 
  mainDiv.removeEventListener('mousemove', handleMouseMove);
  isFirstLoop = true;
};

function handleMouseMove (evt) {
  // crate a square with mousemoove data
  createSquare(square.x, square.y, evt.x, evt.y);

  // don't remove old square on first loop because he doesn't exist
  if (isFirstLoop === true)  {
    isFirstLoop = false;
    return;
  }

  // on each loop, remove old square and create a new one with new mouse position
  mainDiv.removeChild(document.getElementById(square.id.toString()));
}

function handleDoubleClick (evt) {
  // get square to rotate and apply spin class
  let squareToRotate = document.getElementById(evt.target.id);
  squareToRotate.classList.add('spin');
  squareToRotate.style.transition = `transform ${SPIN_TIME / 1000}s`;

  // if old timeout exist: delete it
  if (transitionTimeout) {
    clearTimeout(transitionTimeout);
  }
  // create new timeout
  transitionTimeout = setTimeout(() => {
    removeQueuedSquare() // when all spinning are finish: trigger the removing
  }, SPIN_TIME);

  // push in remove queue the spinning square
  removeQueue.push(squareToRotate);
}

function removeQueuedSquare () {

  // remove all the elements in the remove array
  removeQueue.map((elem) => {
    mainDiv.removeChild(elem);
  });

  // clear the remove array
  removeQueue.splice(0,removeQueue.length)
}

// Events Listeners
mainDiv.addEventListener('mousedown', handleMouseDown)
mainDiv.addEventListener('mouseup', handleMouseUp)
