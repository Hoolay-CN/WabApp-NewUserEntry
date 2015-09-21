// entry 

var Framework7 = require('./libs/framework7')
    , $$ = require('./libs/dom7')
    , coreData = require('./libs/coredata')
    , $ = require('./libs/jquery')
    , queryString = require('query-string')

// available controllers
var _controllers = require('./controllers/index') 

// initialize
var App = new Framework7({
    modalTitle : '胡来网',
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
        var fn = null

        if( _controllers.hasOwnProperty( page.name ) ) {
            fn = _controllers[ page.name ]

            $.isPlainObject(fn) 
                && fn.hasOwnProperty('pageAfterInit')
                && fn.pageAfterInit.call( App, page )
        }

    },
    onPageBeforeInit : function(app, page) {
        var fn = null
        // check controllers
        if( _controllers.hasOwnProperty( page.name ) ) {
            fn = _controllers[ page.name ]

            $.isFunction(fn) && fn.call( App, page )
            $.isPlainObject(fn) 
                && fn.hasOwnProperty('pageBeforeInit')
                && fn.pageBeforeInit.call( App, page )
        }
    },
    onAjaxStart : function() {}
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

