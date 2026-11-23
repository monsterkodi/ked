var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var dumpstate

import mode from "../edit/mode.js"


dumpstate = (function ()
{
    function dumpstate ()
    {}

    dumpstate["tags"] = function (state, file)
    {
        var names, novim, tags, _12_54_, _8_41_

        tags = []
        names = (((_8_41_=mode.active[state.name]) != null ? _8_41_ : [])).map(function (m)
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

    dumpstate["ROWS"] = 6
    dumpstate["section"] = function (label, state, cells, file, images)
    {
        var cursors, out, places, ranges, rect, tags

        out = [`=== ${label}`]
        tags = this.tags(state,file)
        if (!_k_.empty(tags))
        {
            out.push(`    ${tags}`)
        }
        cursors = state.s.cursors.map(function (c)
        {
            return `${c[0]}:${c[1]}`
        })
        if (cursors.length === 1)
        {
            out.push(`    cursor ${cursors[0]}`)
        }
        else
        {
            out.push(`    cursors ${cursors.join(' ')} main ${state.s.main}`)
        }
        if (!_k_.empty(state.s.selections))
        {
            ranges = state.s.selections.map(function (r)
            {
                return `${r[0]}:${r[1]}-${r[2]}:${r[3]}`
            })
            out.push(`    select ${ranges.join(' ')}`)
        }
        if (rect = (cells != null ? cells.cellRect : undefined))
        {
            out.push(`    rect ${rect.x}:${rect.y} ${rect.w}x${rect.h}`)
        }
        if (!_k_.empty(images))
        {
            places = images.map(function (img)
            {
                return `${img.x}:${img.y}`
            })
            out.push(`    images ${places.join(' ')}`)
        }
        return out
    }

    return dumpstate
})()

export default dumpstate;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVtcHN0YXRlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC91dGlsL2R1bXBzdGF0ZS5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7O09BQ2MsV0FBUDs7O0FBQ04sYUFBRDs7Ozs7SUFDSSxXQUFDLG1CQUFPLE9BQU07Ozs7UUFFVjtRQUVBLGtCQUFTLEtBQUssT0FBTyxNQUFNLCtCQUFZLGNBQUs7O21CQUFNLEVBQUU7V0FBTTt1QkFDWjs7WUFBOUMsS0FBSyxlQUFlLE1BQU0sS0FBSzs7UUFFL0IsUUFBUSxLQUFLLElBQUksTUFBTTtjQUNjLGdCQUFBLE1BQU87O1lBQTVDLEtBQUssa0JBQWtCLE1BQU07O1lBRVIsTUFBTTs7WUFBM0IsS0FBSyxLQUFLOzt1QkFDeUI7O1lBQW5DLEtBQUssY0FBYzs7ZUFFbkIsS0FBSyxjQUFLOzt1QkFBWTtXQUFRLEtBQUs7OztJQUV2QyxXQUFDLFNBQU07SUFFUCxXQUFDLHNCQUFVLE9BQU0sT0FBTSxPQUFNLE1BQUs7Ozs7UUFFOUIsY0FBZTtRQUNmLE9BQU8sS0FBQyxLQUFLLE1BQU07dUJBRWE7O1lBQWhDLElBQUksWUFBWTs7UUFFaEIsVUFBVSxNQUFNLEVBQUUsUUFBUSxjQUFLOztzQkFBUyxFQUFFLE1BQU0sRUFBRTs7WUFFL0MsUUFBUSxXQUFVOztZQUNqQixJQUFJLG1CQUFtQixRQUFROzs7O1lBRS9CLElBQUksb0JBQW9CLFFBQVEsS0FBSyxhQUFZLE1BQU0sRUFBRTs7dUJBRXBELE1BQU0sRUFBRTs7WUFDYixTQUFTLE1BQU0sRUFBRSxXQUFXLGNBQUs7OzBCQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7O1lBQ3BFLElBQUksbUJBQW1CLE9BQU8sS0FBSzs7WUFFcEMsUUFBTyxnQkFBQSxNQUFPOztZQUNiLElBQUksaUJBQWlCLEtBQUssS0FBSyxLQUFLLEtBQUssS0FBSyxLQUFLLEtBQUs7O3VCQUVuRDs7WUFDTCxTQUFTLE9BQU8sY0FBSzs7MEJBQVcsSUFBSSxLQUFLLElBQUk7O1lBQzdDLElBQUksbUJBQW1CLE9BQU8sS0FBSzs7ZUFFdkM7OztXQTNDUDs7O2VBNkNNIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/util/dumpstate.kode
