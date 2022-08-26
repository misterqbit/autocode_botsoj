// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.3.0'].threads.update({
  thread_id: `${context.params.event.id}`,
  auto_archive_duration: 10080
});

let threadname_lowercase = context.params.event.name.toLowerCase();

await lib.googlesheets.query['@0.3.0'].insert({
  range: `thread_list!A:D`,
  fieldsets: [
    {
      'thread_name': `${context.params.event.name}`,
      'thread_name_search': `${threadname_lowercase}`,
      'thread_id': `${context.params.event.id}`,
      'channel_id': `${context.params.event.parent_id}`
      
    }
  ]
});
