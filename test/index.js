/**
   * mystores v0.2.0
   * A unified web storage interface for localStorage/sessionStorage/cookie/indexDB/...
   * @holyhigh2
   * https://github.com/holyhigh2/mystores
   */
  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myss = {}));
})(this, (function (exports) { 'use strict';

    function _getGrouped(str) {
        return (str.match(/[A-Z]{2,}|([^\s-_]([^\s-_A-Z]+)?(?=[\s-_A-Z]))|([^\s-_]+(?=$))/g) || []);
    }

    function isNil(v) {
        return v === null || v === undefined;
    }

    function toString(v) {
        if (isNil(v))
            return '';
        if (v === 0 && 1 / v < 0)
            return '-0';
        return v.toString();
    }

    function upperFirst(str) {
        str = toString(str);
        if (str.length < 1)
            return str;
        return str[0].toUpperCase() + str.substring(1);
    }

    function pascalCase(str) {
        return _getGrouped(toString(str)).reduce((acc, v) => acc + upperFirst(v.toLowerCase()), '');
    }

    function lowerFirst(str) {
        str = toString(str);
        if (str.length < 1)
            return str;
        return str[0].toLowerCase() + str.substring(1);
    }

    function camelCase(str) {
        return lowerFirst(pascalCase(toString(str)));
    }

    function capitalize(str) {
        str = toString(str);
        if (str.length < 1)
            return str;
        return str[0].toUpperCase() + toString(str.substring(1)).toLowerCase();
    }

    function endsWith(str, searchStr, position) {
        return toString(str).endsWith(searchStr, position);
    }

    const REG_EXP_KEYWORDS = [
        '\\',
        '$',
        '(',
        ')',
        '*',
        '+',
        '.',
        '[',
        ']',
        '?',
        '^',
        '{',
        '}',
        '|',
    ];
    function escapeRegExp(str) {
        return toString(str)
            .split('')
            .reduce((a, b) => a + (REG_EXP_KEYWORDS.includes(b) ? '\\' + b : b), '');
    }

    /**
     * 查找指定值在字符串中首次出现的位置索引
     *
     * @example
     * //10
     * console.log(_.indexOf('cyberfunc.js','js'))
     * //10
     * console.log(_.indexOf('cyberfunc.js','js',5))
     *
     * @param str
     * @param search 指定字符串
     * @param [fromIndex=0] 起始索引
     * @returns 第一个匹配搜索字符串的位置索引或-1
     */
    function indexOf(str, search, fromIndex) {
        str = toString(str);
        return str.indexOf(search, fromIndex || 0);
    }

    function lowerCase(str) {
        return toString(str).toLowerCase();
    }

    function kebabCase(str) {
        return lowerCase(_getGrouped(toString(str)).join('-'));
    }

    function lastIndexOf(str, search, fromIndex) {
        str = toString(str);
        return str.lastIndexOf(search, fromIndex || Infinity);
    }

    function padEnd(str, len, padString) {
        str = toString(str);
        if (str.padEnd)
            return str.padEnd(len, padString);
        padString = padString || ' ';
        const diff = len - str.length;
        if (diff < 1)
            return str;
        let fill = '';
        let i = Math.ceil(diff / padString.length);
        while (i--) {
            fill += padString;
        }
        return str + fill.substring(0, diff);
    }

    function padStart(str, len, padString) {
        str = toString(str);
        if (str.padStart)
            return str.padStart(len, padString);
        padString = padString || ' ';
        const diff = len - str.length;
        if (diff < 1)
            return str;
        let fill = '';
        let i = Math.ceil(diff / padString.length);
        while (i--) {
            fill += padString;
        }
        return fill.substring(fill.length - diff, fill.length) + str;
    }

    function padZ(str, len) {
        return padStart(str, len, '0');
    }

    function repeat(str, count) {
        str = toString(str);
        count = Number.isFinite(count) ? count : 0;
        if (count < 1)
            return '';
        if (str.repeat)
            return str.repeat(count);
        let i = count;
        let rs = '';
        while (i--) {
            rs += str;
        }
        return rs;
    }

    function replace(str, searchValue, replaceValue) {
        return toString(str).replace(searchValue, replaceValue);
    }

    function isRegExp(v) {
        return typeof v === 'object' && v instanceof RegExp;
    }

    function isString(v) {
        return typeof v === 'string' || v instanceof String;
    }

    const PRIMITIVE_TYPES = [
        'string',
        'number',
        'bigint',
        'boolean',
        'undefined',
        'symbol',
    ];
    function isObject(v) {
        return null !== v && PRIMITIVE_TYPES.indexOf(typeof v) < 0;
    }

    function replaceAll(str, searchValue, replaceValue) {
        let searchExp;
        let strRs = toString(str);
        if (isRegExp(searchValue)) {
            searchExp = searchValue;
            if (!searchValue.global) {
                searchExp = new RegExp(searchValue, searchValue.flags + 'g');
            }
            return strRs.replace(searchExp, replaceValue);
        }
        else if (isString(searchValue)) {
            searchExp = new RegExp(escapeRegExp(searchValue), 'g');
            return strRs.replace(searchExp, replaceValue);
        }
        else if (isObject(searchValue)) {
            const ks = Object.keys(searchValue);
            for (let i = ks.length; i--;) {
                const k = ks[i];
                const v = searchValue[k];
                searchExp = new RegExp(escapeRegExp(k), 'g');
                strRs = strRs.replace(searchExp, v);
            }
            return strRs;
        }
        return str;
    }

    function snakeCase(str) {
        return lowerCase(_getGrouped(toString(str)).join('_'));
    }

    function split(str, separator, limit) {
        return toString(str).split(separator, limit);
    }

    function startsWith(str, searchStr, position) {
        return toString(str).startsWith(searchStr, position);
    }

    function substring(str, indexStart, indexEnd) {
        str = toString(str);
        indexStart = indexStart || 0;
        return str.substring(indexStart, indexEnd);
    }

    function test(str, pattern, flags) {
        let regExp = pattern;
        if (!isRegExp(regExp)) {
            regExp = new RegExp(pattern, flags);
        }
        return regExp.test(str);
    }

    function toFixed(v, scale) {
        scale = scale || 0;
        const num = parseFloat(v + '');
        if (isNaN(num))
            return v;
        const isNeg = num < 0 ? -1 : 1;
        const tmp = (num + '').split('.');
        const frac = tmp[1] || '';
        const diff = scale - frac.length;
        let rs = '';
        if (diff > 0) {
            let z = padEnd(frac, scale, '0');
            z = z ? '.' + z : z;
            rs = tmp[0] + z;
        }
        else if (diff === 0) {
            rs = num + '';
        }
        else {
            let integ = parseInt(tmp[0]);
            const i = frac.length + diff;
            const round = frac.substring(i);
            let keep = frac.substring(0, i);
            let startZ = false;
            if (keep[0] === '0' && keep.length > 1) {
                keep = 1 + keep.substring(1);
                startZ = true;
            }
            let n = Math.round(parseFloat(keep + '.' + round));
            const strN = n + '';
            if (n > 0 && strN.length > keep.length) {
                integ += 1 * isNeg;
                n = strN.substring(1);
            }
            if (startZ) {
                n = parseInt(strN[0]) - 1 + strN.substring(1);
            }
            n = n !== '' && keep.length > 0 ? '.' + n : n;
            rs = integ + n + '';
            if (isNeg < 0 && rs[0] !== '-')
                rs = '-' + rs;
        }
        return rs;
    }

    function trim(str) {
        str = toString(str);
        return str.trim();
    }

    function trimEnd(str) {
        str = toString(str);
        if (str.trimEnd)
            return str.trimEnd();
        return str.replace(/\s*$/, '');
    }

    function trimStart(str) {
        str = toString(str);
        if (str.trimStart)
            return str.trimStart();
        return str.replace(/^\s*/, '');
    }

    function truncate(str, len, options) {
        str = toString(str);
        if (str.length <= len)
            return str;
        if (!isObject(options)) {
            options = { omission: '...' };
        }
        options.omission = options.omission || '...';
        str = str.substring(0, len);
        if (options.separator) {
            let separator = options.separator;
            if (!isObject(separator)) {
                separator = new RegExp(escapeRegExp(separator), 'g');
            }
            else if (!separator.global) {
                separator = new RegExp(separator, separator.flags + 'g');
            }
            let rs;
            let tmp;
            while ((tmp = separator.exec(str)) !== null) {
                rs = tmp;
            }
            if (rs) {
                str = str.substring(0, rs.index);
            }
        }
        return str + options.omission;
    }

    function upperCase(str) {
        return toString(str).toUpperCase();
    }

    var str = /*#__PURE__*/Object.freeze({
        __proto__: null,
        camelCase: camelCase,
        capitalize: capitalize,
        endsWith: endsWith,
        escapeRegExp: escapeRegExp,
        indexOf: indexOf,
        kebabCase: kebabCase,
        lastIndexOf: lastIndexOf,
        lowerCase: lowerCase,
        lowerFirst: lowerFirst,
        padEnd: padEnd,
        padStart: padStart,
        padZ: padZ,
        pascalCase: pascalCase,
        repeat: repeat,
        replace: replace,
        replaceAll: replaceAll,
        snakeCase: snakeCase,
        split: split,
        startsWith: startsWith,
        substring: substring,
        test: test,
        toFixed: toFixed,
        toString: toString,
        trim: trim,
        trimEnd: trimEnd,
        trimStart: trimStart,
        truncate: truncate,
        upperCase: upperCase,
        upperFirst: upperFirst
    });

    function formatNumber(v, pattern = '#,##0.00') {
        if (v === Infinity)
            return '\u221E';
        if (v === -Infinity)
            return '-\u221E';
        if (Number.isNaN(v))
            return '\uFFFD';
        if (isNaN(parseFloat(v + '')))
            return v + '';
        let formatter = cache$1[pattern];
        if (!formatter) {
            const match = pattern.match(/(?<integer>[0,#]+)(?:\.(?<fraction>[0#]+))?(?<suffix>[%\u2030E])?/);
            if (match == null) {
                return v + '';
            }
            let integerPtn = match.groups?.integer || '';
            const fractionPtn = match.groups?.fraction || '';
            let suffix = match.groups?.suffix || '';
            if (!integerPtn ||
                integerPtn.indexOf('0#') > -1 ||
                fractionPtn.indexOf('#0') > -1)
                return v + '';
            const ptnPart = match[0];
            const endsPart = pattern.split(ptnPart);
            const rnd = true;
            const isPercentage = suffix === '%';
            const isPermillage = suffix === '\u2030';
            const isScientific = suffix === 'E';
            const groupMatch = integerPtn.match(/,[#0]+$/);
            let groupLen = -1;
            if (groupMatch) {
                groupLen = groupMatch[0].substring(1).length;
                integerPtn = integerPtn.replace(/^.*,(?=[^,])/, '');
            }
            let zeroizeLen = integerPtn.indexOf('0');
            if (zeroizeLen > -1) {
                zeroizeLen = integerPtn.length - zeroizeLen;
            }
            let fixedLen = Math.max(fractionPtn.lastIndexOf('0'), fractionPtn.lastIndexOf('#'));
            if (fixedLen > -1) {
                fixedLen += 1;
            }
            formatter = (val) => {
                const num = parseFloat(val + '');
                let number = num;
                let exponent = 0;
                if (isPercentage) {
                    number = number * 100;
                }
                else if (isPermillage) {
                    number = number * 1000;
                }
                else if (isScientific) {
                    const str = number + '';
                    const pair = str.split('.');
                    if (number >= 1) {
                        exponent = pair[0].length - 1;
                    }
                    else if (number < 1) {
                        const fraStr = pair[1];
                        exponent = fraStr.replace(/^0+/, '').length - fraStr.length - 1;
                    }
                    number = number / 10 ** exponent;
                }
                const numStr = number + '';
                let integer = parseInt(numStr);
                const pair = numStr.split('.');
                const fraction = pair[1] || '';
                let dStr = '';
                if (fractionPtn) {
                    if (fraction.length >= fixedLen) {
                        dStr = parseFloat('0.' + fraction).toFixed(fixedLen);
                        dStr = dStr.substring(1);
                    }
                    else {
                        dStr =
                            '.' +
                                fractionPtn.replace(/[0#]/g, (tag, i) => {
                                    const l = fraction[i];
                                    return l == undefined ? (tag === '0' ? '0' : '') : l;
                                });
                    }
                    if (dStr.length < 2) {
                        dStr = '';
                    }
                }
                else {
                    let carry = 0;
                    if (fraction && rnd) {
                        carry = Math.round(parseFloat('0.' + fraction));
                    }
                    integer += carry;
                }
                let iStr = integer + '';
                let sym = num < 0 ? '-' : '';
                if (iStr[0] === '-' || iStr[0] === '+') {
                    sym = iStr[0];
                    iStr = iStr.substring(1);
                }
                if (groupLen > -1 && iStr.length > groupLen) {
                    const reg = new RegExp('\\B(?=(\\d{' + groupLen + '})+$)', 'g');
                    iStr = iStr.replace(reg, ',');
                }
                else if (iStr.length < integerPtn.length) {
                    const integerPtnLen = integerPtn.length;
                    const iStrLen = iStr.length;
                    iStr = integerPtn.replace(/[0#]/g, (tag, i) => {
                        if (integerPtnLen - i > iStrLen)
                            return tag === '0' ? '0' : '';
                        const l = iStr[iStrLen - (integerPtnLen - i)];
                        return l == undefined ? (tag === '0' ? '0' : '') : l;
                    });
                }
                if (isScientific) {
                    suffix = 'e' + exponent;
                }
                let rs = sym + iStr + dStr + suffix;
                return (endsPart[0] || '') + rs + (endsPart[1] || '');
            };
        }
        return formatter(v);
    }
    const cache$1 = {};

    function toNumber(v) {
        if (v === undefined || v === null)
            return NaN;
        return Number(v);
    }

    function gt(a, b) {
        return toNumber(a) > toNumber(b);
    }

    function gte(a, b) {
        return toNumber(a) >= toNumber(b);
    }

    function lt(a, b) {
        return toNumber(a) < toNumber(b);
    }

    function inRange(v, start, end) {
        start = start || 0;
        if (end === undefined) {
            end = start;
            start = 0;
        }
        if (start > end) {
            const tmp = end;
            end = start;
            start = tmp;
        }
        return gte(v, start) && lt(v, end);
    }

    function lte(a, b) {
        return toNumber(a) <= toNumber(b);
    }

    function toInteger(v) {
        if (v === null || v === undefined)
            return 0;
        return parseInt(v);
    }

    var num = /*#__PURE__*/Object.freeze({
        __proto__: null,
        formatNumber: formatNumber,
        gt: gt,
        gte: gte,
        inRange: inRange,
        lt: lt,
        lte: lte,
        toInt: toInteger,
        toInteger: toInteger,
        toNumber: toNumber
    });

    const TIME_MAP$1 = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
    };
    function addTime(date, amount, type) {
        type = type || 's';
        const d = new Date(date);
        switch (type) {
            case 'y':
                d.setFullYear(d.getFullYear() + amount);
                break;
            case 'M':
                d.setMonth(d.getMonth() + amount);
                break;
            default:
                let times = 0;
                times = amount * TIME_MAP$1[type];
                d.setTime(d.getTime() + times);
        }
        return d;
    }

    const TIME_MAP = {
        s: 1000,
        m: 1000 * 60,
        h: 1000 * 60 * 60,
        d: 1000 * 60 * 60 * 24,
    };
    function compareDate(date1, date2, type) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        type = type || 'd';
        if (type === 'y') {
            return d1.getFullYear() - d2.getFullYear();
        }
        else if (type === 'M') {
            return ((d1.getFullYear() - d2.getFullYear()) * 12 +
                (d1.getMonth() - d2.getMonth()));
        }
        else {
            switch (type) {
                case 'd':
                    d1.setHours(0, 0, 0, 0);
                    d2.setHours(0, 0, 0, 0);
                    break;
                case 'h':
                    d1.setHours(d1.getHours(), 0, 0, 0);
                    d2.setHours(d2.getHours(), 0, 0, 0);
                    break;
                case 'm':
                    d1.setHours(d1.getHours(), d1.getMinutes(), 0, 0);
                    d2.setHours(d2.getHours(), d2.getMinutes(), 0, 0);
                    break;
            }
            const diff = d1.getTime() - d2.getTime();
            return diff / TIME_MAP[type];
        }
    }

    function isInteger(v) {
        return Number.isInteger(v);
    }

    function isArray(v) {
        return Array.isArray(v);
    }

    function toDate(value) {
        let rs;
        if (isInteger(value)) {
            if (value < TIMESTAMP_MIN) {
                value = toNumber(padEnd(value + '', 13, '0'));
            }
            else if (value > TIMESTAMP_MAX) {
                value = 0;
            }
            rs = new Date(value);
        }
        else if (isArray(value)) {
            rs = new Date(...value);
        }
        else {
            rs = new Date(value);
        }
        if (rs.toDateString() === 'Invalid Date') {
            rs = new Date(0);
        }
        return rs;
    }
    const TIMESTAMP_MIN = 1000000000000;
    const TIMESTAMP_MAX = 9999999999999;

    function isLeapYear(date) {
        date = toDate(date);
        const year = date.getFullYear();
        return year % 400 === 0 || year % 4 === 0;
    }

    const DaysOfMonth = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function getDayOfYear(date) {
        date = toDate(date);
        const leapYear = isLeapYear(date);
        const month = date.getMonth();
        let dates = date.getDate();
        for (let i = 0; i < month; i++) {
            const ds = DaysOfMonth[i] || (leapYear ? 29 : 28);
            dates += ds;
        }
        return dates;
    }

    function getWeekOfMonth(date) {
        date = toDate(date);
        const year = date.getFullYear();
        let firstDayOfMonth = new Date(year, date.getMonth(), 1);
        let extraWeek = 0;
        let d = firstDayOfMonth.getDay();
        if (d === 0 || d > 5) {
            extraWeek = 1;
        }
        return Math.ceil(date.getDate() / 7) + extraWeek;
    }

    function getWeekOfYear(date) {
        date = toDate(date);
        const year = date.getFullYear();
        let firstDayOfYear = new Date(year, 0, 1);
        let extraWeek = 0;
        let d = firstDayOfYear.getDay();
        if (d === 0 || d > 5) {
            extraWeek = 1;
        }
        return Math.ceil(getDayOfYear(date) / 7) + extraWeek;
    }

    const INVALID_DATE = '';
    const SearchExp = /y{2,4}|M{1,3}|d{1,4}|h{1,2}|m{1,2}|s{1,2}|Q{1,2}|E{1,2}|W{1,2}|w{1,2}/gm;
    const pad0 = (str) => str.length > 1 ? '' : '0' + str;
    const pad00 = (str) => str.length > 2 ? '' : (str.length > 1 ? '0' + str : '00' + str);
    function formatDate(val, pattern) {
        pattern = pattern || 'yyyy-MM-dd hh:mm:ss';
        let formatter = cache[pattern];
        if (!formatter) {
            formatter = (date) => {
                if (!date)
                    return INVALID_DATE;
                let ptn = pattern + '';
                if (typeof date === 'string' || typeof date === 'number') {
                    date = toDate(date);
                }
                if (date.toString().indexOf('Invalid') > -1)
                    return INVALID_DATE;
                let valDate = date;
                return ptn.replace(SearchExp, (tag) => {
                    const cap = tag[0];
                    const month = valDate.getMonth();
                    const locale = Locale[Lang];
                    if (cap === 'y') {
                        const year = valDate.getFullYear();
                        return tag === 'yy' ? (year % 100) + '' : year + '';
                    }
                    else if (cap === 'M') {
                        switch (tag) {
                            case 'M':
                                return month + 1 + '';
                            case 'MM':
                                return pad0(month + 1 + '');
                            case 'MMM':
                                return locale?.months[month] || tag;
                        }
                    }
                    else if (cap == 'd') {
                        let dayOfMonth = valDate.getDate();
                        switch (tag) {
                            case 'd':
                                return dayOfMonth + '';
                            case 'dd':
                                return pad0(dayOfMonth + '');
                            case 'ddd':
                                return getDayOfYear(valDate) + '';
                            case 'dddd':
                                return pad00(getDayOfYear(valDate) + '');
                        }
                    }
                    else if (cap == 'h') {
                        const val = valDate.getHours() + '';
                        return tag.length > 1 ? pad0(val) : val;
                    }
                    else if (cap == 'm') {
                        const val = valDate.getMinutes() + '';
                        return tag.length > 1 ? pad0(val) : val;
                    }
                    else if (cap == 's') {
                        const val = valDate.getSeconds() + '';
                        return tag.length > 1 ? pad0(val) : val;
                    }
                    else if (cap == 'Q') {
                        const quarter = Math.ceil(month / 3);
                        if (tag === 'Q')
                            return quarter + '';
                        return locale?.quarters[quarter - 1] || tag;
                    }
                    else if (cap === 'W') {
                        const val = getWeekOfYear(valDate) + '';
                        return tag.length > 1 ? pad0(val) : val;
                    }
                    else if (cap === 'w') {
                        const val = getWeekOfMonth(valDate);
                        if (tag === 'w')
                            return val + '';
                        return locale?.weeks[val - 1] || tag;
                    }
                    else if (cap === 'E') {
                        let dayOfWeek = valDate.getDay();
                        dayOfWeek = dayOfWeek < 1 ? 7 : dayOfWeek;
                        return tag === 'E'
                            ? dayOfWeek + ''
                            : locale?.days[dayOfWeek - 1] || tag;
                    }
                    return tag;
                });
            };
        }
        return formatter(val);
    }
    const cache = {};
    const Locale = {
        'zh-CN': {
            quarters: ['一季度', '二季度', '三季度', '四季度'],
            months: [
                '一',
                '二',
                '三',
                '四',
                '五',
                '六',
                '七',
                '八',
                '九',
                '十',
                '十一',
                '十二',
            ].map((v) => v + '月'),
            weeks: ['一', '二', '三', '四', '五', '六'].map((v) => '第' + v + '周'),
            days: ['一', '二', '三', '四', '五', '六', '日'].map((v) => '星期' + v),
        },
    };
    let Lang = globalThis.navigator?.language || 'zh-CN';
    formatDate.locale = function (lang, options) {
        let locale = Locale[lang];
        if (!locale) {
            locale = Locale[lang] = { quarters: [], months: [], weeks: [], days: [] };
        }
        if (options?.quarters) {
            locale.quarters = options?.quarters;
        }
        if (options?.months) {
            locale.months = options?.months;
        }
        if (options?.weeks) {
            locale.weeks = options?.weeks;
        }
        if (options?.days) {
            locale.days = options?.days;
        }
    };
    formatDate.lang = function (lang) {
        Lang = lang;
    };

    function isSameDay(date1, date2) {
        return (new Date(date1).setHours(0, 0, 0, 0) ===
            new Date(date2).setHours(0, 0, 0, 0));
    }

    function now() {
        return Date.now();
    }

    var datetime = /*#__PURE__*/Object.freeze({
        __proto__: null,
        addTime: addTime,
        compareDate: compareDate,
        formatDate: formatDate,
        getDayOfYear: getDayOfYear,
        getWeekOfMonth: getWeekOfMonth,
        getWeekOfYear: getWeekOfYear,
        isLeapYear: isLeapYear,
        isSameDay: isSameDay,
        now: now,
        toDate: toDate
    });

    function isFunction(v) {
        return typeof v == 'function' || v instanceof Function;
    }

    function isArrayLike(v) {
        if (isString(v) && v.length > 0)
            return true;
        if (!isObject(v))
            return false;
        const list = v;
        if (list.length !== undefined) {
            const proto = list.constructor.prototype;
            if (isFunction(proto.item))
                return true;
            if (isFunction(list[Symbol.iterator]))
                return true;
        }
        return false;
    }

    function isBlank(v) {
        return v === null || v === undefined || (v + '').trim().replace(/\t|\n|\f|\r/mg, '').length === 0;
    }

    function isBoolean(v) {
        return typeof v === 'boolean' || v instanceof Boolean;
    }

    function isDate(v) {
        return v instanceof Date;
    }

    function isDefined(v) {
        return v !== undefined;
    }

    function isElement(v) {
        return typeof v === 'object' && v instanceof HTMLElement;
    }

    function isEmpty(v) {
        if (null === v)
            return true;
        if (undefined === v)
            return true;
        if ('' === v)
            return true;
        if (0 === v)
            return true;
        if (isArrayLike(v) && v.length < 1)
            return true;
        if (v instanceof Object && Object.keys(v).length < 1)
            return true;
        return false;
    }

    function eq$1(a, b) {
        if (Number.isNaN(a) && Number.isNaN(b))
            return true;
        return a === b;
    }

    function isEqualWith(a, b, comparator) {
        let cptor = comparator;
        if (!isObject(a) || !isObject(b)) {
            return (cptor || eq$1)(a, b);
        }
        let keys = [];
        if ((keys = Object.keys(a)).length !== Object.keys(b).length)
            return false;
        if (isDate(a) && isDate(b))
            return cptor ? cptor(a, b) : a.getTime() === b.getTime();
        if (isRegExp(a) && isRegExp(b))
            return cptor ? cptor(a, b) : a.toString() === b.toString();
        for (let i = keys.length; i--;) {
            const k = keys[i];
            const v1 = a[k], v2 = b[k];
            if (!isEqualWith(v1, v2, cptor)) {
                return false;
            }
        }
        return true;
    }

    function isEqual(a, b) {
        return isEqualWith(a, b);
    }

    function isError(v) {
        return typeof v === 'object' && v instanceof Error;
    }

    function isFinite(v) {
        return Number.isFinite(v);
    }

    function isMap(v) {
        return v instanceof Map;
    }

    function isMatchWith(target, props, comparator = eq$1) {
        if (isNil(props))
            return true;
        const ks = Object.keys(props);
        if (!isObject(target))
            return false;
        let rs = true;
        for (let i = ks.length; i--;) {
            const k = ks[i];
            const v1 = target[k];
            const v2 = props[k];
            if (isObject(v1) && isObject(v2)) {
                if (!isMatchWith(v1, v2, comparator)) {
                    rs = false;
                    break;
                }
            }
            else {
                if (!comparator(v1, v2, k, target, props)) {
                    rs = false;
                    break;
                }
            }
        }
        return rs;
    }

    function isMatch(object, props) {
        return isMatchWith(object, props, eq$1);
    }

    function isNaN$1(v) {
        return Number.isNaN(v);
    }

    function isNull(v) {
        return null === v;
    }

    function isNumber(v) {
        return typeof v === 'number' || v instanceof Number;
    }

    function isPlainObject(v) {
        return isObject(v) && v.constructor === Object.prototype.constructor;
    }

    function isSafeInteger(v) {
        return Number.isSafeInteger(v);
    }

    function isSet(v) {
        return v instanceof Set;
    }

    function isSymbol(v) {
        return typeof v === 'symbol';
    }

    function isUndefined(v) {
        return v === undefined;
    }

    function isWeakMap(v) {
        return v instanceof WeakMap;
    }

    function isWeakSet(v) {
        return v instanceof WeakSet;
    }

    var is = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isArray: isArray,
        isArrayLike: isArrayLike,
        isBlank: isBlank,
        isBoolean: isBoolean,
        isDate: isDate,
        isDefined: isDefined,
        isElement: isElement,
        isEmpty: isEmpty,
        isEqual: isEqual,
        isEqualWith: isEqualWith,
        isError: isError,
        isFinite: isFinite,
        isFunction: isFunction,
        isInteger: isInteger,
        isMap: isMap,
        isMatch: isMatch,
        isMatchWith: isMatchWith,
        isNaN: isNaN$1,
        isNil: isNil,
        isNull: isNull,
        isNumber: isNumber,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isRegExp: isRegExp,
        isSafeInteger: isSafeInteger,
        isSet: isSet,
        isString: isString,
        isSymbol: isSymbol,
        isUndefined: isUndefined,
        isWeakMap: isWeakMap,
        isWeakSet: isWeakSet
    });

    function identity(v) {
        return v;
    }

    function eachSources(target, sources, handler, afterHandler) {
        sources.forEach((src) => {
            if (!isObject(src))
                return;
            Object.keys(src).forEach((k) => {
                let v = src[k];
                if (handler) {
                    v = handler(src[k], target[k], k, src, target);
                }
                afterHandler(v, src[k], target[k], k, src, target);
            });
        });
    }

    function checkTarget(target) {
        if (target === null || target === undefined)
            return {};
        if (!isObject(target))
            return new target.constructor(target);
        if (!Object.isExtensible(target) ||
            Object.isFrozen(target) ||
            Object.isSealed(target)) {
            return target;
        }
    }

    function assignWith(target, ...sources) {
        const rs = checkTarget(target);
        if (rs)
            return rs;
        let src = sources;
        const sl = sources.length;
        let handler = src[sl - 1];
        if (!handler || !handler.call) {
            handler = identity;
        }
        else {
            src = src.slice(0, sl - 1);
        }
        eachSources(target, src, handler, (v, sv, tv, k, s, t) => {
            t[k] = v;
        });
        return target;
    }

    function assign(target, ...sources) {
        return assignWith(target, ...sources, identity);
    }

    function cloneBuiltInObject(obj) {
        let rs = null;
        if (isDate(obj)) {
            rs = new Date(obj.getTime());
        }
        else if (isBoolean(obj)) {
            rs = Boolean(obj);
        }
        else if (isString(obj)) {
            rs = String(obj);
        }
        else if (isRegExp(obj)) {
            rs = new RegExp(obj);
        }
        return rs;
    }

    function cloneWith(obj, handler = identity) {
        if (!isObject(obj))
            return obj;
        if (isFunction(obj))
            return obj;
        let copy = cloneBuiltInObject(obj);
        if (copy !== null)
            return copy;
        copy = new obj.constructor();
        return assignWith(copy, obj, (sv, tv, k) => handler(sv, k));
    }

    function clone(obj) {
        return cloneWith(obj, identity);
    }

    function cloneDeepWith(obj, handler) {
        if (!isObject(obj))
            return obj;
        if (isFunction(obj))
            return obj;
        let copy = cloneBuiltInObject(obj);
        if (copy !== null)
            return copy;
        copy = new obj.constructor();
        const propNames = Object.keys(obj);
        propNames.forEach((p) => {
            let newProp = (handler || identity)(obj[p], p, obj);
            if (isObject(newProp)) {
                newProp = cloneDeepWith(newProp, handler);
            }
            try {
                ;
                copy[p] = newProp;
            }
            catch (e) { }
        });
        return copy;
    }

    function cloneDeep(obj) {
        return cloneDeepWith(obj, identity);
    }

    function defaults(target, ...sources) {
        const rs = checkTarget(target);
        if (rs)
            return rs;
        eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
            if (t[k] === undefined) {
                t[k] = v;
            }
        });
        return target;
    }

    function defaultsDeep(target, ...sources) {
        const rs = checkTarget(target);
        if (rs)
            return rs;
        eachSources(target, sources, null, (v, sv, tv, k, s, t) => {
            if (tv === undefined) {
                t[k] = v;
            }
            else if (isObject(tv) && !isFunction(tv)) {
                defaultsDeep(tv, sv);
            }
        });
        return target;
    }

    function eq(a, b) {
        return eq$1(a, b);
    }

    function toPath$1(path) {
        let chain = path;
        if (isArray(chain)) {
            chain = chain.join('.');
        }
        else {
            chain += '';
        }
        const rs = (chain + '')
            .replace(/\[([^\]]+)\]/gm, '.$1')
            .replace(/^\./g, '')
            .split('.');
        return rs;
    }

    function get(obj, path, defaultValue) {
        if (!isObject(obj))
            return defaultValue;
        const chain = toPath$1(path);
        let target = obj;
        for (let i = 0; i < chain.length; i++) {
            const seg = chain[i];
            target = target[seg];
            if (!target)
                break;
        }
        if (target === undefined)
            target = defaultValue;
        return target;
    }

    function prop(path) {
        return (obj) => {
            return get(obj, path);
        };
    }

    function toPath(path) {
        return toPath$1(path);
    }

    function matcher(props) {
        return (obj) => {
            return isMatch(obj, props);
        };
    }

    function iteratee(value) {
        if (isUndefined(value)) {
            return identity;
        }
        else if (isFunction(value)) {
            return value;
        }
        else if (isString(value)) {
            return prop(value);
        }
        else if (isArray(value)) {
            return prop(toPath(value));
        }
        else if (isObject(value)) {
            return matcher(value);
        }
        return () => false;
    }

    function findKey(object, predicate) {
        const callback = iteratee(predicate);
        let rs;
        for (let k in object) {
            let v = object[k];
            const r = callback(v, k, object);
            if (r) {
                rs = k;
                break;
            }
        }
        return rs;
    }

    function fromPairs(pairs) {
        const rs = {};
        for (let k in pairs) {
            let pair = pairs[k];
            rs[pair[0]] = pair[1];
        }
        return rs;
    }

    function functions$1(obj) {
        let rs = [];
        for (let k in obj) {
            if (isFunction(obj[k])) {
                rs.push(k);
            }
        }
        return rs;
    }

    function has(obj, key) {
        return obj && obj.hasOwnProperty && obj.hasOwnProperty(key);
    }

    function keys(obj) {
        if (obj === null || obj === undefined)
            return [];
        return Object.keys(obj);
    }

    function keysIn(obj) {
        const rs = [];
        for (const k in obj) {
            if (k)
                rs.push(k);
        }
        return rs;
    }

    function noop() {
        return undefined;
    }

    function values(obj) {
        return keys(obj).map((k) => obj[k]);
    }

    function toArray(collection) {
        if (isArray(collection))
            return collection.concat();
        if (isFunction(collection))
            return [collection];
        if (isSet(collection)) {
            return Array.from(collection);
        }
        else if (isString(collection)) {
            return collection.split('');
        }
        else if (isArrayLike(collection)) {
            return Array.from(collection);
        }
        else if (isMap(collection)) {
            return Array.from(collection.values());
        }
        else if (isObject(collection)) {
            return values(collection);
        }
        return [collection];
    }

    function concat(...arrays) {
        if (arrays.length < 1)
            return [];
        arrays = arrays.map((alk) => (isArrayLike(alk) ? toArray(alk) : alk));
        return toArray(arrays[0]).concat(...arrays.slice(1));
    }

    function mergeWith(target, ...sources) {
        const rs = checkTarget(target);
        if (rs)
            return rs;
        let src = sources;
        const sl = src.length;
        let handler = src[sl - 1];
        if (!isFunction(handler)) {
            handler = noop;
        }
        else {
            src = src.slice(0, sl - 1);
        }
        walkSources(target, src, handler, []);
        return target;
    }
    function walkSources(target, src, handler, stack) {
        eachSources(target, src, null, (v, sv, tv, k, s, t) => {
            const path = concat(stack, k);
            v = handler(sv, tv, k, s, t, path);
            if (v !== undefined) {
                t[k] = v;
            }
            else {
                if (isObject(tv) && !isFunction(tv)) {
                    walkSources(tv, [sv], handler, path);
                }
                else {
                    t[k] = sv;
                }
            }
        });
    }

    function merge(target, ...sources) {
        return mergeWith(target, ...sources, noop);
    }

    function omitBy(obj, predicate) {
        const rs = {};
        if (obj === null || obj === undefined)
            return rs;
        Object.keys(obj).forEach(k => {
            let v = obj[k];
            if (!(predicate || identity)(v, k)) {
                rs[k] = v;
            }
        });
        return rs;
    }

    function flat(array, depth = 1) {
        if (depth < 1)
            return array.concat();
        const rs = toArray(array).reduce((acc, val) => {
            return acc.concat(Array.isArray(val) && depth > 0 ? flat(val, depth - 1) : val);
        }, []);
        return rs;
    }

    function flatDeep(array) {
        return flat(array, Infinity);
    }

    function omit(obj, ...props) {
        const keys = flatDeep(props);
        return omitBy(obj, (v, k) => {
            return keys.includes(k);
        });
    }

    function pickBy(obj, predicate) {
        const rs = {};
        if (obj === null || obj === undefined)
            return rs;
        Object.keys(obj).forEach(k => {
            let v = obj[k];
            if ((predicate || identity)(v, k)) {
                rs[k] = v;
            }
        });
        return rs;
    }

    function _eachIterator(collection, callback, forRight) {
        let values;
        let keys;
        if (isString(collection) || isArrayLike(collection)) {
            let size = collection.length;
            if (forRight) {
                while (size--) {
                    const r = callback(collection[size], size, collection);
                    if (r === false)
                        return;
                }
            }
            else {
                for (let i = 0; i < size; i++) {
                    const r = callback(collection[i], i, collection);
                    if (r === false)
                        return;
                }
            }
        }
        else if (isSet(collection)) {
            let size = collection.size;
            if (forRight) {
                values = Array.from(collection);
                while (size--) {
                    const r = callback(values[size], size, collection);
                    if (r === false)
                        return;
                }
            }
            else {
                values = collection.values();
                for (let i = 0; i < size; i++) {
                    const r = callback(values.next().value, i, collection);
                    if (r === false)
                        return;
                }
            }
        }
        else if (isMap(collection)) {
            let size = collection.size;
            keys = collection.keys();
            values = collection.values();
            if (forRight) {
                keys = Array.from(keys);
                values = Array.from(values);
                while (size--) {
                    const r = callback(values[size], keys[size], collection);
                    if (r === false)
                        return;
                }
            }
            else {
                for (let i = 0; i < size; i++) {
                    const r = callback(values.next().value, keys.next().value, collection);
                    if (r === false)
                        return;
                }
            }
        }
        else if (isObject(collection)) {
            keys = Object.keys(collection);
            let size = keys.length;
            if (forRight) {
                while (size--) {
                    const k = keys[size];
                    const r = callback(collection[k], k, collection);
                    if (r === false)
                        return;
                }
            }
            else {
                for (let i = 0; i < size; i++) {
                    const k = keys[i];
                    const r = callback(collection[k], k, collection);
                    if (r === false)
                        return;
                }
            }
        }
    }

    function each(collection, callback) {
        _eachIterator(collection, callback, false);
    }

    function slice(array, begin, end) {
        return toArray(array).slice(begin || 0, end);
    }

    function includes(collection, value, fromIndex) {
        let rs = false;
        fromIndex = fromIndex || 0;
        if (isString(collection)) {
            return collection.includes(value, fromIndex);
        }
        collection = isArrayLike(collection)
            ? slice(collection, fromIndex)
            : collection;
        each(collection, (v) => {
            if (eq$1(v, value)) {
                rs = true;
                return false;
            }
        });
        return rs;
    }

    function pick(obj, ...props) {
        const keys = flatDeep(props);
        return pickBy(obj, (v, k) => {
            return includes(keys, k);
        });
    }

    function set(obj, path, value) {
        if (!isObject(obj))
            return obj;
        const chain = toPath$1(path);
        let target = obj;
        for (let i = 0; i < chain.length; i++) {
            const seg = chain[i];
            const nextSeg = chain[i + 1];
            let tmp = target[seg];
            if (nextSeg) {
                tmp = target[seg] = !tmp ? (isNaN(nextSeg) ? {} : []) : tmp;
            }
            else {
                target[seg] = value;
                break;
            }
            target = tmp;
        }
        return obj;
    }

    function toObject(...vals) {
        if (vals.length === 0)
            return {};
        const rs = {};
        const pairs = [];
        let key = null;
        vals.forEach((v) => {
            if (isArray(v)) {
                const tmp = toObject(...v);
                assign(rs, tmp);
            }
            else if (isObject(v)) {
                if (key) {
                    pairs.push(key, v);
                    key = null;
                }
                else {
                    assign(rs, v);
                }
            }
            else {
                if (key) {
                    pairs.push(key, v);
                    key = null;
                }
                else {
                    key = v;
                }
            }
        });
        if (key) {
            pairs.push(key);
        }
        if (pairs.length > 0) {
            for (let i = 0; i < pairs.length; i += 2) {
                rs[pairs[i]] = pairs[i + 1];
            }
        }
        return rs;
    }

    function toPairs(obj) {
        const rs = [];
        for (let k in obj) {
            let v = obj[k];
            rs.push([k, v]);
        }
        return rs;
    }

    function unset(obj, path) {
        if (!isObject(obj))
            return obj;
        const chain = toPath$1(path);
        let target = obj;
        for (let i = 0; i < chain.length; i++) {
            const seg = chain[i];
            const nextSeg = chain[i + 1];
            let tmp = target[seg];
            if (nextSeg) {
                tmp = target[seg] = !tmp ? (isNaN(nextSeg) ? {} : []) : tmp;
            }
            else {
                return delete target[seg];
            }
            target = tmp;
        }
        return false;
    }

    function valuesIn(obj) {
        return keysIn(obj).map((k) => obj[k]);
    }

    var object = /*#__PURE__*/Object.freeze({
        __proto__: null,
        assign: assign,
        assignWith: assignWith,
        clone: clone,
        cloneDeep: cloneDeep,
        cloneDeepWith: cloneDeepWith,
        cloneWith: cloneWith,
        defaults: defaults,
        defaultsDeep: defaultsDeep,
        eq: eq,
        findKey: findKey,
        fromPairs: fromPairs,
        functions: functions$1,
        get: get,
        has: has,
        keys: keys,
        keysIn: keysIn,
        merge: merge,
        mergeWith: mergeWith,
        omit: omit,
        omitBy: omitBy,
        pick: pick,
        pickBy: pickBy,
        prop: prop,
        set: set,
        toObject: toObject,
        toPairs: toPairs,
        unset: unset,
        values: values,
        valuesIn: valuesIn
    });

    function countBy(collection, itee) {
        const stat = {};
        const cb = iteratee(itee || identity);
        each(collection, (el) => {
            const key = cb(el);
            if (stat[key] === undefined)
                stat[key] = 0;
            stat[key]++;
        });
        return stat;
    }

    function eachRight(collection, callback) {
        _eachIterator(collection, callback, true);
    }

    function every(collection, predicate) {
        let rs = true;
        const callback = iteratee(predicate);
        each(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (!r) {
                rs = false;
                return false;
            }
        });
        return rs;
    }

    function filter(collection, predicate) {
        const rs = [];
        const callback = iteratee(predicate);
        each(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (r) {
                rs.push(v);
            }
        });
        return rs;
    }

    function find(collection, predicate) {
        const callback = iteratee(predicate);
        let rs;
        each(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (r) {
                rs = v;
                return false;
            }
        });
        return rs;
    }

    function findLast(collection, predicate) {
        const callback = iteratee(predicate);
        let rs;
        eachRight(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (r) {
                rs = v;
                return false;
            }
        });
        return rs;
    }

    function map(collection, itee) {
        const rs = [];
        const cb = iteratee(itee);
        each(collection, (v, k, c) => {
            const r = cb(v, k, c);
            rs.push(r);
        });
        return rs;
    }

    function flatMap(collection, itee, depth) {
        return flat(map(collection, itee), depth || 1);
    }

    function flatMapDeep(collection, itee) {
        return flatMap(collection, itee, Infinity);
    }

    function groupBy(collection, itee) {
        const stat = {};
        const cb = iteratee(itee || identity);
        each(collection, (el) => {
            const key = cb(el);
            if (stat[key] === undefined)
                stat[key] = [];
            stat[key].push(el);
        });
        return stat;
    }

    function keyBy(collection, itee) {
        const stat = {};
        const cb = iteratee(itee || identity);
        each(collection, (el) => {
            const key = cb(el);
            stat[key] = el;
        });
        return stat;
    }

    function partition(collection, predicate) {
        const matched = [];
        const mismatched = [];
        const callback = iteratee(predicate);
        each(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (r) {
                matched.push(v);
            }
            else {
                mismatched.push(v);
            }
        });
        return [matched, mismatched];
    }

    function reduce(collection, callback, initialValue) {
        let accumulator = initialValue;
        let hasInitVal = initialValue !== undefined;
        each(collection, (v, k, c) => {
            if (hasInitVal) {
                accumulator = callback(accumulator, v, k, c);
            }
            else {
                accumulator = v;
                hasInitVal = true;
            }
        });
        return accumulator;
    }

    function reject(collection, predicate) {
        const rs = [];
        const callback = iteratee(predicate);
        each(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (!r) {
                rs.push(v);
            }
        });
        return rs;
    }

    function randi(min, max) {
        let maxNum = max || min;
        if (max === undefined) {
            min = 0;
        }
        maxNum >>= 0;
        min >>= 0;
        return (Math.random() * (maxNum - min) + min) >> 0;
    }

    function sample(collection) {
        const ary = toArray(collection);
        return ary[randi(ary.length)];
    }

    function range(start = 0, end, step) {
        let startNum = 0;
        let endNum = 0;
        let stepNum = 1;
        if (isNumber(start) && isUndefined(end) && isUndefined(step)) {
            endNum = start >> 0;
        }
        else if (isNumber(start) && isNumber(end) && isUndefined(step)) {
            startNum = start >> 0;
            endNum = end >> 0;
        }
        else if (isNumber(start) && isNumber(end) && isNumber(step)) {
            startNum = start >> 0;
            endNum = end >> 0;
            stepNum = step || 1;
        }
        const rs = Array(Math.round(Math.abs(endNum - startNum) / stepNum));
        let rsIndex = 0;
        if (endNum > startNum) {
            for (let i = startNum; i < endNum; i += stepNum) {
                rs[rsIndex++] = i;
            }
        }
        else if (endNum < startNum) {
            for (let i = startNum; i > endNum; i -= stepNum) {
                rs[rsIndex++] = i;
            }
        }
        return rs;
    }

    function pop(array, index) {
        index = index || -1;
        let rs = null;
        if (isArray(array)) {
            const i = toNumber(index);
            if (i > -1) {
                rs = array.splice(i, 1);
                if (rs.length < 1)
                    rs = null;
                else {
                    rs = rs[0];
                }
            }
            else {
                rs = array.pop();
            }
        }
        return rs;
    }

    function sampleSize(collection, count) {
        count = count || 1;
        const ary = toArray(collection);
        const seeds = range(0, ary.length);
        const ks = [];
        while (seeds.length > 0) {
            if (count-- < 1)
                break;
            const i = pop(seeds, randi(seeds.length));
            if (i)
                ks.push(i);
        }
        const rs = map(ks, (v) => ary[v]);
        return rs;
    }

    function size(collection) {
        if (isNil(collection))
            return 0;
        if ((collection.length))
            return collection.length;
        if (isMap(collection) || isSet(collection))
            return collection.size;
        if (isObject(collection))
            return Object.keys(collection).length;
        return 0;
    }

    function shuffle(collection) {
        return sampleSize(collection, size(collection));
    }

    function some(collection, predicate) {
        let rs = false;
        const callback = iteratee(predicate || (() => true));
        each(collection, (v, k, c) => {
            const r = callback(v, k, c);
            if (r) {
                rs = true;
                return false;
            }
        });
        return rs;
    }

    function sortBy(collection, itee) {
        if (size(collection) < 1)
            return [];
        const cb = iteratee(itee || identity);
        let i = 0;
        const list = map(collection, (v, k) => {
            return {
                src: v,
                index: i++,
                value: cb(v, k),
            };
        });
        const comparator = getComparator(list[0].value);
        return map(list.sort((a, b) => !eq$1(a.value, b.value) ? comparator(a.value, b.value) : a.index - b.index), (item) => item.src);
    }
    const compareNumAsc = (a, b) => {
        if (isNil(a) || !isNumber(a))
            return 1;
        if (isNil(b) || !isNumber(b))
            return -1;
        return a - b;
    };
    const compareStrAsc = (a, b) => {
        if (isNil(a))
            return 1;
        if (isNil(b))
            return -1;
        return toString(a).localeCompare(toString(b));
    };
    const compareDateAsc = (a, b) => {
        if (isNil(a))
            return 1;
        if (isNil(b))
            return -1;
        return compareDate(a, b);
    };
    function getComparator(el) {
        let comparator;
        if (isNumber(el)) {
            comparator = compareNumAsc;
        }
        else if (isDate(el)) {
            comparator = compareDateAsc;
        }
        else {
            comparator = compareStrAsc;
        }
        return comparator;
    }

    function sort(collection, comparator) {
        const ary = toArray(collection);
        if (ary.length < 1)
            return ary;
        if (isFunction(comparator)) {
            return ary.sort(comparator);
        }
        else {
            return sortBy(collection);
        }
    }

    var collection = /*#__PURE__*/Object.freeze({
        __proto__: null,
        countBy: countBy,
        each: each,
        eachRight: eachRight,
        every: every,
        filter: filter,
        find: find,
        findLast: findLast,
        flatMap: flatMap,
        flatMapDeep: flatMapDeep,
        groupBy: groupBy,
        includes: includes,
        keyBy: keyBy,
        map: map,
        partition: partition,
        reduce: reduce,
        reject: reject,
        sample: sample,
        sampleSize: sampleSize,
        shuffle: shuffle,
        size: size,
        some: some,
        sort: sort,
        sortBy: sortBy,
        toArray: toArray
    });

    function append(array, ...values) {
        const rs = isArray(array) ? array : toArray(array);
        rs.push(...values);
        return rs;
    }

    function chunk(array, size = 1) {
        const ary = toArray(array);
        const sizeNum = (size || 1) >> 0;
        const rs = [];
        ary.forEach((v, i) => {
            if (i % sizeNum == 0) {
                rs.push(ary.slice(i, i + sizeNum));
            }
        });
        return rs;
    }

    function compact(array) {
        return toArray(array).filter(identity);
    }

    function except(...params) {
        let comparator;
        let list = params;
        const sl = params.length;
        if (sl > 2) {
            const lp = params[sl - 1];
            if (isFunction(lp)) {
                comparator = lp;
                list = params.slice(0, params.length - 1);
            }
        }
        list = list.filter((v) => isArrayLike(v) || isArray(v));
        if (list.length < 1)
            return list;
        const len = list.length;
        const kvMap = new Map();
        for (let j = 0; j < len; j++) {
            const ary = list[j];
            const localMap = new Map();
            for (let i = 0; i < ary.length; i++) {
                const v = ary[i];
                const id = comparator ? comparator(v) : v;
                if (!kvMap.get(id)) {
                    kvMap.set(id, { i: 0, v: v });
                }
                if (kvMap.get(id) && !localMap.get(id)) {
                    kvMap.get(id).i++;
                    localMap.set(id, true);
                }
            }
        }
        const rs = [];
        each(kvMap, (v) => {
            if (v.i < len) {
                rs.push(v.v);
            }
        });
        return rs;
    }

    function fill(array, value, start = 0, end) {
        const rs = toArray(array);
        rs.fill(value, start, end);
        return rs;
    }

    function findIndex(array, predicate, fromIndex) {
        let rs = -1;
        let fromIndexNum = fromIndex || 0;
        const itee = iteratee(predicate);
        each(slice(array, fromIndexNum), (v, k, c) => {
            const r = itee(v, k, c);
            if (r) {
                rs = k + fromIndexNum;
                return false;
            }
        });
        return rs;
    }

    function findLastIndex(array, predicate, fromIndex) {
        let rs = -1;
        let fromIndexNum = fromIndex || 0;
        const itee = iteratee(predicate);
        if (fromIndex === undefined) {
            fromIndexNum = size(array) - 1;
        }
        eachRight(slice(array, 0, fromIndexNum + 1), (v, k, c) => {
            const r = itee(v, k, c);
            if (r) {
                rs = k;
                return false;
            }
        });
        return rs;
    }

    function first(array) {
        return toArray(array)[0];
    }

    function initial(array) {
        return array.slice(0, array.length - 1);
    }

    function insert(array, index, ...values) {
        const rs = isArray(array) ? array : toArray(array);
        if (!isNumber(index) || index < 0)
            index = 0;
        rs.splice(index, 0, ...values);
        return rs;
    }

    function intersect(...params) {
        let comparator;
        let list = params;
        const sl = params.length;
        if (sl > 2) {
            const lp = params[sl - 1];
            if (isFunction(lp)) {
                comparator = lp;
                list = params.slice(0, sl - 1);
            }
        }
        list = list.filter((v) => isArrayLike(v) || isArray(v));
        if (list.length < 1)
            return list;
        const len = list.length;
        list.sort((a, b) => a.length - b.length);
        const kvMap = new Map();
        let idLength = 0;
        for (let i = list[0].length; i--;) {
            const v = list[0][i];
            const id = comparator ? comparator(v) : v;
            if (!kvMap.get(id)) {
                kvMap.set(id, { i: 1, v: v });
                idLength++;
            }
        }
        for (let j = 1; j < len; j++) {
            const ary = list[j];
            const localMap = new Map();
            let localMatchedCount = 0;
            for (let i = 0; i < ary.length; i++) {
                const v = ary[i];
                const id = comparator ? comparator(v) : v;
                if (kvMap.get(id) && !localMap.get(id)) {
                    kvMap.get(id).i++;
                    localMap.set(id, true);
                    localMatchedCount++;
                    if (localMatchedCount === idLength)
                        break;
                }
            }
        }
        const rs = [];
        each(kvMap, (v) => {
            if (v.i === len) {
                rs.push(v.v);
            }
        });
        return rs;
    }

    function join(array, separator) {
        return toArray(array).join(separator || ',');
    }

    function last(array) {
        const ary = toArray(array);
        return ary[ary.length - 1];
    }

    function remove(array, predicate) {
        const rs = [];
        if (!isArray(array))
            return rs;
        const itee = iteratee(predicate);
        let i = 0;
        for (let l = 0; l < array.length; l++) {
            const item = array[l];
            const r = itee(item, l, array);
            if (r) {
                rs.push(item);
            }
            else {
                array[i++] = item;
            }
        }
        array.length = i;
        return rs;
    }

    function pull(array, ...values) {
        remove(array, (item) => includes(values, item));
        return array;
    }

    function reverse(array) {
        const rs = toArray(array);
        return rs.reverse();
    }

    function sortedIndexBy(array, value, itee) {
        let left = 0;
        let right = size(array);
        let index = 0;
        const cb = iteratee(itee || identity);
        value = cb(value);
        while (left < right) {
            const mid = parseInt((left + right) / 2);
            if (cb(array[mid]) < value) {
                left = mid + 1;
                index = left;
            }
            else {
                right = mid;
            }
        }
        return index;
    }

    function sortedIndex(array, value) {
        return sortedIndexBy(array, value);
    }

    function tail(array) {
        const rs = toArray(array);
        return rs.slice(1);
    }

    function take(array, length) {
        const rs = toArray(array);
        return rs.slice(0, length);
    }

    function takeRight(array, length) {
        const rs = toArray(array);
        const maxLength = rs.length;
        return rs.slice(maxLength - (length || maxLength), maxLength);
    }

    function union(...params) {
        let comparator;
        let list = params;
        const sl = params.length;
        if (sl > 2 && isFunction(params[sl - 1])) {
            comparator = params[sl - 1];
            list = params.slice(0, sl - 1);
        }
        list = list.filter((v) => isArrayLike(v) || isArray(v));
        if (list.length < 1)
            return list;
        let rs;
        if (comparator) {
            const kvMap = new Map();
            flat(list).forEach((v) => {
                const id = comparator(v);
                if (!kvMap.get(id)) {
                    kvMap.set(id, v);
                }
            });
            rs = map(kvMap, (v) => v);
        }
        else {
            rs = toArray(new Set(flat(list)));
        }
        return rs;
    }

    function uniq(array) {
        const ary = toArray(array);
        return toArray(new Set(ary));
    }

    function uniqBy(array, itee) {
        const cb = iteratee(itee || identity);
        const keyMap = new Map();
        const rs = [];
        each(array, (v, k) => {
            const key = cb(v, k);
            if (keyMap.get(key))
                return;
            keyMap.set(key, 1);
            rs.push(v);
        });
        return rs;
    }

    function unzip(array) {
        const rs = [];
        const len = size(array);
        each(array, (group, colIndex) => {
            each(group, (el, rowIndex) => {
                let row = rs[rowIndex];
                if (!row) {
                    row = rs[rowIndex] = new Array(len);
                }
                row[colIndex] = el;
            });
        });
        return rs;
    }

    function without(array, ...values) {
        return filter(array, (item) => !includes(values, item));
    }

    function zip(...arrays) {
        const rs = [];
        const size = arrays.length;
        arrays.forEach((ary, colIndex) => {
            each(ary, (el, i) => {
                let group = rs[i];
                if (!group) {
                    group = rs[i] = new Array(size);
                }
                group[colIndex] = el;
            });
        });
        return rs;
    }

    function zipObject(keys, values) {
        const rs = {};
        each(keys, (k, i) => {
            rs[k] = get(values, i);
        });
        return rs;
    }

    function zipWith(...params) {
        const sl = params.length;
        let itee = params[sl - 1];
        const arys = params;
        if (!isFunction(itee)) {
            itee = identity;
        }
        else {
            pop(arys);
        }
        const rs = zip(...arys);
        return map(rs, (group) => itee(group));
    }

    var array = /*#__PURE__*/Object.freeze({
        __proto__: null,
        append: append,
        chunk: chunk,
        compact: compact,
        concat: concat,
        except: except,
        fill: fill,
        findIndex: findIndex,
        findLastIndex: findLastIndex,
        first: first,
        flat: flat,
        flatDeep: flatDeep,
        head: first,
        initial: initial,
        insert: insert,
        intersect: intersect,
        join: join,
        last: last,
        pop: pop,
        pull: pull,
        range: range,
        remove: remove,
        reverse: reverse,
        slice: slice,
        sortedIndex: sortedIndex,
        sortedIndexBy: sortedIndexBy,
        tail: tail,
        take: take,
        takeRight: takeRight,
        union: union,
        uniq: uniq,
        uniqBy: uniqBy,
        unzip: unzip,
        without: without,
        zip: zip,
        zipObject: zipObject,
        zipWith: zipWith
    });

    function add(a, b) {
        a = isNil(a) ? 0 : a;
        b = isNil(b) ? 0 : b;
        return a + b;
    }

    function divide(a, b) {
        a = isNil(a) ? 0 : a;
        b = isNil(b) ? 0 : b;
        return a / b;
    }

    function max(values) {
        const vals = flatMap(values, v => isNil(v) || isNaN(v) ? [] : v);
        let f64a = new Float64Array(vals);
        f64a.sort();
        return f64a[f64a.length - 1];
    }

    function mean(values) {
        const vals = map(values, v => isNil(v) ? 0 : v);
        let f64a = new Float64Array(vals);
        let rs = 0;
        f64a.forEach(v => {
            rs += v;
        });
        return rs / f64a.length;
    }

    function min(values) {
        const vals = flatMap(values, v => isNil(v) || isNaN(v) ? [] : v);
        let f64a = new Float64Array(vals);
        f64a.sort();
        return f64a[0];
    }

    function multiply(a, b) {
        a = isNil(a) ? 0 : a;
        b = isNil(b) ? 0 : b;
        return a * b;
    }

    function randf(min, max) {
        if (max === undefined) {
            if (!min)
                return Math.random();
            max = min;
            min = 0;
        }
        max = parseFloat(max + '') || 0;
        min = parseFloat(min + '') || 0;
        return Math.random() * (max - min) + min;
    }

    function subtract(a, b) {
        a = isNil(a) ? 0 : a;
        b = isNil(b) ? 0 : b;
        return a - b;
    }

    function sum(...values) {
        let ary = values;
        if (ary.length === 1 && isArrayLike(ary[0])) {
            ary = ary[0];
        }
        const vals = ary.map((v) => isNil(v) ? 0 : v);
        let rs = 0;
        const f64a = new Float64Array(vals);
        f64a.forEach((v) => {
            rs += v;
        });
        return rs;
    }

    var math = /*#__PURE__*/Object.freeze({
        __proto__: null,
        add: add,
        divide: divide,
        max: max,
        mean: mean,
        min: min,
        multiply: multiply,
        randf: randf,
        randi: randi,
        subtract: subtract,
        sum: sum
    });

    const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
    function alphaId(len) {
        const bytes = self.crypto.getRandomValues(new Uint8Array(len || 16));
        let rs = '';
        bytes.forEach(b => rs += ALPHABET[b % ALPHABET.length]);
        return rs;
    }

    function defaultTo(v, defaultValue) {
        if (v === null || v === undefined || Number.isNaN(v))
            return defaultValue;
        return v;
    }

    function mixin(target, obj) {
        functions$1(obj).forEach((fnName) => {
            const fn = obj[fnName];
            if (isFunction(target)) {
                target[fnName] = fn;
            }
            else {
                target.prototype[fnName] = function (...rest) {
                    this._chain.push({
                        fn: fn,
                        params: rest,
                    });
                    return this;
                };
            }
        });
    }

    function noConflict() {
        const ctx = globalThis;
        if (ctx.myff) {
            ctx._ = ctx.__f_prev;
        }
        return ctx.myff;
    }

    function snowflakeId(nodeId, epoch) {
        epoch = epoch || 1580486400000;
        if (isNil(nodeId))
            return '0000000000000000000';
        let nowTime = Date.now();
        if (lastTimeStamp === nowTime) {
            sequence += randi(1, 9);
            if (sequence > 0xfff) {
                nowTime = _getNextTime(lastTimeStamp);
                sequence = randi(0, 99);
            }
        }
        else {
            sequence = randi(0, 99);
        }
        lastTimeStamp = nowTime;
        const timeOffset = (nowTime - epoch).toString(2);
        const nodeBits = padEnd((nodeId % 0x3ff).toString(2) + '', 10, '0');
        const seq = padZ(sequence.toString(2) + '', 12);
        return BigInt(`0b${timeOffset}${nodeBits}${seq}`).toString();
    }
    let lastTimeStamp = -1;
    let sequence = 0;
    const _getNextTime = (lastTime) => {
        let t = Date.now();
        while (t <= lastTime) {
            t = Date.now();
        }
        return t;
    };

    function times(n, iteratee) {
        return range(n).map(iteratee);
    }

    function uniqueId(prefix) {
        return (prefix !== undefined ? prefix + '_' : '') + seed++;
    }
    let seed = 0;

    const VARIANTS = ['8', '9', 'a', 'b'];
    function uuid(delimiter) {
        let uuid = '';
        if (self.crypto.randomUUID) {
            uuid = self.crypto.randomUUID();
        }
        else {
            const r32 = Math.random();
            const r16 = Math.random();
            const p1Num = Math.floor(r32 * (0xffffffff - 0x10000000)) + 0x10000000;
            const p1 = p1Num.toString(16);
            const p2Num = Math.floor(r16 * (0xffff - 0x1000)) + 0x1000;
            const p2 = p2Num.toString(16);
            const p3 = substring((p2Num << 1).toString(16), 0, 3);
            const p4 = substring((p2Num >> 1).toString(16), 0, 3);
            let p5 = Date.now().toString(16);
            p5 =
                substring((p1Num >> 1).toString(16), 0, 6) +
                    substring(p5, p5.length - 6, p5.length);
            uuid =
                p1 + '-' + p2 + '-4' + p3 + '-' + VARIANTS[randi(0, 3)] + p4 + '-' + p5;
        }
        return delimiter ? uuid : uuid.replace(/-/g, '');
    }

    var utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        alphaId: alphaId,
        defaultTo: defaultTo,
        identity: identity,
        iteratee: iteratee,
        matcher: matcher,
        mixin: mixin,
        noConflict: noConflict,
        noop: noop,
        snowflakeId: snowflakeId,
        times: times,
        toPath: toPath,
        uniqueId: uniqueId,
        uuid: uuid
    });

    function after(fn, count) {
        const proxy = fn;
        let i = count || 0;
        let rtn;
        return (...args) => {
            if (i === 0) {
                rtn = proxy(...args);
            }
            if (i > 0)
                i--;
            return rtn;
        };
    }

    function alt(v, interceptor1, interceptor2) {
        let rs = interceptor1(v);
        if (rs === undefined) {
            rs = interceptor2(v);
        }
        return rs;
    }

    const PLACEHOLDER = void 0;
    function partial(fn, ...args) {
        return function (...params) {
            let p = 0;
            const applyArgs = args.map((v) => (v === PLACEHOLDER ? params[p++] : v));
            if (params.length > p) {
                for (let i = p; i < params.length; i++) {
                    applyArgs.push(params[i]);
                }
            }
            return fn(...applyArgs);
        };
    }

    function bind(fn, thisArg, ...args) {
        return partial(fn.bind(thisArg), ...args);
    }

    function bindAll(object, ...methodNames) {
        const pathList = flatDeep(methodNames);
        each(pathList, (path) => {
            const fn = get(object, path);
            set(object, path, fn.bind(object));
        });
        return object;
    }

    function call(fn, ...args) {
        if (!isFunction(fn))
            return undefined;
        return fn(...args);
    }

    function compose(...fns) {
        return function (...args) {
            let rs = fns[0](...args);
            for (let i = 1; i < fns.length; i++) {
                if (isFunction(fns[i])) {
                    rs = fns[i](rs);
                }
            }
            return rs;
        };
    }

    function delay(fn, wait, ...args) {
        return setTimeout(() => {
            fn(...args);
        }, wait || 0);
    }

    function fval(expression) {
        return Function('"use strict";return ' + expression)();
    }

    function once(fn) {
        let proxy = fn;
        return (...args) => {
            let rtn;
            if (proxy) {
                rtn = proxy(...args);
            }
            proxy = null;
            return rtn;
        };
    }

    function tap(v, interceptor) {
        interceptor(v);
        return v;
    }

    var functions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        after: after,
        alt: alt,
        bind: bind,
        bindAll: bindAll,
        call: call,
        compose: compose,
        delay: delay,
        fval: fval,
        once: once,
        partial: partial,
        tap: tap
    });

    class FuncChain {
        constructor(v) {
            this._wrappedValue = v;
            this._chain = [];
        }
        value() {
            let comprehension = isArrayLike(this._wrappedValue)
                ? createComprehension()
                : null;
            const maxChainIndex = this._chain.length - 1;
            return this._chain.reduce((acc, v, i) => {
                const params = [acc, ...v.params];
                if (comprehension) {
                    let rs;
                    const sig = buildComprehension(comprehension, v.fn, v.params);
                    if (sig > 0 || (!sig && maxChainIndex === i)) {
                        rs = execComprehension(comprehension, acc);
                        if (comprehension.tap) {
                            comprehension.tap(rs);
                        }
                        comprehension = null;
                    }
                    if (sig > 1) {
                        comprehension = createComprehension(v.fn, v.params);
                    }
                    if (rs) {
                        return sig !== 1 ? rs : v.fn(...[rs, ...v.params]);
                    }
                    return acc;
                }
                if (CAN_COMPREHENSIONS.includes(v.fn.name)) {
                    comprehension = createComprehension();
                    return v.fn(...[acc, ...v.params]);
                }
                return v.fn(...params);
            }, this._wrappedValue);
        }
    }
    function myfx(v) {
        return v instanceof FuncChain ? v : new FuncChain(v);
    }
    const CAN_COMPREHENSIONS = [split.name, toArray.name, range.name];
    function createComprehension(fn, params) {
        const comprehension = {
            forEachRight: false,
            goalSettings: [],
            range: [],
            reverse: false,
            count: undefined,
            tap: undefined,
            returnEl: false,
        };
        if (fn && params) {
            buildComprehension(comprehension, fn, params);
        }
        return comprehension;
    }
    function buildComprehension(comprehension, fn, params) {
        const fnName = fn.name;
        switch (fnName) {
            case map.name:
            case filter.name:
                if (size(comprehension.range) > 0 || isDefined(comprehension.count))
                    return 2;
                let fn = params[0];
                if (!isFunction(fn)) {
                    fn = iteratee(params[0]);
                }
                comprehension.goalSettings.push({ type: fnName, fn: fn });
                break;
            case reverse.name:
                if (size(comprehension.range) < 1) {
                    comprehension.forEachRight = !comprehension.forEachRight;
                }
                else {
                    comprehension.reverse = !comprehension.reverse;
                }
                break;
            case slice.name:
                if (size(comprehension.range) > 0)
                    return 2;
                comprehension.range[0] = params[0];
                comprehension.range[1] = params[1];
                break;
            case tail.name:
                if (size(comprehension.range) > 0)
                    return 2;
                comprehension.range[0] = 1;
                comprehension.range[1] = params[1];
                break;
            case take.name:
                if (isUndefined(comprehension.count) || params[0] < comprehension.count) {
                    comprehension.count = params[0];
                }
                break;
            case first.name:
            case first.name:
                if (isUndefined(comprehension.count) || 1 < comprehension.count) {
                    comprehension.count = 1;
                    comprehension.returnEl = true;
                }
                break;
            case last.name:
                comprehension.count = 1;
                comprehension.returnEl = true;
                comprehension.forEachRight = true;
                break;
            case tap.name:
                comprehension.tap = params[0];
                break;
            default:
                return 1;
        }
        return 0;
    }
    function execComprehension(comprehension, collection) {
        const targets = [];
        let targetIndex = 0;
        if (!comprehension.count && comprehension.range.length > 0) {
            comprehension.count = comprehension.range[1] - comprehension.range[0];
        }
        const isReverse = comprehension.reverse;
        const count = comprehension.count;
        const gs = comprehension.goalSettings;
        const gsLen = gs.length;
        const range = comprehension.range;
        const hasRange = range.length > 0;
        const forEach = comprehension.forEachRight ? eachRight : each;
        forEach(collection, (v, k) => {
            let t = v;
            for (let i = 0; i < gsLen; i++) {
                const setting = gs[i];
                if (setting.type === map.name) {
                    t = setting.fn(t, k);
                }
                else if (setting.type === filter.name) {
                    if (!setting.fn(t, k)) {
                        return;
                    }
                }
            }
            if (hasRange && targetIndex++ < range[0])
                return;
            if (hasRange && targetIndex > range[1])
                return false;
            if (targets.length === count)
                return false;
            if (isReverse) {
                targets.unshift(t);
            }
            else {
                targets.push(t);
            }
        });
        if (targets.length === 1 && comprehension.returnEl) {
            return targets[0];
        }
        return targets;
    }

    function template(string, options) {
        const delimiters = map(template.settings.delimiters, (d) => {
            const letters = replace(d, /\//gim, '');
            return map(letters, (l) => {
                return includes(ESCAPES, l) ? '\\' + l : l;
            }).join('');
        });
        options = toObject(options);
        const mixins = options.mixins;
        const stripWhite = options.stripWhite || false;
        const comment = delimiters[0] + template.settings.comment + delimiters[1];
        const interpolate = delimiters[0] + template.settings.interpolate + delimiters[1];
        const evaluate = delimiters[0] + template.settings.evaluate + delimiters[1];
        const mixin = delimiters[0] + template.settings.mixin + delimiters[1];
        const splitExp = new RegExp(`(?:${comment})|(?:${mixin})|(?:${interpolate})|(?:${evaluate})`, 'mg');
        const tokens = parse(string, splitExp, mixins, stripWhite);
        const render = compile(tokens, options);
        return render;
    }
    const ESCAPES = ['[', ']', '{', '}', '$'];
    template.settings = {
        delimiters: ['[%', '%]'],
        interpolate: '=([\\s\\S]+?)',
        comment: '--[\\s\\S]+?--',
        mixin: '@([a-zA-Z_$][\\w_$]*)([\\s\\S]+?)',
        evaluate: '([\\s\\S]+?)',
    };
    function parse(str, splitExp, mixins, stripWhite) {
        let indicator = 0;
        let lastSegLength = 0;
        const tokens = [];
        const fullStack = [];
        let prevText = null;
        let prevNode = null;
        while (true) {
            const rs = splitExp.exec(str);
            if (rs == null) {
                const node = getText(str.substring(indicator + lastSegLength, str.length));
                if (prevText) {
                    tokens.push(getText(prevText));
                }
                if (prevNode) {
                    tokens.push(prevNode);
                }
                tokens.push(node);
                break;
            }
            else {
                let text = str.substring(indicator + lastSegLength, rs.index);
                if (prevText) {
                    if (stripWhite) {
                        const stripStart = prevText.replace(/\n\s*$/, '\n');
                        const stripEnd = text.replace(/^\s*\n/, '');
                        const prevTextNode = getText(stripStart);
                        if (stripStart.length !== prevText.length &&
                            stripEnd.length !== text.length) {
                            text = stripEnd;
                        }
                        if (prevNode?.comment) {
                            tokens.push(prevTextNode);
                        }
                        else {
                            const lastToken = last(tokens);
                            const merge1 = prevText.replace(/\n|\s/g, '');
                            const merge2 = lastToken
                                ? lastToken.source.replace(/\n|\s/g, '')
                                : true;
                            if (!merge1 && !merge2 && lastToken) {
                                lastToken.source = '';
                            }
                            else {
                                tokens.push(getText(prevText));
                            }
                            if (prevNode)
                                tokens.push(prevNode);
                        }
                    }
                    else {
                        tokens.push(getText(prevText));
                        if (prevNode)
                            tokens.push(prevNode);
                    }
                }
                prevText = text;
                indicator = rs.index;
                const node = getText(text);
                fullStack.push(node);
                try {
                    const node2 = parseNode(rs, mixins);
                    prevNode = node2;
                    fullStack.push(node2);
                }
                catch (error) {
                    const recInfo = takeRight(fullStack, 5);
                    const tipInfo = map(recInfo, 'source').join('') + rs[0];
                    let tipIndicator = map(rs[0], () => '^').join('');
                    const tipLineStartIndex = lastIndexOf(substring(str, 0, rs.index), '\n') + 1;
                    tipIndicator = padStart(tipIndicator, rs.index - tipLineStartIndex + tipIndicator.length, ' ');
                    console.error('...', tipInfo + '\n' + tipIndicator + '\n', error);
                    return tokens;
                }
                lastSegLength = rs[0].length;
            }
        }
        return tokens;
    }
    function getText(str) {
        return {
            text: true,
            source: str,
        };
    }
    function parseNode(rs, mixins) {
        const parts = compact(rs);
        const src = parts[0];
        const modifier = src.replace(template.settings.delimiters[0], '')[0];
        switch (modifier) {
            case '-':
                return {
                    comment: true,
                    source: src,
                };
            case '=':
                return {
                    interpolate: true,
                    source: src,
                    expression: parts[1],
                };
            case '@':
                const mixin = parts[1];
                if (!mixins || !mixins[mixin]) {
                    throw new SyntaxError(`The mixin '${mixin}' does not exist, check if the options.mixins has been set`);
                }
                let paramters = trim(parts[2]);
                if (paramters) {
                    const matcher = paramters.match(/\{(?:,?[a-zA-Z_$][a-zA-Z0-9_$]*(?::.*?)?)+\}/gm);
                    if (!matcher) {
                        throw new SyntaxError(`Invalid mixin paramters '${parts[2]}', must be JSON form`);
                    }
                    paramters = matcher[0];
                }
                return {
                    mixin: true,
                    source: src,
                    tmpl: mixins[mixin],
                    paramters,
                };
            default:
                return {
                    evaluate: true,
                    source: src,
                    expression: parts[1],
                };
        }
    }
    function compile(tokens, options) {
        let funcStr = '';
        each(tokens, (token) => {
            if (token.comment)
                return;
            if (token.text) {
                funcStr += '\nprint(`' + token.source + '`);';
            }
            else if (token.interpolate) {
                funcStr += `\nprint(${token.expression});`;
            }
            else if (token.evaluate) {
                funcStr += '\n' + token.expression;
            }
            else if (token.mixin) {
                funcStr += `\nprint(_.template(${JSON.stringify(token.tmpl)},$options)(${token.paramters}));`;
            }
        });
        return (obj) => {
            let declarations = keys(obj).join(',');
            if (declarations) {
                declarations = '{' + declarations + '}';
            }
            let globalKeys = [];
            let globalValues = [];
            const paramAry = unzip(toPairs(options.globals));
            if (size(paramAry) > 0) {
                globalKeys = paramAry[0];
                globalValues = paramAry[1];
            }
            globalKeys.push('_');
            globalValues.push(myfx);
            const getRender = new Function(...globalKeys, '$options', `return function(${declarations}){
      const textQ=[];
      const print=(str)=>{
        textQ.push(str)
      };` +
                funcStr +
                ';return textQ.join("")}')(...globalValues, options);
            return getRender(obj);
        };
    }

    var template$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        default: template
    });

    function arrayToTree(array, idKey = 'id', pidKey, options = {}) {
        if (!isArray(array))
            return [];
        const pk = pidKey || 'pid';
        const attrMap = options.attrMap;
        const hasAttrMap = !!attrMap && isObject(attrMap);
        const rootParentValue = get(options, 'rootParentValue', null);
        const childrenKey = options.childrenKey || 'children';
        const sortKey = options.sortKey;
        const hasSortKey = !!sortKey;
        const roots = [];
        const nodeMap = {};
        const sortMap = {};
        array.forEach((record) => {
            const nodeId = record[idKey || 'id'];
            nodeMap[nodeId] = record;
            if (hasSortKey) {
                const sortNo = record[sortKey];
                sortMap[nodeId] = [sortNo, sortNo];
            }
            if (record[pk] === rootParentValue) {
                if (hasAttrMap) {
                    each(attrMap, (v, k) => (record[k] = record[v]));
                }
                roots.push(record);
            }
        });
        array.forEach((record) => {
            const parentId = record[pk];
            const parentNode = nodeMap[parentId];
            if (parentNode) {
                let children = parentNode[childrenKey];
                if (!children) {
                    children = parentNode[childrenKey] = [];
                }
                if (hasAttrMap) {
                    each(attrMap, (v, k) => (record[k] = record[v]));
                }
                if (hasSortKey) {
                    const [min, max] = sortMap[parentId];
                    const sortNo = record[sortKey];
                    if (sortNo <= min) {
                        children.unshift(record);
                        sortMap[parentId][0] = sortNo;
                    }
                    else if (sortNo >= max) {
                        children.push(record);
                        sortMap[parentId][1] = sortNo;
                    }
                    else {
                        const i = sortedIndexBy(children, { [sortKey]: sortNo }, sortKey);
                        children.splice(i, 0, record);
                    }
                }
                else {
                    children.push(record);
                }
            }
        });
        return hasSortKey ? sortBy(roots, sortKey) : roots;
    }

    function closest(node, predicate, parentKey) {
        let p = node;
        let t = null;
        let k = true;
        let i = 0;
        while (k && p) {
            if (predicate(p, i++, () => { k = false; })) {
                t = p;
                break;
            }
            p = p[parentKey];
        }
        return t;
    }

    function walkTree(treeNodes, callback, options) {
        _walkTree(treeNodes, callback, options);
    }
    function _walkTree(treeNodes, callback, options, ...rest) {
        options = options || {};
        const parentNode = rest[0];
        const chain = rest[1] || [];
        const childrenKey = options.childrenKey || 'children';
        const data = isArray(treeNodes) ? treeNodes : [treeNodes];
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const rs = callback(parentNode, node, chain);
            if (rs === false)
                return;
            if (rs === -1)
                continue;
            if (!isEmpty(node[childrenKey])) {
                let nextChain = [node];
                if (parentNode) {
                    nextChain = chain.concat(nextChain);
                }
                const rs = _walkTree(node[childrenKey], callback, options, node, nextChain);
                if (rs === false)
                    return;
            }
        }
    }

    function filterTree(treeNodes, predicate, options) {
        options = options || {};
        const callback = iteratee(predicate);
        const childrenKey = options.childrenKey || 'children';
        let nodes = [];
        walkTree(treeNodes, (p, n, c) => {
            const rs = callback(n);
            if (rs) {
                c.forEach((node) => {
                    if (!includes(nodes, node)) {
                        nodes.push(node);
                    }
                });
                nodes.push(n);
            }
        }, options);
        nodes = map(nodes, (item) => cloneWith(item, (v, k) => (k === childrenKey ? null : v)));
        return nodes;
    }

    function findTreeNode(treeNodes, predicate, options) {
        const callback = iteratee(predicate);
        let node;
        walkTree(treeNodes, (p, n, c) => {
            const rs = callback(n);
            if (rs) {
                node = n;
                return false;
            }
        }, options);
        return node;
    }

    function findTreeNodes(treeNodes, predicate, options) {
        const callback = iteratee(predicate);
        const nodes = [];
        walkTree(treeNodes, (p, n, c) => {
            const rs = callback(n);
            if (rs) {
                nodes.push(n);
            }
        }, options);
        return nodes;
    }

    function sortTree(treeNodes, comparator, options) {
        options = options || {};
        const childrenKey = options.childrenKey || 'children';
        const data = isArray(treeNodes)
            ? treeNodes
            : [treeNodes];
        data.sort((a, b) => comparator(a, b));
        data.forEach((node) => {
            if (!isEmpty(node[childrenKey])) {
                sortTree(node[childrenKey], comparator);
            }
        });
    }

    var tree = /*#__PURE__*/Object.freeze({
        __proto__: null,
        arrayToTree: arrayToTree,
        closest: closest,
        filterTree: filterTree,
        findTreeNode: findTreeNode,
        findTreeNodes: findTreeNodes,
        sortTree: sortTree,
        walkTree: walkTree
    });

    /* eslint-disable require-jsdoc */
    /* eslint-disable no-invalid-this */
    /* eslint-disable max-len */
    mixin(FuncChain, {
        ...str,
        ...num,
        ...datetime,
        ...is,
        ...object,
        ...collection,
        ...math,
        ...utils,
        ...functions,
        ...array,
        ...template$1,
        ...tree,
    });
    mixin(myfx, {
        ...str,
        ...num,
        ...datetime,
        ...is,
        ...object,
        ...collection,
        ...math,
        ...utils,
        ...functions,
        ...array,
        ...template$1,
        ...tree,
    });
    myfx.VERSION = '1.0.1';//version
    /**
     * 显式开启myfx的函数链，返回一个包裹了参数v的myfx链式对象。
     * <p>
     * 函数链使用惰性计算 —— 直到显示调用value()方法时，函数链才会进行计算并返回结果
     * </p>
     * @example
     * //3-5
     * console.log(_.chain([1,2,3,4]).map(v=>v+1).filter(v=>v%2!==0).take(2).join('-').value())
     *
     * @param v
     * @returns myfx对象
     */
    myfx.chain = myfx;
    //bind _
    const ctx = globalThis;
    if (ctx.myff) {
        setTimeout(function () {
            ctx.__f_prev = ctx._;
            ctx._ = myfx;
        }, 0);
    }

    class BaseStore {
        constructor() {
            this.opts = {
                prefix: "_myss_",
                type: exports.StoreType.LOCAL,
                serializer: (v) => {
                    if (isString(v))
                        return [v, SerializeType.STR];
                    if (isDate(v))
                        return [v.getTime() + "", SerializeType.DATE];
                    if (isNumber(v))
                        return [v + "", SerializeType.NUM];
                    if (isBoolean(v))
                        return [v + "", SerializeType.BOOL];
                    if (isUndefined(v))
                        return ["", SerializeType.UNDEF];
                    if (isNull(v))
                        return ["", SerializeType.NULL];
                    if (isNaN$1(v))
                        return ["", SerializeType.NAN];
                    if (isRegExp(v)) {
                        let str = v.toString();
                        return [str.substring(1, str.length - 1), SerializeType.EXP];
                    }
                    if (isFunction(v))
                        return [v.toString(), SerializeType.FUNC];
                    if (isObject(v))
                        return [JSON.stringify(v), SerializeType.JSON];
                    return ["$", SerializeType.STR];
                },
                unserializer: (dataStr, dataType) => {
                    switch (dataType) {
                        case SerializeType.DATE:
                            return new Date(parseInt(dataStr));
                        case SerializeType.NUM:
                            return Number(dataStr);
                        case SerializeType.BOOL:
                            return dataStr == "true" ? true : false;
                        case SerializeType.UNDEF:
                            return undefined;
                        case SerializeType.NULL:
                            return null;
                        case SerializeType.NAN:
                            return NaN;
                        case SerializeType.EXP:
                            return new RegExp(dataStr);
                        case SerializeType.FUNC:
                            return new Function(dataStr);
                        case SerializeType.JSON:
                            return JSON.parse(dataStr);
                        case SerializeType.STR:
                        default:
                            return dataStr;
                    }
                },
            };
        }
        getKey(key) {
            return this.opts.prefix + encodeURIComponent(key);
        }
        options(opts) {
            if (opts)
                merge(this.opts, opts);
            else {
                return this.opts;
            }
        }
    }
    /**
     * 存储类型
     */
    exports.StoreType = void 0;
    (function (StoreType) {
        StoreType["LOCAL"] = "local";
        StoreType["SESSION"] = "session";
        StoreType["COOKIE"] = "cookie";
        StoreType["INDEXED"] = "indexed";
        StoreType["MEMORY"] = "mem";
    })(exports.StoreType || (exports.StoreType = {}));
    /**
     * 序列化类型
     */
    var SerializeType;
    (function (SerializeType) {
        SerializeType["STR"] = "string";
        SerializeType["DATE"] = "date";
        SerializeType["NUM"] = "number";
        SerializeType["BOOL"] = "boolean";
        SerializeType["UNDEF"] = "undefined";
        SerializeType["NULL"] = "null";
        SerializeType["NAN"] = "nan";
        SerializeType["EXP"] = "exp";
        SerializeType["FUNC"] = "function";
        SerializeType["JSON"] = "json";
    })(SerializeType || (SerializeType = {}));

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */


    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var _Storage_storage;
    /**
     * local & session
     */
    class Storage extends BaseStore {
        constructor(type) {
            super();
            _Storage_storage.set(this, void 0);
            __classPrivateFieldSet(this, _Storage_storage, type === exports.StoreType.LOCAL ? localStorage : sessionStorage, "f");
        }
        keys() {
            return flatMap(Object.keys(__classPrivateFieldGet(this, _Storage_storage, "f")), (key) => startsWith(key, this.opts.prefix) ? key : []);
        }
        clear() {
            each(this.keys(), (key) => {
                if (startsWith(key, this.opts.prefix)) {
                    __classPrivateFieldGet(this, _Storage_storage, "f").removeItem(key);
                }
            });
        }
        has(key) {
            const k = this.getKey(key);
            return !!__classPrivateFieldGet(this, _Storage_storage, "f").getItem(this.getKey(k));
        }
        set(key, value, expires) {
            if (expires == 0)
                return false;
            const k = this.getKey(key);
            const [dataStr, dataType] = this.opts.serializer(value);
            let exp = expires || -1;
            const myVal = [
                exp < 0 ? expires : Date.now() + exp * 1000,
                dataStr,
                dataType,
            ];
            __classPrivateFieldGet(this, _Storage_storage, "f").setItem(k, JSON.stringify(myVal));
            return true;
        }
        /**
         * 通过指定key获取存储值
         * @param key
         * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
         */
        get(key) {
            const k = this.getKey(key);
            let storeStr = __classPrivateFieldGet(this, _Storage_storage, "f").getItem(k);
            if (storeStr) {
                const [expires, dataStr, dataType] = JSON.parse(storeStr);
                if (parseInt(expires) < Date.now()) {
                    __classPrivateFieldGet(this, _Storage_storage, "f").removeItem(k);
                    return null;
                }
                return this.opts.unserializer(dataStr, dataType);
            }
            return null;
        }
        /**
         * 通过指定key获取存储值字符串
         * @param key
         * @returns 字符串值；如果key不存在或已过期返回null
         */
        getString(key) {
            const k = this.getKey(key);
            let storeStr = __classPrivateFieldGet(this, _Storage_storage, "f").getItem(k);
            if (storeStr) {
                const [expires, dataStr] = JSON.parse(storeStr);
                if (parseInt(expires) < Date.now()) {
                    __classPrivateFieldGet(this, _Storage_storage, "f").removeItem(k);
                    return null;
                }
                return dataStr;
            }
            return null;
        }
        /**
         * 删除指定缓存
         * @param key
         */
        remove(key) {
            const k = this.getKey(key);
            if (!this.has(key))
                return false;
            __classPrivateFieldGet(this, _Storage_storage, "f").removeItem(k);
            return true;
        }
    }
    _Storage_storage = new WeakMap();

    class Cookie extends BaseStore {
        keys() {
            const keys = document.cookie.match(/(?:^|;)\s*([^=]*)=/gm);
            return flatMap(keys, (key) => startsWith(key.replace(/^;\s*/, ""), this.opts.prefix)
                ? key.replace(/^;\s*/, "").replace("=", "")
                : []);
        }
        clear() {
            each(this.keys(), (k) => {
                k = k.replace(/^;\s*/, "");
                if (startsWith(k, this.opts.prefix)) {
                    this.remove(k.replace(this.opts.prefix, ""));
                }
            });
        }
        has(key) {
            const k = this.getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), "$1");
            return !!storeStr;
        }
        set(key, value, expires, options) {
            if (expires == 0)
                return false;
            if (!key)
                return false;
            const k = this.getKey(key);
            const [dataStr, dataType] = this.opts.serializer(value);
            const myVal = [dataStr, dataType];
            if (options === null || options === void 0 ? void 0 : options.path) {
                myVal.push(options.path);
            }
            if (options === null || options === void 0 ? void 0 : options.domain) {
                myVal.push(options.domain);
            }
            let val = k + "=" + JSON.stringify(myVal);
            if (expires) {
                const doomsday = new Date(0x7fffffff * 1e3).getTime();
                expires = Date.now() + (expires < 0 ? doomsday : expires * 1000);
                val += ";expires=" + expires;
            }
            if (options === null || options === void 0 ? void 0 : options.path) {
                val += ";path=" + options.path;
            }
            if (options === null || options === void 0 ? void 0 : options.domain) {
                val += ";domain=" + options.path;
            }
            if (options === null || options === void 0 ? void 0 : options.secure) {
                val += ";secure";
            }
            document.cookie = val;
            return true;
        }
        /**
         * 通过指定key获取存储值
         * @param key
         * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
         */
        get(key) {
            const k = this.getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), "$1");
            if (storeStr) {
                const [dataStr, dataType] = JSON.parse(storeStr);
                return this.opts.unserializer(dataStr, dataType);
            }
            return null;
        }
        /**
         * 通过指定key获取存储值字符串
         * @param key
         * @returns 字符串值；如果key不存在或已过期返回null
         */
        getString(key) {
            const k = this.getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), "$1");
            if (storeStr) {
                const [dataStr, dataType] = JSON.parse(storeStr);
                return dataStr;
            }
            return null;
        }
        /**
         * 删除指定缓存
         * @param key
         */
        remove(key) {
            const k = this.getKey(key);
            const storeStr = document.cookie.replace(new RegExp(`(?:(?:^|.*;)\\s*${k}\\s*=\\s*([^;]*).*$)|^.*$`), "$1");
            if (!storeStr)
                return false;
            const [dataStr, dataType, path, domain] = JSON.parse(storeStr);
            let str = k + "=;expires=" + new Date(-1).toUTCString();
            if (path) {
                str += ";path=" + path;
            }
            if (domain) {
                str += ";domain=" + domain;
            }
            document.cookie = str;
            return true;
        }
    }

    var _Indexed_instances, _Indexed_db, _Indexed_listeners, _Indexed_on;
    let GlobalDB = null;
    class Indexed extends BaseStore {
        constructor() {
            super();
            _Indexed_instances.add(this);
            _Indexed_db.set(this, void 0);
            _Indexed_listeners.set(this, []);
            const that = this;
            if (GlobalDB)
                return;
            let prefix = this.opts.prefix;
            const request = indexedDB.open("MyStore", 1);
            request.onupgradeneeded = function (e) {
                const db = (GlobalDB = __classPrivateFieldSet(that, _Indexed_db, this.result, "f"));
                db.createObjectStore("storage", { keyPath: prefix });
            };
            request.onsuccess = function (e) {
                GlobalDB = __classPrivateFieldSet(that, _Indexed_db, this.result, "f");
                //exec queue
                each(__classPrivateFieldGet(that, _Indexed_listeners, "f"), ({ cmd, res, args }) => {
                    let promise = cmd.call(that, ...args);
                    if (promise.then) {
                        promise.then((rs) => res(rs));
                    }
                });
            };
            request.onerror = function (e) {
                console.error(e);
            };
        }
        keys() {
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.keys, res);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db
                    .transaction("storage", "readwrite")
                    .objectStore("storage");
                const req = objectStore.getAllKeys();
                req.onsuccess = function (ev) {
                    res(req.result);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        clear() {
            const objectStore = (__classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB)
                .transaction("storage", "readwrite")
                .objectStore("storage");
            objectStore.clear();
        }
        set(key, value, expires) {
            const k = this.getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.set, res, key, value, expires);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db
                    .transaction("storage", "readwrite")
                    .objectStore("storage");
                const req = objectStore.put({ [this.opts.prefix]: k, value, expires });
                req.onsuccess = function (ev) {
                    res(req.result.value);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        get(key) {
            const k = this.getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.get, res, key);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db
                    .transaction("storage", "readwrite")
                    .objectStore("storage");
                const req = objectStore.get(k);
                req.onsuccess = function (ev) {
                    res(req.result.value);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        getString(key) {
            return null;
        }
        remove(key) {
            const k = this.getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.remove, res, key);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db
                    .transaction("storage", "readwrite")
                    .objectStore("storage");
                const req = objectStore.delete(k);
                req.onsuccess = function (ev) {
                    res(req.result.value);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
        has(key) {
            const k = this.getKey(key);
            const db = __classPrivateFieldGet(this, _Indexed_db, "f") || GlobalDB;
            if (!db) {
                const that = this;
                const promise = new Promise((res, rej) => {
                    __classPrivateFieldGet(that, _Indexed_instances, "m", _Indexed_on).call(that, that.has, res, key);
                });
                return promise;
            }
            return new Promise((res, rej) => {
                const objectStore = db
                    .transaction("storage", "readwrite")
                    .objectStore("storage");
                const req = objectStore.get(k);
                req.onsuccess = function (ev) {
                    res(!!req.result);
                };
                req.onerror = function (ev) {
                    rej(ev);
                };
            });
        }
    }
    _Indexed_db = new WeakMap(), _Indexed_listeners = new WeakMap(), _Indexed_instances = new WeakSet(), _Indexed_on = function _Indexed_on(cmd, res, ...args) {
        let list = __classPrivateFieldGet(this, _Indexed_listeners, "f");
        if (!list) {
            list = [];
        }
        list.push({ cmd, res, args: args });
    };

    /**
     * globalThis
     */
    class Memory extends BaseStore {
        constructor() {
            super();
            set(globalThis, this.opts.prefix, {});
        }
        keys() {
            return Object.keys(get(globalThis, this.opts.prefix));
        }
        clear() {
            set(globalThis, this.opts.prefix, {});
        }
        has(key) {
            let k = encodeURIComponent(key);
            const mem = get(globalThis, this.opts.prefix);
            return !!mem[k];
        }
        set(key, value) {
            let k = encodeURIComponent(key);
            const mem = get(globalThis, this.opts.prefix);
            mem[k] = value;
            return true;
        }
        /**
         * 通过指定key获取存储值
         * @param key
         * @returns 返回值会自动反序列化为保存时的对象类型；如果key不存在或已过期返回null
         */
        get(key) {
            const mem = get(globalThis, this.opts.prefix);
            let k = encodeURIComponent(key);
            return mem[k];
        }
        /**
         * 通过指定key获取存储值字符串
         * @param key
         * @returns 字符串值；如果key不存在或已过期返回null
         */
        getString(key) {
            let rs = this.get(key);
            return this.opts.serializer(rs)[0];
        }
        /**
         * 删除指定缓存
         * @param key
         */
        remove(key) {
            if (!this.has(key))
                return false;
            const mem = get(globalThis, this.opts.prefix);
            let k = encodeURIComponent(key);
            mem[k] = null;
            delete mem[k];
            return true;
        }
    }

    /**
     * 提供基于localStorage/sessionStorage/cookie/indexedDB的统一存储API，
     * 并提供扩展特性以方便使用
     * @author holyhigh
     */
    /**
     * 获取一个store并使用
     * @param type
     */
    function getStore(type) {
        switch (type) {
            case exports.StoreType.COOKIE:
                return new Cookie();
            case exports.StoreType.INDEXED:
                return new Indexed();
            case exports.StoreType.MEMORY:
                return new Memory();
            case exports.StoreType.SESSION:
                return new Storage(exports.StoreType.SESSION);
            case exports.StoreType.LOCAL:
            default:
                return new Storage(exports.StoreType.LOCAL);
        }
    }
    let InnerStore = new Storage(exports.StoreType.LOCAL);
    var index = {
        set: (key, value, expires, options) => {
            return InnerStore.set.call(InnerStore, key, value, expires, options);
        },
        get: (key) => {
            return InnerStore.get.call(InnerStore, key);
        },
        getString: (key) => {
            return InnerStore.getString.call(InnerStore, key);
        },
        remove: (key) => {
            return InnerStore.remove.call(InnerStore, key);
        },
        keys: () => {
            return InnerStore.keys.call(InnerStore);
        },
        has: (key) => {
            return InnerStore.has.call(InnerStore, key);
        },
        clear: () => {
            return InnerStore.clear.call(InnerStore);
        },
        getStore,
        options: (opts) => {
            if (opts) {
                InnerStore.options(opts);
                if (opts.type) {
                    InnerStore = getStore(opts.type);
                }
            }
            else {
                return InnerStore.options();
            }
        },
    };

    exports.default = index;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
