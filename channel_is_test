// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.googlesheets.query['@0.3.0'].insert({
  range: `thread_list!F:G`,
  fieldsets: [
    {
      'channel_name': `${context.params.event.name}`,
      'channel_id': `${context.params.event.id}`
    }
  ]
});
