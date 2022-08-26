// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// console.log(context.params.event);
// console.log(context.params.event.data.options[0].options[0]);

if (context.params.event.data.options[0].name == "tiny-rpg") {

  let episode;

  if (context.params.event.data.options[0].options[0] == null) {
    episode = 99;
  }
  else {
    episode = context.params.event.data.options[0].options[0].value;
  }

  ////////// Save New Game or Old Game
  let existing_player = await lib.googlesheets.query['@0.3.0'].select({
    range: `Tiny-RPG!J:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'gamemaster': `${context.params.event.member.user.id}`
      }
    ],
    limit: {
      'count': 0,
      'offset': 0
    }
  });
  if (existing_player.rows.length == 0) {
    await lib.googlesheets.query['@0.3.0'].insert({
      range: `Tiny-RPG!J:K`,
      fieldsets: [{
          'active_episode': `${episode}`,
          'gamemaster': `${context.params.event.member.user.id}`
      }],
    });
  }
  else {
    await lib.googlesheets.query['@0.3.0'].update({
        range: `Tiny-RPG!J:K`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'gamemaster': `${context.params.event.member.user.id}`
          }
        ],
        fields: {
            'active_episode': `${episode}`
        },
    });
  }
  //////////

  let result = await lib.googlesheets.query['@0.3.0'].select({
    range: `Tiny-RPG!A:H`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'episode': `${episode}`
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

              /*await lib.discord.channels['@0.3.0'].messages.create({
                "channel_id": `${context.params.event.channel_id}`,
                "content": `${trimmedString}`,
                "tts": false
              });*/
              await lib.discord.users['@0.2.0'].dms.create({
                recipient_id: `${context.params.event.member.user.id}`,
                content: `${trimmedString}`
              });
              index = trimmedString.length;
              message = message.substr(index);
              division = Math.floor(message.length/slice_limit);
          } 
      }
  ///////

  if (choix_nombre == 1) {
      let choix1 = result.rows[0].fields.choix1;

  /*    await lib.discord.channels['@0.3.0'].messages.create({
        "channel_id": `${context.params.event.channel_id}`,
        "content": `${message} \n${url} [#${episode}]`,
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
      });*/
      await lib.discord.users['@0.2.0'].dms.create({
        recipient_id: `${context.params.event.member.user.id}`,
        content: `${message} \n${url} \n[#${episode}]`,
        components: [
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

  /*  await lib.discord.channels['@0.3.0'].messages.create({
      "channel_id": `${context.params.event.channel_id}`,
      "content": `${message} \n${url} [#${episode}]`,
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
    });*/
    await lib.discord.users['@0.2.0'].dms.create({
      recipient_id: `${context.params.event.member.user.id}`,
      content: `${message} \n${url} \n[#${episode}]`,
      components: [
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
  let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: "919246510238076988",
    content: 
    `Soj_Story/Tiny RPG lancé par ${context.params.event.member.user.username}`
  });
}

else if (context.params.event.data.options[0].name == "lost-in-cpc") {
  /*await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,*/
    await lib.discord.users['@0.2.0'].dms.create({
        recipient_id: `${context.params.event.member.user.id}`,
        content: `https://i.ibb.co/b2WC5D4/thend.gif`,
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
  
  await lib.discord.users['@0.2.0'].dms.create({
    recipient_id: `${context.params.event.member.user.id}`,
    content: `The End! \nBravo! Vous avez trouvé tous les secrets de ce voyage dans les univers de SRAM, mais aussi ceux de... \nStop! La fin? Quelle fin? M'enfin! Je ne veux pas qu'on me l'offre cette fin! Je veux explorer, résoudre des énigmes, éviter les pièges, améliorer mes compétences, je veux la mériter, cette fin! Cachez cette fin que je ne saurais voir! Et démarrons cette aventure!! \nùCPM`
  });
  
  
/*  await lib.discord.interactions['@0.0.0'].followups.ephemeral.create({
    token: `${context.params.event.token}`,
    content: `Bravo! Vous avez trouvé tous les secrets de ce voyage dans les univers de SRAM, mais aussi de........ La fin? Quelle fin? M'enfin! Je veux la trouver cette fin! Je veux explorer, résoudre des énigmes, éviter les pièges, améliorer mes compétences, je veux la mériter, cette fin! Cachez cette fin que je ne saurais voir! Et démarrons cette aventure!!`,
  });*/
  
  await lib.discord.users['@0.2.0'].dms.create({
    recipient_id: `${context.params.event.member.user.id}`,
    content: `>DEPART:`,
    components: [
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
  
  
  /*
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
  });*/
  
  //set in google sheet the position to Start for this channel id
  let result = await lib.googlesheets.query['@0.3.0'].select({
    range: `adventure!A:C`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [
      {
        'gamemaster': `${context.params.event.member.user.id}`,
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
          'gamemaster': `${context.params.event.member.user.id}`,
        }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
      fields: {
          'position': `5050`,
          'aco': 0,
          'botw': 0,
          'xcx': 0,
          'ds': 0,
          'tess': 0,
          'ngp': 0
      }
    });
  }
  let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: "919246510238076988",
    content: 
    `Soj_Story/Lost in CPC lancé par ${context.params.event.member.user.username}`
  });
  
}
else {}
