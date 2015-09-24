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
    , $ = require('../libs/jquery')

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
            name : '',
            gender : '',
            avatar : '',  
            location : '',
            college_id: 0,
            phone : '',
            email : '',
            password : '',
            code : ''
        },
        submitHandler : function(e){
            var data = avalon.mix({}, vmodel.data.$model)
            delete data['avatar']
            // validate data
            if( true === traverse(data).reduce(function( acc, n){
                this.isLeaf && acc.push(n)
                return acc
            }, []).some(function(n){
                return !n
            }) ) {
                coreData.App.alert('Oops，请检查信息是否完善') 
                return
            }
            // save state
            coreData.App.showPreloader('处理中...')
            api.codeCompletion( vmodel.data.$model, function(res){
                if(res) {
                    // entry done page
                    //coreData.mainView.router.load({
                    //    url : 'pages/userentrydone.html',
                    //   query : avalon.mix({}, vmodel.data.$model)
                    //})
                    if( $(document.documentElement).hasClass('ios') ) {
                        // navigate to itunes
                        window.location.href = 'https://itunes.apple.com/cn/app/hu-lai-wang-yi-shu-jia-ban/id966069685'
                    } else {
                        // notice user login 
                        coreData.App.alert('账号设置完成，马上登录胡来网（www.hoolay.cn）管理您的作品。')
                    }
                }
            }, function(err){
                if( err.message ) {
                    if( typeof err.message == 'string' ) {
                        coreData.App.alert( err.message )
                    } else if( $.isPlainObject( err.message ) ) {
                        traverse(err.message).forEach(function(n){
                            if( this.isRoot )
                                return
                            coreData.App.alert(n)
                        })
                    }

                    return
                }

                coreData.App.alert('保存失败，请稍后再试试吧')
            } ).always(function(){
                coreData.App.hidePreloader()
            }) 
        },
        collegesSelectHandler : function(e) {
            vmodel.data.college_id = $$(this).val()
        },
        locationSelectHandler : function() {
            vmodel.data.location = $$(this).val()
        },
        smartGender : function(){
            return vmodel.data.gender == 'f' ? '女' : (
                   vmodel.data.gender == 'm' ? '男' : '未设置'
            )
        },
        smartAvatar : function(){
            if( !!vmodel.data.avatar ) {
                return vmodel.data.avatar + '!200x200?v=' + (new Date).getTime()
            } else {
                return 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA='
            }
        }
})

// watcher
vmodel.data.$watch('code', function(a, b){
    // validate code
    coreData.App.showPreloader('验证中...')
    api.codeConfirmation({
            code : a
    }, function(res){
        if( res && (res = res.user)) {
            traverse(vmodel.data.$model).forEach(function(){
                if ( this.isRoot ) 
                    return;
                if (res.hasOwnProperty( this.key )) {
                        vmodel.data[this.key] = res[this.key]
                }
            }) 
            //avalon.mix( vmodel.data, res )
        }
    }, function(err){
        if( err && typeof err.message == 'string' ) {
            coreData.App.alert( err.message )
        }
    }).always(function(){
        coreData.App.hidePreloader()
    })
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
               vmodel.data.avatar = res[0].prefix + response.url
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
      
        // detect select avatar 
        var _avatarTouchCount = 1 
        $('#avatar_picker').on('click', function(e){
            if( e.target && e.target.nodeName.toLowerCase() === 'label' ) {
                ++_avatarTouchCount 
            }

            // notice user may be can not select avatar
            if( _avatarTouchCount >= 4 ) {
                coreData.App.alert('是不是上传头像遇到问题，您可以尝试在浏览器中打开或者暂时不设置头像，完成基本设置后，可以下载【胡来伙伴APP】，获得更好的体验:)')
            }
        })

       // scan
       avalon.scan(page.container) 

       // auth code
       if(!page.query.code) {
           coreData.App.alert('非法验证')
       } else {
           vmodel.data.code = page.query.code
       }
    })    
}

