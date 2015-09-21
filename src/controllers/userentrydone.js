// handle user entry page
// cached page

var coreData = require('../libs/coredata')
    , avalon = require('../libs/avalon')
    , $$ = require('../libs/dom7')
    , T7 = require('../libs/template7')

var _compiledContent = null
// exports
module.exports = function(page) {
    var $container = $$(page.container)
        , $content =  $container.find('.page-content') 

    if( !_compiledContent ) {
        _compiledContent = T7.compile( $content.html() )
    }

    $content.html( _compiledContent({
                query : JSON.stringify( page.query )
    }) )
}
