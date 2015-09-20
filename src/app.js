// entry 

var Framework7 = require('./libs/framework7')
    , $$ = require('./libs/dom7')
    , coreData = require('./libs/coredata')
    , queryString = require('query-string')

// available controllers
var _controllers = require('./controllers/index') 

// initialize
var App = new Framework7({
    onPageInit : function(app, page){
        if(page.name === 'index') {
            setTimeout(function(){
                mainView.router.load({ 
                    pageName : 'userentry',
                    query : queryString.parse(location.search)
                })
            }, 444)
        }
        // check controllers
        if( _controllers.hasOwnProperty( page.name ) ) {
            _controllers[ page.name ].call(null, page)
        }
    }
})

// add main view
var mainView = App.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    domCache : true,
    dynamicNavbar: true
})

// store necessary reference into core data
coreData.App = App
coreData.mainView = mainView

// event hook
App.onPageInit('userentry', function (page) {
    //$$(page.container).find('.page-content').html( userentryHtml )
})
