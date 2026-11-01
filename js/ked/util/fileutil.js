var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var fileutil

import kxk from "../../kxk.js"
let post = kxk.post
let slash = kxk.slash

import nfs from "../../kxk/nfs.js"
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQVFVLFVBQUE7SUFBTTtJQUFLOztPQUNMLFVBQU47T0FBVSxhQUFWOzs7QUFFRCxZQUFUOzs7OztJQUdJLFVBQUMseUJBQXdCLE9BQU8sS0FBSyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sTUFBTSxNQUFNLE1BQU0sTUFBTTtJQUN0RixVQUFDLHVCQUF3QixTQUFTLGVBQWUsWUFBWSxtQkFBbUIsVUFBVSxRQUFRLFNBQVMsVUFBVSxXQUFXLGNBQWM7SUFDOUksVUFBQyx5QkFBc0IsU0FBUyxvQkFBb0IsT0FBTyxTQUFTLG1CQUFvQixLQUFLLEtBQUssTUFBTSxRQUFRLE9BQU8sTUFBTSxNQUFNLE9BQU8sS0FBSyxPQUFPLE9BQU8sTUFBTSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sT0FBTyxTQUFTLE9BQU8sT0FBTyxZQUFZO0lBQzNPLFVBQUMscUJBQXVCLE1BQU0sTUFBTSxPQUFPLE1BQU0sT0FBTyxNQUFNLE9BQU87SUFRckUsVUFBQyxrQkFDRyxJQUFVLEtBQ1YsS0FBVSxNQUFNLEtBQ2hCLElBQVUsTUFBTSxLQUNoQixHQUFVLE1BQU0sSUFBSSxNQUNwQixLQUFVLE1BQU0sS0FDaEIsUUFBVSxLQUFLLE9BQ2YsTUFBVSxLQUFLLE9BQ2YsS0FBVSxPQUNWLEtBQVUsT0FDVixLQUFVLE9BQ1YsS0FBVSxPQUNWLElBQVUsU0FBUyxRQUNuQixLQUFVLFNBQVMsUUFDbkIsS0FBVSxRQUNWLE1BQVUsUUFDVixNQUFVLFFBQ1YsTUFBVSxPQUNWLEtBQVUsUUFDVixNQUFVO0lBUWQsVUFBQywwQkFBYSxNQUFLLE1BQUs7Ozs7UUFFcEIsWUFBWSxLQUFLLGdCQUFnQjtZQUM5QixhQUFhOztZQUNaLE9BQU8scUJBQU8seUJBQUEsMEJBQWEsS0FBSyxXQUFLLGlCQUFlLFFBQVE7O2VBQ2hFOzs7SUFTSixVQUFDLGtDQUFlLE9BQU07Ozs7UUFFbEIsT0FBQSxjQUFBLE1BQU8sUUFBUTtRQUVmOzRCQUVZOzs7WUFBUjtZQUVBLFVBQVUsTUFBTSxTQUFTLEtBQUs7dUJBRWxCLFFBQVc7O2dCQUF2Qjs7WUFFQSxlQUFVLElBQUksV0FBVztpQkFDVDs7Z0JBQWhCOztZQUVBLGdCQUFXLElBQUksZUFBZTswQkFDWjs7Z0JBQWxCOzt1QkFFWSxRQUFXOztnQkFBdkI7O1lBRUEsTUFBTSxLQUFLOztlQUVmOzs7SUFFSixVQUFDLDBCQUFPOztxQkFFRixJQUFJLE1BQU07OztJQVFoQixVQUFDLDBCQUFPOzs7O1FBRUosYUFBYSxNQUFNLElBQUksWUFBWSxJQUFJO1FBQ3ZDLGNBQUEscUJBQUEsYUFBYyxRQUFRO1FBQ3RCLE9BQWEsTUFBTSxLQUFLLGNBQWM7Y0FFcEMsSUFBSSxNQUFNO0VBRU4sT0FBTyxNQUFLLFFBQVE7OztXQUdYOzs7O1NBSUY7O2VBSWIsS0FBSyxLQUFLLFlBQVksS0FBSyxFQUFFOzs7SUFRakMsVUFBQyw4QkFBVzs7OztRQUVSLE1BQU0sTUFBTSxLQUFLLE9BQU87UUFDeEIsWUFBTyxJQUFJLE1BQU07WUFDZCxRQUFPOzttQkFDTixLQUFLLEtBQUs7Ozs7SUFRbEIsVUFBQywyQkFBUSxTQUFROzs7O1lBRVAsWUFBVzs7OztRQUVqQixZQUFPLElBQUksS0FBSyxRQUFRO1lBQ3JCLFFBQU87O1lBQ04sZ0NBQXdCOzs7O1dBdkkzQjs7O0FBeUlULEtBQUssR0FBRyxhQUFrQixTQUFTO0FBQ25DLEtBQUssR0FBRyxhQUFrQixTQUFTO0FBQ25DLEtBQUssR0FBRyxjQUFrQixTQUFTO0FBQ25DLEtBQUssR0FBRyxrQkFBa0IsU0FBUztlQUU1QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/fileutil.kode
