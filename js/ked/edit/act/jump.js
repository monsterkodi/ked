var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let post = kxk.post

export default {
    jumpEntry:function (pos)
    {
        var entry, _14_30_, _18_40_
    
        pos = (pos != null ? pos : this.mainCursor())
        entry = {file:(((_14_30_=this.sheetPage) != null ? _14_30_ : this)).currentFile(),x:pos[0],y:pos[1]}
        if ((this.sheetPage != null))
        {
            entry.node = this.name
        }
        return entry
    },
    pushJump:function (pos)
    {
        if (this.novim.jumps.keep)
        {
            return false
        }
        this.novim.jumps.record(this.jumpEntry(pos))
        return true
    },
    jumpOlder:function (count = 1)
    {
        var entry, i, moved, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        this.pruneJumps()
        for (i = 0; i < n; i++)
        {
            entry = this.novim.jumps.older(this.jumpEntry())
            if (!entry)
            {
                break
            }
            this.jumpToEntry(entry)
            moved = true
        }
        return moved
    },
    jumpNewer:function (count = 1)
    {
        var entry, i, moved, n
    
        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        this.pruneJumps()
        for (i = 0; i < n; i++)
        {
            entry = this.novim.jumps.newer()
            if (!entry)
            {
                break
            }
            this.jumpToEntry(entry)
            moved = true
        }
        return moved
    },
    jumpToEntry:function (entry)
    {
        var page, _62_26_
    
        page = ((_62_26_=this.sheetPage) != null ? _62_26_ : this)
        if (!_k_.empty(entry.file) && entry.file !== page.currentFile())
        {
            post.emit('file.open',entry.file,entry.x,entry.y)
        }
        else
        {
            this.jumpTo(entry.x,entry.y,entry.node)
        }
        return true
    },
    jumpChangeOlder:function (count = 1)
    {
        var i, moved, n, pos
    
        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        this.pruneJumps()
        for (i = 0; i < n; i++)
        {
            pos = this.novim.changes.older()
            if (!pos)
            {
                break
            }
            this.jumpTo(pos[0],pos[1],pos[2])
            moved = true
        }
        return moved
    },
    jumpChangeNewer:function (count = 1)
    {
        var i, moved, n, pos
    
        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        this.pruneJumps()
        for (i = 0; i < n; i++)
        {
            pos = this.novim.changes.newer()
            if (!pos)
            {
                break
            }
            this.jumpTo(pos[0],pos[1],pos[2])
            moved = true
        }
        return moved
    },
    jumpTo:function (x, y, node)
    {
        var page, _105_26_, _107_23_
    
        page = ((_105_26_=this.sheetPage) != null ? _105_26_ : this)
        if ((page.rectree != null))
        {
            return page.sheetJump(x,y,node)
        }
        else
        {
            return this.setMainCursor(x,y)
        }
    },
    pruneJumps:function ()
    {
        var page, _114_26_, _116_46_
    
        page = ((_114_26_=this.sheetPage) != null ? _114_26_ : this)
        if ((page.rectree != null))
        {
            return page.pruneSheetJumps()
        }
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVtcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3QvanVtcC5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUFhLFVBQUE7SUFBTTs7O0lBUWYsb0JBQVc7Ozs7UUFFUCxPQUFBLGNBQUEsTUFBTyxLQUFDO1FBRVIsU0FDSSxnQkFBTyxLQUFDLCtCQUFZLE9BQUcsY0FDdkIsRUFBTSxJQUFJLEdBQ1YsRUFBTSxJQUFJO2FBRVEsS0FBQzs7WUFBdkIsTUFBTSxPQUFPLEtBQUM7O2VBRWQ7O0lBRUosbUJBQVU7O1lBRUssS0FBQyxNQUFNLE1BQU07O21CQUF0Qjs7UUFFRixLQUFDLE1BQU0sTUFBTSxPQUFPLEtBQUMsVUFBVTtlQUUvQjs7SUFFSixvQkFBWSxRQUFNOzs7O1FBRWQsWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFDbkIsUUFBUTtRQUVSLEtBQUM7YUFFRyxJQUFLLE9BQUk7O1lBQ1QsUUFBUSxLQUFDLE1BQU0sTUFBTSxNQUFNLEtBQUM7aUJBQ2Y7O2dCQUFiOztZQUNBLEtBQUMsWUFBWTtZQUNiLFFBQVE7O2VBRVo7O0lBRUosb0JBQVksUUFBTTs7OztRQUVkLFlBQVEsSUFBRyxnQkFBQSxRQUFRO1FBQ25CLFFBQVE7UUFFUixLQUFDO2FBRUcsSUFBSyxPQUFJOztZQUNULFFBQVEsS0FBQyxNQUFNLE1BQU07aUJBQ1I7O2dCQUFiOztZQUNBLEtBQUMsWUFBWTtZQUNiLFFBQVE7O2VBRVo7O0lBRUosc0JBQWE7Ozs7UUFFVCxpQkFBTyxLQUFDLCtCQUFZO3VCQUVYLE1BQU0sU0FBUyxNQUFNLFNBQVEsS0FBSzs7WUFDdkMsS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFLLE1BQU0sRUFBRSxNQUFNOzs7O1lBRS9DLEtBQUMsT0FBTyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU07O2VBRWxDOztJQUVKLDBCQUFrQixRQUFNOzs7O1FBRXBCLFlBQVEsSUFBRyxnQkFBQSxRQUFRO1FBQ25CLFFBQVE7UUFFUixLQUFDO2FBRUcsSUFBSyxPQUFJOztZQUNULE1BQU0sS0FBQyxNQUFNLFFBQVE7aUJBQ1I7O2dCQUFiOztZQUNBLEtBQUMsT0FBTyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUk7WUFDMUIsUUFBUTs7ZUFFWjs7SUFFSiwwQkFBa0IsUUFBTTs7OztRQUVwQixZQUFRLElBQUcsZ0JBQUEsUUFBUTtRQUNuQixRQUFRO1FBRVIsS0FBQzthQUVHLElBQUssT0FBSTs7WUFDVCxNQUFNLEtBQUMsTUFBTSxRQUFRO2lCQUNSOztnQkFBYjs7WUFDQSxLQUFDLE9BQU8sSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJO1lBQzFCLFFBQVE7O2VBRVo7O0lBSUosaUJBQVMsR0FBRSxHQUFFOzs7O1FBRVQsa0JBQU8sS0FBQyxnQ0FBWTthQUVqQixLQUFLOzttQkFDSixLQUFLLFVBQVUsRUFBRSxFQUFFOzs7O21CQUVuQixLQUFDLGNBQWMsRUFBRTs7O0lBRXpCOzs7O1FBRUksa0JBQU8sS0FBQyxnQ0FBWTthQUVNLEtBQUs7O21CQUEvQixLQUFLIn0=
//# sourceURL=../../../../kode/ked/edit/act/jump.kode
