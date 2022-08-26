// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

//if a thread name is changed, then update the thread list google sheet
let result = await lib.googlesheets.query['@0.3.0'].update({
  range: `thread_list!F:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'channel_id__is': `${context.params.event.id}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
  fields: {
    'channel_name': `${context.params.event.name}`
    
  }
});
