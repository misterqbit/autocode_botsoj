// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
// console.log(context.params.event);

let last_episode = await lib.googlesheets.query['@0.3.0'].select({
  range: `Tiny-RPG!J:K`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
      {
        'gamemaster': `${context.params.event.user.id}`
      }
    ],
  limit: {
    'count': 0,
    'offset': 0
  },
});
last_episode = last_episode.rows[0].fields.active_episode;
let new_episode = await lib.googlesheets.query['@0.3.0'].select({
  range: `Tiny-RPG!A:H`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'episode': `${last_episode}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
});

new_episode = new_episode.rows[0].fields.choix1_next;

let result = await lib.googlesheets.query['@0.3.0'].select({
  range: `Tiny-RPG!A:H`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'episode': `${new_episode}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
});

let url = result.rows[0].fields.url;
let message = result.rows[0].fields.message;
let choix_nombre = result.rows[0].fields.choix_nombre;
const slice_limit = 1900;

//Check and split long messages
    let index = 0;
    let trimmedString;
    let division;
    
    for (let i = 0; i < 7; i++) {
        division = Math.floor(message.length/slice_limit);
        if (division > 0) {
            //trim the string to the maximum length
            trimmedString = message.substr(0,slice_limit);

            //re-trim if we are in the middle of a word
            trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

            await lib.discord.channels['@0.3.0'].messages.create({
              "channel_id": `${context.params.event.channel_id}`,
              "content": `${trimmedString}`,
              "tts": false
            });
            index = trimmedString.length;
            message = message.substr(index);
            division = Math.floor(message.length/slice_limit);
        } 
    }
///////

await lib.googlesheets.query['@0.3.0'].update({
    range: `Tiny-RPG!J:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'gamemaster': `${context.params.event.user.id}`
      }
    ],
    fields: {
        'active_episode': `${new_episode}`
    },
});

if (choix_nombre == 1) {
    let choix1 = result.rows[0].fields.choix1;
    
    await lib.discord.channels['@0.3.0'].messages.create({
      "channel_id": `${context.params.event.channel_id}`,
      "content": `${message} \n${url} \n[#${new_episode}]`,
      "tts": false,
      "components": [
        {
          "type": 1,
          "components": [
            {
              "style": 1,
              "label": `${choix1}`,
              "custom_id": `tinyrpg_choix1`,
              "disabled": false,
              "type": 2
            }
          ]
        }
      ]
    });
}
else {
  let choix1 = result.rows[0].fields.choix1;
  let choix2 = result.rows[0].fields.choix2;
  await lib.discord.channels['@0.3.0'].messages.create({
    "channel_id": `${context.params.event.channel_id}`,
    "content": `${message} \n${url} \n[#${new_episode}]`,
    "tts": false,
    "components": [
      {
        "type": 1,
        "components": [
          {
            "style": 1,
            "label": `${choix1}`,
            "custom_id": `tinyrpg_choix1`,
            "disabled": false,
            "type": 2
          },
          {
            "style": 1,
            "label": `${choix2}`,
            "custom_id": `tinyrpg_choix2`,
            "disabled": false,
            "type": 2
          }
        ]
      }
    ]
  });
}
