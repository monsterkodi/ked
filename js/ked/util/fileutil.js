var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { var m = Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var fileutil

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

import salter from "../../kxk/salter.js"

import extlang from "../../kolor/extlang.js"
let exts = extlang.exts
let lang = extlang.lang


fileutil = (function ()
{
    function fileutil ()
    {}

    fileutil["indexFileExtensions"] = ['kode','mm','zig','cc','c','h','hpp','cpp','nim','kim','lua','kua']
    fileutil["dotFileExtensions"] = ['bashrc','bash_history','gitconfig','gitignore_global','lesshst','npmrc','nvimrc','profile','zprofile','zsh_history','zshrc']
    fileutil["sourceFileExtensions"] = fileutil.indexFileExtensions.concat(fileutil.dotFileExtensions,['ts','js','mjs','swift','styl','css','pug','html','md','noon','json','txt','log','sh','fish','py','frag','vert','config','toml','conf','gitignore','plist'])
    fileutil["imageExtensions"] = ['png','jpg','jpeg','gif','tiff','pxm','icns','webp']
    fileutil["counterparts"] = {mm:['h'],cpp:['hpp','h'],cc:['hpp','h'],h:['cpp','c','mm'],hpp:['cpp','c'],coffee:['js','mjs'],kode:['js','mjs'],kim:['nim'],nim:['kim'],kua:['lua'],lua:['kua'],js:['coffee','kode'],mjs:['coffee','kode'],pug:['html'],noon:['json'],json:['noon'],html:['pug'],css:['styl'],styl:['css']}
    fileutil["detectClassWeights"] = {keyword:1,'keyword function':1,'keyword type':1,require:0.9,define:0.9,punct:0.8,type:0.7,function:0.5,'function call':0.5,method:0.5,module:0.35,property:0.2,'property color':0.2,'property special':0.2,argument:0.35,important:0.4,nil:0.3}
    fileutil["kodeSignals"] = [['[◆▪■□➜⮐▸]',6],['(^|\\n)\\s*(log|use)\\s+',3],['(^|\\n)\\s*@\\w*\\s*:',2]]
    fileutil["coffeeSignals"] = [['(^|\\n)\\s*unless\\b',3],['\\b(isnt|yes|no)\\b',1.5],['(^|\\n)\\s*@\\w+\\s*=',1.5],['->',1.5]]
    fileutil["jsSignals"] = [['\\bconsole\\.(log|error|warn|info|debug)\\b',4],['\\b(document|window|globalThis)\\.',3],['\\b(require|module\\.exports|exports\\.)',3],['(^|\\n)\\s*(const|let)\\s+[A-Za-z_$]',2],['=>',2],['===|!==',2],['(^|\\n)\\s*(async\\s+)?function\\s+\\w*\\s*\\(',3],['\\bexport\\s+(default|const|function|class)\\b',3],['\\.then\\s*\\(|new\\s+Promise\\b',2],['\\?\\?|\\?\\.',1],['\\bnew\\s+[A-Z]\\w*\\s*\\(',1]]
    fileutil["tsSignals"] = [['\\b(interface|type)\\s+[A-Za-z_$]\\w*',3],['\\b(readonly|implements|namespace|declare|enum)\\b',2],['\\b(public|private|protected)\\s+\\w+',2],['\\bimport\\s+type\\b',3],['\\bas\\s+(const|string|number|boolean|any)\\b',2],['\\w+\\?:\\s*\\w+',1],['<\\w+(\\[\\])?>\\s*[=(]',1]]
    fileutil["pySignals"] = [['(^|\\n)\\s*def\\s+\\w+\\s*\\([^\\n]*\\)\\s*:',5],['(^|\\n)\\s*class\\s+\\w+([^\\n]*)?:',4],['(^|\\n)\\s*(elif|except)\\b',4],['\\bself\\.\\w+',3],['__init__|__name__',4],['\\blambda\\s+\\w+\\s*:',3],['(^|\\n)\\s*@\\w+(\\.\\w+)*\\s*$',2],['\\b(None|True|False)\\b',2],['\\b(range|len)\\s*\\(',1.5],["\"\"\"|'''",3],['(^|\\n)\\s*(if|elif|else|for|while|try|except|finally|with|import|from|return|yield|raise|pass|break|continue)\\b[^\\n]*:',2],['\\bprint\\s*\\(',1.5]]
    fileutil["shellSignals"] = [['^#!.*\\b(ba|z|k|da|fi)?sh\\b',6],['\\$\\{?[A-Za-z_]\\w*\\}?',2],['\\$\\([^)\\n]*\\)',3],['\\b(fi|done|esac|then|elif)\\b',2],['\\|\\s*(grep|sed|awk|head|tail|sort|cat|cut|xargs|tee)\\b',3],['\\b(grep|sed|awk|curl|wget|chmod|sudo|mkdir|rm|cp|mv|cat|echo)\\s',2],['2>&1|>\\s*/dev/null',3],['\\[\\[?\\s*-[a-z]\\s',3],['(^|\\n)\\s*(export|source|alias)\\s+',2],[';\\s*do\\b',1.5]]
    fileutil["fishSignals"] = [['^#!.*\\bfish\\b',6],['(^|\\n)\\s*(set|function|status|string|math|test)\\b',2],['\\$\\w+\\[',2],['\\bcommand\\s+-[a-z]',2]]
    fileutil["luaSignals"] = [['(^|\\n)\\s*--',4],['(^|\\n)\\s*local\\s+\\w+',4],['(^|\\n)\\s*function\\s+[\\w.:]+\\s*\\(',3],['\\b(then|elseif)\\b',2],['\\bnil\\b',1.5],['~=',2],['\\.\\.(?!\\.)',2],['\\b(ipairs|pairs|require|setmetatable|getmetatable)\\s*\\(',2]]
    fileutil["zigSignals"] = [['@import\\s*\\(',5],['(^|\\n)\\s*(pub\\s+)?fn\\s+\\w+',4],['!void|!u\\d+|!\\[\\]',3],['\\b(orelse|defer)\\b',3],['\\.\\{',2],['\\[\\]const\\s+\\w+',3],['@\\w+\\s*\\(',2],['(^|\\n)\\s*(const|var)\\s+\\w+\\s*=\\s*',1],['\\bcatch\\b',1]]
    fileutil["nimSignals"] = [['(^|\\n)\\s*proc\\s+\\w+',5],['(^|\\n)\\s*(method|template|macro|iterator|converter)\\s+\\w+',4],['(^|\\n)\\s*func\\s+\\w+',2],['\\becho\\s+',3],['\\b(discard|newSeq|result)\\b',2],['(^|\\n)\\s*import\\s+[\\w, ]+',2],['\\b(var|let|const)\\s+\\w+\\s*:',2],['@\\[',3],['(^|\\n)\\s*#[^\\n]*',0.5]]
    fileutil["cFamilySignals"] = [['#include\\s*<[\\w./]+>',3],['#define\\s+\\w+',3],['#pragma\\s+',3],['\\b(struct|enum|union)\\s+\\w+\\s*\\{',2],['\\b(int|void|char|float|double|long|unsigned|short)\\s+\\w+\\s*\\(',2],['\\breturn\\s+[\\w.]+\\s*;',1],['->\\s*\\w+',1]]
    fileutil["cppSignals"] = [['#include\\s*<(iostream|vector|string|map|memory|algorithm|utility|thread|mutex|fstream|sstream)>',4],['\\bstd::',3],['\\b(cout|cin|cerr|endl)\\b',3],['\\b(template\\s*<|typename|using\\s+namespace)',3],['\\b(public|private|protected)\\s*:',2],['\\bnew\\s+[A-Za-z_]\\w*|\\bdelete\\b',1],['::',1.5]]
    fileutil["cSignals"] = [['#include\\s*<(stdio|stdlib|string|math|unistd|stdint|stdbool|assert|ctype|time|sys/\\w+)',4],['\\b(printf|scanf|malloc|calloc|realloc|free|fopen|fclose|strlen|memcpy)\\s*\\(',2],['(^|\\n)\\s*(int|void)\\s+main\\s*\\(',2]]
    fileutil["mmSignals"] = [['@(interface|implementation|protocol|property|synthesize|end)\\b',5],['#import\\s',4],['\\bNS[A-Z]\\w+',3],['\\b(self|super|alloc|release|autorelease)\\b',1.5],['\\b(YES|NO|BOOL|id)\\b',1]]
    fileutil["csSignals"] = [['\\busing\\s+System\\b',4],['\\bConsole\\.(Write|Read|Error)\\w*',4],['\\b(public|private|protected)\\s+static\\s+void\\s+Main\\b',4],['\\bnamespace\\s+\\w+',2],['\\b(string\\[\\]|List<|IEnumerable<|Dictionary<)',2],['\\bvar\\s+\\w+\\s*=\\s*new\\b',2]]
    fileutil["htmlSignals"] = [['</?[a-zA-Z][\\w-]*(\\s|>|/)',2],['<!DOCTYPE|<!--|-->',3],["\\b(class|id|href|src|style)\\s*=\\s*[\"']",2],['</\\w+\\s*>',2],['<\\w+[^>]*/>',2]]
    fileutil["svgSignals"] = [['<svg\\b|</svg>|viewBox|xmlns=',4],['<(path|rect|circle|ellipse|polygon|polyline|line|text|g|defs)\\b',1.5]]
    fileutil["mdSignals"] = [['(^|\\n)#{1,6}\\s+\\S',3],['\\*\\*[^*\\n]+\\*\\*|__[^_\\n]+__',2],['\\[[^\\]\\n]+\\]\\([^)\\n]+\\)',3],['(^|\\n)\\s*[-*+]\\s+\\S',1],['(^|\\n)>\\s+\\S',1.5],['(^|\\n)```',3],['`[^`\\n]+`',1]]
    fileutil["cssSignals"] = [['[\\w-]+\\s*:\\s*[^;{\\n]+;',2],['[.#][\\w-]+\\s*([,{:])',2],['@(media|import|font-face|keyframes|supports|charset)\\b',3],['#[0-9a-fA-F]{3,8}\\b',1.5],['\\b\\d+(px|em|rem|vh|vw|vmin|vmax|%|s|ms)\\b',1],['!important',2],['\\b(color|background|margin|padding|font|display|border|width|height|position|flex|grid|transform|transition)\\s*:',1.5]]
    fileutil["cssBracedSignals"] = [['\\{[^{}]*[\\w-]+\\s*:\\s*[^;{}]+;',3],[';\\s*\\}',2]]
    fileutil["scssSignals"] = [['\\$[A-Za-z_]\\w*\\s*:',3],['@(mixin|include|extend|each|if|else|for|while|function)\\b',2],['&:?[\\w-]+',1]]
    fileutil["stylSignals"] = [['(^|\\n)\\s*[\\w-]+\\s+[#\\d][^\\n]*$',2]]
    fileutil["jsonSignals"] = [['(^|\\n)\\s*"[^"\\n]+"\\s*:',2],['(^|\\n)\\s*[\\[{]\\s*(\\n|$)',1],['[:\\[,]\\s*(true|false|null)\\b',1.5]]
    fileutil["yamlSignals"] = [['(^|\\n)\\s*[\\w.-]+\\s*:\\s*(\\n|$|\\S)',2],['(^|\\n)\\s*-\\s+\\S',1.5],['(^|\\n)---\\s*$',3],['(^|\\n)\\s*#\\s',0.5]]
    fileutil["iniSignals"] = [['(^|\\n)\\s*\\[[^\\]\\n]+\\]\\s*$',3],['(^|\\n)\\s*[\\w.-]+\\s*=\\s*\\S',1.5],['(^|\\n)\\s*[;#]\\s',0.5]]
    fileutil["plistSignals"] = [['<key>|<dict>|<array>|<string>|<plist',4],['<\\?xml',1]]
    fileutil["swiftSignals"] = [['(^|\\n)\\s*import\\s+(Foundation|UIKit|SwiftUI|AppKit)\\b',5],['(^|\\n)\\s*func\\s+\\w+\\s*\\(',4],['\\b(guard|if)\\s+let\\b',3],['->\\s*[A-Z]\\w*',2],['\\b(let|var)\\s+\\w+\\s*:\\s*[A-Z]\\w*',3],['@(IBOutlet|IBAction|objc|escaping|available)\\b',3],['\\b(String|Int|Bool|Double|Float|Array|Dictionary|Optional)\\b',1.5],['\\boverride\\s+func\\b',2]]
    fileutil["signalRegex"] = function (pattern)
    {
        var _291_31_, _292_40_

        fileutil.signalRegexes = ((_291_31_=fileutil.signalRegexes) != null ? _291_31_ : {})
        fileutil.signalRegexes[pattern] = ((_292_40_=fileutil.signalRegexes[pattern]) != null ? _292_40_ : new RegExp(pattern,'gm'))
        return fileutil.signalRegexes[pattern]
    }

    fileutil["signalsFor"] = function (ext)
    {
        var sigs, _297_30_

        fileutil.signalsCache = ((_297_30_=fileutil.signalsCache) != null ? _297_30_ : {})
        if (fileutil.signalsCache[ext])
        {
            return fileutil.signalsCache[ext]
        }
        sigs = []
        if (ext === 'kode')
        {
            sigs = sigs.concat(fileutil.kodeSignals)
        }
        if (ext === 'coffee')
        {
            sigs = sigs.concat(fileutil.coffeeSignals)
        }
        if (_k_.in(ext,['js','ts']))
        {
            sigs = sigs.concat(fileutil.jsSignals)
        }
        if (ext === 'ts')
        {
            sigs = sigs.concat(fileutil.tsSignals)
        }
        if (ext === 'py')
        {
            sigs = sigs.concat(fileutil.pySignals)
        }
        if (_k_.in(ext,['sh','bash']))
        {
            sigs = sigs.concat(fileutil.shellSignals)
        }
        if (ext === 'fish')
        {
            sigs = sigs.concat(fileutil.fishSignals)
        }
        if (_k_.in(ext,['lua','kua']))
        {
            sigs = sigs.concat(fileutil.luaSignals)
        }
        if (ext === 'zig')
        {
            sigs = sigs.concat(fileutil.zigSignals)
        }
        if (_k_.in(ext,['nim','kim']))
        {
            sigs = sigs.concat(fileutil.nimSignals)
        }
        if (_k_.in(ext,['cpp','hpp','cxx','mm','c','h','cs','frag','vert']))
        {
            sigs = sigs.concat(fileutil.cFamilySignals)
        }
        if (_k_.in(ext,['cpp','hpp','cxx']))
        {
            sigs = sigs.concat(fileutil.cppSignals)
        }
        if (ext === 'c')
        {
            sigs = sigs.concat(fileutil.cSignals)
        }
        if (ext === 'cs')
        {
            sigs = sigs.concat(fileutil.csSignals)
        }
        if (ext === 'mm')
        {
            sigs = sigs.concat(fileutil.mmSignals)
        }
        if (_k_.in(ext,['html','htm']))
        {
            sigs = sigs.concat(fileutil.htmlSignals)
        }
        if (ext === 'svg')
        {
            sigs = sigs.concat(fileutil.htmlSignals).concat(fileutil.svgSignals)
        }
        if (ext === 'md')
        {
            sigs = sigs.concat(fileutil.mdSignals)
        }
        if (_k_.in(ext,['css','scss','sass','styl']))
        {
            sigs = sigs.concat(fileutil.cssSignals)
        }
        if (_k_.in(ext,['css','scss']))
        {
            sigs = sigs.concat(fileutil.cssBracedSignals)
        }
        if (_k_.in(ext,['scss','sass']))
        {
            sigs = sigs.concat(fileutil.scssSignals)
        }
        if (ext === 'styl')
        {
            sigs = sigs.concat(fileutil.stylSignals)
        }
        if (ext === 'json')
        {
            sigs = sigs.concat(fileutil.jsonSignals)
        }
        if (_k_.in(ext,['yml','yaml']))
        {
            sigs = sigs.concat(fileutil.yamlSignals)
        }
        if (ext === 'ini')
        {
            sigs = sigs.concat(fileutil.iniSignals)
        }
        if (ext === 'plist')
        {
            sigs = sigs.concat(fileutil.plistSignals)
        }
        if (ext === 'swift')
        {
            sigs = sigs.concat(fileutil.swiftSignals)
        }
        fileutil.signalsCache[ext] = sigs
        return sigs
    }

    fileutil["looksLikeKode"] = function (text)
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

    fileutil["looksLikeJSON"] = function (text)
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

    fileutil["detectTokens"] = function (text)
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

    fileutil["detectExt"] = function (text)
    {
        var bestScore, candidates, classWeight, cls, detectedExts, ext, matches, n, owners, score, scores, sig, signalCount, signalCounts, token, tokens, weight, wordCount, wordCounts, words, _464_63_, _465_28_, _467_32_, _475_28_, _477_34_, _485_38_, _486_42_, _487_44_

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
                classWeight = ((_464_63_=fileutil.detectClassWeights[cls]) != null ? _464_63_ : 0.5)
                scores[ext] = ((_465_28_=scores[ext]) != null ? _465_28_ : 0)
                scores[ext] += weight * classWeight
                wordCounts[ext] = ((_467_32_=wordCounts[ext]) != null ? _467_32_ : 0)
                wordCounts[ext] += 1
            }
        }
        var list3 = _k_.list(detectedExts)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            ext = list3[_d_]
            var list4 = _k_.list(fileutil.signalsFor(ext))
            for (var _e_ = 0; _e_ < list4.length; _e_++)
            {
                sig = list4[_e_]
                matches = text.match(fileutil.signalRegex(sig[0]))
                if (!matches)
                {
                    continue
                }
                scores[ext] = ((_475_28_=scores[ext]) != null ? _475_28_ : 0)
                scores[ext] += sig[1] * _k_.min(matches.length,3)
                signalCounts[ext] = ((_477_34_=signalCounts[ext]) != null ? _477_34_ : 0)
                signalCounts[ext] += 1
            }
        }
        bestScore = 0
        candidates = []
        var list5 = _k_.list(detectedExts)
        for (var _f_ = 0; _f_ < list5.length; _f_++)
        {
            ext = list5[_f_]
            score = ((_485_38_=scores[ext]) != null ? _485_38_ : 0)
            wordCount = ((_486_42_=wordCounts[ext]) != null ? _486_42_ : 0)
            signalCount = ((_487_44_=signalCounts[ext]) != null ? _487_44_ : 0)
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

    fileutil["swapLastDir"] = function (path, from, to)
    {
        var lastIndex

        lastIndex = path.lastIndexOf(`/${from}/`)
        if (lastIndex >= 0)
        {
            path = path.slice(0, typeof lastIndex === 'number' ? lastIndex+1 : Infinity) + to + path.slice(lastIndex + (`/${from}`).length)
        }
        return path
    }

    fileutil["existingFiles"] = async function (paths, cwd)
    {
        var absFile, exists, files, path

        cwd = (cwd != null ? cwd : process.cwd())
        files = []
        var list = _k_.list(paths)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            path = list[_a_]
            absFile = slash.absolute(path,cwd)
            if (_k_.in(absFile,files))
            {
                continue
            }
            exists = await nfs.fileExists(absFile)
            if (!exists)
            {
                continue
            }
            absFile = await nfs.resolveSymlink(absFile)
            if (_k_.empty(absFile))
            {
                continue
            }
            if (_k_.in(absFile,files))
            {
                continue
            }
            files.push(absFile)
        }
        return files
    }

    fileutil["trash"] = async function (path)
    {
        return await nfs.trash(path)
    }

    fileutil["class"] = async function (name)
    {
        var currentDir, file

        currentDir = slash.dir(ked_session.get('editor▸file'))
        currentDir = (currentDir != null ? currentDir : process.cwd())
        file = slash.path(currentDir,`${name}.kode`)
        await nfs.write(file,`###
${salter(name,{prepend:'    '})}
###

function ${name}

    @: ->
    
export ${name}
`)
        return post.emit('file.open',file,6,'eol')
    }

    fileutil["newFolder"] = async function (parent)
    {
        var dir, res

        dir = slash.path(parent,'new_folder')
        res = await nfs.mkdir(dir)
        if (res === dir)
        {
            return post.emit('redraw')
        }
    }

    fileutil["rename"] = async function (oldPath, newPath)
    {
        var res

        if (oldPath === newPath)
        {
            return
        }
        res = await nfs.move(oldPath,newPath)
        if (res !== newPath)
        {
            console.error(`rename failed! ${res}`)
        }
    }

    fileutil["duplicate"] = async function (path)
    {
        var res

        res = await nfs.duplicate(path)
        if (res)
        {
            return post.emit('redraw')
        }
    }

    return fileutil
})()

post.on('file.trash',fileutil.trash)
post.on('file.class',fileutil.class)
post.on('file.rename',fileutil.rename)
post.on('file.duplicate',fileutil.duplicate)
post.on('file.new_folder',fileutil.newFolder)
export default fileutil;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBZ0I7SUFBSztJQUFNOztPQUNYLGFBQWhCOztPQUNNLGNBQUE7SUFBVTtJQUFLOzs7QUFFOUIsWUFBRDs7Ozs7SUFHSSxVQUFDLHlCQUF3QixPQUFPLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLE1BQU0sTUFBTSxNQUFNLE1BQU07SUFDdEYsVUFBQyx1QkFBd0IsU0FBUyxlQUFlLFlBQVksbUJBQW1CLFVBQVUsUUFBUSxTQUFTLFVBQVUsV0FBVyxjQUFjO0lBQzlJLFVBQUMseUJBQXNCLFNBQVMsb0JBQW9CLE9BQU8sU0FBUyxtQkFBb0IsS0FBSyxLQUFLLE1BQU0sUUFBUSxPQUFPLE1BQU0sTUFBTSxPQUFPLEtBQUssT0FBTyxPQUFPLE1BQU0sTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLE9BQU8sU0FBUyxPQUFPLE9BQU8sWUFBWTtJQUMzTyxVQUFDLHFCQUF1QixNQUFNLE1BQU0sT0FBTyxNQUFNLE9BQU8sTUFBTSxPQUFPO0lBRXJFLFVBQUMsa0JBQ0csSUFBVSxLQUNWLEtBQVUsTUFBTSxLQUNoQixJQUFVLE1BQU0sS0FDaEIsR0FBVSxNQUFNLElBQUksTUFDcEIsS0FBVSxNQUFNLEtBQ2hCLFFBQVUsS0FBSyxPQUNmLE1BQVUsS0FBSyxPQUNmLEtBQVUsT0FDVixLQUFVLE9BQ1YsS0FBVSxPQUNWLEtBQVUsT0FDVixJQUFVLFNBQVMsUUFDbkIsS0FBVSxTQUFTLFFBQ25CLEtBQVUsUUFDVixNQUFVLFFBQ1YsTUFBVSxRQUNWLE1BQVUsT0FDVixLQUFVLFFBQ1YsTUFBVTtJQUVkLFVBQUMsd0JBQ0csUUFBb0IsRUFDcEIsbUJBQW9CLEVBQ3BCLGVBQW9CLEVBQ3BCLFFBQW9CLElBQ3BCLE9BQW9CLElBQ3BCLE1BQW9CLElBQ3BCLEtBQW9CLElBQ3BCLFNBQW9CLElBQ3BCLGdCQUFv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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/fileutil.kode
