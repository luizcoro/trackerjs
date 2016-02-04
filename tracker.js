/*
			* trackerJS 0.1.0 - Fast tracker library
			* https://github.com/luizcoro/trackerjs
			* Copyright (c) 2015 Luiz Fernando Afra Brito (luizfernandoafrabrito@hotmail.com)
			* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
			*
			* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
			* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
			* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
			* ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
			* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
			* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
			* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
			* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
			* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
			* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
			*/

(function(){
	tracker = function(config){
		for(property in config){
			var p = property;

			if(_private._variables.config.hasOwnProperty(p)){
				if(typeof config[p] === "boolean"){
					if(typeof _private._variables.config[p] === "object"){
						for(p2 in _private._variables.config[p]){
							_private._variables.config[p][p2] = config[p];
						}
					}
					else {
						_private._variables.config[p] = config[p];
					}
				}
				else{
					for(sub_property in config[p]){
						var p2 = sub_property;
						if(_private._variables.config[p].hasOwnProperty(p2)){
							_private._variables.config[p][p2] = config[p][p2]
						}
					}
				}
			}
		}
	};

	var _private = {
		_thirds : {
			browser_detect : {
			    init: function () {
			        this.browser = this.searchString(this.dataBrowser) || "Other";
			        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
			    },
			    searchString: function (data) {
			        for (var i = 0; i < data.length; i++) {
			            var dataString = data[i].string;
			            this.versionSearchString = data[i].subString;

			            if (dataString.indexOf(data[i].subString) !== -1) {
			                return data[i].identity;
			            }
			        }
			    },
			    searchVersion: function (dataString) {
			        var index = dataString.indexOf(this.versionSearchString);
			        if (index === -1) {
			            return;
			        }

			        var rv = dataString.indexOf("rv:");
			        if (this.versionSearchString === "Trident" && rv !== -1) {
			            return parseFloat(dataString.substring(rv + 3));
			        } else {
			            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
			        }
			    },

			    dataBrowser: [
			        {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
			        {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
			        {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
			        {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
			        {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
			        {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
			    ]

			},

			/*
			* fingerprintJS 0.5.4 - Fast browser fingerprint library
			* https://github.com/Valve/fingerprintjs
			* Copyright (c) 2013 Valentin Vasilyev (valentin.vasilyev@outlook.com)
			* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
			*
			* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
			* AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
			* IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
			* ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
			* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
			* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
			* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
			* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
			* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
			* THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
			*/

			fingerprint :  (function (name, context, definition) {
				  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
				  else if (typeof define === 'function' && define.amd) { define(definition); }
				  else { context[name] = definition(); }
				})('Fingerprint', this, function () {
				  'use strict';

				  var Fingerprint = function (options) {
				    var nativeForEach, nativeMap;
				    nativeForEach = Array.prototype.forEach;
				    nativeMap = Array.prototype.map;

				    this.each = function (obj, iterator, context) {
				      if (obj === null) {
				        return;
				      }
				      if (nativeForEach && obj.forEach === nativeForEach) {
				        obj.forEach(iterator, context);
				      } else if (obj.length === +obj.length) {
				        for (var i = 0, l = obj.length; i < l; i++) {
				          if (iterator.call(context, obj[i], i, obj) === {}) return;
				        }
				      } else {
				        for (var key in obj) {
				          if (obj.hasOwnProperty(key)) {
				            if (iterator.call(context, obj[key], key, obj) === {}) return;
				          }
				        }
				      }
				    };

				    this.map = function(obj, iterator, context) {
				      var results = [];
				      // Not using strict equality so that this acts as a
				      // shortcut to checking for `null` and `undefined`.
				      if (obj == null) return results;
				      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
				      this.each(obj, function(value, index, list) {
				        results[results.length] = iterator.call(context, value, index, list);
				      });
				      return results;
				    };

				    if (typeof options == 'object'){
				      this.hasher = options.hasher;
				      this.screen_resolution = options.screen_resolution;
				      this.screen_orientation = options.screen_orientation;
				      this.canvas = options.canvas;
				      this.ie_activex = options.ie_activex;
				    } else if(typeof options == 'function'){
				      this.hasher = options;
				    }
				  };

				  Fingerprint.prototype = {
				    get: function(){
				      var keys = [];
				      keys.push(navigator.userAgent);
				      keys.push(navigator.language);
				      keys.push(screen.colorDepth);
				      if (this.screen_resolution) {
				        var resolution = this.getScreenResolution();
				        if (typeof resolution !== 'undefined'){ // headless browsers, such as phantomjs
				          keys.push(this.getScreenResolution().join('x'));
				        }
				      }
				      keys.push(new Date().getTimezoneOffset());
				      keys.push(this.hasSessionStorage());
				      keys.push(this.hasLocalStorage());
				      keys.push(!!window.indexedDB);
				      //body might not be defined at this point or removed programmatically
				      if(document.body){
				        keys.push(typeof(document.body.addBehavior));
				      } else {
				        keys.push(typeof undefined);
				      }
				      keys.push(typeof(window.openDatabase));
				      keys.push(navigator.cpuClass);
				      keys.push(navigator.platform);
				      keys.push(navigator.doNotTrack);
				      keys.push(this.getPluginsString());
				      if(this.canvas && this.isCanvasSupported()){
				        keys.push(this.getCanvasFingerprint());
				      }
				      if(this.hasher){
				        return this.hasher(keys.join('###'), 31);
				      } else {
				        return this.murmurhash3_32_gc(keys.join('###'), 31);
				      }
				    },

				    /**
				     * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
				     *
				     * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
				     * @see http://github.com/garycourt/murmurhash-js
				     * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
				     * @see http://sites.google.com/site/murmurhash/
				     *
				     * @param {string} key ASCII only
				     * @param {number} seed Positive integer only
				     * @return {number} 32-bit positive integer hash
				     */

				    murmurhash3_32_gc: function(key, seed) {
				      var remainder, bytes, h1, h1b, c1, c2, k1, i;

				      remainder = key.length & 3; // key.length % 4
				      bytes = key.length - remainder;
				      h1 = seed;
				      c1 = 0xcc9e2d51;
				      c2 = 0x1b873593;
				      i = 0;

				      while (i < bytes) {
				          k1 =
				            ((key.charCodeAt(i) & 0xff)) |
				            ((key.charCodeAt(++i) & 0xff) << 8) |
				            ((key.charCodeAt(++i) & 0xff) << 16) |
				            ((key.charCodeAt(++i) & 0xff) << 24);
				        ++i;

				        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
				        k1 = (k1 << 15) | (k1 >>> 17);
				        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

				        h1 ^= k1;
				            h1 = (h1 << 13) | (h1 >>> 19);
				        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
				        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
				      }

				      k1 = 0;

				      switch (remainder) {
				        case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
				        case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
				        case 1: k1 ^= (key.charCodeAt(i) & 0xff);

				        k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
				        k1 = (k1 << 15) | (k1 >>> 17);
				        k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
				        h1 ^= k1;
				      }

				      h1 ^= key.length;

				      h1 ^= h1 >>> 16;
				      h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
				      h1 ^= h1 >>> 13;
				      h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
				      h1 ^= h1 >>> 16;

				      return h1 >>> 0;
				    },

				    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
				    hasLocalStorage: function () {
				      try{
				        return !!window.localStorage;
				      } catch(e) {
				        return true; // SecurityError when referencing it means it exists
				      }
				    },

				    hasSessionStorage: function () {
				      try{
				        return !!window.sessionStorage;
				      } catch(e) {
				        return true; // SecurityError when referencing it means it exists
				      }
				    },

				    isCanvasSupported: function () {
				      var elem = document.createElement('canvas');
				      return !!(elem.getContext && elem.getContext('2d'));
				    },

				    isIE: function () {
				      if(navigator.appName === 'Microsoft Internet Explorer') {
				        return true;
				      } else if(navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)){// IE 11
				        return true;
				      }
				      return false;
				    },

				    getPluginsString: function () {
				      if(this.isIE() && this.ie_activex){
				        return this.getIEPluginsString();
				      } else {
				        return this.getRegularPluginsString();
				      }
				    },

				    getRegularPluginsString: function () {
				      return this.map(navigator.plugins, function (p) {
				        var mimeTypes = this.map(p, function(mt){
				          return [mt.type, mt.suffixes].join('~');
				        }).join(',');
				        return [p.name, p.description, mimeTypes].join('::');
				      }, this).join(';');
				    },

				    getIEPluginsString: function () {
				      if(window.ActiveXObject){
				        var names = ['ShockwaveFlash.ShockwaveFlash',//flash plugin
				          'AcroPDF.PDF', // Adobe PDF reader 7+
				          'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
				          'QuickTime.QuickTime', // QuickTime
				          // 5 versions of real players
				          'rmocx.RealPlayer G2 Control',
				          'rmocx.RealPlayer G2 Control.1',
				          'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)',
				          'RealVideo.RealVideo(tm) ActiveX Control (32-bit)',
				          'RealPlayer',
				          'SWCtl.SWCtl', // ShockWave player
				          'WMPlayer.OCX', // Windows media player
				          'AgControl.AgControl', // Silverlight
				          'Skype.Detection'];

				        // starting to detect plugins in IE
				        return this.map(names, function(name){
				          try{
				            new ActiveXObject(name);
				            return name;
				          } catch(e){
				            return null;
				          }
				        }).join(';');
				      } else {
				        return ""; // behavior prior version 0.5.0, not breaking backwards compat.
				      }
				    },

				    getScreenResolution: function () {
				      var resolution;
				       if(this.screen_orientation){
				         resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
				       }else{
				         resolution = [screen.height, screen.width];
				       }
				       return resolution;
				    },

				    getCanvasFingerprint: function () {
				      var canvas = document.createElement('canvas');
				      var ctx = canvas.getContext('2d');
				      // https://www.browserleaks.com/canvas#how-does-it-work
				      var txt = 'http://valve.github.io';
				      ctx.textBaseline = "top";
				      ctx.font = "14px 'Arial'";
				      ctx.textBaseline = "alphabetic";
				      ctx.fillStyle = "#f60";
				      ctx.fillRect(125,1,62,20);
				      ctx.fillStyle = "#069";
				      ctx.fillText(txt, 2, 15);
				      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
				      ctx.fillText(txt, 4, 17);
				      return canvas.toDataURL();
				    }
				  };


				  return Fingerprint;

				})

		},

		_variables : {
			config : {
				click : {
					left_click : true,
					double_left_click : true,
					mid_click : true,
					double_mid_click : true,
					right_click : true,
					double_right_click : true
				},
				mouse_movement : {
					mouse_move : true,
					mouse_stop : true
				},
				keyboard : {
					keyboard_writing : false,
					keyboard_deletion : false
				},
				page : {
					page_enter : true,
					page_leave : true
				},
				others : {
					scroll : true,
					selection : true
				},
				debug : false,
				celv : false

			},

			tracking_data :  null,

			event : {
				LEFT_CLICK: 1,
				DOUBLE_LEFT_CLICK: 2,
				MID_CLICK: 3,
				DOUBLE_MID_CLICK: 4,
				RIGHT_CLICK: 5,
				DOUBLE_RIGHT_CLICK: 6,
				MOUSE_MOVE: 7,
				MOUSE_STOP: 8,
				SCROLL: 9,
				SELECTION: 10,
				KEYBOARD_WRITE: 11,
				KEYBOARD_DELETION: 12,
				PAGE_LEAVE: 13,
				PAGE_ENTER: 14,

				//CELVONLINE ESPECIFIC EVENTS NEEDS TO BE REMOVED
				SEARCH: 15,
				LIST: 16,
				GRAPH1: 17,
				GRAPH2: 18,
				VIDEOSTART : 19,
				VIDEOSTOP : 20,
			},
		},

		_functions: {
			init_tracking_data : function(){
				if(_private._variables.config.debug){
					console.log(_private._variables.config);
				}
				_private._thirds.browser_detect.init();

				_private._variables.tracking_data = {
					data: new Date(),
					user_id : new Fingerprint({canvas: true}).get(),
					usr_ip : myip,
					browser : _private._thirds.browser_detect.browser,
					browserVersion : _private._thirds.browser_detect.version,
					site : window.location.href,
					screen : { x: screen.width, y: screen.height },
					readings : []
				};

				if(_private._variables.config.debug){
					console.log(_private._variables.tracking_data);
				}
			},

			get_parents : function(element){
				var parents = [];

				while (element)
				{
				    var tmp = element.tagName;
					if( element.id )
						tmp += '#' + element.id;
					if( element.className )
						tmp += '.' + element.className;

					parents.unshift( tmp );

					element = element.parentNode;
				}

				return parents;
			},

			array_to_string : function(array){
				var str = array[1];

				for( var i = 2; i < array.length; ++i )
				{
					str += '>' + array[i];
				}

				return str;
			},

			set_listener_by_name : function(name){
				var fn = _private._functions.listeners_init[name];

				if(typeof fn === "function"){
					fn();
				}
			},

			add_record : function(obj){
				if(_private._variables.config.debug){
					console.log(obj);
				}

				_private._variables.tracking_data.readings.push(obj);
			},

			all_properties_false : function(obj){
				if(typeof obj === "boolean") {
					if(obj === false)
						return true;
					else
						return false;
				}

				var is_all_false = true;
				for(property in obj){
					if(obj[property]){
						is_all_false = false;
					}

				}
				return is_all_false;
			},

			listeners_init : {
				click : function(){
					document.addEventListener( 'click', function(e) {

					    switch (e.which) {
					        case 1:
					            if(_private._variables.config.click.left_click){
					            	create_left_click_record(e);
					            }
					            break;
					        case 2:
					        	if(_private._variables.config.click.mid_click){
					        		create_mid_click_record(e);
					        	}
					        	break;
					        case 3:
					        	if(_private._variables.config.click.right_click){
					        		create_right_click_record(e);
					        	}
					        	break;
					    }
					});

					var left_timeout = 0, left_clicked = false;

					function create_left_click_record(e)
					{

						if( left_clicked ) {
							clearTimeout(left_timeout);
							left_clicked = false;

							if(_private._variables.config.click.double_left_click){
								_private._functions.add_record({
									event : _private._variables.event.DOUBLE_LEFT_CLICK,
									date : new Date(),
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
									page_coord : {x: e.pageX, y: e.pageY },
									client_coord : {x: e.clientX, y: e.clientY },
								});
							}

						}
						else {
							left_clicked = true;
							left_timeout = setTimeout( function() {
								left_clicked = false;

								if(_private._variables.config.click.left_click){
									_private._functions.add_record({
										event : _private._variables.event.LEFT_CLICK,
										date : new Date(new Date() - 250),
										element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
										page_coord : {x: e.pageX, y: e.pageY },
										client_coord : {x: e.clientX, y: e.clientY },
									});
								}
							}, 300 );
						}
					}

					var mid_timeout = 0, mid_clicked = false;

					function create_mid_click_record(e)
					{
						if( mid_clicked ) {
							clearTimeout(mid_timeout);
							mid_clicked = false;

							if(_private._variables.config.click.double_mid_click){
								_private._functions.add_record({
									event : _private._variables.event.DOUBLE_MID_CLICK,
									date : new Date(),
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
									page_coord : {x: e.pageX, y: e.pageY },
									client_coord : {x: e.clientX, y: e.clientY },
								});
							}
						}
						else {
							mid_clicked = true;
							mid_timeout = setTimeout( function() {
								mid_clicked = false;

								if(_private._variables.config.click.mid_click){
									_private._functions.add_record({
										event : _private._variables.event.MID_CLICK,
										date : new Date(new Date() - 250),
										element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
										page_coord : {x: e.pageX, y: e.pageY },
										client_coord : {x: e.clientX, y: e.clientY },
									});
								}
							}, 300 );
						}
					}

					var right_timeout = 0, right_clicked = false;

					function create_right_click_record(e)
					{
						if( right_clicked ) {
							clearTimeout(right_timeout);
							right_clicked = false;

							if(_private._variables.config.click.double_right_click){
								_private._functions.add_record({
									event : _private._variables.event.DOUBLE_RIGHT_CLICK,
									date : new Date(),
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
									page_coord : {x: e.pageX, y: e.pageY },
									client_coord : {x: e.clientX, y: e.clientY },
								});
							}
						}
						else {
							right_clicked = true;
							right_timeout = setTimeout( function() {
								right_clicked = false;

								if(_private._variables.config.click.right_click){
									_private._functions.add_record({
										event : _private._variables.event.RIGHT_CLICK,
										date : new Date(new Date() - 250),
										element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
										page_coord : {x: e.pageX, y: e.pageY },
										client_coord : {x: e.clientX, y: e.clientY },
									});
								}
							}, 300 );
						}
					}
				},

				mouse_movement : function(){
					var writing = true;
					var timer = null;
					var start = null;

					document.addEventListener('mousemove',function(e) {

						if(timer){
							clearTimeout(timer);
							timer = null;
						}

						//stop
						if( start != null )
						{
							if(_private._variables.config.mouse_movement.mouse_stop){
								_private._functions.add_record({
									event : _private._variables.event.MOUSE_STOP,
									date_before : start.toString(),
									date_after : new Date(),
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
									page_coord : {x: e.pageX, y: e.pageY },
									client_coord : {x: e.clientX, y: e.clientY },
								});
							}

							start = null;
						}

						if( writing )
						{
							writing = false;

							if(_private._variables.config.mouse_movement.mouse_move){
								_private._functions.add_record({
									event : _private._variables.event.MOUSE_MOVE,
									date : new Date(),
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
									page_coord : {x: e.pageX, y: e.pageY },
									client_coord : {x: e.clientX, y: e.clientY },
								});
							}
						}

						timer = setTimeout( mousestop(e), 300);

					});

					setInterval( function(){writing = true;}, 250 );

					function mousestop(e) {
						return function(){
							start = new Date();
						}
					}
				},

				keyboard : function(){
					var tmp = document.getElementsByTagName('input');

					for(var i = 0; i < tmp.length; ++i) {
						if(tmp[i].type == "text") {
							tmp[i].addEventListener('keypress', keypressHandler);
						}
					}

					var text_before_deletetion = null;
					var date_defore_deletion = null;
					var deletion_timer = null;

					var text_before_write = null;
					var date_before_write = null;
					var writing_timer = null;

					function keypressHandler(e) {
						var key = e.keyCode || e.charCode;

						if(key === 8 || key === 46) {
							if(!deletion_timer) {
								text_before_deletion = this.value;
								date_before_deletion = new Date();
							}
							else {
								clearTimeout(deletion_timer);
								deletion_timer = null;
							}

							deletion_timer = setTimeout(create_keyboard_deletion_record(e, this), 1000)

						}
						else {
							if(!writing_timer) {
								text_before_write = this.value;
								date_before_write = new Date();
							}
							else {
								clearTimeout(writing_timer);
								writing_timer = null;
							}

							writing_timer = setTimeout(create_keyboard_write_record(e, this), 1000);
						}
					};

					function create_keyboard_deletion_record(e, element){
						return function(){
							if(_private._variables.config.keyboard.keyboard_deletion){
								_private._functions.add_record({
									event :	_private._variables.event.KEYBOARD_DELETION,
									date_before : date_before_deletion,
									text_before : text_before_deletion,
									date_after : new Date(new Date() - 1000),
									text_after : element.value,
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
								});
							}

							deletion_timer = null;
						}
					}

					function create_keyboard_write_record(e, element){
						return function(){
							if(_private._variables.config.keyboard.keyboard_writing){
								_private._functions.add_record({
									event :	_private._variables.event.KEYBOARD_WRITE,
									date_before : date_before_write,
									text_before : text_before_write,
									date_after : new Date(new Date() - 1000),
									text_after : element.value,
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
								});
							}

							writing_timer = null;
						}
					}
				},

				page : function(){
					var enter_time;

					window.onload = function() {

						enter_time = new Date();

						if(_private._variables.config.page.page_enter){
							_private._functions.add_record({
								event : _private._variables.event.PAGE_ENTER,
								date : enter_time
							});
						}
					};

					window.onbeforeunload = function () {
						if(_private._variables.config.page.page_leave){
							var tmp = new Date();
							_private._functions.add_record({
								event : _private._variables.event.PAGE_LEAVE,
								date : tmp,
								time : (tmp - enter_time)
							});

							$.ajax({
								type: "POST",
								contentType : 'application/json',
						        async: false,
						        url: 'http://54.94.202.131:8080',
						        data: JSON.stringify(_private._variables.tracking_data),
						    });
						}
					};
				},
				others : function(){
					var timer = null;
					var page_coord_before = null;
					var client_coord_before = null;
					var date_before = null;

					document.addEventListener('scroll', function(e){
						if(!timer) {
							page_coord_before = {x: e.pageX, y: e.pageY };
							client_coord_before = {x: e.clientX, y: e.clientY };
							date_before = new Date();
						}
						else {
							clearTimeout(timer);
							timer = null;
						}

						timer = setTimeout(create_scroll_record(e), 250);
					});

					setInterval(function(){writing=true;}, 300);

					function create_scroll_record(e){
						return function(){
							if(_private._variables.config.others.scroll){
								_private._functions.add_record({
									event : _private._variables.event.SCROLL,
									date_before : date_before,
									page_coord_before : page_coord_before,
									client_coord_before : client_coord_before,
									date_after : new Date(),
									page_coord_after : {x: e.pageX, y: e.pageY },
									client_coord_after : {x: e.clientX, y: e.clientY },
								});
							}

							timer = null;
						}
					}

					document.addEventListener('mouseup', function(e) {
						var text = getSelectedText();

						if( text != '')
						{
							if(_private._variables.config.others.selection){
								_private._functions.add_record({
									event : _private._variables.event.SELECTION,
									date : new Date(),
									text : text,
									element : _private._functions.array_to_string( _private._functions.get_parents( e.target ) ),
									page_coord : {x: e.pageX, y: e.pageY },
									client_coord : {x: e.clientX, y: e.clientY },
								});
							}
						}
					});

					function getSelectedText() {
						if (window.getSelection) {
							return window.getSelection();
						} else if (document.selection) {
							return document.selection.createRange().text;
						}
						return '';
					}
				},

				celv : function(){
					var tm = 0,
					tl,
					td;
					console.log('ola');
					$('#table_wrapper').on('dblclick', '#tabela tbody tr', function () {

					    var position = mGlobal.table.fnGetPosition(this);

						if( mGlobal.site === "we")
							tl = mGlobal.table.fnGetData(position)[3];
						else
							tl = mGlobal.table.fnGetData(position)[5];


						td = $('#video_delay').val();

						tm = new Date();

						_private._functions.add_record({
							event : _private._variables.event.VIDEOSTART,
							date : new Date(),
							link : tl,
							delay : td,
						});
					});

					$('#videomodal').bind('closed', function() {
						var tmp = new Date();

						_private._functions.add_record({
							event : _private._variables.event.VIDEOSTOP,
							date : tmp,
							time : (tmp - tm),
							link : tl,
							delay : td,
						});
					});

					$('#search_bt').click(function(){

						var countries = [];
						var themes = [];

						$( '#countries  input[type=checkbox]' ).each( function(){
					        if( this.checked )
					        {
					        	countries.push( this.value );
					        }
					    });

						if( mGlobal.search.category === "all")
						{
							$( '#subcategories  input[type=checkbox]' ).each( function(){
						        if( this.checked )
						        {
						        	var tmp = this.value.substr(this.value.indexOf(")") + 1);
						        	themes.push(tmp );
						        }
						    });
						}
						else
						{
							$( '#subcategories  input[type=checkbox]' ).each( function(){
						        if( this.checked )
						        {
						        	themes.push( this.value );
						        }
						    });
						}

						_private._functions.add_record({
							event : _private._variables.event.SEARCH,
							date : new Date(),
							query : $('#query').val().toLowerCase(),
							type : $('#radio_list').is(':checked') ? 'list' : 'graph',
							genre : $('#categories').children("input:checked").val(),
							countries : countries,
							themes : themes,
							channel : $('#channel_search').val()
						});

					});

					$( '.wrapper' ).on( 'click', '#lista_incidencias > li > a', function(){

						var sort = [];
					    $( '#sorts > select' ).each( function(){
					        if( this.value != "none" )
					        {
					            sort.push( this.value );
					        }
					    });

					    _private._functions.add_record({
							event : _private._variables.event.LIST,
							date : new Date(),
							text : $(this).text(),
							max_videos : $('#max_rows').val(),
							max_hits :  $('#max_snippets').val(),
							sort : sort
						});

					});

					$('#chart1').bind('jqplotDataClick',
					    function (ev, seriesIndex, pointIndex, data) {

							var sort = [];
						    $( '#sorts > select' ).each( function(){
						        if( this.value != "none" )
						        {
						            sort.push( this.value );
						        }
						    });

						    _private._functions.add_record({
								event : _private._variables.event.GRAPH1,
								date : new Date(),
								bar : country_labels[ pointIndex ],
								max_videos : $('#max_rows').val(),
								max_hits :  $('#max_snippets').val(),
								sort : sort
							});
					    }
					);

					$('#chart2').bind('jqplotDataClick',
					    function (ev, seriesIndex, pointIndex, data) {
							var sort = [];
						    $( '#sorts > select' ).each( function(){
						        if( this.value != "none" )
						        {
						            sort.push( this.value );
						        }
						    });

						    _private._functions.add_record({
								event : _private._variables.event.GRAPH2,
								date : new Date(),
								bar : subcategory_labels[ pointIndex ],
								max_videos : $('#max_rows').val(),
								max_hits :  $('#max_snippets').val(),
								sort : sort
							});
					    }
					);
				}
			}
		}
	};

	tracker.prototype.init = function(){
		_private._functions.init_tracking_data();

		for(property in _private._variables.config){
			var temp = property;

			if(!_private._functions.all_properties_false(_private._variables.config[temp])){
				_private._functions.set_listener_by_name(temp);
			}
		}
	};

	tracker.prototype.get = function(){
		return _private._variables.tracking_data;
	};

	tracker.prototype.addListeners = function(objs){
		for(var i = 0; i < objs.length; ++i ){
			_private._functions.add_event_listener(objs[i].target, objs[i].event, objs[i].callback);
		}
	};
}());
