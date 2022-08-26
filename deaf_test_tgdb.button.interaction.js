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
      'name': `tgdb_game_id`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
});

/*if (result.rows[0].fields.content != 0) {*/
    let FrontUrlGet = await lib.http.request['@1.1.6']({
      method: 'GET',
      url: `https://cdn.thegamesdb.net/images/original/boxart/front/${result.rows[0].fields.content}-1.jpg`
    }); 
    if (FrontUrlGet.statusCode == 200) {
        await lib.discord.channels['@0.2.0'].messages.create({
          "channel_id": `${context.params.event.channel_id}`,
          "content": `https://thegamesdb.net/game.php?id=${result.rows[0].fields.content}`,
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title": "",
              "description": "",
              "color": 0x00FFFF,
              "image": {
                "url": `https://cdn.thegamesdb.net/images/original/boxart/front/${result.rows[0].fields.content}-1.jpg`,
                "height": 0,
                "width": 0
              }
            }
          ]
        });
    }
    else {
      FrontUrlGet = await lib.http.request['@1.1.6']({
        method: 'GET',
        url: `https://cdn.thegamesdb.net/images/original/boxart/front/${result.rows[0].fields.content}-1.png`
      }); 
      if (FrontUrlGet.statusCode == 200) {
          await lib.discord.channels['@0.2.0'].messages.create({
            "channel_id": `${context.params.event.channel_id}`,
            "content": `https://thegamesdb.net/game.php?id=${result.rows[0].fields.content}`,
            "tts": false,
            "embeds": [
              {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "image": {
                  "url": `https://cdn.thegamesdb.net/images/original/boxart/front/${result.rows[0].fields.content}-1.png`,
                  "height": 0,
                  "width": 0
                }
              }
            ]
          });
      }
      else {
        await lib.discord.channels['@0.2.0'].messages.create({
          "channel_id": `${context.params.event.channel_id}`,
          "content": `https://thegamesdb.net/game.php?id=${result.rows[0].fields.content}`,
          "tts": false,
          "embeds": [
            {
              "type": "rich",
              "title": "",
              "description": "",
              "color": 0x00FFFF,
              "image": {
                "url": `https://cdn.thegamesdb.net/images/original/boxart/front/${result.rows[0].fields.content}-2.jpg`,
                "height": 0,
                "width": 0
              }
            }
          ]
        });
      }
    }

/*    await lib.googlesheets.query['@0.3.0'].update({
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
          'content': 0
      }
    });*/
    
    //////// Launch a new game
    let randomgamenumber;
    let timeout = 0;
    function findURL() {
      if (timeout < 35) {
        randomgamenumber = getRandomInt(1,50000);
        timeout = timeout +1;
        console.log(timeout);
      }
      else {
          console.log(`timeout for game ${randomgamenumber}`);
          randomgamenumber = getRandomInt(1,123);
      }
    }
    
    /*let newgamemessage = await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: "..."
    });*/
    
    //Get a new random number for URL and check if URL is valid. If not, then loop.
    let i = 0;
    while (i == 0) {
      await findURL();
      let ScreenUrlGet = await lib.http.request['@1.1.6']({
        method: 'GET',
        url: `https://cdn.thegamesdb.net/images/original/screenshot/${randomgamenumber}-1.jpg`
      });
      //console.log(URLGET.statusCode); 
      //console.log(`https://cdn.thegamesdb.net/images/original/screenshot/${randomgamenumber}-1.jpg`);  
      if (ScreenUrlGet.statusCode == 200) {
        i = 1;
      }
    }
    await lib.googlesheets.query['@0.3.0'].update({
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
/*}
else {}*/
