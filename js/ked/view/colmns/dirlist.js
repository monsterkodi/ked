var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var dirlist

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash

import nfs from "../../../kxk/nfs.js"

import icons from "../../theme/icons.js"

import diritem from "./diritem.js"


dirlist = (function ()
{
    function dirlist ()
    {}

    dirlist["items"] = async function (dir)
    {
        var item, items, parent

        items = await nfs.list(dir,{recursive:false})
        var list = _k_.list(items)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            item = list[_a_]
            item.tilde = diritem.symbolName(item)
        }
        items.sort(function (a, b)
        {
            return dirlist.weight(a) - dirlist.weight(b)
        })
        parent = slash.dir(dir)
        items.unshift({type:'dir',file:slash.name(parent),path:parent,tilde:(parent ? (icons.dir + '\u00A0..') : '')})
        return items
    }

    dirlist["weight"] = function (item)
    {
        var p, w

        p = slash.parse(item.path)
        w = 0
        if (item.type === 'file')
        {
            w += 10000
        }
        if (item.tilde.startsWith(icons.dir + ' .'))
        {
            w += 1000
        }
        if (_k_.in(slash.ext(item.tilde),['js','json']))
        {
            w += 1
        }
        w += kstr.weight(p.file)
        return w
    }

    return dirlist
})()

export default dirlist;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlybGlzdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlybGlzdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFlUyxXQUFUOzs7OzthQU9JLDBCQUFROzs7O1FBRUosY0FBUyxJQUFJLEtBQUssS0FBSSxVQUFVOzRCQUVwQjs7O1lBQVI7WUFDQSxLQUFLLFFBQVEsUUFBUSxXQUFXOztRQUVwQyxNQUFNLGVBQU0sR0FBRTs7bUJBQU0sUUFBUSxPQUFPLEtBQUssUUFBUSxPQUFPOztRQUV2RCxTQUFTLE1BQU0sSUFBSTtRQUVuQixNQUFNLFNBQ0YsS0FBTSxNQUNOLEtBQU0sTUFBTSxLQUFLLFFBQ2pCLEtBQU0sT0FDTixPQUFPLFVBQVUsTUFBTSxNQUFNLGNBQWM7ZUFFL0M7OzthQUtKLHFCQUFTOzs7O1FBRUwsSUFBSSxNQUFNLE1BQU0sS0FBSztRQUVyQixJQUFJO1lBQ1UsS0FBSyxTQUFROztZQUEzQixLQUFLOztZQUNTLEtBQUssTUFBTSxXQUFXLE1BQU0sTUFBTTs7WUFBaEQsS0FBSzs7bUJBQ1MsTUFBTSxJQUFJLEtBQUssUUFBVyxLQUFLOztZQUE3QyxLQUFLOztRQUNMLEtBQUssS0FBSyxPQUFPLEVBQUU7ZUFDbkI7OztXQXRDQzs7O2VBd0NGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirlist.kode
