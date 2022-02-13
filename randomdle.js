// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let wordleWidth = getRandomInt(5,9);
let wordleHeight = getRandomInt(2,6);
let wordleDay = getRandomInt(1,365);
let line = [];
let squareColorNbr;
line.push('Randomdle     ' + '#' + `${wordleDay}     ` + `${wordleHeight}` + '/6' + '\n' + '\n');
for (j=0; j<wordleHeight; j++) {
  for (i=0; i<wordleWidth; i++) {
    squareColorNbr = getRandomInt(1,3);
    if (squareColorNbr == 1) {
      line.push(`:green_square:`);
    }
    else if (squareColorNbr == 2) {
      line.push(`:orange_square:`);
    }
    else if (squareColorNbr == 3) {
      line.push(`:black_medium_square:`);
    }
  }
  line.push('\n');
}
for (i=0; i<wordleWidth; i++) {
  line.push(`:green_square:`);
}
line.push('\n');


let result = await lib.discord.channels['@0.2.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: line.join(' ')
});
