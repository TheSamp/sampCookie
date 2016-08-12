//Cookie, see settings.sjs/defaults.js for vars
(function() {
    var sCookie = {
        //vars
        defaults: {
            scname: 'sCookie',
            sctype: 'slab',//box
            sclocationX: 'left',//right
            sclocationY: 'bottom',//top
            sctext: 'This website uses cookies to ensure you get the best experience on our website.',
            sclinktext: 'More info&raquo;',
            sclinkurl: '',
            scbtntext: 'Okay',
            scanimationtime: 1,//seconds
            scdelay: 2,//seconds
            sctimeout: 100,//seconds
            scenabled: false,
            scresponsive: true,
            scaddcss: true,
            scdebug: false //set true to show reset button (left, mid page)
        },
        //vars - EOL

        d: {},//scookie div-element
        b: document.body,
        settings: {},//defaults and user vars are combined to this

        //3rd Party
        //http://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
        extend: function (defaults, options) {
            var extended = {};
            var prop;

            for (prop in defaults) {
                if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                    extended[prop] = defaults[prop];
                }
            }

            for (prop in options) {
                if (Object.prototype.hasOwnProperty.call(options, prop)) {
                    extended[prop] = options[prop];
                }
            }
            return extended;
        },
        //http://ejohn.org/projects/flexible-javascript-events/
        addEvt: function(obj, type, fn ) {
            if (typeof obj === 'object' && obj !== null) {
                if (obj.attachEvent) {
                    obj['e' + type + fn] = fn;
                    obj[type + fn] = function () {
                        obj['e' + type + fn](window.event);
                    }
                    obj.attachEvent('on' + type, obj[type + fn]);
                } else  obj.addEventListener(type, fn, false);
            }
        },
        removeEvt: function( obj, type, fn ) {
            if (typeof obj === 'object' && obj !== null) {
                if (obj.detachEvent) {
                    obj.detachEvent('on' + type, obj[type + fn]);
                    obj[type + fn] = null;
                } else  obj.removeEventListener(type, fn, false);
            }
        },
        //3rd Party EOL

        //Event listeners
        agreeListener: function(evt){
            sCookie.agreeScookie();//this.function cant be used within functions
        },
        //Event listeners - EOL

        //Display funx
        createScookie: function () {
            var chtml = '<div><p>' + settings.sctext;
                if(settings.sclinkurl !== '') chtml += '<a href="' + settings.sclinkurl + '" target="_blank">' + settings.sclinktext + '</a>';
            chtml += '</p><button id="sCookie-btn-ok">' + settings.scbtntext + '</button></div>';
            this.d = document.createElement('div');
            this.d.id = 'sCookie';
            this.d.setAttribute('class', 'sCookie-hidden');
            this.d.innerHTML = chtml;
            this.b.insertBefore(this.d, this.b.childNodes[this.b.childNodes.length-1]);//add to DOM, just before js inclusion
            sCookie.showScookie();
        },
        showScookie: function(){
            this.d.setAttribute('class', 'sCookie-' + settings.sctype + ' sCookie-' + settings.sclocationX + ' sCookie-' + settings.sclocationY);
                if(typeof this.d.classList === 'object') this.d.classList.add('sCookie-animateIn');
                else{ sCookie.d.className += ' sCookie-show';}//=<IE9
            this.addEvt(document.getElementById('sCookie-btn-ok'), 'click', this.agreeListener);
        },
        hideScookie: function () {
                if (typeof sCookie.d.classList === 'object') {
                    sCookie.d.classList.remove('sCookie-animateIn');
                    sCookie.d.classList.add('sCookie-animateOut');
                }else{
                    sCookie.d.className += ' sCookie-hide';//=<IE9
                }
            var rto = window.setTimeout(function(){
                sCookie.removeScookie();
                rto = clearTimeout(rto);
            }, (settings.scanimationtime*2)*1000);//wait longer and then remove element
        },
        removeScookie: function(){
                if(typeof this.d === 'object'){
                    sCookie.removeEvt(document.getElementById('sCookie-btn-ok'), 'click', this.agreeListener);
                    this.d.outerHTML = '';
                    delete this.d;
                }
        },
        //Display funx - EOL

        //Prompt funx
        agreeScookie: function() {
            sCookie.setScookie(settings.scname, 1, 90, this.hideScookie);
        },
        declineScookie: function () {
            sCookie.deleteScookie(settings.scname);
            sCookie.removeScookie();
        },
        //Prompt funx - EOL

        //Cookie funx
        setScookie: function(_name, _value, _days, _cb){
                if(_days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (_days * 24 * 60 * 60 * 1000));
                    var expires = '; expires=' + date.toGMTString();
                } else var expires = '';
            document.cookie = _name + '=' + _value + expires + '; path=/';
                if(typeof _cb === 'function') _cb();
        },
        getScookie: function (_name) {
            var nameEQ = _name + '=';
            var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
            return null;
        },
        deleteScookie: function (_name) {
            sCookie.setScookie(_name, '', -1, null);
        },
        //Cookie funx - EOL

        //Styling
        addCSS: function() {
            var csheet = document.createElement('style');
            csheet.id = 'sCookie-css';
            csheet.setAttribute('type', 'text/css');
            //display
            csheetCSS = '#sCookie,#sCookie *{-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;}#sCookie{position:fixed;z-index:10001;}.sCookie-hidden{display:none;}#sCookie > div{width:100%;padding:0.5em;}#sCookie p{margin:0.5em;padding:0;}';
            csheetCSS += '#sCookie button{display:inline-block;cursor:pointer;border:none;padding:0.5em;margin:0.5em;}.sCookie-show{display:block;}.sCookie-hide{display:none;}';
            //colours
            csheetCSS += '#sCookie > div{background-color: #666;color:#fff;}#sCookie button{background-color:#000;color:#fff;}';
            //animations
            //IN
            csheetCSS += '@-webkit-keyframes sCookie-fadeIn{from{opacity:0;}to{opacity:1;}}@-moz-keyframes sCookie-fadeIn{from{opacity:0;}to{opacity:1;}}@keyframes sCookie-fadeIn{from{opacity:0;}to{opacity:1;}}';
            csheetCSS += '.sCookie-animateIn{opacity: 0;-webkit-animation:sCookie-fadeIn ease-in 1;-moz-animation:sCookie-fadeIn ease-in 1;animation:sCookie-fadeIn ease-in 1;';
            csheetCSS += '-webkit-animation-fill-mode:forwards;-moz-animation-fill-mode:forwards;animation-fill-mode:forwards;';
            csheetCSS += '-webkit-animation-duration:'+settings.scanimationtime+'s;-moz-animation-duration:'+settings.scanimationtime+'s;animation-duration:'+settings.scanimationtime+'s;}';
            //OUT
            csheetCSS += '@-webkit-keyframes sCookie-fadeOut{from{opacity:1;}to{opacity:0;}}@-moz-keyframes sCookie-fadeOut{from{opacity:1;}to{opacity:0;}}@keyframes sCookie-fadeOut{from{opacity:1;}to{opacity:0;}}';
            csheetCSS += '.sCookie-animateOut{opacity: 1;-webkit-animation:sCookie-fadeOut ease-in 1;-moz-animation:sCookie-fadeOut ease-in 1;animation:sCookie-fadeOut ease-in 1;';
            csheetCSS += '-webkit-animation-fill-mode:forwards;-moz-animation-fill-mode:forwards;animation-fill-mode:forwards;';
            csheetCSS += '-webkit-animation-duration:'+settings.scanimationtime+'s;-moz-animation-duration:'+settings.scanimationtime+'s;animation-duration:'+settings.scanimationtime+'s;}';
            //vars
                if(settings.sclocationY == 'bottom') csheetCSS += '.sCookie-bottom{bottom:0;}';
                else if(settings.sclocationY == 'top') csheetCSS += '.sCookie-top{top:0;}';
                if(settings.sclocationX == 'left') csheetCSS += '.sCookie-left{left:0;}';
                else if(settings.sclocationX == 'right') csheetCSS += '.sCookie-right{right:0;}';
                if(settings.sctype == 'slab') csheetCSS += '.sCookie-slab{width:100%;}#sCookie > div{float:left;}#sCookie a{display:inline-block;margin-left:0.5em;}#sCookie p{float:left;}#sCookie button{float:right;}';
                else if(settings.sctype == 'box'){
                    csheetCSS += '.sCookie-box{width:25%;}#sCookie a{display:block;}';
                        if(settings.scresponsive) csheetCSS += '@media handheld, only screen and (max-width: 992px){.sCookie-box{width:100%;}}';
                }

                if(csheet.styleSheet){//IE
                    csheet.styleSheet.cssText = csheetCSS;
                }else{
                    var textnode = document.createTextNode(csheetCSS);
                    csheet.appendChild(textnode);
                }

            var h = document.getElementsByTagName('head')[0];
            var hc = h.firstChild;

            var styleSheetList = [];
                    styleSheetList = h.getElementsByTagName('link');//Find if head has link-tags. //document.styleSheets;
                        if(styleSheetList.length > 0) hc = styleSheetList[0];
            h.insertBefore(csheet, hc);
        },
        //Styling - EOL

        //DEBUG
        resetScookie: function(){
            sCookie.declineScookie();
            sCookie.createScookie();
        },
        debugScookie: function() {
            this.db = document.createElement('button');
            this.db.id = 'sCookie-btn-reset';
            this.db.innerHTML = 'RESET sCookie';
            this.db.setAttribute('style', 'position:fixed;top:50%;left:0;');
            this.b.insertBefore(this.db, this.b.childNodes[0]);//add to DOM
            sCookie.addEvt(document.getElementById('sCookie-btn-reset'), 'click', this.resetScookie);
        },
        //DEBUG - EOL

        initScookie: function (options) {
            settings = sCookie.extend(this.defaults, options);

                if(settings.scenabled) {
                    var wdelay = window.setTimeout(function(){

                            if (!sCookie.getScookie(settings.scname)) {
                                    if(settings.scaddcss) {
                                        sCookie.addCSS();
                                    }
                                sCookie.createScookie();
                            }

                            if (settings.scdebug) sCookie.debugScookie();

                        var wto = window.setTimeout(function(){
                            sCookie.hideScookie();
                            wto = window.clearTimeout(wto);
                        }, settings.sctimeout*1000);
                        wdelay = window.clearTimeout(wdelay);
                    }, settings.scdelay*1000);
                }
        }
    }

    var cOptions = {};

        if(typeof window.scookie_options === 'object'){
            cOptions = window.scookie_options;
            window.scookie_options = null;
            //delete window.scookie_options;
        }

    sCookie.initScookie(cOptions);

})();