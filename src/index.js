import RestModel from './rest-model';

RestModel.baseUrl = 'http://gash.lan';

RestModel.register('pages', (factory) => {
    return factory.collectable('pages')
        .nest('pages')
        .nest('page-urls');
});

RestModel.register('page-urls', (factory) => {
    return factory.collectable('page-urls');
});

let pages = RestModel.resolve('pages');

// sections.scope(1).resolve('pages').query().get().then(collection => {
//     console.log(collection);
//
//     // collection[0].hideInNav = 1;
//     // collection[0].$save();
// });

// pages.query().include('pages').where('pages', 4).select('pages.id', 'pages.title').sort('pages.id', 'desc').get().then(collection => {
//     console.log(collection);
// });

pages.query().include('pages', 'page-urls')
    .select('id', 'title', 'page-urls.id')
    .limit(1)
    .limit('page-urls', 4)
    .offset(1)
    .sort('id')
    .sort('page-urls.id', 'desc')
    .get().then(collection => {
        console.log(collection);
    });