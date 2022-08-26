// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let dices_number = context.params.event.data.options[0].value;
let dices_type = context.params.event.data.options[1].value;
let result = [];
//let dices_total = 0;
result.push(`<@!${context.params.event.member.user.id}>`);
result.push('\n');

if (dices_number > 128) {
  result.push("Est-ce bien raisonnable de vouloir faire autant de lancers?");
  await lib.discord.channels['@0.2.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: result.join(' ')
    });
}
else {
  for (i=1; i<(dices_number+1); i++) {
    let diceresult = getRandomInt(1,dices_type);
    result.push(":game_die: ["+dices_type+" faces] >> Lancer n°"+i+" >> Résultat: **"+diceresult+"**");
    result.push('\n');
//    dices_total = dices_total + diceresult;
  }
//  dices_total = dices_total*1000;
//  dices_total = Math.floor(dices_total/(dices_number*dices_type));
//  result.push("votre score est: "+dices_total);
  await lib.discord.channels['@0.2.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: result.join(' ')
  });
}
