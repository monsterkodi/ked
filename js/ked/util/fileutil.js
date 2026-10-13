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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXV0aWwuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3V0aWwvZmlsZXV0aWwua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O3VDQWM2QixPQUFPLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxNQUFNLE1BQU0sTUFBTSxNQUFNLE1BQU07cUNBQzdELFNBQVMsZUFBZSxZQUFZLG1CQUFtQixVQUFVLFFBQVEsU0FBUyxVQUFVLFdBQVcsY0FBYzt1Q0FDdkgsU0FBUyxvQkFBb0IsT0FBTyxTQUFTLG1CQUFvQixLQUFLLEtBQUssTUFBTSxRQUFRLE9BQU8sTUFBTSxNQUFNLE9BQU8sS0FBSyxPQUFPLE9BQU8sTUFBTSxNQUFNLEtBQUssT0FBTyxLQUFLLE9BQU8sT0FBTyxTQUFTLE9BQU8sT0FBTyxZQUFZO21DQUNuTixNQUFNLE1BQU0sT0FBTyxNQUFNLE9BQU8sTUFBTSxPQUFPO2dDQVNqRSxJQUFVLEtBQ1YsS0FBVSxNQUFNLEtBQ2hCLElBQVUsTUFBTSxLQUNoQixHQUFVLE1BQU0sSUFBSSxNQUNwQixLQUFVLE1BQU0sS0FDaEIsUUFBVSxLQUFLLE9BQ2YsTUFBVSxLQUFLLE9BQ2YsS0FBVSxPQUNWLEtBQVUsT0FDVixLQUFVLE9BQ1YsS0FBVSxPQUNWLElBQVUsU0FBUyxRQUNuQixLQUFVLFNBQVMsUUFDbkIsS0FBVSxRQUNWLE1BQVUsUUFDVixNQUFVLFFBQ1YsTUFBVSxPQUNWLEtBQVUsUUFDVixNQUFVOzs7OztRQVVWLFlBQVksS0FBSyxnQkFBZ0I7WUFDOUIsYUFBYTs7WUFDWixPQUFPLHFCQUFPLHlCQUFBLDBCQUFhLEtBQUssV0FBSyxpQkFBZSxRQUFROztlQUNoRTs7Ozs7cUJBVUUsSUFBSSxNQUFNOzs7Ozs7O1FBVVosYUFBYSxNQUFNLElBQUksWUFBWSxJQUFJO1FBQ3ZDLGNBQUEscUJBQUEsYUFBYyxRQUFRO1FBQ3RCLE9BQWEsTUFBTSxLQUFLLGNBQWM7Y0FFcEMsSUFBSSxNQUFNO0VBRU4sT0FBTyxNQUFLLFFBQVE7OztXQUdYOzs7O1NBSUY7O2VBSWIsS0FBSyxLQUFLLFlBQVksS0FBSyxFQUFFOzs7Ozs7O1FBVTdCLE1BQU0sTUFBTSxLQUFLLE9BQU87UUFDeEIsWUFBTyxJQUFJLE1BQU07WUFDZCxRQUFPOzttQkFDTixLQUFLLEtBQUs7Ozs7Ozs7O1lBVVIsWUFBVzs7OztRQUVqQixZQUFPLElBQUksS0FBSyxRQUFRO1lBQ3JCLFFBQU87O1lBQ04sZ0NBQXdCOzs7Ozs7O0FBRXBDLEtBQUssR0FBRyxhQUFrQixTQUFTO0FBQ25DLEtBQUssR0FBRyxhQUFrQixTQUFTO0FBQ25DLEtBQUssR0FBRyxjQUFrQixTQUFTO0FBQ25DLEtBQUssR0FBRyxrQkFBa0IsU0FBUztlQUU1QiJ9
//# sourceURL=kode/ked/util/fileutil.kode
