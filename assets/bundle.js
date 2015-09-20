/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// entry 

	var Framework7 = __webpack_require__(1)
	    , $$ = __webpack_require__(2)
	    , coreData = __webpack_require__(3)
	    , queryString = __webpack_require__(5)

	// available controllers
	var _controllers = __webpack_require__(4) 

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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// framework7 commonjs module
	// global framework7
	module.exports = Framework7


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// dom7 utils commonjs module
	module.exports = Dom7


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// store global shared data
	module.exports = {}


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// indexes controllers

	var controllers = {}

	controllers.userentry = __webpack_require__(6)



	// exports
	module.exports = controllers


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strictUriEncode = __webpack_require__(8);

	exports.extract = function (str) {
		return str.split('?')[1] || '';
	};

	exports.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#|&)/, '');

		if (!str) {
			return {};
		}

		return str.split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			var key = parts[0];
			var val = parts[1];

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	exports.stringify = function (obj) {
		return obj ? Object.keys(obj).sort().map(function (key) {
			var val = obj[key];

			if (Array.isArray(val)) {
				return val.sort().map(function (val2) {
					return strictUriEncode(key) + '=' + strictUriEncode(val2);
				}).join('&');
			}

			return strictUriEncode(key) + '=' + strictUriEncode(val);
		}).filter(function (x) {
			return x.length > 0;
		}).join('&') : '';
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// handle user entry page
	// cached page

	var coreData = __webpack_require__(3)
	    , mainView = coreData.mainView
	    , userentryHtml = __webpack_require__(9)
	    , $$ = __webpack_require__(2)
	    , avalon = __webpack_require__(10)

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


/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div ms-controller=\"vmUserentry\">\n<div class=\"list-block user-entry-list-block-a\">\n  <ul class=\"user-entry-lists\">\n    <li class=\"item-content avatar-item\">\n      <div class=\"item-inner\">\n        <div class=\"item-title\">头像</div>\n        <div class=\"item-after\">Label</div>\n      </div>\n    </li>\n    <li>\n      <div class=\"item-content\">\n        <div class=\"item-inner\">\n          <div class=\"item-title label\">真实姓名</div>\n          <div class=\"item-input\">\n              <input type=\"text\" ms-attr-value=\"{{data.name}}\" required />\n          </div>\n        </div>\n      </div>  \n    </li>\n    <li class=\"item-content\">\n      <div class=\"item-inner\">\n        <div class=\"item-title\">性别</div>\n        <div class=\"item-after\">{{data.gender}}</div>\n      </div>\n    </li>\n     <li>\n      <a class=\"item-link item-content\" href=\"#\">\n          <div class=\"item-inner\">\n            <div class=\"item-title\">所在地</div>\n            <div class=\"item-after\">{{data.location}}</div>\n          </div>\n      </a>\n    </li>\n     <li>\n      <a class=\"item-link item-content\" href=\"#\">\n          <div class=\"item-inner\">\n            <div class=\"item-title\">毕业院校</div>\n            <div class=\"item-after\">{{data.colledge}}</div>\n          </div>\n      </a>\n    </li>\n</ul>\n</div>\n<div class=\"list-block user-entry-list-block-b\">\n    <ul>\n        <li>\n          <div class=\"item-content\">\n            <div class=\"item-inner\">\n              <div class=\"item-title label\">手机号</div>\n              <div class=\"item-input\">\n                  <input type=\"text\" pattern=\"\\d*\" ms-attr-value=\"{{data.phone}}\" required />\n              </div>\n            </div>\n          </div>  \n        </li>\n        <li>\n          <div class=\"item-content\">\n            <div class=\"item-inner\">\n              <div class=\"item-title label\">邮箱</div>\n              <div class=\"item-input\">\n                  <input type=\"email\" ms-attr-value=\"{{data.email}}\" required />\n              </div>\n            </div>\n          </div>  \n        </li>\n        <li>\n          <div class=\"item-content\">\n            <div class=\"item-inner\">\n              <div class=\"item-title label\">密码</div>\n              <div class=\"item-input\">\n                  <input type=\"password\" value=\"\" required /> \n              </div>\n            </div>\n          </div>  \n        </li>\n    </ul>\n</div>\n\n<div class=\"content-block\" style=\"margin-top:0px;\">\n    <a href=\"javascript:;\" class=\"button button-big button-fill\" ms-click=\"submitHandler\"> \n        完成\n    </a>\n</div>\n</div>\n";

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// avalon exports
	module.exports = avalon


/***/ }
/******/ ]);