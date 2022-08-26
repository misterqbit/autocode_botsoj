// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let result = await lib.googlesheets.query['@0.3.0'].select({
  range: `variables!B:C`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'name': `cpc_game_id`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
});

/*if (result.rows[0].fields.content != 0) {*/
  
  await lib.discord.channels['@0.2.0'].messages.create({
    "channel_id": `${context.params.event.channel_id}`,
    "content": ` https://www.cpc-power.com/index.php?page=detail&num=${result.rows[0].fields.content}`,
    "tts": false,
    "embeds": [
      {
        "type": "rich",
        "title": "",
        "description": "",
        "color": 0x00FFFF,
        "image": {
          "url": `https://www.cpc-power.com/extra_lire_fichier.php?extra=cpcold&fiche=${result.rows[0].fields.content}&slot=1&part=A&type=.png`,
          "height": 0,
          "width": 0
        }
      }
    ]
  });
//  console.log(`https://www.cpc-power.com/extra_lire_fichier.php?extra=cpcold&fiche=${result.rows[0].fields.content}&slot=1&part=A&type=.png`);
/*  await lib.googlesheets.query['@0.3.0'].update({
    range: `variables!B:C`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'name': `cpc_game_id`,
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    },
    fields: {
        'content': 0
    }
  });*/
  let randomgamenumber = getRandomInt(1,3698);
  
  await lib.googlesheets.query['@0.3.0'].update({
      range: `variables!B:C`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
          'name': `cpc_game_id`,
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      fields: {
          'content': `${randomgamenumber}`
      }
  });
  
  //display quiz message
  await lib.discord.channels['@0.2.0'].messages.create({
      "channel_id": `${context.params.event.channel_id}`,
      "content": ` `,
      "tts": false,
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 3,
              "label": `Solution`,
              "custom_id": `cpc_solution_button_id`,
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
            "url": `https://www.cpc-power.com/extra_lire_fichier.php?extra=cpcold&fiche=${randomgamenumber}&slot=2&part=A&type=.png`,
            "height": 0,
            "width": 0
          }
        }
      ]
  });

/*}
else {}*/
