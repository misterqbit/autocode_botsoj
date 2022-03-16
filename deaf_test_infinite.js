// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

if (context.params.event.channel_id == '928370783603028018') {
  /////////////////////////////////////CPC Power /////////////////////////////

    let randomgamenumber = getRandomInt(1,3698);

    let result = await lib.googlesheets.query['@0.3.0'].update({
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
}
else if (context.params.event.channel_id == '953642125931708486') {
  /////////////////////////////////// GAMESDB ////////////////////////////
  let randomgamenumber;
  function findURL() {
    randomgamenumber = getRandomInt(1,12202);
  }
  
  let newgamemessage = await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: "..."
  });
  
  //Get a new random number for URL and check if URL is valid. If not, then loop.
  let i = 0;
  while (i == 0) {
    await findURL();
    let URLGET = await lib.http.request['@1.1.6']({
      method: 'GET',
      url: `https://cdn.thegamesdb.net/images/original/screenshot/${randomgamenumber}-1.jpg`
    });
    console.log(URLGET.statusCode); 
    console.log(`https://cdn.thegamesdb.net/images/original/screenshot/${randomgamenumber}-1.jpg`);  
    if (URLGET.statusCode == 200) {
      i = 1;
    }
  }
  let result = await lib.googlesheets.query['@0.3.0'].update({
    range: `variables!B:C`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'name': `tgdb_game_id`,
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
            "custom_id": `tgdb_solution_button_id`,
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
          "url": `https://cdn.thegamesdb.net/images/original/screenshot/${randomgamenumber}-1.jpg`,
          "height": 0,
          "width": 0
        }
      }
    ]
  });
}

else {
  let result = await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@!${context.params.event.member.user.id}> : Cette commande n'est permise que dans un des fils Deaf Test Infinite`
  });
}
