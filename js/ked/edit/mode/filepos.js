var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var filepos

import kxk from "../../../kxk.js"
let post = kxk.post
let kutil = kxk.kutil
let slash = kxk.slash


filepos = (function ()
{
    filepos["autoStart"] = true
    filepos["fileposl"] = []
    filepos["offset"] = 0
    function filepos (state)
    {
        this.state = state
    
        this["goForward"] = this["goForward"].bind(this)
        this["goBackward"] = this["goBackward"].bind(this)
        this["swapPrevious"] = this["swapPrevious"].bind(this)
        this.name = 'filepos'
        this.restoring = false
        this.fileLoaded(ked_session.get("editor▸file"))
        post.on('filepos.goBackward',this.goBackward)
        post.on('filepos.goForward',this.goForward)
        post.on('filepos.swapPrevious',this.swapPrevious)
        post.emit('redraw')
    }

    filepos.prototype["cursorsSet"] = function ()
    {
        var curview, file, fposl

        if (this.restoring)
        {
            return
        }
        if (file = ked_session.get("editor▸file"))
        {
            curview = this.state.mainCursor().concat(this.state.s.view)
            fposl = filepos.fileposl
            if (_k_.empty(fposl))
            {
                fposl.push([file,curview])
            }
            else
            {
                if (filepos.offset && fposl.length > 1 && fposl[fposl.length - 1 - filepos.offset][0] === file)
                {
                    fposl[fposl.length - 1 - filepos.offset][1] = curview
                }
                else
                {
                    if (filepos.offset && fposl[fposl.length - 1 - filepos.offset][0] !== file)
                    {
                        filepos.offset = 0
                    }
                    kutil.pullIf(fposl,function (fp)
                    {
                        return fp[0] === file
                    })
                    fposl.push([file,curview])
                }
            }
            post.emit('title.filepos',fposl,filepos.offset)
            return ked_session.set(`editor▸filepos▸${file}`,curview)
        }
    }

    filepos.prototype["fileLoaded"] = function (file, row, col, view)
    {
        var posview

        if ((row != null))
        {
            return post.emit('goto.line',row,col,view)
        }
        else
        {
            if (posview = ked_session.get(`editor▸filepos▸${file}`))
            {
                this.restoring = true
                this.state.setCursors([posview.slice(0, 2)],{adjust:false})
                this.state.setView(posview.slice(2))
                return this.restoring = false
            }
        }
    }

    filepos["addFiles"] = function (files)
    {
        var current, currentEntry, entries, entry, file, fposl, view

        if (_k_.empty(files))
        {
            return
        }
        files = files.slice(0).reverse()
        entries = []
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
            view = ked_session.get(`editor▸filepos▸${file}`)
            view = (view != null ? view : [0,0,0,0])
            entries.push([file,view])
        }
        fposl = filepos.fileposl
        current = ked_session.get('editor▸file')
        if (fposl.length && current && fposl.slice(-1)[0][0] === current)
        {
            currentEntry = fposl.pop()
            var list1 = _k_.list(entries)
            for (var _b_ = 0; _b_ < list1.length; _b_++)
            {
                entry = list1[_b_]
                fposl.push(entry)
            }
            fposl.push(currentEntry)
        }
        else
        {
            var list2 = _k_.list(entries)
            for (var _c_ = 0; _c_ < list2.length; _c_++)
            {
                entry = list2[_c_]
                fposl.push(entry)
            }
        }
        return post.emit('title.filepos',fposl,filepos.offset)
    }

    filepos.prototype["swapPrevious"] = function ()
    {
        var lf, pf

        if (filepos.fileposl.length < 2)
        {
            return
        }
        if (filepos.offset)
        {
            filepos.offset = 0
        }
        else
        {
            lf = filepos.fileposl.pop()
            pf = filepos.fileposl.pop()
            filepos.fileposl.push(lf)
            filepos.fileposl.push(pf)
        }
        return this.emitOpen()
    }

    filepos.prototype["goBackward"] = function ()
    {
        if (filepos.fileposl.length < 2)
        {
            return
        }
        if (filepos.offset >= filepos.fileposl.length - 1)
        {
            return
        }
        filepos.offset += 1
        return this.emitOpen()
    }

    filepos.prototype["goForward"] = function ()
    {
        if (filepos.fileposl.length < 2)
        {
            return
        }
        if (filepos.offset <= 0)
        {
            return
        }
        filepos.offset -= 1
        return this.emitOpen()
    }

    filepos.prototype["emitOpen"] = function ()
    {
        var fp

        fp = filepos.fileposl[filepos.fileposl.length - filepos.offset - 1]
        post.emit('title.filepos',filepos.fileposl,filepos.offset)
        return post.emit('file.open',fp[0],fp[1][1],fp[1][0],[fp[1][2],fp[1][3]])
    }

    return filepos
})()

export default filepos;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXBvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlL2ZpbGVwb3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQWFhLFVBQUE7SUFBTTtJQUFLO0lBQU07OztBQUVyQixXQUFUOztJQUVJLFNBQUMsY0FBVztJQUVaLFNBQUM7SUFDRCxTQUFDLFdBQVU7YUFFWCxTQUFJOztRQUFEOzs7OztRQUVDLEtBQUMsT0FBTztRQUNSLEtBQUMsWUFBWTtRQU9iLEtBQUMsV0FBVyxZQUFZLElBQUk7UUFFNUIsS0FBSyxHQUFHLHFCQUF1QixLQUFDO1FBQ2hDLEtBQUssR0FBRyxvQkFBdUIsS0FBQztRQUNoQyxLQUFLLEdBQUcsdUJBQXVCLEtBQUM7UUFFaEMsS0FBSyxLQUFLOzs7dUJBUWQ7Ozs7WUFHVSxLQUFDOzs7O1lBRUosT0FBTyxZQUFZLElBQUk7O1lBRXRCLFVBQVUsS0FBQyxNQUFNLGFBQWEsT0FBTyxLQUFDLE1BQU0sRUFBRTtZQUU5QyxRQUFRLFFBQVE7MEJBRVA7O2dCQUNMLE1BQU0sTUFBTSxLQUFLOzs7O29CQUdkLFFBQVEsVUFBVyxNQUFNLFNBQVMsS0FBTSxNQUFNLE1BQU0sU0FBTyxJQUFFLFFBQVEsUUFBUSxPQUFNOztvQkFDbEYsTUFBTSxNQUFNLFNBQU8sSUFBRSxRQUFRLFFBQVEsS0FBSzs7Ozt3QkFFdkMsUUFBUSxVQUFXLE1BQU0sTUFBTSxTQUFPLElBQUUsUUFBUSxRQUFRLE9BQU07O3dCQUM3RCxRQUFRLFNBQVM7O29CQUNyQixNQUFNLE9BQU8sZ0JBQU87OytCQUFPLEdBQUcsT0FBTTs7b0JBQ3BDLE1BQU0sTUFBTSxLQUFLOzs7WUFFekIsS0FBSyxLQUFLLGdCQUFnQixNQUFNLFFBQVE7bUJBQ3hDLFlBQVksc0JBQXNCLE9BQU87Ozs7dUJBUWpELHlCQUFZLE1BQUssS0FBSSxLQUFJOzs7O2FBRWxCOzttQkFDQyxLQUFLLEtBQUssWUFBWSxJQUFJLElBQUk7Ozs7Z0JBRTNCLFVBQVUsWUFBWSxzQkFBc0I7O2dCQUMzQyxLQUFDLFlBQVk7Z0JBQ2IsS0FBQyxNQUFNLFlBQVksY0FBUSxRQUFPLE9BQU87Z0JBQ3pDLEtBQUMsTUFBTSxRQUFRLGNBQVE7dUJBQ3ZCLEtBQUMsWUFBWTs7Ozs7SUFHekIsU0FBQyx1QkFBVTs7OztzQkFFSzs7OztRQUVaLFFBQVEsZUFBVTtRQUVsQjs0QkFFWTs7O1lBQVI7WUFDQSxPQUFPLFlBQVksc0JBQXNCO1lBQ3pDLFFBQUEsZUFBQSxRQUFTLEVBQUUsRUFBRSxFQUFFO1lBQ2YsUUFBUSxNQUFNLEtBQUs7O1FBRXZCLFFBQVEsUUFBUTtRQUNoQixVQUFVLFlBQVksSUFBSTtZQUV2QixNQUFNLFVBQVcsV0FBWSxtQkFBVSxPQUFNOztZQUM1QyxlQUFlLE1BQU07aUNBQ1I7OztnQkFBVDtnQkFDQSxNQUFNLEtBQUs7O1lBQ2YsTUFBTSxLQUFLOzs7O2lDQUVFOzs7Z0JBQVQ7Z0JBQ0EsTUFBTSxLQUFLOzs7ZUFFbkIsS0FBSyxLQUFLLGdCQUFnQixNQUFNLFFBQVE7Ozt1QkFRNUM7Ozs7WUFFVSxRQUFRLFNBQVMsU0FBUzs7OztZQUU3QixRQUFROztZQUNQLFFBQVEsU0FBUzs7OztZQUVqQixLQUFLLFFBQVEsU0FBUztZQUN0QixLQUFLLFFBQVEsU0FBUztZQUN0QixRQUFRLFNBQVMsS0FBSztZQUN0QixRQUFRLFNBQVMsS0FBSzs7ZUFFMUIsS0FBQzs7O3VCQVFMOztZQUVVLFFBQVEsU0FBUyxTQUFTOzs7O1lBQzFCLFFBQVEsVUFBVSxRQUFRLFNBQVMsU0FBTzs7OztRQUVoRCxRQUFRLFVBQVU7ZUFFbEIsS0FBQzs7O3VCQUVMOztZQUVVLFFBQVEsU0FBUyxTQUFTOzs7O1lBQzFCLFFBQVEsVUFBVTs7OztRQUV4QixRQUFRLFVBQVU7ZUFFbEIsS0FBQzs7O3VCQVFMOzs7O1FBRUksS0FBSyxRQUFRLFNBQVMsUUFBUSxTQUFTLFNBQU8sUUFBUSxTQUFPO1FBRTdELEtBQUssS0FBSyxnQkFBZ0IsUUFBUSxTQUFTLFFBQVE7ZUFDbkQsS0FBSyxLQUFLLFlBQVksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRzs7O1dBN0o3RDs7O2VBK0pGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/filepos.kode
