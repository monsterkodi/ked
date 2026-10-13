var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        this.fileLoaded(ked_session.get("editor▸file"))
        post.on('filepos.goBackward',this.goBackward)
        post.on('filepos.goForward',this.goForward)
        post.on('filepos.swapPrevious',this.swapPrevious)
        post.emit('redraw')
    }

    filepos.prototype["cursorsSet"] = function ()
    {
        var curview, file, fposl

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
            post.emit('status.filepos',fposl,filepos.offset)
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
                this.state.setCursors([posview.slice(0, 2)])
                return this.state.setView(posview.slice(2))
            }
        }
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
        post.emit('status.filepos',filepos.fileposl,filepos.offset)
        return post.emit('file.open',fp[0],fp[1][1],fp[1][0],[fp[1][2],fp[1][3]])
    }

    return filepos
})()

export default filepos;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXBvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlL2ZpbGVwb3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzJCQWlCZ0I7O3dCQUdEOzs7Ozs7OztRQUlQLEtBQUMsT0FBTztRQU9SLEtBQUMsV0FBVyxZQUFZLElBQUk7UUFFNUIsS0FBSyxHQUFHLHFCQUF1QixLQUFDO1FBQ2hDLEtBQUssR0FBRyxvQkFBdUIsS0FBQztRQUNoQyxLQUFLLEdBQUcsdUJBQXVCLEtBQUM7UUFFaEMsS0FBSyxLQUFLOzs7Ozs7O1lBVVAsT0FBTyxZQUFZLElBQUk7O1lBRXRCLFVBQVUsS0FBQyxNQUFNLGFBQWEsT0FBTyxLQUFDLE1BQU0sRUFBRTtZQUU5QyxRQUFRLFFBQVE7MEJBRVA7O2dCQUNMLE1BQU0sTUFBTSxLQUFLOzs7O29CQUdkLFFBQVEsVUFBVyxNQUFNLFNBQVMsS0FBTSxNQUFNLE1BQU0sU0FBTyxJQUFFLFFBQVEsUUFBUSxPQUFNOztvQkFDbEYsTUFBTSxNQUFNLFNBQU8sSUFBRSxRQUFRLFFBQVEsS0FBSzs7Ozt3QkFFdkMsUUFBUSxVQUFXLE1BQU0sTUFBTSxTQUFPLElBQUUsUUFBUSxRQUFRLE9BQU07O3dCQUM3RCxRQUFRLFNBQVM7O29CQUNyQixNQUFNLE9BQU87OytCQUFjLEdBQUcsT0FBTTs7b0JBQ3BDLE1BQU0sTUFBTSxLQUFLOzs7WUFLekIsS0FBSyxLQUFLLGlCQUFpQixNQUFNLFFBQVE7bUJBQ3pDLFlBQVksc0JBQXNCLE9BQU87Ozs7Ozs7O2FBVTFDOzttQkFFQyxLQUFLLEtBQUssWUFBWSxJQUFJLElBQUk7Ozs7Z0JBRTNCLFVBQVUsWUFBWSxzQkFBc0I7O2dCQUUzQyxLQUFDLE1BQU0sWUFBWSxjQUFRO3VCQUMzQixLQUFDLE1BQU0sUUFBUSxjQUFROzs7Ozs7Ozs7WUFVekIsUUFBUSxTQUFTLFNBQVM7Ozs7WUFFN0IsUUFBUTs7WUFDUCxRQUFRLFNBQVM7Ozs7WUFFakIsS0FBSyxRQUFRLFNBQVM7WUFDdEIsS0FBSyxRQUFRLFNBQVM7WUFDdEIsUUFBUSxTQUFTLEtBQUs7WUFDdEIsUUFBUSxTQUFTLEtBQUs7O2VBRTFCLEtBQUM7Ozs7O1lBVUssUUFBUSxTQUFTLFNBQVM7Ozs7WUFDMUIsUUFBUSxVQUFVLFFBQVEsU0FBUyxTQUFPOzs7O1FBRWhELFFBQVEsVUFBVTtlQUVsQixLQUFDOzs7OztZQUlLLFFBQVEsU0FBUyxTQUFTOzs7O1lBQzFCLFFBQVEsVUFBVTs7OztRQUV4QixRQUFRLFVBQVU7ZUFFbEIsS0FBQzs7Ozs7OztRQVVELEtBQUssUUFBUSxTQUFTLFFBQVEsU0FBUyxTQUFPLFFBQVEsU0FBTztRQUU3RCxLQUFLLEtBQUssaUJBQWlCLFFBQVEsU0FBUyxRQUFRO2VBQ3BELEtBQUssS0FBSyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7Ozs7OztlQUUvRCJ9
//# sourceURL=file://kode/ked/edit/mode/filepos.kode
