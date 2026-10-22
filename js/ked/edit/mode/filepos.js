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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXBvcy5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9tb2RlL2ZpbGVwb3Mua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQWVTLFdBQVQ7OzJCQUVnQjs7d0JBR0Q7YUFFWCxTQUFHOzs7Ozs7O1FBRUMsS0FBQyxPQUFPO1FBT1IsS0FBQyxXQUFXLFlBQVksSUFBSTtRQUU1QixLQUFLLEdBQUcscUJBQXVCLEtBQUM7UUFDaEMsS0FBSyxHQUFHLG9CQUF1QixLQUFDO1FBQ2hDLEtBQUssR0FBRyx1QkFBdUIsS0FBQztRQUVoQyxLQUFLLEtBQUs7Ozt1QkFRZDs7OztZQUVPLE9BQU8sWUFBWSxJQUFJOztZQUV0QixVQUFVLEtBQUMsTUFBTSxhQUFhLE9BQU8sS0FBQyxNQUFNLEVBQUU7WUFFOUMsUUFBUSxRQUFROzBCQUVQOztnQkFDTCxNQUFNLE1BQU0sS0FBSzs7OztvQkFHZCxRQUFRLFVBQVcsTUFBTSxTQUFTLEtBQU0sTUFBTSxNQUFNLFNBQU8sSUFBRSxRQUFRLFFBQVEsT0FBTTs7b0JBQ2xGLE1BQU0sTUFBTSxTQUFPLElBQUUsUUFBUSxRQUFRLEtBQUs7Ozs7d0JBRXZDLFFBQVEsVUFBVyxNQUFNLE1BQU0sU0FBTyxJQUFFLFFBQVEsUUFBUSxPQUFNOzt3QkFDN0QsUUFBUSxTQUFTOztvQkFDckIsTUFBTSxPQUFPLGdCQUFPOzsrQkFBTyxHQUFHLE9BQU07O29CQUNwQyxNQUFNLE1BQU0sS0FBSzs7O1lBRXpCLEtBQUssS0FBSyxpQkFBaUIsTUFBTSxRQUFRO21CQUN6QyxZQUFZLHNCQUFzQixPQUFPOzs7O3VCQVFqRCx5QkFBWSxNQUFLLEtBQUksS0FBSTs7OzthQUVsQjs7bUJBQ0MsS0FBSyxLQUFLLFlBQVksSUFBSSxJQUFJOzs7O2dCQUUzQixVQUFVLFlBQVksc0JBQXNCOztnQkFDM0MsS0FBQyxNQUFNLFlBQVksY0FBUTt1QkFDM0IsS0FBQyxNQUFNLFFBQVEsY0FBUTs7Ozs7dUJBUW5DOzs7O1lBRVUsUUFBUSxTQUFTLFNBQVM7Ozs7WUFFN0IsUUFBUTs7WUFDUCxRQUFRLFNBQVM7Ozs7WUFFakIsS0FBSyxRQUFRLFNBQVM7WUFDdEIsS0FBSyxRQUFRLFNBQVM7WUFDdEIsUUFBUSxTQUFTLEtBQUs7WUFDdEIsUUFBUSxTQUFTLEtBQUs7O2VBRTFCLEtBQUM7Ozt1QkFRTDs7WUFFVSxRQUFRLFNBQVMsU0FBUzs7OztZQUMxQixRQUFRLFVBQVUsUUFBUSxTQUFTLFNBQU87Ozs7UUFFaEQsUUFBUSxVQUFVO2VBRWxCLEtBQUM7Ozt1QkFFTDs7WUFFVSxRQUFRLFNBQVMsU0FBUzs7OztZQUMxQixRQUFRLFVBQVU7Ozs7UUFFeEIsUUFBUSxVQUFVO2VBRWxCLEtBQUM7Ozt1QkFRTDs7OztRQUVJLEtBQUssUUFBUSxTQUFTLFFBQVEsU0FBUyxTQUFPLFFBQVEsU0FBTztRQUU3RCxLQUFLLEtBQUssaUJBQWlCLFFBQVEsU0FBUyxRQUFRO2VBQ3BELEtBQUssS0FBSyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7OztXQTNIN0Q7OztlQTZIRiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/mode/filepos.kode
