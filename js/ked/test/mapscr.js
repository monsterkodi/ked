var toExport = {}
var cursors, e, h, highlights, id, ink, key, m, selections, squaresOf, wmap

import editor from "../edit/editor.js"

import harness from "../util/harness.js"

import mapscr from "../view/editor/mapscr.js"

import squares from "../util/img/squares.js"

h = e = m = null

wmap = function (lines)
{
    h = new harness({cols:40,rows:10})
    e = new editor(h.screen,'test_wrapmap',['susan'])
    e.layout(0,0,10,10)
    e.state.loadLines(lines)
    e.grabFocus()
    m = new mapscr(e)
    m.cells.layout(30,0,12,10)
    m.csz = [10,20]
    h.screen.t.pixels = [400,200]
    h.screen.t.cellsz = [10,20]
    squares.onResize(40,10,null,[10,20])
    e.state.setView([0,0])
    return m.calcView()
}

key = function (combo)
{
    return h.key(e,combo)
}

ink = function (y)
{
    var bg, data, hgt, i, out, py, s, w, x

    w = m.cells.cols * m.csz[0]
    hgt = m.imageHeight(y)
    data = Buffer.alloc(w * hgt * 3)
    m.imageForLine(data,e.state.s.lines[y],y)
    bg = m.color.bg
    out = []
    for (var _a_ = m.pixelsPerRow, py = 0; (_a_ > 0 ? py < hgt : py > hgt); py += _a_)
    {
        s = ''
        for (x = 0; x < 12; x++)
        {
            i = (py * w + x * m.pixelsPerCol) * 3
            s += ((data[i] === bg[0] && data[i + 1] === bg[1] && data[i + 2] === bg[2]) ? '.' : '#')
        }
        out.push(s.replace(/\.+$/,''))
    }
    return out
}

squaresOf = function (name, draw)
{
    var calls, place

    calls = []
    place = squares.place
    squares.place = function (sx, sy, sw, sh, fg, z, nm)
    {
        if (nm === name)
        {
            return calls.push([sx,sy,sw,sh])
        }
    }
    try
    {
        draw()
    }
    finally
    {
        squares.place = place
    }
    return calls
}

cursors = function ()
{
    return squaresOf('map.cursor',function ()
    {
        return m.drawCursors()
    })
}

selections = function ()
{
    return squaresOf('map.select',function ()
    {
        return m.drawHighlights()
    })
}

highlights = function ()
{
    return squaresOf('map.highlight',function ()
    {
        return m.drawHighlights()
    })
}
toExport["mapscr"] = async function ()
{
    await section("wrapping", async function ()
    {
        await section("chars", async function ()
        {
            wmap(['0123456789abcdefghijk','next'])
            compare(ink(0),['############'])
            key('ctrl+w')
            compare(m.imageHeight(0),12)
            compare(ink(0),['##########','##########','#'])
            compare(ink(1),['####'])
            wmap(['  aaaaaaaaaaaaa','aaa bbb ccc ddd'])
            key('alt+w')
            compare(ink(0),['..########','..#####'])
            compare(ink(1),['###.###','###.###'])
        })
        await section("cache", async function ()
        {
            wmap(['0123456789abcdefghijk','next'])
            key('ctrl+w')
            id = m.ensureImage(0)
            compare(m.ensureImage(0),id)
            e.layout(0,0,7,10)
            compare((m.ensureImage(0) !== id),true)
        })
        await section("cursors", async function ()
        {
            wmap(['0123456789abcdefghijk','next'])
            key('ctrl+w')
            e.state.setCursors([[12,0]],{adjust:false})
            compare(cursors(),[[412,4,8,4],[303,4,4,4]])
            e.state.setCursors([[30,0],[2,1]],{main:0,adjust:false})
            compare(cursors(),[[412,8,8,4],[317,8,4,4],[304,12,2,4]])
            wmap(['  aaaaaaaaaaaaa','next'])
            key('ctrl+w')
            e.state.setCursors([[10,0]],{adjust:false})
            compare(cursors(),[[412,4,8,4],[303,4,4,4]])
        })
        await section("selections", async function ()
        {
            wmap(['0123456789abcdefghijk','next'])
            key('ctrl+w')
            e.state.setCursors([[0,1]],{adjust:false})
            e.state.setSelections([[8,0,12,0]])
            compare(selections(),[[388,0,32,8]])
            e.state.setSelections([[19,0,2,1]])
            compare(selections(),[[388,4,32,8],[388,12,32,4]])
            e.state.setSelections([[0,0,4,1]])
            compare(selections(),[[388,0,32,12],[388,12,32,4]])
        })
        await section("highlights", async function ()
        {
            wmap(['0123456789abcdefghijk','next'])
            key('ctrl+w')
            e.state.setHighlights([[12,0,14,0]])
            compare(highlights(),[[404,4,16,4]])
            e.state.setHighlights([[9,0,21,0],[1,1,3,1]])
            compare(highlights(),[[404,0,16,12],[404,12,16,4]])
        })
    })
}
toExport["mapscr"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwc2NyLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi9rb2RlL2tlZC90ZXN0L21hcHNjci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7T0FBcUIsYUFBZDs7T0FDYyxjQUFkOztPQUNjLGFBQVQ7O09BQ1MsY0FBQTs7QUFFckIsSUFBSSxJQUFJLElBQUk7O0FBRVosaUJBQU87O0lBQ0gsUUFBUSxTQUFRLEtBQUssR0FBRyxLQUFLO0lBQzdCLFFBQVEsT0FBTyxFQUFFLE9BQU8sZ0JBQWdCO0lBQ3hDLEVBQUUsT0FBTyxFQUFFLEVBQUUsR0FBRztJQUNoQixFQUFFLE1BQU0sVUFBVTtJQUNsQixFQUFFO0lBQ0YsUUFBUSxPQUFPO0lBQ2YsRUFBRSxNQUFNLE9BQU8sR0FBRyxFQUFFLEdBQUc7SUFDdkIsRUFBRSxPQUFPLEdBQUc7SUFDWixFQUFFLE9BQU8sRUFBRSxVQUFVLElBQUk7SUFDekIsRUFBRSxPQUFPLEVBQUUsVUFBVSxHQUFHO0lBQ3hCLFFBQVEsU0FBUyxHQUFHLEdBQUcsTUFBTSxHQUFHO0lBQ2hDLEVBQUUsTUFBTSxTQUFTLEVBQUU7V0FDbkIsRUFBRTs7O0FBRU4sZ0JBQU07O1dBQVMsRUFBRSxJQUFJLEVBQUU7OztBQUV2QixnQkFBTTs7OztJQUNGLElBQU8sRUFBRSxNQUFNLE9BQUssRUFBRSxJQUFJO0lBQzFCLE1BQU8sRUFBRSxZQUFZO0lBQ3JCLE9BQU8sT0FBTyxNQUFNLElBQUUsTUFBSTtJQUMxQixFQUFFLGFBQWEsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUc7SUFDdkMsS0FBTSxFQUFFLE1BQU07SUFDZDttQkFDcUIsRUFBRSxjQUFuQixLQUFNLG1CQUFJLFdBQUE7O1FBQ1YsSUFBSTthQUNBLElBQUssT0FBSTs7WUFDVCxLQUFLLEtBQUcsSUFBSSxJQUFFLEVBQUUsZ0JBQWM7WUFDOUIsT0FBTSxLQUFLLE9BQU0sR0FBRyxNQUFPLEtBQUssSUFBRSxPQUFNLEdBQUcsTUFBTyxLQUFLLElBQUUsT0FBTSxHQUFHLE1BQU0sTUFBTTs7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
//# sourceURL=../../../kode/ked/test/mapscr.kode
