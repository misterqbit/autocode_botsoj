// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let search = context.params.event.data.options[0].value;
let keyword = search.toLowerCase();

let result = await lib.googlesheets.query['@0.3.0'].select({
      range: `episodes!A:J`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [
        {
        'themesminor__contains' : `${keyword}`
                  }
      ],
      limit: {
        'count': 0,
        'offset': 0
      },
});

if (result.rows[0] == null) {
      await lib.discord.channels['@0.0.6'].messages.create({
        channel_id: context.params.event.channel_id,
        content: `<@!${context.params.event.member.user.id}> : pas de résultat`
      });
} 
else {
    let recherche = [];
    for (let i = 0; i < result.rows.length; i++) {
            recherche.push(`\n${result.rows[i].fields.themes}`); 
            recherche.push(`Date: ${result.rows[i].fields.date}`);  
            //recherche.push(`Saison: ${result.rows[i].fields.saison}`);
            //recherche.push(`Ep.: ${result.rows[i].fields.episode}`);
    }   
    await lib.discord.channels['@0.0.6'].messages.create({
          channel_id: `${context.params.event.channel_id}`,
          content: [
          `<@!${context.params.event.member.user.id}> : vous trouverez ${keyword} dans:`,
          `${recherche}`,
          '___'
          ].join('\n')
    });
      
}
