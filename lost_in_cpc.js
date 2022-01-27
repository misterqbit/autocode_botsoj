// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
  token: `${context.params.event.token}`,
  content: `Bravo! Vous avez trouvé tous les secrets de ce voyage dans les univers de SRAM, mais aussi de...`,
  embeds: [
    {
      "type": "rich",
      "title": "",
      "description": "",
      "color": 0x00FFFF,
      "image": {
        "url": `https://i.ibb.co/b2WC5D4/thend.gif`,
        "height": 0,
        "width": 400
      }
    }
  ]
});

await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
  token: `${context.params.event.token}`,
  content: `La fin? Quelle fin? M'enfin! Je veux la trouver cette fin! Je veux explorer, résoudre des énigmes, éviter les pièges, améliorer mes compétences, je veux la mériter, cette fin! Cachez cette fin que je ne saurais voir! Et démarrons cette aventure`,
});

await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": `>DEPART:`,
  "tts": false,
  "components": [
    {
      "type": 1,
      "components": [
        {
          "style": 1,
          "label": `OUEST`,
          "custom_id": `adv_ouest`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `NORD`,
          "custom_id": `adv_nord`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `EST`,
          "custom_id": `adv_est`,
          "disabled": false,
          "type": 2
        },
        {
          "style": 1,
          "label": `SUD`,
          "custom_id": `adv_sud`,
          "disabled": false,
          "type": 2
        }
      ]
    }
  ],
  "embeds": [
    {
      "type": "rich",
      "title": "",
      "description": "",
      "color": 0x00FFFF,
      "image": {
        "url": `https://i.ibb.co/swHGNb9/x100y100.png`,
        "height": 0,
        "width": 400
      }
    }
  ]
});

//set in google sheet the position to Start for this channel id
let result = await lib.googlesheets.query['@0.3.0'].select({
  range: `adventure!A:C`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'channel_id': `${context.params.event.channel_id}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  }
});
console.log(result.rows.length);
if (result.rows.length == 0) {
  await lib.googlesheets.query['@0.3.0'].insert({
    range: `adventure!A:I`,
    fieldsets: [{
        'channel_id': `${context.params.event.channel_id}`,
        'position': `5050`,
        'gamemaster': `${context.params.event.member.user.id}`,
        'aco': 0,
        'botw': 0,
        'xcx': 0,
        'ds': 0,
        'tess': 0,
        'ngp': 0
    }],
  });
}
else{
  await lib.googlesheets.query['@0.3.0'].update({
    range: `adventure!A:I`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'channel_id': `${context.params.event.channel_id}`,
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
        'position': `5050`,
        'gamemaster': `${context.params.event.member.user.id}`,
        'aco': 0,
        'botw': 0,
        'xcx': 0,
        'ds': 0,
        'tess': 0,
        'ngp': 0
    }
  });
}
