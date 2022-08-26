// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let newName = context.params.event.name.toLowerCase();
console.log(newName);

//if a thread name is changed, then update the thread list google sheet
let result = await lib.googlesheets.query['@0.3.0'].update({
  range: `thread_list!A:D`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [
    {
      'thread_id__is': `${context.params.event.id}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  },
  fields: {
    'thread_name': `${context.params.event.name}`,
    'thread_name_search': `${newName}`
    
  }
});
