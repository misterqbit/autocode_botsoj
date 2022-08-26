// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});


//if a thread is deleted, then update the thread list
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
    'thread_name_search': "borrado"
    
  }
});

/*let result = await lib.googlesheets.query['@0.3.0'].delete({
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
  }
});*/
