//! moment.js
//! version : 2.2.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a){function b(a,b){return function(c){return i(a.call(this,c),b)}}function c(a,b){return function(c){return this.lang().ordinal(a.call(this,c),b)}}function d(){}function e(a){g(this,a)}function f(a){var b=a.years||a.year||a.y||0,c=a.months||a.month||a.M||0,d=a.weeks||a.week||a.w||0,e=a.days||a.day||a.d||0,f=a.hours||a.hour||a.h||0,g=a.minutes||a.minute||a.m||0,h=a.seconds||a.second||a.s||0,i=a.milliseconds||a.millisecond||a.ms||0;this._input=a,this._milliseconds=+i+1e3*h+6e4*g+36e5*f,this._days=+e+7*d,this._months=+c+12*b,this._data={},this._bubble()}function g(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a}function h(a){return 0>a?Math.ceil(a):Math.floor(a)}function i(a,b){for(var c=a+"";c.length<b;)c="0"+c;return c}function j(a,b,c,d){var e,f,g=b._milliseconds,h=b._days,i=b._months;g&&a._d.setTime(+a._d+g*c),(h||i)&&(e=a.minute(),f=a.hour()),h&&a.date(a.date()+h*c),i&&a.month(a.month()+i*c),g&&!d&&L.updateOffset(a),(h||i)&&(a.minute(e),a.hour(f))}function k(a){return"[object Array]"===Object.prototype.toString.call(a)}function l(a,b){var c,d=Math.min(a.length,b.length),e=Math.abs(a.length-b.length),f=0;for(c=0;d>c;c++)~~a[c]!==~~b[c]&&f++;return f+e}function m(a){return a?ib[a]||a.toLowerCase().replace(/(.)s$/,"$1"):a}function n(a,b){return b.abbr=a,P[a]||(P[a]=new d),P[a].set(b),P[a]}function o(a){delete P[a]}function p(a){if(!a)return L.fn._lang;if(!P[a]&&Q)try{require("./lang/"+a)}catch(b){return L.fn._lang}return P[a]||L.fn._lang}function q(a){return a.match(/\[.*\]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function r(a){var b,c,d=a.match(T);for(b=0,c=d.length;c>b;b++)d[b]=mb[d[b]]?mb[d[b]]:q(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function s(a,b){return b=t(b,a.lang()),jb[b]||(jb[b]=r(b)),jb[b](a)}function t(a,b){function c(a){return b.longDateFormat(a)||a}for(var d=5;d--&&(U.lastIndex=0,U.test(a));)a=a.replace(U,c);return a}function u(a,b){switch(a){case"DDDD":return X;case"YYYY":return Y;case"YYYYY":return Z;case"S":case"SS":case"SSS":case"DDD":return W;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return $;case"a":case"A":return p(b._l)._meridiemParse;case"X":return bb;case"Z":case"ZZ":return _;case"T":return ab;case"MM":case"DD":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return V;default:return new RegExp(a.replace("\\",""))}}function v(a){var b=(_.exec(a)||[])[0],c=(b+"").match(fb)||["-",0,0],d=+(60*c[1])+~~c[2];return"+"===c[0]?-d:d}function w(a,b,c){var d,e=c._a;switch(a){case"M":case"MM":null!=b&&(e[1]=~~b-1);break;case"MMM":case"MMMM":d=p(c._l).monthsParse(b),null!=d?e[1]=d:c._isValid=!1;break;case"D":case"DD":null!=b&&(e[2]=~~b);break;case"DDD":case"DDDD":null!=b&&(e[1]=0,e[2]=~~b);break;case"YY":e[0]=~~b+(~~b>68?1900:2e3);break;case"YYYY":case"YYYYY":e[0]=~~b;break;case"a":case"A":c._isPm=p(c._l).isPM(b);break;case"H":case"HH":case"h":case"hh":e[3]=~~b;break;case"m":case"mm":e[4]=~~b;break;case"s":case"ss":e[5]=~~b;break;case"S":case"SS":case"SSS":e[6]=~~(1e3*("0."+b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=v(b)}null==b&&(c._isValid=!1)}function x(a){var b,c,d,e=[];if(!a._d){for(d=z(a),b=0;3>b&&null==a._a[b];++b)a._a[b]=e[b]=d[b];for(;7>b;b++)a._a[b]=e[b]=null==a._a[b]?2===b?1:0:a._a[b];e[3]+=~~((a._tzm||0)/60),e[4]+=~~((a._tzm||0)%60),c=new Date(0),a._useUTC?(c.setUTCFullYear(e[0],e[1],e[2]),c.setUTCHours(e[3],e[4],e[5],e[6])):(c.setFullYear(e[0],e[1],e[2]),c.setHours(e[3],e[4],e[5],e[6])),a._d=c}}function y(a){var b=a._i;a._d||(a._a=[b.years||b.year||b.y,b.months||b.month||b.M,b.days||b.day||b.d,b.hours||b.hour||b.h,b.minutes||b.minute||b.m,b.seconds||b.second||b.s,b.milliseconds||b.millisecond||b.ms],x(a))}function z(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function A(a){var b,c,d,e=p(a._l),f=""+a._i;for(d=t(a._f,e).match(T),a._a=[],b=0;b<d.length;b++)c=(u(d[b],a).exec(f)||[])[0],c&&(f=f.slice(f.indexOf(c)+c.length)),mb[d[b]]&&w(d[b],c,a);f&&(a._il=f),a._isPm&&a._a[3]<12&&(a._a[3]+=12),a._isPm===!1&&12===a._a[3]&&(a._a[3]=0),x(a)}function B(a){var b,c,d,f,h,i=99;for(f=0;f<a._f.length;f++)b=g({},a),b._f=a._f[f],A(b),c=new e(b),h=l(b._a,c.toArray()),c._il&&(h+=c._il.length),i>h&&(i=h,d=c);g(a,d)}function C(a){var b,c=a._i,d=cb.exec(c);if(d){for(a._f="YYYY-MM-DD"+(d[2]||" "),b=0;4>b;b++)if(eb[b][1].exec(c)){a._f+=eb[b][0];break}_.exec(c)&&(a._f+=" Z"),A(a)}else a._d=new Date(c)}function D(b){var c=b._i,d=R.exec(c);c===a?b._d=new Date:d?b._d=new Date(+d[1]):"string"==typeof c?C(b):k(c)?(b._a=c.slice(0),x(b)):c instanceof Date?b._d=new Date(+c):"object"==typeof c?y(b):b._d=new Date(c)}function E(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function F(a,b,c){var d=O(Math.abs(a)/1e3),e=O(d/60),f=O(e/60),g=O(f/24),h=O(g/365),i=45>d&&["s",d]||1===e&&["m"]||45>e&&["mm",e]||1===f&&["h"]||22>f&&["hh",f]||1===g&&["d"]||25>=g&&["dd",g]||45>=g&&["M"]||345>g&&["MM",O(g/30)]||1===h&&["y"]||["yy",h];return i[2]=b,i[3]=a>0,i[4]=c,E.apply({},i)}function G(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=L(a).add("d",f),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function H(a){var b=a._i,c=a._f;return null===b||""===b?null:("string"==typeof b&&(a._i=b=p().preparse(b)),L.isMoment(b)?(a=g({},b),a._d=new Date(+b._d)):c?k(c)?B(a):A(a):D(a),new e(a))}function I(a,b){L.fn[a]=L.fn[a+"s"]=function(a){var c=this._isUTC?"UTC":"";return null!=a?(this._d["set"+c+b](a),L.updateOffset(this),this):this._d["get"+c+b]()}}function J(a){L.duration.fn[a]=function(){return this._data[a]}}function K(a,b){L.duration.fn["as"+a]=function(){return+this/b}}for(var L,M,N="2.2.1",O=Math.round,P={},Q="undefined"!=typeof module&&module.exports,R=/^\/?Date\((\-?\d+)/i,S=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)\:(\d+)\.?(\d{3})?/,T=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,U=/(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,V=/\d\d?/,W=/\d{1,3}/,X=/\d{3}/,Y=/\d{1,4}/,Z=/[+\-]?\d{1,6}/,$=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,_=/Z|[\+\-]\d\d:?\d\d/i,ab=/T/i,bb=/[\+\-]?\d+(\.\d{1,3})?/,cb=/^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,db="YYYY-MM-DDTHH:mm:ssZ",eb=[["HH:mm:ss.S",/(T| )\d\d:\d\d:\d\d\.\d{1,3}/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],fb=/([\+\-]|\d\d)/gi,gb="Date|Hours|Minutes|Seconds|Milliseconds".split("|"),hb={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6},ib={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",w:"week",W:"isoweek",M:"month",y:"year"},jb={},kb="DDD w W M D d".split(" "),lb="M D H h m s w W".split(" "),mb={M:function(){return this.month()+1},MMM:function(a){return this.lang().monthsShort(this,a)},MMMM:function(a){return this.lang().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.lang().weekdaysMin(this,a)},ddd:function(a){return this.lang().weekdaysShort(this,a)},dddd:function(a){return this.lang().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return i(this.year()%100,2)},YYYY:function(){return i(this.year(),4)},YYYYY:function(){return i(this.year(),5)},gg:function(){return i(this.weekYear()%100,2)},gggg:function(){return this.weekYear()},ggggg:function(){return i(this.weekYear(),5)},GG:function(){return i(this.isoWeekYear()%100,2)},GGGG:function(){return this.isoWeekYear()},GGGGG:function(){return i(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.lang().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.lang().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return~~(this.milliseconds()/100)},SS:function(){return i(~~(this.milliseconds()/10),2)},SSS:function(){return i(this.milliseconds(),3)},Z:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+i(~~(a/60),2)+":"+i(~~a%60,2)},ZZ:function(){var a=-this.zone(),b="+";return 0>a&&(a=-a,b="-"),b+i(~~(10*a/6),4)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},X:function(){return this.unix()}};kb.length;)M=kb.pop(),mb[M+"o"]=c(mb[M],M);for(;lb.length;)M=lb.pop(),mb[M+M]=b(mb[M],2);for(mb.DDDD=b(mb.DDD,3),g(d.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a){var b,c,d;for(this._monthsParse||(this._monthsParse=[]),b=0;12>b;b++)if(this._monthsParse[b]||(c=L.utc([2e3,b]),d="^"+this.months(c,"")+"|^"+this.monthsShort(c,""),this._monthsParse[b]=new RegExp(d.replace(".",""),"i")),this._monthsParse[b].test(a))return b},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=L([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b){var c=this._calendar[a];return"function"==typeof c?c.apply(b):c},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",preparse:function(a){return a},postformat:function(a){return a},week:function(a){return G(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6}}),L=function(a,b,c){return H({_i:a,_f:b,_l:c,_isUTC:!1})},L.utc=function(a,b,c){return H({_useUTC:!0,_isUTC:!0,_l:c,_i:a,_f:b}).utc()},L.unix=function(a){return L(1e3*a)},L.duration=function(a,b){var c,d,e=L.isDuration(a),g="number"==typeof a,h=e?a._input:g?{}:a,i=S.exec(a);return g?b?h[b]=a:h.milliseconds=a:i&&(c="-"===i[1]?-1:1,h={y:0,d:~~i[2]*c,h:~~i[3]*c,m:~~i[4]*c,s:~~i[5]*c,ms:~~i[6]*c}),d=new f(h),e&&a.hasOwnProperty("_lang")&&(d._lang=a._lang),d},L.version=N,L.defaultFormat=db,L.updateOffset=function(){},L.lang=function(a,b){return a?(a=a.toLowerCase(),a=a.replace("_","-"),b?n(a,b):null===b?(o(a),a="en"):P[a]||p(a),L.duration.fn._lang=L.fn._lang=p(a),void 0):L.fn._lang._abbr},L.langData=function(a){return a&&a._lang&&a._lang._abbr&&(a=a._lang._abbr),p(a)},L.isMoment=function(a){return a instanceof e},L.isDuration=function(a){return a instanceof f},g(L.fn=e.prototype,{clone:function(){return L(this)},valueOf:function(){return+this._d+6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){return s(L(this).utc(),"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return null==this._isValid&&(this._isValid=this._a?!l(this._a,(this._isUTC?L.utc(this._a):L(this._a)).toArray()):!isNaN(this._d.getTime())),!!this._isValid},invalidAt:function(){var a,b=this._a,c=(this._isUTC?L.utc(this._a):L(this._a)).toArray();for(a=6;a>=0&&b[a]===c[a];--a);return a},utc:function(){return this.zone(0)},local:function(){return this.zone(0),this._isUTC=!1,this},format:function(a){var b=s(this,a||L.defaultFormat);return this.lang().postformat(b)},add:function(a,b){var c;return c="string"==typeof a?L.duration(+b,a):L.duration(a,b),j(this,c,1),this},subtract:function(a,b){var c;return c="string"==typeof a?L.duration(+b,a):L.duration(a,b),j(this,c,-1),this},diff:function(a,b,c){var d,e,f=this._isUTC?L(a).zone(this._offset||0):L(a).local(),g=6e4*(this.zone()-f.zone());return b=m(b),"year"===b||"month"===b?(d=432e5*(this.daysInMonth()+f.daysInMonth()),e=12*(this.year()-f.year())+(this.month()-f.month()),e+=(this-L(this).startOf("month")-(f-L(f).startOf("month")))/d,e-=6e4*(this.zone()-L(this).startOf("month").zone()-(f.zone()-L(f).startOf("month").zone()))/d,"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:h(e)},from:function(a,b){return L.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)},fromNow:function(a){return this.from(L(),a)},calendar:function(){var a=this.diff(L().zone(this.zone()).startOf("day"),"days",!0),b=-6>a?"sameElse":-1>a?"lastWeek":0>a?"lastDay":1>a?"sameDay":2>a?"nextDay":7>a?"nextWeek":"sameElse";return this.format(this.lang().calendar(b,this))},isLeapYear:function(){var a=this.year();return 0===a%4&&0!==a%100||0===a%400},isDST:function(){return this.zone()<this.clone().month(0).zone()||this.zone()<this.clone().month(5).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?"string"==typeof a&&(a=this.lang().weekdaysParse(a),"number"!=typeof a)?this:this.add({d:a-b}):b},month:function(a){var b,c=this._isUTC?"UTC":"";return null!=a?"string"==typeof a&&(a=this.lang().monthsParse(a),"number"!=typeof a)?this:(b=this.date(),this.date(1),this._d["set"+c+"Month"](a),this.date(Math.min(b,this.daysInMonth())),L.updateOffset(this),this):this._d["get"+c+"Month"]()},startOf:function(a){switch(a=m(a)){case"year":this.month(0);case"month":this.date(1);case"week":case"isoweek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoweek"===a&&this.isoWeekday(1),this},endOf:function(a){return a=m(a),this.startOf(a).add("isoweek"===a?"week":a,1).subtract("ms",1)},isAfter:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)>+L(a).startOf(b)},isBefore:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)<+L(a).startOf(b)},isSame:function(a,b){return b="undefined"!=typeof b?b:"millisecond",+this.clone().startOf(b)===+L(a).startOf(b)},min:function(a){return a=L.apply(null,arguments),this>a?this:a},max:function(a){return a=L.apply(null,arguments),a>this?this:a},zone:function(a){var b=this._offset||0;return null==a?this._isUTC?b:this._d.getTimezoneOffset():("string"==typeof a&&(a=v(a)),Math.abs(a)<16&&(a=60*a),this._offset=a,this._isUTC=!0,b!==a&&j(this,L.duration(b-a,"m"),1,!0),this)},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},hasAlignedHourOffset:function(a){return a=a?L(a).zone():0,0===(this.zone()-a)%60},daysInMonth:function(){return L.utc([this.year(),this.month()+1,0]).date()},dayOfYear:function(a){var b=O((L(this).startOf("day")-L(this).startOf("year"))/864e5)+1;return null==a?b:this.add("d",a-b)},weekYear:function(a){var b=G(this,this.lang()._week.dow,this.lang()._week.doy).year;return null==a?b:this.add("y",a-b)},isoWeekYear:function(a){var b=G(this,1,4).year;return null==a?b:this.add("y",a-b)},week:function(a){var b=this.lang().week(this);return null==a?b:this.add("d",7*(a-b))},isoWeek:function(a){var b=G(this,1,4).week;return null==a?b:this.add("d",7*(a-b))},weekday:function(a){var b=(this._d.getDay()+7-this.lang()._week.dow)%7;return null==a?b:this.add("d",a-b)},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},get:function(a){return a=m(a),this[a.toLowerCase()]()},set:function(a,b){a=m(a),this[a.toLowerCase()](b)},lang:function(b){return b===a?this._lang:(this._lang=p(b),this)}}),M=0;M<gb.length;M++)I(gb[M].toLowerCase().replace(/s$/,""),gb[M]);I("year","FullYear"),L.fn.days=L.fn.day,L.fn.months=L.fn.month,L.fn.weeks=L.fn.week,L.fn.isoWeeks=L.fn.isoWeek,L.fn.toJSON=L.fn.toISOString,g(L.duration.fn=f.prototype,{_bubble:function(){var a,b,c,d,e=this._milliseconds,f=this._days,g=this._months,i=this._data;i.milliseconds=e%1e3,a=h(e/1e3),i.seconds=a%60,b=h(a/60),i.minutes=b%60,c=h(b/60),i.hours=c%24,f+=h(c/24),i.days=f%30,g+=h(f/30),i.months=g%12,d=h(g/12),i.years=d},weeks:function(){return h(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+2592e6*(this._months%12)+31536e6*~~(this._months/12)},humanize:function(a){var b=+this,c=F(b,!a,this.lang());return a&&(c=this.lang().pastFuture(b,c)),this.lang().postformat(c)},add:function(a,b){var c=L.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=L.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=m(a),this[a.toLowerCase()+"s"]()},as:function(a){return a=m(a),this["as"+a.charAt(0).toUpperCase()+a.slice(1)+"s"]()},lang:L.fn.lang});for(M in hb)hb.hasOwnProperty(M)&&(K(M,hb[M]),J(M.toLowerCase()));K("Weeks",6048e5),L.duration.fn.asMonths=function(){return(+this-31536e6*this.years())/2592e6+12*this.years()},L.lang("en",{ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),Q&&(module.exports=L),"undefined"==typeof ender&&(this.moment=L),"function"==typeof define&&define.amd&&define("moment",[],function(){return L})}).call(this);
/*
	Masked Input plugin for jQuery
	Copyright (c) 2007-2013 Josh Bush (digitalbush.com)
	Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
	Version: 1.3.1
*/
(function($) {
	function getPasteEvent() {
		var el = document.createElement('input'), name = 'onpaste';
		el.setAttribute(name, '');
		return (typeof el[name] === 'function')?'paste':'input';             
	}
	var pasteEventName = getPasteEvent() + ".mask",ua = navigator.userAgent,iPhone = /iphone/i.test(ua),android=/android/i.test(ua),caretTimeoutId;
	$.mask = {
	//Predefined character definitions
		definitions: {'9':"[0-9]", 'a': "[A-Za-z]", '*': ".",'#':"[A-Za-z0-9]", '~': "[^0-9]"},
		dataName: "rawMaskFn",
		placeholder: '',
	};

$.fn.extend({
	//Helper Function for Caret positioning
	caret: function(begin, end) {
		var range;
		if (this.length === 0 || this.is(":hidden")) {return;}

		if (typeof begin == 'number') {
			end = (typeof end === 'number') ? end : begin;
			return this.each(function() {
				if (this.setSelectionRange) {
					this.setSelectionRange(begin, end);
				} else if (this.createTextRange) {
					range = this.createTextRange();
					range.collapse(true);
					range.moveEnd('character', end);
					range.moveStart('character', begin);
					range.select();
				}
			});
		} else {
			if (this[0].setSelectionRange) {
				begin = this[0].selectionStart;
				end = this[0].selectionEnd;
			} else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				begin = 0 - range.duplicate().moveStart('character', -100000);
				end = begin + range.text.length;
			}
			return { begin: begin, end: end };
		}
	},
	unmask: function() {
		return this.trigger("unmask");
	},
	mask: function(mask, settings) {
		var input,defs,tests,partialPosition,firstNonMaskPos,len;
		if (!mask && this.length > 0) {
			//input = $(this[0]);
			//return input.data($.mask.dataName)();
			//return false;
		}
		settings = $.extend({
			placeholder: $.mask.placeholder, // Load default placeholder
			completed: null
		}, settings);
		defs = $.mask.definitions;tests = [];partialPosition = len = mask.length;firstNonMaskPos = null;

		$.each(mask.split(""), function(i, c) {
			if (c == '?') {
				len--;
				partialPosition = i;
			} else if (defs[c]) {
				tests.push(new RegExp(defs[c]));
				if (firstNonMaskPos === null) {
					firstNonMaskPos = tests.length - 1;
				}
			} else {
				tests.push(null);
			}
		});

		return this.trigger("unmask").each(function() {
			var input = $(this),
				buffer = $.map(
				mask.split(""),
				function(c, i) {
					if (c != '?') {
						return defs[c] ? settings.placeholder : c;
					}
				}),
				focusText = input.val();

			function seekNext(pos) {
				while (++pos < len && !tests[pos]);
				return pos;
			}

			function seekPrev(pos) {
				while (--pos >= 0 && !tests[pos]);
				return pos;
			}
			function shiftL(begin,end) {
				var i,j;
				if (begin<0) {
					return;
				}
				for (i = begin, j = seekNext(end); i < len; i++) {
					if (tests[i]) {
						if (j < len && tests[i].test(buffer[j])) {
							buffer[i] = buffer[j];
							buffer[j] = settings.placeholder;
						} else {
							break;
						}
						j = seekNext(j);
					}
				}
				writeBuffer();
				input.caret(Math.max(firstNonMaskPos, begin));
			}

			function shiftR(pos) {
				var i,c,j,t;

				for (i = pos, c = settings.placeholder; i < len; i++) {
					if (tests[i]) {
						j = seekNext(i);
						t = buffer[i];
						buffer[i] = c;
						if (j < len && tests[j].test(t)) {
							c = t;
						} else {
							break;
						}
					}
				}
			}
			function keydownEvent(e) {
				var k = e.which,pos,begin,end;				
				/*backspace, delete, and escape get special treatment
				console.log("--------------------------------");
				console.log("Buffer before: "+buffer);
				console.log("k before: "+k);
				console.log("val before: "+input.val());
				console.log("--------------------------------");*/
				var val=input.val(); if (val===''){clearBuffer(0,len);}
				if (k===8){
					val=input.val().slice(0,-1); 
					buffer=val.split("").concat('','','','','','','','','','','','','','','')
					console.log("Buffer changed: "+buffer);
					return true;
				}
				//if (k===8){return true;}//mano
				if (k === 46 || (iPhone && k === 127)) {
					pos = input.caret();
					begin = pos.begin;
					end = pos.end;

					if (end - begin === 0) {
						begin=k!==46?seekPrev(begin):(end=seekNext(begin-1));
						end=k===46?seekNext(end):end;
					}
					clearBuffer(begin, end);
					shiftL(begin, end - 1);

					e.preventDefault();
				} else if (k == 27) {//escape
					input.val(focusText);
					input.caret(0, checkVal());
					e.preventDefault();
				}else{
					if (settings.fnBefore){settings.fnBefore.call(this,e,input,buffer,k);}
				}
				console.log("fnBefore2");
			}
			function keypressEvent(e) {
				var k = e.which,pos = input.caret(),p,c,next;

				if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {//Ignore
					return;
				} else if (k) {
					if (pos.end - pos.begin !== 0){
						clearBuffer(pos.begin, pos.end);
						shiftL(pos.begin, pos.end-1);
					}

					p = seekNext(pos.begin - 1); c = String.fromCharCode(k);
					//Vienas reiškia, kad testuojam tik pagal ta viena naujai irasoma verte, to kas jau ten yra netikrinam, nes buferis pas mus tuščias
					if (len===1){
						if (tests[0].test(c)) {
							input.val(input.val()+c).caret(next);
						}
					}
					else if (p < len) {
						if (tests[p].test(c)) {
							shiftR(p);

							buffer[p] = c;
							writeBuffer();
							next = seekNext(p);

							if(android){
								setTimeout($.proxy($.fn.caret,input,next),0);
							}else{
								input.caret(next);
							}
							if (settings.completed) {//&& next >= len
								settings.completed.call(input);
							}
						}
					}
					console.log("fnAfter2");
					if (settings.fnAfter){settings.fnAfter.call(this,input);}
					e.preventDefault();
				}
			}

			function clearBuffer(start, end) {
				var i;
				for (i = start; i < end && i < len; i++) {
					if (tests[i]) {
						buffer[i] = settings.placeholder;
					}
				}
			}

			function writeBuffer() { 
				//debugger;
				input.val(buffer.join(''));
			}

			function checkVal(allow) {
				//try to place characters where they belong
				//var test = input.val(),lastMatch = -1,i,c,length=test.length;
				var test=input.val(),lastMatch = -1,i,c;
				console.log("checkVal: "+test);
				if (settings.fnOnBlur){test=settings.fnOnBlur.call(this,input,test,settings);if (!test){return false;}}
				console.log("checkVal2: "+test);
				for (i = 0, pos = 0; i < len; i++) {
					if (tests[i]) {
						buffer[i] = settings.placeholder;
						while (pos++ < test.length) {
							c = test.charAt(pos - 1);
							if (tests[i].test(c)) {
								buffer[i] = c;
								lastMatch = i;
								break;
							}
						}
						if (pos > test.length) {
							break;
						}
					} else if (buffer[i] === test.charAt(pos) && i !== partialPosition) {
						pos++;
						lastMatch = i;
					}
				}
				if (allow) {
					writeBuffer();
				} else if (lastMatch + 1 < partialPosition) {
					input.val("");
					clearBuffer(0, len);
				} else {
					writeBuffer();
					input.val(input.val().substring(0, lastMatch + 1));
				}
				return (partialPosition ? i : firstNonMaskPos);
			}

			input.data($.mask.dataName,function(){
				return $.map(buffer, function(c, i) {
					return tests[i]&&c!=settings.placeholder ? c : null;
				}).join('');
			});

			if (!input.attr("readonly"))
				input
				.one("unmask", function() {
					input
						.unbind(".mask")
						.removeData($.mask.dataName);
				})
				.bind("focus.mask", function() {
					clearTimeout(caretTimeoutId);
					var pos,
						moveCaret;

					focusText = input.val();
					pos = checkVal();
					
					caretTimeoutId = setTimeout(function(){
						//writeBuffer(); jei mask netitinka vertes inpute iškirs
						if (pos == mask.length) {
							input.caret(0, pos);
						} else {
							input.caret(pos);
						}
					}, 10);
				})
				.bind("blur.mask", function() {
					checkVal();
					if (input.val() != focusText)
						input.change();
				})
				.bind("keydown.mask", keydownEvent)
				.bind("keypress.mask", keypressEvent)
				.bind(pasteEventName, function() {
					setTimeout(function() { 
						var pos=checkVal(true);
						input.caret(pos); 
						if (settings.completed && pos == input.val().length)
							settings.completed.call(input);
					}, 0);
				});
			checkVal(); //Perform initial check for existing values
		});
	}
});
})(jQuery);
(function($){
$.widget("ui.inputControl", {
_init : function() {//type:Date,Integer,Decimal
	var self = this;
	/* self.options.delay; */
	var  pattern={Date:'9999~99~99',Other:''};
	var set = {
			fnAfter_OnlyNoAndPoints:function(input){
				console.log("fnAfter");
				var newVal=input.val().replace(/[^0-9\.]+/g,'.')
				input.val(newVal);
			}, fnAfter_No:function(input){
				var newVal=input.val().replace(/[^0-9\.]+/g,'')
				input.val(newVal);
				console.log("fnAfter2"+input.val());
			}, fnAfter_Decimal:function(input){
				var newVal=input.val().replace(/[^0-9\.]+/g,'.')
				var rx=/^\d+\.?\d*/, newVal=rx.exec(newVal)[0];
				input.val(newVal);
			}, fnAfter_Time:function(input){
				var newVal=input.val().replace(/[^0-9\.]+/g,':')
				var match=newVal.match(/([01]?\d|2[0-3])(:)?([0-5]?\d?)/);//['visas','hh',':','mm']
				if (match[2]&&match[1].length===1){match[0]="0"+match[0];}//Jei yra '1:' -> '01:'
				input.val(match[0]);				
			}, fnBefore_Date:function(e,input,buffer,k){//k=keyPressed
				console.log("fnBefore");
				var val=input.val(), notNumeric=(k<48 || (k>57 && k < 96) || k > 105);
				if  (notNumeric&&val.length===2) {
					var No=parseInt(val,10);
					buffer.splice(0,2);/*panaikinam sena*/var old=val.split("");
					if (val>30){
						buffer.unshift("1","9",old[0],old[1],".");
						input.val(19+input.val()+".");
					}
					else if (val<30){
						buffer.unshift("2","0",old[0],old[1],".");
						input.val(20+input.val()+".");
					}
					e.preventDefault();
				}
				if  (notNumeric&&val.length===6) {
					buffer.splice(0,6);/*panaikinam sena*/
					var old=val.split("");
					console.log(old);
					old.splice(5,1,"0",val[5],".");// darašom priekyj nulį   be val[5] - 0 . 5
					// console.log(old);
					// console.log("buffer before");
					//buffer.unshift(JSON.stringify(old).replace("[","").replace("]",""));
					buffer.unshift(old[0],old[1],old[2],old[3],old[4],old[5],old[6],old[7]);//
					input.val(old.join(""));
					e.preventDefault();
				}
				// console.log("buffer after");
				// console.log(buffer);
			},fnOnBlur_Date:function(input,test,settings){
				var length=test.length
				if (length<10&&length>6){
					var oldVal=test.split(".");
					if (oldVal[1].length===1){oldVal[1]="0"+oldVal[1];}
					if (oldVal[2].length===1){oldVal[2]="0"+oldVal[2];}
					test=oldVal.join(".");
					input.val(test); 
				}
				if (settings.Validity){
					input.css("border-color","").data("notValid",false).parent().find("div.validity-tooltip").remove();today=oGLOBAL.date.getTodayString()
					var dateFormat=App.userData.dateFormat,error="",valSet=settings.Validity, diff=moment().diff(test,"hours");//days suapvalina
					if (! moment(test,dateFormat).isValid()){error="Netinkamas datos formatas. Pakeiskite į tokį "+dateFormat;}
					else if (valSet==="less"&&diff<0){error="Data negali būt didesnė už šiandieną - "+today;}
					else if (valSet==="more"&&diff>24){error="Data negali būt mažesnė už šiandieną - "+today;}
					if (error) {input.css("border-color","#eb5a44").data("notValid",true).parent().append("<div class='validity-tooltip'>"+error+"</div>");} //input.focus();}
				}
				return test;
			},fnOnBlur_No:function(input,test){
				var newVal=/^\d+\.?\d*/.exec(test);
				if (!newVal){return false;}
				newVal=newVal[0];
				if (newVal.slice(-1)==='.'){newVal+="0";}//Jei gale taskas dadedu nuli
				input.val(newVal);
				return false;
			},fnOnBlur_Time:function(input,test){
				var newVal, match=input.val().match(/(2[0-3]|[01]?\d)?(:)?([0-5]?\d)/);//['visas' 0,'hh' 1,':' 2,'mm' 3]
				if (match) {
					newVal=match[0];
					if (match[2]){//Jei yra ':'
						if (match[3].length===1){newVal=newVal.replace(":",":0");}//'01:1' -> '01:01'
					} else {
						if(newVal.length===1){newVal="0"+newVal;}
						newVal=newVal+":00";
					}
				} else { newVal="00:00";}		
				input.val(newVal);				
				return false;
			}			
		}
	var t=self.options.type;
	if (t==='Date'){$(this.element).mask(pattern.Date,{fnAfter:set.fnAfter_OnlyNoAndPoints,fnBefore:set.fnBefore_Date,fnOnBlur:set.fnOnBlur_Date,Validity:self.options.Validity});}
	else if (t==='Integer'){$(this.element).mask('9',{fnAfter:set.fnAfter_No,fnOnBlur:set.fnOnBlur_No});} //jeigu len=1 tikrins tik pagal ta viena
	else if (t==='Decimal'){$(this.element).mask('*',{fnAfter:set.fnAfter_Decimal,fnOnBlur:set.fnOnBlur_No});} 
	else if (t==='Time'){$(this.element).mask('*',{fnAfter:set.fnAfter_Time,fnOnBlur:set.fnOnBlur_Time});} 
	else console.error('Wrong type: '+t);
},
	options: {
		delay: 500
	}
});
})(jQuery);
/* Lithuanian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas@avalon.lt> */
jQuery(function ($) {
	$.datepicker.regional['lt'] = {
		closeText: 'Uždaryti',
		prevText: '&#x3c;Atgal',
		nextText: 'Pirmyn&#x3e;',
		currentText: 'Šiandien',
		monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
					 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
		monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
					 'Lie', 'Rugp', 'Rugs', 'Spa', 'Lap', 'Gru'],
		dayNames: ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'],
		dayNamesShort: ['sek', 'pir', 'ant', 'tre', 'ket', 'pen', 'šeš'],
		dayNamesMin: ['Se', 'Pr', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
		weekHeader: 'Sv',
		dateFormat: 'yy.mm.dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional['lt']);
	$.datepicker.setDefaults({
		duration: 'fast',
		changeMonth: true,
		changeYear: true,
		showOtherMonths: true,
		constrainInput:false
	});
});
(function ($) {
	$.fn.extend({
		tblSortable: function (options) {
			var defaults = { cols: [], controller: null, sortedCol: 1 }
			var opt = $.extend(defaults, options), table=this;
			return table.each(function () {
				$(this).find('th').each(function(index){
					if (opt.cols[index]){
						$(this).addClass("clickable").on("click",function(e){
							table.spinner();
							var $e=(e.target.tagName.toUpperCase()==="TH")?$(e.target ):$(e.target ).closest("th"), classes=$e.find("span").attr("class"),newClass,n="ui-icon-carat-1-n",s="ui-icon-carat-1-s",ns="ui-icon-carat-2-n-s";				
							if (classes.indexOf(ns)>-1){newClass=n;}	//Nerūšiuota	
							else if (classes.indexOf(n)>-1){newClass=s;}//desc
							else if (classes.indexOf(s)>-1){newClass=n;}//asc
							else  throw new Error("no needed class found");
							
							$e.closest("tr").find("span."+n).toggleClass(n+" "+ns);
							$e.closest("tr").find("span."+s).toggleClass(s+" "+ns);
							$e.find("span").toggleClass(ns+" "+newClass);
							
							var c=App[opt.controller];							
							if (newClass===n){c.set("sortAscending", true);}else{c.set("sortAscending", false);}
							c.set("sortProperties",[opt.cols[index]]);
							c.set("content",c.get("arrangedContent"));
							if (opt.refreshView&&!e.isTrigger) { opt.refreshView.call(c);}//kai su funkcija pats saves nepaleis, turinys turi but jau išrusiuotas pries tai (!e.isTrigger||e.isOk)
							table.spinner('remove');
						}).append('<span class="ui-icon ui-icon-carat-2-n-s ui-tblHead-icon"></span>');
						if (index===opt.sortedCol){$(this).trigger("click"); }//{type:"click",isOk:true}
					}
				});
				
			});
		}
	});

})(jQuery);
/*
*   jQuery.stickyPanel
*   ----------------------
*   version: 2.0.1
*   date: 3/13/13
*   Copyright (c) 2011 Donny Velazquez
*   http://donnyvblog.blogspot.com/
*   http://code.google.com/p/sticky-panel/
*   Licensed under the Apache License 2.0
*   revisions
*   -----------------------
*   11/19/12 - re-architect plugin to use jquery.com best practices http://docs.jquery.com/Plugins/Authoring
*/
(function ($) {
var methods = {
        options: {
            // Use this to set the top margin of the detached panel.
            topPadding: 0,
            // This class is applied when the panel detaches.
            afterDetachCSSClass: "",
            // When set to true the space where the panel was is kept open.
            savePanelSpace: false,
            // Event fires when panel is detached
            // function(detachedPanel, panelSpacer){....}
            onDetached: null,
            // Event fires when panel is reattached
            // function(detachedPanel){....}
            onReAttached: null,
            // Set this using any valid jquery selector to 
            // set the parent of the sticky panel.
            // If set to null then the window object will be used.
            parentSelector: null
        },
        init: function (options) {
            var options = $.extend({element:$(this)}, methods.options, options);
            return this.each(function () {
                var id = Math.ceil(Math.random() * 9999); /* Pick random number between 1 and 9999 */
                $(this).data("stickyPanel.state", {
                    stickyPanelId: id,
                    isDetached: false,
                    parentContainer: $((options.parentSelector ? options.parentSelector : window)),
                    options: options					
                });
                if (options.parentSelector) {
                    var p = $(this).data("stickyPanel.state").parentContainer.css("position");
                    switch (p) {
                        case "inherit":
                        case "static":
                            $(this).data("stickyPanel.state").parentContainer.css("position", "relative");
                            break;
                    }
                }
                $(this).data("stickyPanel.state").parentContainer.bind("scroll.stickyPanel_" + id, {
                    selected: $(this)
                }, methods.scroll);
		$(window).resize(function(){
			methods.unstick(options.element);
			return false;
			Em.run.next(methods,function(){this.scroll(options.element);});//call resize to remove add fix
		}); 					
            });
        },
        scroll: function (event) {
	//var node = event.data.selected;
	var node = (event.originalEvent)?event.data.selected:event;//call from resize to remove resize bug
	var o = node.data("stickyPanel.state").options//event.data.options;
	var parentContainer = node.data("stickyPanel.state").parentContainer;
	var parentHeight = parentContainer.height();
	var nodeHeight = node.outerHeight(true);
	if (nodeHeight+50>parentHeight){return false;}
            var scrollTop = o.parentSelector ? parentContainer.scrollTop() : $(document).scrollTop();
            var docHeight = o.parentSelector ? parentContainer.height() : $(document).height();
            var HeightDiff = o.parentSelector ? parentHeight : (docHeight - parentHeight);
            var topdiff = node.position().top - o.topPadding;
            var TopDiff = topdiff < 0 ? 0 : topdiff;
            var isDetached = node.data("stickyPanel.state").isDetached;
            // when top of parent reaches the top of the panel detach
            if (scrollTop <= HeightDiff && // Fix for rubberband scrolling in Safari on Lion
        	    scrollTop > TopDiff &&
                !isDetached) {
                node.data("stickyPanel.state").isDetached = true;
                // topPadding
                var newNodeTop = 0;
                if (o.topPadding != "undefined") {
                    newNodeTop = newNodeTop + o.topPadding;
                }
                // get top & left before adding spacer
                var nodeLeft = o.parentSelector ? node.position().left : node.offset().left;
                var nodeTop = o.parentSelector ? node.position().top : node.offset().top;
                // save panels top
                node.data("PanelsTop", nodeTop - newNodeTop);
                // MOVED: savePanelSpace before afterDetachCSSClass to handle afterDetachCSSClass changing size of node
                // savePanelSpace
                var PanelSpacer = null;
                if (o.savePanelSpace == true) {
                    var nodeWidth = node.outerWidth(true);
                    var nodeCssfloat = node.css("float");
                    var nodeCssdisplay = node.css("display");
                    var randomNum = Math.ceil(Math.random() * 9999); /* Pick random number between 1 and 9999 */
                    node.data("stickyPanel.PanelSpaceID", "stickyPanelSpace" + randomNum);
                    PanelSpacer = $("<div id='" + node.data("stickyPanel.PanelSpaceID") + "' style='width:" +nodeWidth + "px;height:" + nodeHeight + "px;float:" + nodeCssfloat + ";display:" + nodeCssdisplay + ";'>&#20;</div>");
                    node.before(PanelSpacer);
                }
                // afterDetachCSSClass
                if (o.afterDetachCSSClass != "") {
                    node.addClass(o.afterDetachCSSClass);
                }
                // save inline css
                node.data("Original_Inline_CSS", (!node.attr("style") ? "" : node.attr("style")));
                // detach panel
                node.css({
                    "margin": 0,
                    "left": nodeLeft,
                    "top": newNodeTop,
                    "position": o.parentSelector ? "absolute" : "fixed",
					"width": node.outerWidth(false)
                });
                // fire detach event
                if (o.onDetached)
                    o.onDetached(node, PanelSpacer);
            }
            // Update top for div scrolling
            if (o.parentSelector && isDetached) {
                node.css({
                    "top": o.topPadding ? (scrollTop + o.topPadding) : scrollTop
                });
            }
            // ADDED: css top check to avoid continuous reattachment
            if (scrollTop <= node.data("PanelsTop") &&
                node.css("top") != "auto" &&
                isDetached) {
                methods.unstick(node);
            }
        },
        unstick: function (nodeRef) {
            var node = nodeRef ? nodeRef : this; ;
            node.data("stickyPanel.state").isDetached = false;
            var o = node.data("stickyPanel.state").options;
            if (o.savePanelSpace == true) {
                $("#" + node.data("stickyPanel.PanelSpaceID")).remove();
            }
            // attach panel
            node.attr("style", node.data("Original_Inline_CSS"));
            if (o.afterDetachCSSClass != "") {
                node.removeClass(o.afterDetachCSSClass);
            }
            // fire reattached event
            if (o.onReAttached)
                o.onReAttached(node);
            if (!nodeRef)
                methods._unstick(node);
        },
        _unstick: function (nodeRef) {
            nodeRef.data("stickyPanel.state").parentContainer.unbind("scroll.stickyPanel_" + nodeRef.data("stickyPanel.state").stickyPanelId);
        }
    };
    $.fn.stickyPanel = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.stickyPanel');
        }
    };
})(jQuery);
(function( $ ){
	//plugin buttonset vertical
	$.fn.buttonsetv = function() {
		//$(':radio, :checkbox', this).wrap('<div/>');// style="margin: 1px"
		return $(this).buttonset();
		
		//$('label:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
		//$('label:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');
		
        // Tomas 2013.08.08 $('label:first', this).css('border-bottom', 'none');
        // Tomas 2013.08.08 $('label:last', this).css('border-bottom', 'solid 1px #ccc');
		// $('label', this).each(function(index){
			// w = $(this).width();
			// if (w > mw) mw = w; 
		// })
		// $('label', this).each(function(index){
			// $(this).width(mw);
		// })
	};
})( jQuery );
jQuery.loadScript = function (url, arg1, arg2) {
	var cache = false, callback = null;
	//arg1 and arg2 can be interchangable
	if ($.isFunction(arg1)){
		callback = arg1;	cache = arg2 || cache;
	} else {
		cache = arg1 || cache; callback = arg2 || callback;
	}
							 
	var load = true;
	//check all existing script tags in the page for the url
	jQuery('script[type="text/javascript"]')
		.each(function () { 
			return load = (url != $(this).attr('src')); 
		});
	if (load){
		//didn't find it in the page, so load it
		jQuery.ajax({type: 'GET',url: url,success: 
			callback,
		dataType: 'script',cache: cache});
	} else {
		//already loaded so just call the callback
		if (jQuery.isFunction(callback)) {
			callback.call(this);
		};
	};
};
// jQuery.download = function(url, data, method){
	// //url and data options required
	// if( url && data ){ 
		// //data can be string of parameters or array/object
		// data = typeof data == 'string' ? data : jQuery.param(data);
		// //split params into form inputs
		// var inputs = '';
		// jQuery.each(data.split('&'), function(){ 
			// var pair = this.split('=');
			// inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		// });
		// //send request
		// jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		// .appendTo('body').submit().remove();
	// };
// };