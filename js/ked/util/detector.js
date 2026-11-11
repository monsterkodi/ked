var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var detector

import extlang from "../../kolor/extlang.js"
let exts = extlang.exts
let lang = extlang.lang


detector = (function ()
{
    function detector ()
    {}

    detector["detectClassWeights"] = {keyword:1,'keyword function':1,'keyword type':1,require:0.9,define:0.9,punct:0.8,type:0.7,function:0.5,'function call':0.5,method:0.5,module:0.35,property:0.2,'property color':0.2,'property special':0.2,argument:0.35,important:0.4,nil:0.3}
    detector["kodeSignals"] = [['[◆▪■□➜⮐▸]',6],['(^|\\n)\\s*(log|use)\\s+',3],['(^|\\n)\\s*@\\w*\\s*:',2]]
    detector["coffeeSignals"] = [['(^|\\n)\\s*unless\\b',3],['\\b(isnt|yes|no)\\b',1.5],['(^|\\n)\\s*@\\w+\\s*=',1.5],['->',1.5]]
    detector["jsSignals"] = [['\\bconsole\\.(log|error|warn|info|debug)\\b',4],['\\b(document|window|globalThis)\\.',3],['\\b(require|module\\.exports|exports\\.)',3],['(^|\\n)\\s*(const|let)\\s+[A-Za-z_$]',2],['=>',2],['===|!==',2],['(^|\\n)\\s*(async\\s+)?function\\s+\\w*\\s*\\(',3],['\\bexport\\s+(default|const|function|class)\\b',3],['\\.then\\s*\\(|new\\s+Promise\\b',2],['\\?\\?|\\?\\.',1],['\\bnew\\s+[A-Z]\\w*\\s*\\(',1]]
    detector["tsSignals"] = [['\\b(interface|type)\\s+[A-Za-z_$]\\w*',3],['\\b(readonly|implements|namespace|declare|enum)\\b',2],['\\b(public|private|protected)\\s+\\w+',2],['\\bimport\\s+type\\b',3],['\\bas\\s+(const|string|number|boolean|any)\\b',2],['\\w+\\?:\\s*\\w+',1],['<\\w+(\\[\\])?>\\s*[=(]',1]]
    detector["pySignals"] = [['(^|\\n)\\s*def\\s+\\w+\\s*\\([^\\n]*\\)\\s*:',5],['(^|\\n)\\s*class\\s+\\w+([^\\n]*)?:',4],['(^|\\n)\\s*(elif|except)\\b',4],['\\bself\\.\\w+',3],['__init__|__name__',4],['\\blambda\\s+\\w+\\s*:',3],['(^|\\n)\\s*@\\w+(\\.\\w+)*\\s*$',2],['\\b(None|True|False)\\b',2],['\\b(range|len)\\s*\\(',1.5],["\"\"\"|'''",3],['(^|\\n)\\s*(if|elif|else|for|while|try|except|finally|with|import|from|return|yield|raise|pass|break|continue)\\b[^\\n]*:',2],['\\bprint\\s*\\(',1.5]]
    detector["shellSignals"] = [['^#!.*\\b(ba|z|k|da|fi)?sh\\b',6],['\\$\\{?[A-Za-z_]\\w*\\}?',2],['\\$\\([^)\\n]*\\)',3],['\\b(fi|done|esac|then|elif)\\b',2],['\\|\\s*(grep|sed|awk|head|tail|sort|cat|cut|xargs|tee)\\b',3],['\\b(grep|sed|awk|curl|wget|chmod|sudo|mkdir|rm|cp|mv|cat|echo)\\s',2],['2>&1|>\\s*/dev/null',3],['\\[\\[?\\s*-[a-z]\\s',3],['(^|\\n)\\s*(export|source|alias)\\s+',2],[';\\s*do\\b',1.5]]
    detector["fishSignals"] = [['^#!.*\\bfish\\b',6],['(^|\\n)\\s*(set|function|status|string|math|test)\\b',2],['\\$\\w+\\[',2],['\\bcommand\\s+-[a-z]',2]]
    detector["luaSignals"] = [['(^|\\n)\\s*--',4],['(^|\\n)\\s*local\\s+\\w+',4],['(^|\\n)\\s*function\\s+[\\w.:]+\\s*\\(',3],['\\b(then|elseif)\\b',2],['\\bnil\\b',1.5],['~=',2],['\\.\\.(?!\\.)',2],['\\b(ipairs|pairs|require|setmetatable|getmetatable)\\s*\\(',2]]
    detector["zigSignals"] = [['@import\\s*\\(',5],['(^|\\n)\\s*(pub\\s+)?fn\\s+\\w+',4],['!void|!u\\d+|!\\[\\]',3],['\\b(orelse|defer)\\b',3],['\\.\\{',2],['\\[\\]const\\s+\\w+',3],['@\\w+\\s*\\(',2],['(^|\\n)\\s*(const|var)\\s+\\w+\\s*=\\s*',1],['\\bcatch\\b',1]]
    detector["nimSignals"] = [['(^|\\n)\\s*proc\\s+\\w+',5],['(^|\\n)\\s*(method|template|macro|iterator|converter)\\s+\\w+',4],['(^|\\n)\\s*func\\s+\\w+',2],['\\becho\\s+',3],['\\b(discard|newSeq|result)\\b',2],['(^|\\n)\\s*import\\s+[\\w, ]+',2],['\\b(var|let|const)\\s+\\w+\\s*:',2],['@\\[',3],['(^|\\n)\\s*#[^\\n]*',0.5]]
    detector["cFamilySignals"] = [['#include\\s*<[\\w./]+>',3],['#define\\s+\\w+',3],['#pragma\\s+',3],['\\b(struct|enum|union)\\s+\\w+\\s*\\{',2],['\\b(int|void|char|float|double|long|unsigned|short)\\s+\\w+\\s*\\(',2],['\\breturn\\s+[\\w.]+\\s*;',1],['->\\s*\\w+',1]]
    detector["cppSignals"] = [['#include\\s*<(iostream|vector|string|map|memory|algorithm|utility|thread|mutex|fstream|sstream)>',4],['\\bstd::',3],['\\b(cout|cin|cerr|endl)\\b',3],['\\b(template\\s*<|typename|using\\s+namespace)',3],['\\b(public|private|protected)\\s*:',2],['\\bnew\\s+[A-Za-z_]\\w*|\\bdelete\\b',1],['::',1.5]]
    detector["cSignals"] = [['#include\\s*<(stdio|stdlib|string|math|unistd|stdint|stdbool|assert|ctype|time|sys/\\w+)',4],['\\b(printf|scanf|malloc|calloc|realloc|free|fopen|fclose|strlen|memcpy)\\s*\\(',2],['(^|\\n)\\s*(int|void)\\s+main\\s*\\(',2]]
    detector["mmSignals"] = [['@(interface|implementation|protocol|property|synthesize|end)\\b',5],['#import\\s',4],['\\bNS[A-Z]\\w+',3],['\\b(self|super|alloc|release|autorelease)\\b',1.5],['\\b(YES|NO|BOOL)\\b',1]]
    detector["csSignals"] = [['\\busing\\s+System\\b',4],['\\bConsole\\.(Write|Read|Error)\\w*',4],['\\b(public|private|protected)\\s+static\\s+void\\s+Main\\b',4],['\\bnamespace\\s+\\w+',2],['\\b(string\\[\\]|List<|IEnumerable<|Dictionary<)',2],['\\bvar\\s+\\w+\\s*=\\s*new\\b',2]]
    detector["htmlSignals"] = [['</?[a-zA-Z][\\w-]*(\\s|>|/)',2],['<!DOCTYPE|<!--|-->',3],["\\b(class|id|href|src|style)\\s*=\\s*[\"']",2],['</\\w+\\s*>',2],['<\\w+[^>]*/>',2]]
    detector["svgSignals"] = [['<svg\\b|</svg>|viewBox|xmlns=',4],['<(path|rect|circle|ellipse|polygon|polyline|line|text|g|defs)\\b',1.5]]
    detector["mdSignals"] = [['(^|\\n)#{1,6}\\s+\\S',3],['\\*\\*[^*\\n]+\\*\\*|__[^_\\n]+__',2],['\\[[^\\]\\n]+\\]\\([^)\\n]+\\)',3],['(^|\\n)\\s*[-*+]\\s+\\S',1],['(^|\\n)>\\s+\\S',1.5],['(^|\\n)```',3],['`[^`\\n]+`',1]]
    detector["cssSignals"] = [['[\\w-]+\\s*:\\s*[^;{\\n]+;',2],['[.#][\\w-]+\\s*([,{:])',2],['@(media|import|font-face|keyframes|supports|charset)\\b',3],['#[0-9a-fA-F]{3,8}\\b',1.5],['\\b\\d+(px|em|rem|vh|vw|vmin|vmax|%|s|ms)\\b',1],['!important',2],['\\b(color|background|margin|padding|font|display|border|width|height|position|flex|grid|transform|transition)\\s*:',1.5]]
    detector["cssBracedSignals"] = [['\\{[^{}]*[\\w-]+\\s*:\\s*[^;{}]+;',3],[';\\s*\\}',2]]
    detector["scssSignals"] = [['\\$[A-Za-z_]\\w*\\s*:',3],['@(mixin|include|extend|each|if|else|for|while|function)\\b',2],['&:?[\\w-]+',1]]
    detector["stylSignals"] = [['(^|\\n)\\s*[\\w-]+\\s+[#\\d][^\\n]*$',2]]
    detector["jsonSignals"] = [['(^|\\n)\\s*"[^"\\n]+"\\s*:',2],['(^|\\n)\\s*[\\[{]\\s*(\\n|$)',1],['[:\\[,]\\s*(true|false|null)\\b',1.5]]
    detector["yamlSignals"] = [['(^|\\n)\\s*[\\w.-]+\\s*:\\s*(\\n|$|\\S)',2],['(^|\\n)\\s*-\\s+\\S',1.5],['(^|\\n)---\\s*$',3],['(^|\\n)\\s*#\\s',0.5]]
    detector["iniSignals"] = [['(^|\\n)\\s*\\[[^\\]\\n]+\\]\\s*$',3],['(^|\\n)\\s*[\\w.-]+\\s*=\\s*\\S',1.5],['(^|\\n)\\s*[;#]\\s',0.5]]
    detector["plistSignals"] = [['<key>|<dict>|<array>|<string>|<plist',4],['<\\?xml',1]]
    detector["swiftSignals"] = [['(^|\\n)\\s*import\\s+(Foundation|UIKit|SwiftUI|AppKit)\\b',5],['(^|\\n)\\s*func\\s+\\w+\\s*\\(',4],['\\b(guard|if)\\s+let\\b',3],['->\\s*[A-Z]\\w*',2],['\\b(let|var)\\s+\\w+\\s*:\\s*[A-Z]\\w*',3],['@(IBOutlet|IBAction|objc|escaping|available)\\b',3],['\\b(String|Int|Bool|Double|Float|Array|Dictionary|Optional)\\b',1.5],['\\boverride\\s+func\\b',2]]
    detector["signalRegex"] = function (pattern)
    {
        var _264_31_, _265_40_

        detector.signalRegexes = ((_264_31_=detector.signalRegexes) != null ? _264_31_ : {})
        detector.signalRegexes[pattern] = ((_265_40_=detector.signalRegexes[pattern]) != null ? _265_40_ : new RegExp(pattern,'gm'))
        return detector.signalRegexes[pattern]
    }

    detector["signalsFor"] = function (ext)
    {
        var sigs, _270_30_

        detector.signalsCache = ((_270_30_=detector.signalsCache) != null ? _270_30_ : {})
        if (detector.signalsCache[ext])
        {
            return detector.signalsCache[ext]
        }
        sigs = []
        if (ext === 'kode')
        {
            sigs = sigs.concat(detector.kodeSignals)
        }
        if (ext === 'coffee')
        {
            sigs = sigs.concat(detector.coffeeSignals)
        }
        if (_k_.in(ext,['js','ts']))
        {
            sigs = sigs.concat(detector.jsSignals)
        }
        if (ext === 'ts')
        {
            sigs = sigs.concat(detector.tsSignals)
        }
        if (ext === 'py')
        {
            sigs = sigs.concat(detector.pySignals)
        }
        if (_k_.in(ext,['sh','bash']))
        {
            sigs = sigs.concat(detector.shellSignals)
        }
        if (ext === 'fish')
        {
            sigs = sigs.concat(detector.fishSignals)
        }
        if (_k_.in(ext,['lua','kua']))
        {
            sigs = sigs.concat(detector.luaSignals)
        }
        if (ext === 'zig')
        {
            sigs = sigs.concat(detector.zigSignals)
        }
        if (_k_.in(ext,['nim','kim']))
        {
            sigs = sigs.concat(detector.nimSignals)
        }
        if (_k_.in(ext,['cpp','hpp','cxx','mm','c','h','cs','frag','vert']))
        {
            sigs = sigs.concat(detector.cFamilySignals)
        }
        if (_k_.in(ext,['cpp','hpp','cxx']))
        {
            sigs = sigs.concat(detector.cppSignals)
        }
        if (ext === 'c')
        {
            sigs = sigs.concat(detector.cSignals)
        }
        if (ext === 'cs')
        {
            sigs = sigs.concat(detector.csSignals)
        }
        if (ext === 'mm')
        {
            sigs = sigs.concat(detector.mmSignals)
        }
        if (_k_.in(ext,['html','htm']))
        {
            sigs = sigs.concat(detector.htmlSignals)
        }
        if (ext === 'svg')
        {
            sigs = sigs.concat(detector.htmlSignals).concat(detector.svgSignals)
        }
        if (ext === 'md')
        {
            sigs = sigs.concat(detector.mdSignals)
        }
        if (_k_.in(ext,['css','scss','sass','styl']))
        {
            sigs = sigs.concat(detector.cssSignals)
        }
        if (_k_.in(ext,['css','scss']))
        {
            sigs = sigs.concat(detector.cssBracedSignals)
        }
        if (_k_.in(ext,['scss','sass']))
        {
            sigs = sigs.concat(detector.scssSignals)
        }
        if (ext === 'styl')
        {
            sigs = sigs.concat(detector.stylSignals)
        }
        if (ext === 'json')
        {
            sigs = sigs.concat(detector.jsonSignals)
        }
        if (_k_.in(ext,['yml','yaml']))
        {
            sigs = sigs.concat(detector.yamlSignals)
        }
        if (ext === 'ini')
        {
            sigs = sigs.concat(detector.iniSignals)
        }
        if (ext === 'plist')
        {
            sigs = sigs.concat(detector.plistSignals)
        }
        if (ext === 'swift')
        {
            sigs = sigs.concat(detector.swiftSignals)
        }
        detector.signalsCache[ext] = sigs
        return sigs
    }

    detector["looksLikeKode"] = function (text)
    {
        var marker

        var list = ['⮐','◆','▪','■','□','➜']
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            marker = list[_a_]
            if (text.includes(marker))
            {
                return true
            }
        }
        if (/(^|\n)\s*log\s+/.test(text))
        {
            return true
        }
        if (/(^|\n)\s*use\s+/.test(text))
        {
            return true
        }
        if (/(^|\n)\s*@\w*\s*:/.test(text))
        {
            return true
        }
        return false
    }

    detector["looksLikeJSON"] = function (text)
    {
        var s

        s = _k_.trim(text)
        if (_k_.empty(s))
        {
            return false
        }
        if (!(_k_.in(s[0],['{','['])))
        {
            return false
        }
        try
        {
            JSON.parse(s)
            return true
        }
        catch (err)
        {
            return false
        }
    }

    detector["detectTokens"] = function (text)
    {
        var before, c, i, j, n, quote, seen, tokens, word

        tokens = []
        seen = {}
        i = 0
        n = text.length
        while (i < n)
        {
            c = text[i]
            if (_k_.in(c,['"',"'",'`']))
            {
                quote = c
                i += 1
                while (i < n)
                {
                    if (text[i] === '\\')
                    {
                        i += 2
                    }
                    else if (text[i] === quote)
                    {
                        i += 1
                        break
                    }
                    else
                    {
                        i += 1
                    }
                }
                continue
            }
            if (c === '/' && text[i + 1] === '/')
            {
                while (i < n && text[i] !== '\n')
                {
                    i += 1
                }
                continue
            }
            if (c === '/' && text[i + 1] === '*')
            {
                i += 2
                while (i < n && !(text[i] === '*' && text[i + 1] === '/'))
                {
                    i += 1
                }
                i += 2
                continue
            }
            if (c === '#')
            {
                while (i < n && text[i] !== '\n')
                {
                    i += 1
                }
                continue
            }
            if (c === '@' && i + 1 < n && /[A-Za-z_]/.test(text[i + 1]))
            {
                j = i + 2
                while (j < n && /[A-Za-z0-9_]/.test(text[j]))
                {
                    j += 1
                }
                word = text.slice(i, typeof j === 'number' ? j : -1)
                if (!seen[word])
                {
                    seen[word] = true
                    tokens.push(word)
                }
                i = j
                continue
            }
            if (/[A-Za-z_$]/.test(c))
            {
                j = i + 1
                while (j < n && /[A-Za-z0-9_$]/.test(text[j]))
                {
                    j += 1
                }
                word = text.slice(i, typeof j === 'number' ? j : -1)
                before = (i > 0 ? text[i - 1] : '')
                if (word.length > 1 && before !== '.' && !seen[word])
                {
                    seen[word] = true
                    tokens.push(word)
                }
                i = j
                continue
            }
            i += 1
        }
        return tokens
    }

    detector["detectExt"] = function (text)
    {
        var bestScore, candidates, classWeight, cls, detectedExts, ext, matches, n, owners, score, scores, sig, signalCount, signalCounts, token, tokens, weight, wordCount, wordCounts, words, _437_63_, _438_28_, _440_32_, _448_28_, _450_34_, _458_38_, _459_42_, _460_44_

        if (_k_.empty(text))
        {
            return 'kode'
        }
        if (this.looksLikeKode(text))
        {
            return 'kode'
        }
        if (this.looksLikeJSON(text))
        {
            return 'json'
        }
        tokens = this.detectTokens(text)
        detectedExts = exts.filter(function (ext)
        {
            return !(_k_.in(ext,['txt','log']))
        })
        n = detectedExts.length
        scores = {}
        wordCounts = {}
        signalCounts = {}
        var list = _k_.list(tokens)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            token = list[_a_]
            owners = []
            var list1 = _k_.list(detectedExts)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                ext = list1[_b_]
                words = lang[ext]
                if (words && words.hasOwnProperty(token))
                {
                    owners.push(ext)
                }
            }
            if (_k_.empty(owners))
            {
                continue
            }
            weight = Math.log((n + 1) / owners.length)
            var list2 = _k_.list(owners)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                ext = list2[_c_]
                cls = lang[ext][token]
                classWeight = ((_437_63_=detector.detectClassWeights[cls]) != null ? _437_63_ : 0.5)
                scores[ext] = ((_438_28_=scores[ext]) != null ? _438_28_ : 0)
                scores[ext] += weight * classWeight
                wordCounts[ext] = ((_440_32_=wordCounts[ext]) != null ? _440_32_ : 0)
                wordCounts[ext] += 1
            }
        }
        var list3 = _k_.list(detectedExts)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            ext = list3[_d_]
            var list4 = _k_.list(detector.signalsFor(ext))
            for (var _e_ = 0; _e_ < list4.length; _e_++)
            {
                sig = list4[_e_]
                matches = text.match(detector.signalRegex(sig[0]))
                if (!matches)
                {
                    continue
                }
                scores[ext] = ((_448_28_=scores[ext]) != null ? _448_28_ : 0)
                scores[ext] += sig[1] * _k_.min(matches.length,3)
                signalCounts[ext] = ((_450_34_=signalCounts[ext]) != null ? _450_34_ : 0)
                signalCounts[ext] += 1
            }
        }
        bestScore = 0
        candidates = []
        var list5 = _k_.list(detectedExts)
        for (var _f_ = 0; _f_ < list5.length; _f_++)
        {
            ext = list5[_f_]
            score = ((_458_38_=scores[ext]) != null ? _458_38_ : 0)
            wordCount = ((_459_42_=wordCounts[ext]) != null ? _459_42_ : 0)
            signalCount = ((_460_44_=signalCounts[ext]) != null ? _460_44_ : 0)
            if (wordCount <= 1 && signalCount === 0)
            {
                continue
            }
            if (score > bestScore + 0.000001)
            {
                bestScore = score
                candidates = [ext]
            }
            else if (score > 0 && Math.abs(score - bestScore) <= 0.000001)
            {
                candidates.push(ext)
            }
        }
        if (bestScore < 1)
        {
            return 'kode'
        }
        if (candidates.length)
        {
            return candidates[0]
        }
        return 'kode'
    }

    return detector
})()

export default detector;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0ZWN0b3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZGV0ZWN0b3Iua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNnQixjQUFBO0lBQVU7SUFBSzs7O0FBRTlCLFlBQUQ7Ozs7O0lBSUksVUFBQyx3QkFDRyxRQUFvQixFQUNwQixtQkFBb0IsRUFDcEIsZUFBb0IsRUFDcEIsUUFBb0IsSUFDcEIsT0FBb0IsSUFDcEIsTUFBb0IsSUFDcEIsS0FBb0IsSUFDcEIsU0FBb0IsSUFDcEIsZ0JBQW9CLElBQ3BCLE9BQW9CLElBQ3BCLE9BQW9CLEtBQ3BCLFNBQW9CLElBQ3BCLGlCQUFvQixJQUNwQixtQkFBb0IsSUFDcEIsU0FBb0IsS0FDcEIsVUFBb0IsSUFDcEIsSUFBb0I7SUFJeEIsVUFBQyxrQkFDSSxZQUFZLElBQ1osMkJBQTJCLElBQzNCLHdCQUF3QjtJQUc3QixVQUFDLG9CQUNJLHVCQUF1QixJQUN2QixzQkFBc0IsTUFDdEIsd0JBQXdCLE1BQ3hCLEtBQUs7SUFHVixVQUFDLGdCQUNJLDhDQUE4QyxJQUM5QyxxQ0FBcUMsSUFDckMsMkNBQTJDLElBQzNDLHVDQUF1QyxJQUN2QyxLQUFLLElBQ0wsVUFBVSxJQUNWLGlEQUFpRCxJQUNqRCxpREFBaUQsSUFDakQsbUNBQW1DLElBQ25DLGdCQUFnQixJQUNoQiw2QkFBNkI7SUFHbEMsVUFBQyxnQkFDSSx3Q0FBd0MsSUFDeEMscURBQXFELElBQ3JELHdDQUF3QyxJQUN4Qyx1QkFBdUIsSUFDdkIsZ0RBQWdELElBQ2hELG1CQUFtQixJQUNuQiwwQkFBMEI7SUFHL0IsVUFBQyxnQkFDSSwrQ0FBK0MsSUFDL0Msc0NBQXNDLElBQ3RDLDhCQUE4QixJQUM5QixpQkFBaUIsSUFDakIsb0JBQW9CLElBQ3BCLHlCQUF5QixJQUN6QixrQ0FBa0MsSUFDbEMsMEJBQTBCLElBQzFCLHdCQUF3QixNQUN4QixhQUFhLElBQ2IsNEhBQTRILElBQzVILGtCQUFrQjtJQUd2QixVQUFDLG1CQUNJLCtCQUErQixJQUMvQiwyQkFBMkIsSUFDM0Isb0JBQW9CLElBQ3BCLGlDQUFpQyxJQUNqQyw0REFBNEQsSUFDNUQsb0VBQW9FLElBQ3BFLHNCQUFzQixJQUN0Qix1QkFBdUIsSUFDdkIsdUNBQXVDLElBQ3ZDLGFBQWE7SUFHbEIsVUFBQyxrQkFDSSxrQkFBa0IsSUFDbEIsdURBQXVELElBQ3ZELGFBQWEsSUFDYix1QkFBdUI7SUFHNUIsVUFBQyxpQkFDSSxnQkFBZ0IsSUFDaEIsMkJBQTJCLElBQzNCLHlDQUF5QyxJQUN6QyxzQkFBc0IsSUFDdEIsWUFBWSxNQUNaLEtBQUssSUFDTCxnQkFBZ0IsSUFDaEIsNkRBQTZEO0lBR2xFLFVBQUMsaUJBQ0ksaUJBQWlCLElBQ2pCLGtDQUFrQyxJQUNsQyx1QkFBdUIsSUFDdkIsdUJBQXVCLElBQ3ZCLFNBQVMsSUFDVCxzQkFBc0IsSUFDdEIsZUFBZSxJQUNmLDBDQUEwQyxJQUMxQyxjQUFjO0lBR25CLFVBQUMsaUJBQ0ksMEJBQTBCLElBQzFCLGdFQUFnRSxJQUNoRSwwQkFBMEIsSUFDMUIsY0FBYyxJQUNkLGdDQUFnQyxJQUNoQyxnQ0FBZ0MsSUFDaEMsa0NBQWtDLElBQ2xDLE9BQU8sSUFDUCxzQkFBc0I7SUFHM0IsVUFBQyxxQkFDSSx5QkFBeUIsSUFDekIsa0JBQWtCLElBQ2xCLGNBQWMsSUFDZCx3Q0FBd0MsSUFDeEMscUVBQXFFLElBQ3JFLDRCQUE0QixJQUM1QixhQUFhO0lBR2xCLFVBQUMsaUJBQ0ksbUdBQW1HLElBQ25HLFdBQVcsSUFDWCw2QkFBNkIsSUFDN0IsaURBQWlELElBQ2pELHFDQUFxQyxJQUNyQyx1Q0FBdUMsSUFDdkMsS0FBSztJQUdWLFVBQUMsZUFDSSwyRkFBMkYsSUFDM0YsaUZBQWlGLElBQ2pGLHVDQUF1QztJQUc1QyxVQUFDLGdCQUNJLGtFQUFrRSxJQUNsRSxhQUFhLElBQ2IsaUJBQWlCLElBQ2pCLCtDQUErQyxNQUMvQyxzQkFBc0I7SUFHM0IsVUFBQyxnQkFDSSx3QkFBd0IsSUFDeEIsc0NBQXNDLElBQ3RDLDZEQUE2RCxJQUM3RCx1QkFBdUIsSUFDdkIsbURBQW1ELElBQ25ELGdDQUFnQztJQUdyQyxVQUFDLGtCQUNJLDhCQUE4QixJQUM5QixxQkFBcUIsSUFDckIsNkNBQTZDLElBQzdDLGNBQWMsSUFDZCxlQUFlO0lBR3BCLFVBQUMsaUJBQ0ksZ0NBQWdDLElBQ2hDLG1FQUFtRTtJQUd4RSxVQUFDLGdCQUNJLHVCQUF1QixJQUN2QixvQ0FBb0MsSUFDcEMsaUNBQWlDLElBQ2pDLDBCQUEwQixJQUMxQixrQkFBa0IsTUFDbEIsYUFBYSxJQUNiLGFBQWE7SUFHbEIsVUFBQyxpQkFDSSw2QkFBNkIsSUFDN0IseUJBQXlCLElBQ3pCLDBEQUEwRCxJQUMxRCx1QkFBdUIsTUFDdkIsK0NBQStDLElBQy9DLGFBQWEsSUFDYixxSEFBcUg7SUFHMUgsVUFBQyx1QkFDSSxvQ0FBb0MsSUFDcEMsV0FBVztJQUdoQixVQUFDLGtCQUNJLHdCQUF3QixJQUN4Qiw2REFBNkQsSUFDN0QsYUFBYTtJQUdsQixVQUFDLGtCQUNJLHVDQUF1QztJQUc1QyxVQUFDLGtCQUNJLDZCQUE2QixJQUM3QiwrQkFBK0IsSUFDL0Isa0NBQWtDO0lBR3ZDLFVBQUMsa0JBQ0ksMENBQTBDLElBQzFDLHNCQUFzQixNQUN0QixrQkFBa0IsSUFDbEIsa0JBQWtCO0lBR3ZCLFVBQUMsaUJBQ0ksbUNBQW1DLElBQ25DLGtDQUFrQyxNQUNsQyxxQkFBcUI7SUFHMUIsVUFBQyxtQkFDSSx1Q0FBdUMsSUFDdkMsVUFBVTtJQUdmLFVBQUMsbUJBQ0ksNERBQTRELElBQzVELGlDQUFpQyxJQUNqQywwQkFBMEIsSUFDMUIsa0JBQWtCLElBQ2xCLHlDQUF5QyxJQUN6QyxrREFBa0QsSUFDbEQsaUVBQWlFLE1BQ2pFLHlCQUF5QjtJQUc5QixVQUFDLDBCQUFhOzs7O1FBRVYsU0FBUywyQkFBVCxTQUFTO1FBQ1QsU0FBUyxjQUFjLHNCQUF2QixTQUFTLGNBQWMsbUNBQWdCLE9BQU8sUUFBUztlQUN2RCxTQUFTLGNBQWM7OztJQUUzQixVQUFDLHlCQUFZOzs7O1FBRVQsU0FBUywwQkFBVCxTQUFTO1lBQ3VCLFNBQVMsYUFBYTs7bUJBQXBELFNBQVMsYUFBYTs7UUFFeEI7WUFFRyxRQUFPOztZQUFTLE9BQU8sS0FBSyxPQUFPLFNBQVM7O1lBQzVDLFFBQU87O1lBQVcsT0FBTyxLQUFLLE9BQU8sU0FBUzs7bUJBQzlDLEtBQVEsS0FBSzs7WUFBUSxPQUFPLEtBQUssT0FBTyxTQUFTOztZQUNqRCxRQUFPOztZQUFPLE9BQU8sS0FBSyxPQUFPLFNBQVM7O1lBQzFDLFFBQU87O1lBQU8sT0FBTyxLQUFLLE9BQU8sU0FBUzs7bUJBQzFDLEtBQVEsS0FBSzs7WUFBVSxPQUFPLEtBQUssT0FBTyxTQUFTOztZQUNuRCxRQUFPOztZQUFTLE9BQU8sS0FBSyxPQUFPLFNBQVM7O21CQUM1QyxLQUFRLE1BQU07O1lBQVMsT0FBTyxLQUFLLE9BQU8sU0FBUzs7WUFDbkQsUUFBTzs7WUFBUSxPQUFPLEtBQUssT0FBTyxTQUFTOzttQkFDM0MsS0FBUSxNQUFNOztZQUFTLE9BQU8sS0FBSyxPQUFPLFNBQVM7O21CQUNuRCxLQUFRLE1BQU0sTUFBTSxNQUFNLEtBQUssSUFBSSxJQUFJLEtBQUssT0FBTzs7WUFBVSxPQUFPLEtBQUssT0FBTyxTQUFTOzttQkFDekYsS0FBUSxNQUFNLE1BQU07O1lBQVMsT0FBTyxLQUFLLE9BQU8sU0FBUzs7WUFDekQsUUFBTzs7WUFBTSxPQUFPLEtBQUssT0FBTyxTQUFTOztZQUN6QyxRQUFPOztZQUFPLE9BQU8sS0FBSyxPQUFPLFNBQVM7O1lBQzFDLFFBQU87O1lBQU8sT0FBTyxLQUFLLE9BQU8sU0FBUzs7bUJBQzFDLEtBQVEsT0FBTzs7WUFBUyxPQUFPLEtBQUssT0FBTyxTQUFTOztZQUNwRCxRQUFPOztZQUFRLE9BQU8sS0FBSyxPQUFPLFNBQVMsYUFBYSxPQUFPLFNBQVM7O1lBQ3hFLFFBQU87O1lBQU8sT0FBTyxLQUFLLE9BQU8sU0FBUzs7bUJBQzFDLEtBQVEsTUFBTSxPQUFPLE9BQU87O1lBQVUsT0FBTyxLQUFLLE9BQU8sU0FBUzs7bUJBQ2xFLEtBQVEsTUFBTTs7WUFBVSxPQUFPLEtBQUssT0FBTyxTQUFTOzttQkFDcEQsS0FBUSxPQUFPOztZQUFVLE9BQU8sS0FBSyxPQUFPLFNBQVM7O1lBQ3JELFFBQU87O1lBQVMsT0FBTyxLQUFLLE9BQU8sU0FBUzs7WUFDNUMsUUFBTzs7WUFBUyxPQUFPLEtBQUssT0FBTyxTQUFTOzttQkFDNUMsS0FBUSxNQUFNOztZQUFVLE9BQU8sS0FBSyxPQUFPLFNBQVM7O1lBQ3BELFFBQU87O1lBQVEsT0FBTyxLQUFLLE9BQU8sU0FBUzs7WUFDM0MsUUFBTzs7WUFBVSxPQUFPLEtBQUssT0FBTyxTQUFTOztZQUM3QyxRQUFPOztZQUFVLE9BQU8sS0FBSyxPQUFPLFNBQVM7O1FBRWhELFNBQVMsYUFBYSxPQUFPO2VBQzdCOzs7SUFFSixVQUFDLDRCQUFlOzs7O29CQUVHLElBQUksSUFBSSxJQUFJLElBQUksSUFBSTs7O1lBQS9CO2dCQUNVLEtBQUssU0FBUzs7dUJBQXRCOzs7WUFFSSxrQkFBa0IsS0FBSzs7bUJBQS9COztZQUNRLGtCQUFrQixLQUFLOzttQkFBL0I7O1lBQ1Esb0JBQW9CLEtBQUs7O21CQUFqQzs7ZUFFRjs7O0lBRUosVUFBQyw0QkFBZTs7OztRQUVaLGFBQVM7c0JBQ1E7O21CQUFmOztxQkFDUyxFQUFFLElBQVcsSUFBSTs7bUJBQTFCOzs7O1lBR0UsS0FBSyxNQUFNO21CQUNUOztlQUNBOzttQkFDQTs7OztJQUVWLFVBQUMsMkJBQWM7Ozs7UUFFWDtRQUNBO1FBQ0EsSUFBUztRQUNULElBQVMsS0FBSztlQUVSLElBQUk7O1lBRU4sSUFBSSxLQUFLO3VCQUVOLEdBQU0sSUFBSSxJQUFJOztnQkFFYixRQUFRO2dCQUNSLEtBQUs7dUJBRUMsSUFBSTs7d0JBQ0gsS0FBSyxPQUFNOzt3QkFDVixLQUFLOzs2QkFDRCxLQUFLLE9BQU07O3dCQUNmLEtBQUs7d0JBQ0w7Ozs7d0JBRUEsS0FBSzs7O2dCQUViOztnQkFFRCxNQUFLLE9BQVEsS0FBSyxJQUFFLE9BQU07O3VCQUNuQixJQUFJLEtBQU0sS0FBSyxPQUFNOztvQkFDdkIsS0FBSzs7Z0JBQ1Q7O2dCQUVELE1BQUssT0FBUSxLQUFLLElBQUUsT0FBTTs7Z0JBQ3pCLEtBQUs7dUJBQ0MsSUFBSSxPQUFXLEtBQUssT0FBTSxPQUFRLEtBQUssSUFBRSxPQUFNOztvQkFDakQsS0FBSzs7Z0JBQ1QsS0FBSztnQkFDTDs7Z0JBRUQsTUFBSzs7dUJBQ0UsSUFBSSxLQUFNLEtBQUssT0FBTTs7b0JBQ3ZCLEtBQUs7O2dCQUNUOztnQkFFRCxNQUFLLE9BQVEsSUFBRSxJQUFJLEtBQU0sWUFBWSxLQUFLLEtBQUssSUFBRTs7Z0JBRWhELElBQUksSUFBRTt1QkFDQSxJQUFJLEtBQU0sZUFBZSxLQUFLLEtBQUs7O29CQUNyQyxLQUFLOztnQkFFVCxPQUFPLFdBQUssVUFBSSxpQkFBQTtxQkFFVCxLQUFLOztvQkFDUixLQUFLLFFBQVE7b0JBQ2IsT0FBTyxLQUFLOztnQkFFaEIsSUFBSTtnQkFDSjs7Z0JBRUQsYUFBYSxLQUFLOztnQkFFakIsSUFBSSxJQUFFO3VCQUVBLElBQUksS0FBTSxnQkFBZ0IsS0FBSyxLQUFLOztvQkFDdEMsS0FBSzs7Z0JBRVQsT0FBUyxXQUFLLFVBQUksaUJBQUE7Z0JBQ2xCLFVBQVMsSUFBSSxJQUFJLEtBQUssSUFBRSxLQUFLO29CQUUxQixLQUFLLFNBQVMsS0FBTSxXQUFVLFFBQVksS0FBSzs7b0JBQzlDLEtBQUssUUFBUTtvQkFDYixPQUFPLEtBQUs7O2dCQUVoQixJQUFJO2dCQUNKOztZQUVKLEtBQUs7O2VBRVQ7OztJQUVKLFVBQUMsd0JBQVc7Ozs7c0JBRVU7O21CQUFoQjs7WUFDVSxLQUFDLGNBQWM7O21CQUF6Qjs7WUFDVSxLQUFDLGNBQWM7O21CQUF6Qjs7UUFFRixTQUFTLEtBQUMsYUFBYTtRQUV2QixlQUFlLEtBQUssaUJBQVE7OzRCQUFRLEtBQVksTUFBTTs7UUFDdEQsSUFBZSxhQUFhO1FBQzVCO1FBQ0E7UUFDQTs0QkFFYTs7O1lBQVQ7WUFFQTtpQ0FFVzs7O2dCQUFQO2dCQUNBLFFBQVEsS0FBSztvQkFDTSxTQUFVLE1BQU0sZUFBZTs7b0JBQWxELE9BQU8sS0FBSzs7OzBCQUVFOztnQkFBbEI7O1lBRUEsU0FBUyxLQUFLLEtBQUssSUFBRSxLQUFHLE9BQU87aUNBRXBCOzs7Z0JBQVA7Z0JBQ0EsTUFBTSxLQUFLLEtBQUs7Z0JBQ2hCLHlCQUFjLFNBQVMsbUJBQW1CLDJCQUFPO2dCQUNqRCxPQUFPLGtCQUFQLE9BQU8sMkJBQVE7Z0JBQ2YsT0FBTyxRQUFRLFNBQVM7Z0JBQ3hCLFdBQVcsa0JBQVgsV0FBVywyQkFBUTtnQkFDbkIsV0FBVyxRQUFROzs7NkJBRWhCOzs7WUFBUDtpQ0FFVyxTQUFTLFdBQVc7OztnQkFBM0I7Z0JBQ0EsVUFBVSxLQUFLLE1BQU0sU0FBUyxZQUFZLElBQUk7cUJBQzlCOztvQkFBaEI7O2dCQUNBLE9BQU8sa0JBQVAsT0FBTywyQkFBUTtnQkFDZixPQUFPLFFBQVEsSUFBSSxhQUFTLFFBQVEsT0FBTztnQkFDM0MsYUFBYSxrQkFBYixhQUFhLDJCQUFRO2dCQUNyQixhQUFhLFFBQVE7OztRQUU3QixZQUFhO1FBQ2I7NkJBRVc7OztZQUFQO1lBRUEsbUJBQWMsT0FBTywyQkFBTztZQUM1Qix1QkFBYyxXQUFXLDJCQUFPO1lBQ2hDLHlCQUFjLGFBQWEsMkJBQU87Z0JBRXRCLGFBQWEsS0FBTSxnQkFBZTs7Z0JBQTlDOztnQkFFRyxRQUFRLFlBQVk7O2dCQUNuQixZQUFZO2dCQUNaLGNBQWM7O3FCQUNWLFFBQVEsS0FBTSxLQUFLLElBQUksUUFBTSxjQUFjOztnQkFDL0MsV0FBVyxLQUFLOzs7WUFFWixZQUFZOzttQkFBdEI7O1lBQ2lCLFdBQVc7O21CQUE1QixXQUFXOztlQUViOzs7V0FyZFA7OztlQXVkTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/detector.kode
