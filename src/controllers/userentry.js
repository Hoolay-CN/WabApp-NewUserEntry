// handle user entry page
// cached page

var coreData = require('../libs/coredata')
    , mainView = coreData.mainView
    , userentryHtml = require('html!../pages/userentry.html')
    , $$ = require('../libs/dom7')
    , avalon = require('../libs/avalon')

// define user vmodel
var vmodel = avalon.define({
        $id : 'vmUserentry',
        data : {
            name : 'Charlie',
            gender : 'male',
            location : 'HangZhou',
            colledge : '湖北美术学院',
            phone : '13673082905',
            email : 'xyhp915@qq.com'
        },
        submitHandler : function(e){
            coreData.App.showPreloader()
        }
})

// export function
module.exports = function(page){
    // append page 
    var $content = $$(page.container).find('.page-content') 
        $content.html( userentryHtml )    
    
    // scan 
    avalon.scan($content[0]) 
}
