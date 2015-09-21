// handle user entry page
// cached page

var coreData = require('../libs/coredata')
    , userentryHtml = require('html?minimize=false!../pages/userentry.html')
    , $$ = require('../libs/dom7')
    , avalon = require('../libs/avalon')
    , api = require('../api')
    , cities = require('../libs/city')
    , webUploader = require('../libs/webuploader')
    , traverse = require('traverse')
// colleges store
var _colleges = null

// get prefix
var _upPrefixes = {
    'test-hoolay' : 'http://test-hoolay.b0.upaiyun.com',
    'hoolay-pictrues' : 'http://pic.hoolay.cn'
}

// define user vmodel
var vmodel = avalon.define({
        $id : 'vmUserentry',
        data : {
            name : 'Charlie',
            gender : '',
            avatar : '',  
            location : '信阳',
            college_id: 3,
            phone : '',
            email : '',
            password : ''
        },
        submitHandler : function(e){
            // validate data
            if( true == traverse(vmodel.data.$model).reduce(function( acc, n){
                this.isLeaf && acc.push(n)
                return acc
            }, []).some(function(n){
                return !n
            }) ) {
                coreData.App.alert('Oops，请检查信息是否完善') 
                return
            }
            // entry done page
            coreData.mainView.router.load({
                url : 'pages/userentrydone.html',
                query : avalon.mix({}, vmodel.data.$model)
            })
        },
        collegesSelectHandler : function(e) {
            vmodel.data.college_id = $$(this).val()
        },
        locationSelectHandler : function() {
            vmodel.data.location = $$(this).val()
        },
        smartAvatar : function(){
            if( !!vmodel.data.avatar ) {
                return vmodel.data.avatar + '!200x200?v=' + (new Date).getTime()
            } else {
                return 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='
            }
        }
})

// export 
module.exports.pageBeforeInit = function(page){
    // append page 
    var $content = $$(page.container).find('.page-content') 
        $content.html( userentryHtml )    
    
}

module.exports.pageAfterInit = function(page) {
    var $collegesSelect = $$(page.container).find('select[name=colleges]')
        , $locationSelect = $$(page.container).find('select[name=location]')
    // load colleges
    api.getAllColleges(null, function(res){
        if( res ) {
            // append to select
            res.forEach(function(n){
                coreData.App
                        .smartSelectAddOption( 
                            $collegesSelect, 
                            //'<option value="">未设置</option>' + 
                            '<option value="' + n.id+ '">' + n.name + '</option>' 
                        ) 
            })
        }
    })    
    // load cities
    cities.forEach(function(n){
       coreData.App
       .smartSelectAddOption(
           $locationSelect,
           '<optgroup label="' + n.name + '">' + 
               ( n = n.cities.map(function(n){
                    return '<option value="' + n + '">' + n + '</option>' 
               }) , n.join('') ) +
           '</optgroup>'
       )
    })    
    // avatar uploader setup
    api.getBuckets(null, function(res){
        if ( !res ) {
            return false
        }
        // initialize uploader
        var uploader = webUploader.create({
            server: 'http://v0.api.upyun.com/' + res[0].bucket,
            pick: '#avatar_picker',
            resize: true,
            formData : res[0],
            auto : true,
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        })
       // events
       uploader.on('uploadSuccess', function(file, response) {
           if( response.code == '200') {
               vmodel.data.avatar = _upPrefixes[res[0].bucket] + response.url
           }
       })
       .on('startUpload', function(){
           coreData.App.showPreloader('上传中...')      
       })
       .on('uploadFinished', function(){
            coreData.App.hidePreloader()
       })
       .on('uploadError', function(file, reason){
           alert(reason)
       })
       
       // scan
       avalon.scan(page.container) 
    })    
}

