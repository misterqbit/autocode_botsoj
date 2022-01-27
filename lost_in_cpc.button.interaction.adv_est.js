// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let result = await lib.googlesheets.query['@0.3.0'].select({
  range: `adventure!A:I`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'channel_id': `${context.params.event.channel_id}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
});
console.log(result.rows[0].fields.position);
if (result.rows.length == 0) {
}
else{
  if (result.rows[0].fields.gamemaster == context.params.event.member.user.id) {
    let position = (result.rows[0].fields.position).toString();
    let abs = position.substring(0,2);
    let ord = position.substring(2,4);
    let the_end = 0;
    
    //new game plus
    if (result.rows[0].fields.ngp != 0) {
      if (result.rows[0].fields.ngp == 2) {
        //special message with NEXT button going to USE breakpoint
        //in USE breakpoint, display FEZ GLASSES GIF as starting image. With TAKE and USE Buttons. Contextual menu?
        //Make a path to resolve the lutin image
        //End image: Neo removing the plug... La mort se rapproche à chaque seconde, ces heures de vie se sont envolées. Je ne dois plus répondre à l'appel du jeu. Déconnexion!
      }
      else if (result.rows[0].fields.ngp == 1) {
        //ngp = 2
      }
      else {}
    }
    //normal game
    else {
      //Aller vers l'est
      let xi = (parseInt(abs) + 1);

      let move = await lib.googlesheets.query['@0.3.0'].select({
        range: `adventure!AA:BI`,
        bounds: 'FIRST_EMPTY_ROW',
        where: [
          {
            'y': `${ord}`
          }
        ],
        limit: {
          'count': 0,
          'offset': 0
        },
      });
      if ((move.rows[0].fields[xi]).includes("e")) {
        let new_position = (parseInt(position)+200).toString();

  //SCORING
        if (new_position == "3654" || new_position == "4256" || new_position == "4644" || new_position == "5062" || new_position == "5654") {
          let score = await lib.googlesheets.query['@0.3.0'].select({
            range: `adventure!A:H`,
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
          });
          let scoreupdate = [];
          if (new_position == "3654") {
            scoreupdate[0] = parseInt(3654);
            scoreupdate[1] = parseInt(score.rows[0].fields.botw);
            scoreupdate[2] = parseInt(score.rows[0].fields.xcx);
            scoreupdate[3] = parseInt(score.rows[0].fields.ds);
            scoreupdate[4] = parseInt(score.rows[0].fields.tess);
          }
          else if (new_position == "4256") {
            scoreupdate[0] = parseInt(score.rows[0].fields.aco);
            scoreupdate[1] = parseInt(4256);
            scoreupdate[2] = parseInt(score.rows[0].fields.xcx);
            scoreupdate[3] = parseInt(score.rows[0].fields.ds);
            scoreupdate[4] = parseInt(score.rows[0].fields.tess);
            }
          else if (new_position == "4644") {
            scoreupdate[0] = parseInt(score.rows[0].fields.aco);
            scoreupdate[1] = parseInt(score.rows[0].fields.botw);
            scoreupdate[2] = parseInt(4644);
            scoreupdate[3] = parseInt(score.rows[0].fields.ds);
            scoreupdate[4] = parseInt(score.rows[0].fields.tess);
            }
          else if (new_position == "5062") {
            scoreupdate[0] = parseInt(score.rows[0].fields.aco);
            scoreupdate[1] = parseInt(score.rows[0].fields.botw);
            scoreupdate[2] = parseInt(score.rows[0].fields.xcx);
            scoreupdate[3] = parseInt(5062);
            scoreupdate[4] = parseInt(score.rows[0].fields.tess); 
          }
          else if (new_position == "5654") {
            scoreupdate[0] = parseInt(score.rows[0].fields.aco);
            scoreupdate[1] = parseInt(score.rows[0].fields.botw);
            scoreupdate[2] = parseInt(score.rows[0].fields.xcx);
            scoreupdate[3] = parseInt(score.rows[0].fields.ds);
            scoreupdate[4] = parseInt(5654);
            }
          else {
            scoreupdate[0] = parseInt(score.rows[0].fields.aco);
            scoreupdate[1] = parseInt(score.rows[0].fields.botw);
            scoreupdate[2] = parseInt(score.rows[0].fields.xcx);
            scoreupdate[3] = parseInt(score.rows[0].fields.ds);
            scoreupdate[4] = parseInt(score.rows[0].fields.tess);
          }
          await lib.googlesheets.query['@0.3.0'].update({
            range: `adventure!A:H`,
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
              'aco': scoreupdate[0],
              'botw': scoreupdate[1],
              'xcx': scoreupdate[2],
              'ds': scoreupdate[3],
              'tess': scoreupdate[4]
            }
          });
          let progress = parseInt(((scoreupdate[0]+scoreupdate[1]+scoreupdate[2]+scoreupdate[3]+scoreupdate[4])*100)/23270);
          console.log(progress);
          if (progress == 100) {
            await lib.discord.channels['@0.0.6'].messages.create({
              channel_id: `${context.params.event.channel_id}`,
              content: [
                `<@${context.params.event.member.user.id}> : Votre progression est de : ${progress}%.`,
                `Vous avez trouvé tous les secrets de ce voyage dans les univers de SRAM, Pharaon, La Secte Noire, La Chose de Grotemburg et le Passager du Temps!`
              ].join('\n'),
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
            the_end = 1;
          }
          else {
            await lib.discord.channels['@0.0.6'].messages.create({
              channel_id: `${context.params.event.channel_id}`,
              content: [
              `<@${context.params.event.member.user.id}> : Bravo pour cette découverte!`,
              `Votre progression est de : ${progress}%.`
              ].join('\n')
            });
          }
        }


        //Get URL of new image
        let image_ref = await lib.googlesheets.query['@0.3.0'].select({
          range: `adventure!T:U`,
          bounds: 'FIRST_EMPTY_ROW',
          where: [
            {
              'image': `${new_position}`
            }
          ],
          limit: {
            'count': 0,
            'offset': 0
          },
        });


        await lib.discord.channels['@0.2.0'].messages.create({
          "channel_id": `${context.params.event.channel_id}`,
          "content": `>EST:`,
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
                "url": `${image_ref.rows[0].fields.url}`,
                "height": 0,
                "width": 400
              }
            }
          ]
        });
        if (the_end == 1) {
          new_position = 5030;
        }
        else {
        }
        await lib.googlesheets.query['@0.3.0'].update({
            range: `adventure!A:C`,
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
                'position': `${new_position}`
            }
          });
      }
      else {
        await lib.discord.channels['@0.0.6'].messages.create({
          channel_id: context.params.event.channel_id,
          content: `>EST : Vous ne pouvez pas aller vers l'Est.`
        });
      }
    }
  }
}
