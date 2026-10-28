var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var dumpstate

import mode from "../edit/mode.js"


dumpstate = (function ()
{
    function dumpstate ()
    {}

    dumpstate["tags"] = function (state, file)
    {
        var names, novim, tags, _19_41_, _23_54_

        tags = []
        names = (((_19_41_=mode.active[state.name]) != null ? _19_41_ : [])).map(function (m)
        {
            return m.name
        }).sort()
        if (!_k_.empty(names))
        {
            tags.push(`modes: ${names.join(' ')}`)
        }
        novim = mode.get(state,'novim')
        if (((novim != null ? novim.ex : undefined) != null))
        {
            tags.push(`pending: :${novim.ex}`)
        }
        if (state.isDirty())
        {
            tags.push('dirty')
        }
        if (!_k_.empty(file))
        {
            tags.push(`file: ${file}`)
        }
        return tags.map(function (tag)
        {
            return `[${tag}]`
        }).join(' ')
    }

    return dumpstate
})()

export default dumpstate;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcHN0YXRlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2R1bXBzdGF0ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BVWMsV0FBUDs7O0FBRUUsYUFBVDs7Ozs7SUFFSSxXQUFDLG1CQUFPLE9BQU07Ozs7UUFFVjtRQUVBLG1CQUFTLEtBQUssT0FBTyxNQUFNLGdDQUFZLGNBQUs7O21CQUFNLEVBQUU7V0FBTTt1QkFDWjs7WUFBOUMsS0FBSyxlQUFlLE1BQU0sS0FBSzs7UUFFL0IsUUFBUSxLQUFLLElBQUksTUFBTTtjQUNjLGdCQUFBLE1BQU87O1lBQTVDLEtBQUssa0JBQWtCLE1BQU07O1lBRVIsTUFBTTs7WUFBM0IsS0FBSyxLQUFLOzt1QkFDeUI7O1lBQW5DLEtBQUssY0FBYzs7ZUFFbkIsS0FBSyxjQUFLOzt1QkFBWTtXQUFRLEtBQUs7OztXQWZsQzs7O2VBaUJGIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/dumpstate.kode
