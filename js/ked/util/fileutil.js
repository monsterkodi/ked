var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var fileutil

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash
let nfs = kxk.nfs

import salter from "../../kxk/salter.js"


fileutil = (function ()
{
    function fileutil ()
    {}

    fileutil["indexFileExtensions"] = ['kode','mm','zig','cc','c','h','hpp','cpp','nim','kim','lua','kua']
    fileutil["dotFileExtensions"] = ['bashrc','bash_history','gitconfig','gitignore_global','lesshst','npmrc','nvimrc','profile','zprofile','zsh_history','zshrc']
    fileutil["sourceFileExtensions"] = fileutil.indexFileExtensions.concat(fileutil.dotFileExtensions,['ts','js','mjs','swift','styl','css','pug','html','md','noon','json','txt','log','sh','fish','py','frag','vert','config','toml','conf','gitignore','plist'])
    fileutil["imageExtensions"] = ['png','jpg','jpeg','gif','tiff','pxm','icns','webp']
    fileutil["counterparts"] = {mm:['h'],cpp:['hpp','h'],cc:['hpp','h'],h:['cpp','c','mm'],hpp:['cpp','c'],coffee:['js','mjs'],kode:['js','mjs'],kim:['nim'],nim:['kim'],kua:['lua'],lua:['kua'],js:['coffee','kode'],mjs:['coffee','kode'],pug:['html'],noon:['json'],json:['noon'],html:['pug'],css:['styl'],styl:['css']}
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

    return fileutil
})()

post.on('file.trash',fileutil.trash)
post.on('file.class',fileutil.class)
post.on('file.rename',fileutil.rename)
post.on('file.new_folder',fileutil.newFolder)
export default fileutil;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFVLFVBQUE7SUFBTTtJQUFLO0lBQU07O09BQ1gsYUFBTjs7O0FBRUQsWUFBVDs7Ozs7SUFHSSxVQUFDLHlCQUF3QixPQUFPLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLE1BQU0sTUFBTSxNQUFNLE1BQU07SUFDdEYsVUFBQyx1QkFBd0IsU0FBUyxlQUFlLFlBQVksbUJBQW1CLFVBQVUsUUFBUSxTQUFTLFVBQVUsV0FBVyxjQUFjO0lBQzlJLFVBQUMseUJBQXNCLFNBQVMsb0JBQW9CLE9BQU8sU0FBUyxtQkFBb0IsS0FBSyxLQUFLLE1BQU0sUUFBUSxPQUFPLE1BQU0sTUFBTSxPQUFPLEtBQUssT0FBTyxPQUFPLE1BQU0sTUFBTSxLQUFLLE9BQU8sS0FBSyxPQUFPLE9BQU8sU0FBUyxPQUFPLE9BQU8sWUFBWTtJQUMzTyxVQUFDLHFCQUF1QixNQUFNLE1BQU0sT0FBTyxNQUFNLE9BQU8sTUFBTSxPQUFPO0lBUXJFLFVBQUMsa0JBQ0csSUFBVSxLQUNWLEtBQVUsTUFBTSxLQUNoQixJQUFVLE1BQU0sS0FDaEIsR0FBVSxNQUFNLElBQUksTUFDcEIsS0FBVSxNQUFNLEtBQ2hCLFFBQVUsS0FBSyxPQUNmLE1BQVUsS0FBSyxPQUNmLEtBQVUsT0FDVixLQUFVLE9BQ1YsS0FBVSxPQUNWLEtBQVUsT0FDVixJQUFVLFNBQVMsUUFDbkIsS0FBVSxTQUFTLFFBQ25CLEtBQVUsUUFDVixNQUFVLFFBQ1YsTUFBVSxRQUNWLE1BQVUsT0FDVixLQUFVLFFBQ1YsTUFBVTtJQVFkLFVBQUMsMEJBQWEsTUFBSyxNQUFLOzs7O1FBRXBCLFlBQVksS0FBSyxnQkFBZ0I7WUFDOUIsYUFBYTs7WUFDWixPQUFPLHFCQUFPLHlCQUFBLDBCQUFhLEtBQUssV0FBSyxpQkFBZSxRQUFROztlQUNoRTs7O0lBU0osVUFBQyxrQ0FBZSxPQUFNOzs7O1FBRWxCLE9BQUEsY0FBQSxNQUFPLFFBQVE7UUFFZjs0QkFFWTs7O1lBQVI7WUFFQSxVQUFVLE1BQU0sU0FBUyxLQUFLO3VCQUVsQixRQUFXOztnQkFBdkI7O1lBRUEsZUFBVSxJQUFJLFdBQVc7aUJBQ1Q7O2dCQUFoQjs7WUFFQSxnQkFBVyxJQUFJLGVBQWU7MEJBQ1o7O2dCQUFsQjs7dUJBRVksUUFBVzs7Z0JBQXZCOztZQUVBLE1BQU0sS0FBSzs7ZUFFZjs7O0lBRUosVUFBQywwQkFBTzs7cUJBRUYsSUFBSSxNQUFNOzs7SUFRaEIsVUFBQywwQkFBTzs7OztRQUVKLGFBQWEsTUFBTSxJQUFJLFlBQVksSUFBSTtRQUN2QyxjQUFBLHFCQUFBLGFBQWMsUUFBUTtRQUN0QixPQUFhLE1BQU0sS0FBSyxjQUFjO2NBRXBDLElBQUksTUFBTTtFQUVOLE9BQU8sTUFBSyxRQUFROzs7V0FHWDs7OztTQUlGOztlQUliLEtBQUssS0FBSyxZQUFZLEtBQUssRUFBRTs7O0lBUWpDLFVBQUMsOEJBQVc7Ozs7UUFFUixNQUFNLE1BQU0sS0FBSyxPQUFPO1FBQ3hCLFlBQU8sSUFBSSxNQUFNO1lBQ2QsUUFBTzs7bUJBQ04sS0FBSyxLQUFLOzs7O0lBUWxCLFVBQUMsMkJBQVEsU0FBUTs7OztZQUVQLFlBQVc7Ozs7UUFFakIsWUFBTyxJQUFJLEtBQUssUUFBUTtZQUNyQixRQUFPOztZQUNOLGdDQUF3Qjs7OztXQXZJM0I7OztBQXlJVCxLQUFLLEdBQUcsYUFBa0IsU0FBUztBQUNuQyxLQUFLLEdBQUcsYUFBa0IsU0FBUztBQUNuQyxLQUFLLEdBQUcsY0FBa0IsU0FBUztBQUNuQyxLQUFLLEdBQUcsa0JBQWtCLFNBQVM7ZUFFNUIifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/fileutil.kode
