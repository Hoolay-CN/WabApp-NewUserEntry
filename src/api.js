// api module 
var $ = require('./libs/jquery')

var base = null 

// @todo do not depend location 
var matcher = /^(www|stage-h2).+$/
if( matcher = location.host.match(matcher) ){
    base = 'http://' + matcher[1] + '.hoolay.cn' 
} else {
    base = 'http://h2.hoolay.cc'
}

var defualts = { 
     // entry : [ url , method, isRemote ] 
     getAllColleges : [ '/api/user/default_colleges', 'get' ],
     getBuckets : [ '/api/pictures/buckets', 'get' ]
}

//bind url variables
function bindParams( url, params ){
    if( $.isPlainObject(params) && !$.isEmptyObject( params ) ){
        $.each(params, function(k,v){
            url = url.replace(':' + k, v)
        })
    }
    return url
}
//transport
function _transport( _url, method, _data ){

    return function(data, resultOk, resultFailed, options){
        var url = _url
        var callee = arguments.callee

        if( $.isFunction(data) ){
            resultOk = data
            data = []
        }

        if( callee.hasOwnProperty('_bindParams') ){
            url = bindParams( _url, callee._bindParams )
            delete callee._bindParams
        }

        // if( method  !== 'get' ){
        //     data = JSON.stringify( $.isArray(data) ? data : $.extend({}, _data, data) )
        // }

        //return Promise Object
        return $.ajax( $.extend({
            dataType : 'json',
            url : /^http/.test(url) ? url : (base + url),
            data : data,
            type : method || 'get',
            beforeSend : function(xhr, settings){
                // set Authorization token
                // var token = Token.get()
                // if( !!token ){
                //     xhr.setRequestHeader('Authorization', token)
                // }

                if( $.isFunction(settings._beforeSend) ){
                    return settings._beforeSend.apply( this, [xhr, settings] )
                }
            },
            statusCode : {
                400 : function(xhr){
                    var res
                    try{
                        res = xhr.responseJSON
                        res.error = 400
                        $.isFunction(resultFailed) && resultFailed.call(null, res)
                    }catch(e){}
                },
                401 : function(xhr){
                    var res = { message:'Unauthorized' }
                    try{
                        res.error = 401
                        $.isFunction(resultFailed) && resultFailed.call(null, res)
                    }catch(e){}
                },
                500 : function(){
                    alert('服务器开小差了..')
                },
                404 : function(){
                    alert('访问资源不存在..')
                }
            },
            success : function(res){
                if(res && !!res.error){
                    $.isFunction(resultFailed) && resultFailed.call(null, res)
                }else{
                    //all be success
                    $.isFunction(resultOk) && resultOk.call(null, res)
                }
            }
        }, options || {}) )
        //end
    }
}

//add new api
function _add( config ){
    if( $.isPlainObject( config ) && !$.isEmptyObject( config ) ){
        $.each( config, function(k, v){
            exports[ k ] = _transport.apply( null, v )
        } )
    }else{
        $.error( 'error api config' )
    }
}

//add defualts
_add(defualts)

module.exports.baseUri = base
module.exports._addRoutes = _add
