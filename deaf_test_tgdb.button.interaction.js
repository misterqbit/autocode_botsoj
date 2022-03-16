// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

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

if (result.rows[0].fields.content != 0) {

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
          'content': 0
      }
    });
}
else {}
