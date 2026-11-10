var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
    fileutil["detectClassWeights"] = {keyword:1,'keyword function':1,'keyword type':1,require:0.9,define:0.9,punct:0.8,type:0.7,function:0.5,'function call':0.5,method:0.5,module:0.35,property:0.2,'property color':0.2,'property special':0.2,argument:0.35,important:0.4,nil:0.3}
    fileutil["counterparts"] = {mm:['h'],cpp:['hpp','h'],cc:['hpp','h'],h:['cpp','c','mm'],hpp:['cpp','c'],coffee:['js','mjs'],kode:['js','mjs'],kim:['nim'],nim:['kim'],kua:['lua'],lua:['kua'],js:['coffee','kode'],mjs:['coffee','kode'],pug:['html'],noon:['json'],json:['noon'],html:['pug'],css:['styl'],styl:['css']}
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
        var bestScore, candidates, classWeight, cls, detectedExts, ext, n, owners, score, scores, token, tokens, weight, words, _176_63_, _177_28_, _187_32_

        if (_k_.empty(text))
        {
            return 'kode'
        }
        if (this.looksLikeKode(text))
        {
            return 'kode'
        }
        console.log("---------------------")
        console.log(text)
        console.log("---------------------")
        tokens = this.detectTokens(text)
        console.log("tokens:",tokens)
        detectedExts = exts.filter(function (ext)
        {
            return !(_k_.in(ext,['txt','log']))
        })
        n = detectedExts.length
        scores = {}
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
                classWeight = ((_176_63_=fileutil.detectClassWeights[cls]) != null ? _176_63_ : 0.5)
                scores[ext] = ((_177_28_=scores[ext]) != null ? _177_28_ : 0)
                scores[ext] += weight * classWeight
            }
        }
        bestScore = 0
        candidates = []
        console.log("scores:",scores)
        var list3 = _k_.list(detectedExts)
        for (var _d_ = 0; _d_ < list3.length; _d_++)
        {
            ext = list3[_d_]
            score = ((_187_32_=scores[ext]) != null ? _187_32_ : 0)
            if (score > bestScore + 0.000001)
            {
                bestScore = score
                candidates = [ext]
            }
            else if (score > 0 && Math.abs(score - bestScore) <= 0.000001)
            {
                console.log(`??? ${ext}`)
                candidates.push(ext)
            }
        }
        console.log(`bestScore: ${bestScore}`)
        console.log("candidates:",candidates)
        console.log("---------------------")
        if (bestScore < 1)
        {
            return 'kode'
        }
        if (_k_.in('kode',candidates))
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNVLFVBQUE7SUFBZ0I7SUFBSztJQUFNOztPQUNYLGFBQWhCOztPQUNNLGNBQUE7SUFBVTtJQUFLOzs7QUFFOUIsWUFBRDs7Ozs7SUFHSSxVQUFDLHlCQUF3QixPQUFPLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLE1BQU0sTUFBTSxNQUFNLE1BQU07SUFDdEYsVUFBQyx1QkFBd0IsU0FBUyxlQUFlLFlBQVksbUJBQW1CLFVBQVUsUUFBUSxTQUFTLFVBQVUsV0FBVyxjQUFjO0lBQzlJLFVBQUMseUJBQXNCLFNBQVMsb0JBQW9CLE9BQU8sU0FBUyxtQkFBb0IsS0FBSyxLQUFLLE1BQU0sUUFBUSxPQUFPLE1BQU0sTUFBTSxPQUFPLEtBQUssT0FBTyxPQUFPLE1BQU0sTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLE9BQU8sU0FBUyxPQUFPLE9BQU8sWUFBWTtJQUMzTyxVQUFDLHFCQUF1QixNQUFNLE1BQU0sT0FBTyxNQUFNLE9BQU8sTUFBTSxPQUFPO0lBRXJFLFVBQUMsd0JBQ0csUUFBb0IsRUFDcEIsbUJBQW9CLEVBQ3BCLGVBQW9CLEVBQ3BCLFFBQW9CLElBQ3BCLE9BQW9CLElBQ3BCLE1BQW9CLElBQ3BCLEtBQW9CLElBQ3BCLFNBQW9CLElBQ3BCLGdCQUFvQixJQUNwQixPQUFvQixJQUNwQixPQUFvQixLQUNwQixTQUFvQixJQUNwQixpQkFBb0IsSUFDcEIsbUJBQW9CLElBQ3BCLFNBQW9CLEtBQ3BCLFVBQW9CLElBQ3BCLElBQW9CO0lBRXhCLFVBQUMsa0JBQ0csSUFBVSxLQUNWLEtBQVUsTUFBTSxLQUNoQixJQUFVLE1BQU0sS0FDaEIsR0FBVSxNQUFNLElBQUksTUFDcEIsS0FBVSxNQUFNLEtBQ2hCLFFBQVUsS0FBSyxPQUNmLE1BQVUsS0FBSyxPQUNmLEtBQVUsT0FDVixLQUFVLE9BQ1YsS0FBVSxP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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/fileutil.kode
