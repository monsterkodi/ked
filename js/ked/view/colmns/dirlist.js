var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var dirlist

import kxk from "../../../kxk.js"
let kstr = kxk.kstr
let slash = kxk.slash
let nfs = kxk.nfs

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlybGlzdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4va29kZS9rZWQvdmlldy9jb2xtbnMvZGlybGlzdC5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2EsVUFBQTtJQUFNO0lBQUs7SUFBTTs7T0FDWCxZQUFUOztPQUNTLGNBQUE7OztBQUVsQixXQUFEOzs7OztJQUVJLFNBQUMsMEJBQU87Ozs7UUFFSixjQUFTLElBQUksS0FBSyxLQUFJLFVBQVU7NEJBRXBCOzs7WUFBUjtZQUNBLEtBQUssUUFBUSxRQUFRLFdBQVc7O1FBRXBDLE1BQU0sZUFBTSxHQUFFOzttQkFBTSxRQUFRLE9BQU8sS0FBSyxRQUFRLE9BQU87O1FBRXZELFNBQVMsTUFBTSxJQUFJO1FBRW5CLE1BQU0sU0FDRixLQUFNLE1BQ04sS0FBTSxNQUFNLEtBQUssUUFDakIsS0FBTSxPQUNOLE9BQU8sVUFBVSxNQUFNLE1BQU0sY0FBYztlQUUvQzs7O0lBRUosU0FBQyxxQkFBUTs7OztRQUVMLElBQUksTUFBTSxNQUFNLEtBQUs7UUFFckIsSUFBSTtZQUNVLEtBQUssU0FBUTs7WUFBM0IsS0FBSzs7WUFDUyxLQUFLLE1BQU0sV0FBVyxNQUFNLE1BQU07O1lBQWhELEtBQUs7O21CQUNTLE1BQU0sSUFBSSxLQUFLLFFBQVcsS0FBSzs7WUFBN0MsS0FBSzs7UUFDTCxLQUFLLEtBQUssT0FBTyxFQUFFO2VBQ25COzs7V0E5QlA7OztlQWdDTSJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/view/colmns/dirlist.kode
