var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

import slash from "./slash.js"

import fs from "fs"

import child_process from "child_process"

import fsp from 'fs/promises'
class NFS
{
    static async listdir (dir, opt)
    {
        var absPath, dirent, dirents, file, isDir, resolved, _26_22_, _27_18_, _28_23_

        opt = (opt != null ? opt : {})
        opt.recursive = ((_26_22_=opt.recursive) != null ? _26_22_ : true)
        opt.found = ((_27_18_=opt.found) != null ? _27_18_ : [])
        opt.ignoreDirs = ((_28_23_=opt.ignoreDirs) != null ? _28_23_ : [])
        dir = await NFS.resolveSymlink(dir)
        try
        {
            dirents = await fsp.readdir(dir,{withFileTypes:true})
        }
        catch (err)
        {
            console.log(err)
            return opt.found
        }
        var list = _k_.list(dirents)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            dirent = list[_a_]
            file = dirent.name
            isDir = dirent.isDirectory()
            absPath = slash.path(dir,file)
            resolved = undefined
            if (dirent.isSymbolicLink())
            {
                resolved = await fsp.readlink(absPath)
                if (!slash.isAbsolute(resolved))
                {
                    resolved = slash.path(dir,resolved)
                }
                isDir = await this.isDir(resolved)
            }
            if (isDir)
            {
                if (_k_.in(file,['node_modules','.git']))
                {
                    continue
                }
                if (_k_.in(file,opt.ignoreDirs))
                {
                    continue
                }
                if (_k_.in(absPath,['/Users/Shared']))
                {
                    continue
                }
            }
            else
            {
                if (_k_.in(file,['.DS_Store','.localized']))
                {
                    continue
                }
            }
            opt.found.push({type:(isDir ? 'dir' : 'file'),file:file,path:absPath})
            if (resolved)
            {
                opt.found.slice(-1)[0].link = resolved
            }
            if (isDir && opt.recursive)
            {
                await NFS.listdir(absPath,opt)
            }
        }
        opt.found.sort(function (a, b)
        {
            return a.path.localeCompare(b.path)
        })
        return opt.found
    }

    static list = NFS.listdir

    static dirlist = NFS.listdir

    static async resolveSymlink (p)
    {
        var r, stat

        if (!(_k_.isStr(p)))
        {
            console.error(`nfs.resolveSymlink needs a string! ${p}`)
            return p
        }
        stat = await fsp.lstat(p)
        if (stat.isSymbolicLink())
        {
            r = await fsp.readlink(p)
            if (!slash.isAbsolute(r))
            {
                r = slash.path(slash.dir(p),r)
            }
            return r
        }
        return p
    }

    static async read (p)
    {
        try
        {
            return await fsp.readFile(p,'utf8')
        }
        catch (err)
        {
            return ''
        }
    }

    static async mode (p)
    {
        var stat

        if (_k_.empty(p))
        {
            return
        }
        try
        {
            stat = await fsp.stat(p)
        }
        catch (err)
        {
            return
        }
        return stat.mode & 0o7777
    }

    static async write (p, text)
    {
        var dir, file, mode, tmp

        file = slash.untilde(p)
        dir = slash.dir(file)
        mode = await NFS.mode(file)
        try
        {
            await fsp.mkdir(dir,{recursive:true})
            if (await fsp.access(dir,fs.constants.W_OK))
            {
                return {error:`can't access ${dir}`}
            }
            tmp = slash.tmpsib(file)
            if (await fsp.writeFile(tmp,text))
            {
                return {error:`can't write ${tmp}`}
            }
            if (!_k_.empty(mode))
            {
                await fsp.chmod(tmp,mode)
            }
            if (await fsp.rename(tmp,file))
            {
                return {error:`can't move ${tmp} to ${file}`}
            }
            return file
        }
        catch (err)
        {
            return {error:`nfs.write -- ${String(err)}`}
        }
    }

    static async info (p)
    {
        try
        {
            return await fsp.stat(p)
        }
        catch (err)
        {
            console.error("nfs.info -- " + String(err))
        }
    }

    static async mkdir (p)
    {
        try
        {
            await fsp.mkdir(p,{recursive:true})
        }
        catch (err)
        {
            if (err.code !== 'EEXIST')
            {
                return {error:`nfs.mkdir -- ${String(err)}`}
            }
        }
        return p
    }

    static async exists (p)
    {
        try
        {
            if (!(p != null))
            {
                return
            }
            p = slash.absolute(slash.removeLinePos(p),process.cwd())
            return await fsp.stat(p)
        }
        catch (err)
        {
            return null
        }
    }

    static async type (p)
    {
        var stat

        if (stat = await NFS.exists(p))
        {
            return (stat.isFile() ? 'file' : 'dir')
        }
    }

    static async fileExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isFile() : undefined))
        {
            return stat
        }
    }

    static async isFile (p)
    {
        return NFS.fileExists(p)
    }

    static async dirExists (p)
    {
        var stat

        stat = await NFS.exists(p)
        if ((stat != null ? stat.isDirectory() : undefined))
        {
            return stat
        }
    }

    static async isDir (p)
    {
        return NFS.dirExists(p)
    }

    static async remove (p)
    {
        return await fsp.rm(p,{force:true,recursive:true})
    }

    static async copy (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        return await fsp.cp(from,to,{recursive:true})
    }

    static async move (from, to)
    {
        if (await NFS.isDir(to))
        {
            to = slash.path(to,slash.file(from))
        }
        if (await NFS.exists(from))
        {
            return await fsp.rename(from,to)
        }
    }

    static async git (p)
    {
        var git

        git = slash.path(p)
        while (git.length && git !== "/")
        {
            if (await NFS.isDir(slash.path(git,'.git')))
            {
                return git
            }
            git = slash.dir(git)
        }
    }

    static async pkg (p)
    {
        var pkg

        pkg = slash.path(p)
        while (pkg.length && pkg !== "/")
        {
            if (await NFS.isFile(slash.path(pkg,'package.json')))
            {
                return pkg
            }
            pkg = slash.dir(pkg)
        }
    }

    static async prj (p)
    {
        var pth

        pth = slash.path(p)
        if (await NFS.isFile(pth))
        {
            pth = slash.dir(pth)
        }
        while (pth.length && pth !== "/")
        {
            if (await NFS.isDir(slash.path(pth,'.git')))
            {
                return pth
            }
            if (await NFS.isFile(slash.path(pth,'package.json')))
            {
                return pth
            }
            if (await NFS.isFile(slash.path(slash.dir(pth),'kakao.kode')))
            {
                return pth
            }
            pth = slash.dir(pth)
        }
        return pth
    }

    static async readText (p)
    {
        var text

        text = await NFS.read(p)
        if (text.includes('\ufffd'))
        {
            if (text.slice(0, 33).includes('\x00'))
            {
                return
            }
        }
        return text
    }

    static async hfsPath (p)
    {
        var escapedPath, hfsPath, osascript, stdout

        escapedPath = p.replace(/"/g,'\\\"')
        osascript = "tell application \\"
        Finder(" to return posix file \\")
        stdout = await this.exec(`/usr/bin/osascript -e \"${osascript}\"`)
        hfsPath = stdout.match(/^file\s(.*)/)
        return _k_.trim(hfsPath[1])
    }

    static async trash (p)
    {
        var fileName, hfs, newPath, os, shellCommand, trashPath

        os = process.platform
        if (os === 'darwin')
        {
            hfs = await NFS.hfsPath(p)
            shellCommand = `/usr/bin/osascript -l JavaScript -e \"Application('Finder').delete([\"${hfs}\"])\"`
            return this.exec(shellCommand)
        }
        else if (os === 'linux')
        {
            trashPath = slash.path(process.env.HOME,'.local/share/Trash/files')
            fileName = slash.file(p)
            try
            {
                await fsp.mkdir(trashPath,{recursive:true})
                newPath = slash.path(trashPath,fileName)
                await fsp.rename(p,newPath)
                return newPath
            }
            catch (err)
            {
                console.error(`Failed to move to trash: ${err}`)
                return null
            }
        }
        else
        {
            console.error(`Trash functionality not supported on ${os}`)
            return null
        }
    }

    static async exec (cmd)
    {
        return new Promise(function (resolve, reject)
        {
            try
            {
                return child_process.exec(cmd,{},function (err, stdout, stderr)
                {
                    if (err)
                    {
                        return reject(err,stderr)
                    }
                    else
                    {
                        return resolve(stdout)
                    }
                })
            }
            catch (err)
            {
                return reject(err)
            }
        })
    }

    static async isWritable (p)
    {
        try
        {
            await fsp.access(p,fs.constants.W_OK)
            return true
        }
        catch (err)
        {
            return false
        }
    }

    static async isReadable (p)
    {
        try
        {
            await fsp.access(p,fs.constants.R_OK)
            return true
        }
        catch (err)
        {
            return false
        }
    }
}

export default NFS;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmZzLmpzIiwic291cmNlcyI6WyIuLi8uLi9rb2RlL2t4ay9uZnMua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7T0FZTyxJQUFJLEtBQUs7Ozs7Ozs7UUFZUixPQUFBLGNBQUE7UUFDQSxJQUFJLHNCQUFKLElBQUksK0JBQWE7UUFDakIsSUFBSSxrQkFBSixJQUFJO1FBQ0osSUFBSSx1QkFBSixJQUFJO1FBRUosWUFBTyxJQUFJLGVBQWU7OztZQUt0QixnQkFBVyxJQUFJLFFBQVEsS0FBSSxjQUFjOztlQUN2Qzs7WUFDRixZQUFJO21CQUNGLElBQUk7OzRCQUVJOzs7O1lBRVYsT0FBVyxPQUFPO1lBQ2xCLFFBQVcsT0FBTztZQUNsQixVQUFXLE1BQU0sS0FBSyxJQUFJO1lBQzFCLFdBQVc7Z0JBRVIsT0FBTzs7Z0JBQ04saUJBQVksSUFBSSxTQUFTO3FCQUNsQixNQUFNLFdBQVc7O29CQUNwQixXQUFXLE1BQU0sS0FBSyxJQUFJOztnQkFFOUIsY0FBUyxLQUFDLE1BQU07O2dCQUVqQjs7MkJBQ2EsTUFBUyxlQUFlOztvQkFBcEM7OzJCQUNZLEtBQVEsSUFBSTs7b0JBQXhCOzsyQkFDWSxTQUFZOztvQkFBeEI7Ozs7OzJCQUVZLE1BQVMsWUFBWTs7b0JBQWpDOzs7WUFJSixJQUFJLE1BQU0sTUFDTixNQUFNLFFBQVEsUUFBUSxRQUN0QixLQUFNLEtBQ04sS0FBTTtnQkFFdUI7O2dCQUFqQyxJQUFJLG1CQUFVLE9BQU87O2dCQUVsQixTQUFVLElBQUk7O3NCQUVYLElBQUksUUFBUSxRQUFROzs7UUFFOUIsSUFBSSxNQUFNOzttQkFBYyxFQUFFLEtBQUssY0FBYyxFQUFFOztlQUMvQyxJQUFJOzs7a0JBRUUsSUFBSTs7cUJBQ0osSUFBSTs7Ozs7O3dCQUlIOztZQUNILG9EQUE0QzttQkFDekM7O1FBRVAsYUFBUSxJQUFJLE1BQU07WUFDZixLQUFLOztZQUNKLFVBQUssSUFBSSxTQUFTO2lCQUNYLE1BQU0sV0FBVzs7Z0JBQ3BCLElBQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxHQUFHOzttQkFDN0I7O2VBQ1A7Ozs7Ozs7eUJBV00sSUFBSSxTQUFTLEVBQUU7O2VBQ2Y7O21CQUNGOzs7Ozs7OztzQkFVTzs7Ozs7O1lBR1AsYUFBUyxJQUFJLEtBQUs7O2VBQ2hCOzs7O2VBSU4sS0FBSyxPQUFPOzs7Ozs7O1FBSVosT0FBTyxNQUFNLFFBQVE7UUFDckIsTUFBTyxNQUFNLElBQUk7UUFFakIsYUFBUyxJQUFJLEtBQUs7OztrQkFHWixJQUFJLE1BQU0sS0FBSSxVQUFVO3NCQUNyQixJQUFJLE9BQU8sSUFBSSxHQUFHLFVBQVU7O3dCQUFTLHNCQUF1Qjs7WUFFakUsTUFBTSxNQUFNLE9BQU87c0JBRWQsSUFBSSxVQUFVLElBQUk7O3dCQUFtQixxQkFBc0I7OzJCQUNsQzs7c0JBQTVCLElBQUksTUFBTSxJQUFJOztzQkFDWCxJQUFJLE9BQU8sSUFBSTs7d0JBQXNCLG9CQUFxQixVQUFVOzttQkFDekU7O2VBQ0U7O29CQUNBLHNCQUF1QixPQUFPOzs7Ozs7Ozt5QkFXM0IsSUFBSSxLQUFLOztlQUNaOztZQUNGLGNBQU0saUJBQWlCLE9BQU87Ozs7Ozs7O2tCQVc1QixJQUFJLE1BQU0sR0FBRSxVQUFVOztlQUN0Qjs7Z0JBQ0MsSUFBSSxTQUFROzt3QkFDVCxzQkFBdUIsT0FBTzs7O2VBQ3hDOzs7Ozs7O2tCQVdjOzs7O1lBQ1YsSUFBSSxNQUFNLFNBQVMsTUFBTSxjQUFjLEdBQUcsUUFBUTt5QkFDaEQsSUFBSSxLQUFLOztlQUVUOzttQkFDSDs7Ozs7Ozs7WUFVQSxhQUFRLElBQUksT0FBTzs7b0JBQ2xCLEtBQUssV0FBVyxTQUFTOzs7Ozs7OztRQVU3QixhQUFRLElBQUksT0FBTzthQUNYLGVBQUEsS0FBTTs7bUJBQWQ7Ozs7OztlQUVXLElBQUksV0FBVzs7Ozs7OztRQVUxQixhQUFRLElBQUksT0FBTzthQUNYLGVBQUEsS0FBTTs7bUJBQWQ7Ozs7OztlQUVVLElBQUksVUFBVTs7Ozs7cUJBUVgsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLFVBQVU7Ozs7O2tCQVV2QyxJQUFJLE1BQU07O1lBQ1gsS0FBSyxNQUFNLEtBQUssR0FBSSxNQUFNLEtBQUs7O3FCQUVqQyxJQUFJLEdBQUcsS0FBTSxJQUFJLFVBQVU7Ozs7O2tCQVV4QixJQUFJLE1BQU07O1lBQ1gsS0FBSyxNQUFNLEtBQUssR0FBSSxNQUFNLEtBQUs7O2tCQUU5QixJQUFJLE9BQU87O3lCQUNWLElBQUksT0FBTyxLQUFNOzs7Ozs7OztRQVV2QixNQUFNLE1BQU0sS0FBSztlQUVYLElBQUksVUFBVyxRQUFPOztzQkFFWixJQUFJLE1BQU0sTUFBTSxLQUFLLElBQUk7O3VCQUFsQzs7WUFFSCxNQUFNLE1BQU0sSUFBSTs7Ozs7Ozs7UUFVcEIsTUFBTSxNQUFNLEtBQUs7ZUFFWCxJQUFJLFVBQVcsUUFBTzs7c0JBRVosSUFBSSxPQUFPLE1BQU0sS0FBSyxJQUFJOzt1QkFBbkM7O1lBRUgsTUFBTSxNQUFNLElBQUk7Ozs7Ozs7O1FBVXBCLE1BQU0sTUFBTSxLQUFLO2tCQUVaLElBQUksT0FBTzs7WUFDWixNQUFNLE1BQU0sSUFBSTs7ZUFFZCxJQUFJLFVBQVcsUUFBTzs7c0JBRVosSUFBSSxNQUFNLE1BQU0sS0FBSyxJQUFJOzt1QkFBbEM7O3NCQUNTLElBQUksT0FBTyxNQUFNLEtBQUssSUFBSTs7dUJBQW5DOztzQkFDUyxJQUFJLE9BQU8sTUFBTSxLQUFLLE1BQU0sSUFBSSxLQUFLOzt1QkFBOUM7O1lBRUgsTUFBTSxNQUFNLElBQUk7O2VBRXBCOzs7Ozs7O1FBVUEsYUFBUSxJQUFJLEtBQUs7WUFDZCxLQUFLLFNBQVM7O2dCQUNWLFdBQUssT0FBTyxTQUFTOzs7OztlQUU1Qjs7Ozs7OztRQVVBLGNBQWMsRUFBRSxRQUFRLEtBQUs7UUFDN0IsWUFBWTtRQUFxQixPQUFRO1FBQ3pDLGVBQVUsS0FBQyxnQ0FBZ0M7UUFDM0MsVUFBVSxPQUFPLE1BQU07d0JBQ2xCLFFBQVE7Ozs7Ozs7UUFJYixLQUFLLFFBQVE7WUFFVixPQUFNOztZQUVMLFlBQU8sSUFBSSxRQUFRO1lBQ25CLHdGQUF3RjttQkFDeEYsS0FBQyxLQUFLOztpQkFFRixPQUFNOztZQUVWLFlBQVksTUFBTSxLQUFLLFFBQVEsSUFBSSxLQUFLO1lBQ3hDLFdBQVcsTUFBTSxLQUFLOzs7c0JBR2hCLElBQUksTUFBTSxXQUFVLFVBQVU7Z0JBRWhDLFVBQVUsTUFBTSxLQUFLLFVBQVU7c0JBQzdCLElBQUksT0FBTyxFQUFFO3VCQUNiOzttQkFDQTs7Z0JBQ0YsMENBQWtDO3VCQUNoQzs7Ozs7WUFFTixzREFBOEM7bUJBQzVDOzs7Ozs7bUJBSUY7Ozs7dUJBRUksY0FBYyxLQUFLOzt3QkFDWjs7K0JBQ0MsT0FBTyxJQUFJOzs7OytCQUVYLFFBQVE7Ozs7bUJBQ2Q7O3VCQUNGLE9BQU87Ozs7Ozs7OztrQkFXVCxJQUFJLE9BQU8sRUFBRSxHQUFHLFVBQVU7bUJBQzFCOztlQUNBOzttQkFDQTs7Ozs7Ozs7a0JBS0EsSUFBSSxPQUFPLEVBQUUsR0FBRyxVQUFVO21CQUMxQjs7ZUFDQTs7bUJBQ0E7Ozs7O2VBR1AifQ==
//# sourceURL=file:///home/kodi/s/ked/kode/kxk/nfs.kode
