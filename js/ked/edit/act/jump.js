var _k_ = {max: function () { var m = -Infinity; for (var a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {var n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

import kxk from "../../../kxk.js"
let post = kxk.post

export default {
    jumpEntry:function (pos)
    {
        pos = (pos != null ? pos : this.mainCursor())
        return {file:this.currentFile(),x:pos[0],y:pos[1]}
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
        for (var _a_ = i = 0, _b_ = n; (_a_ <= _b_ ? i < n : i > n); (_a_ <= _b_ ? ++i : --i))
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
        for (var _c_ = i = 0, _d_ = n; (_c_ <= _d_ ? i < n : i > n); (_c_ <= _d_ ? ++i : --i))
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
        var file
    
        file = this.currentFile()
        if (!_k_.empty(entry.file) && entry.file !== file)
        {
            post.emit('file.open',entry.file,entry.x,entry.y)
        }
        else
        {
            this.setMainCursor(entry.x,entry.y)
        }
        return true
    },
    jumpChangeOlder:function (count = 1)
    {
        var i, moved, n, pos
    
        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _e_ = i = 0, _f_ = n; (_e_ <= _f_ ? i < n : i > n); (_e_ <= _f_ ? ++i : --i))
        {
            pos = this.novim.changes.older()
            if (!pos)
            {
                break
            }
            this.setMainCursor(pos[0],pos[1])
            moved = true
        }
        return moved
    },
    jumpChangeNewer:function (count = 1)
    {
        var i, moved, n, pos
    
        n = _k_.max(1,((count != null ? count : 1)))
        moved = false
        for (var _10_ = i = 0, _11_ = n; (_10_ <= _11_ ? i < n : i > n); (_10_ <= _11_ ? ++i : --i))
        {
            pos = this.novim.changes.newer()
            if (!pos)
            {
                break
            }
            this.setMainCursor(pos[0],pos[1])
            moved = true
        }
        return moved
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianVtcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvZWRpdC9hY3QvanVtcC5rb2RlIl0sIm1hcHBpbmdzIjoiOztPQUFhLFVBQUE7SUFBTTs7O0lBS2Ysb0JBQVc7O1FBRVAsT0FBQSxjQUFBLE1BQU8sS0FBQztnQkFFUixLQUFNLEtBQUMsY0FDUCxFQUFNLElBQUksR0FDVixFQUFNLElBQUk7O0lBRWQsbUJBQVU7O1lBRUssS0FBQyxNQUFNLE1BQU07O21CQUF0Qjs7UUFFRixLQUFDLE1BQU0sTUFBTSxPQUFPLEtBQUMsVUFBVTtlQUUvQjs7SUFFSixvQkFBWSxRQUFNOzs7O1FBRWQsWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFDbkIsUUFBUTt1QkFFSixJQUFLLFNBQUkscUJBQUEsUUFBQTs7WUFDVCxRQUFRLEtBQUMsTUFBTSxNQUFNLE1BQU0sS0FBQztpQkFDZjs7Z0JBQWI7O1lBQ0EsS0FBQyxZQUFZO1lBQ2IsUUFBUTs7ZUFFWjs7SUFFSixvQkFBWSxRQUFNOzs7O1FBRWQsWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFDbkIsUUFBUTt1QkFFSixJQUFLLFNBQUkscUJBQUEsUUFBQTs7WUFDVCxRQUFRLEtBQUMsTUFBTSxNQUFNO2lCQUNSOztnQkFBYjs7WUFDQSxLQUFDLFlBQVk7WUFDYixRQUFROztlQUVaOztJQUVKLHNCQUFhOzs7O1FBRVQsT0FBTyxLQUFDO3VCQUVDLE1BQU0sU0FBUyxNQUFNLFNBQVE7O1lBQ2xDLEtBQUssS0FBSyxZQUFZLE1BQU0sS0FBSyxNQUFNLEVBQUUsTUFBTTs7OztZQUUvQyxLQUFDLGNBQWMsTUFBTSxFQUFFLE1BQU07O2VBRWpDOztJQUVKLDBCQUFrQixRQUFNOzs7O1FBRXBCLFlBQVEsSUFBRyxnQkFBQSxRQUFRO1FBQ25CLFFBQVE7dUJBRUosSUFBSyxTQUFJLHFCQUFBLFFBQUE7O1lBQ1QsTUFBTSxLQUFDLE1BQU0sUUFBUTtpQkFDUjs7Z0JBQWI7O1lBQ0EsS0FBQyxjQUFjLElBQUksR0FBRyxJQUFJO1lBQzFCLFFBQVE7O2VBRVo7O0lBRUosMEJBQWtCLFFBQU07Ozs7UUFFcEIsWUFBUSxJQUFHLGdCQUFBLFFBQVE7UUFDbkIsUUFBUTt3QkFFSixJQUFLLFVBQUksdUJBQUEsUUFBQTs7WUFDVCxNQUFNLEtBQUMsTUFBTSxRQUFRO2lCQUNSOztnQkFBYjs7WUFDQSxLQUFDLGNBQWMsSUFBSSxHQUFHLElBQUk7WUFDMUIsUUFBUTs7ZUFFWiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/edit/act/jump.kode
