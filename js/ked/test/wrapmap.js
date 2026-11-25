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
toExport["wrapmap"] = async function ()
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
}
toExport["wrapmap"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JhcG1hcC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC93cmFwbWFwLmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQUFxQixhQUFkOztPQUNjLGNBQWQ7O09BQ2MsYUFBVDs7T0FDUyxjQUFBOztBQUVyQixJQUFJLElBQUksSUFBSTs7QUFFWixpQkFBTzs7SUFDSCxRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTyxnQkFBZ0I7SUFDeEMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ2hCLEVBQUUsTUFBTSxVQUFVO0lBQ2xCLEVBQUU7SUFDRixRQUFRLE9BQU87SUFDZixFQUFFLE1BQU0sT0FBTyxHQUFHLEVBQUUsR0FBRztJQUN2QixFQUFFLE9BQU8sR0FBRztJQUNaLEVBQUUsT0FBTyxFQUFFLFVBQVUsSUFBSTtJQUN6QixFQUFFLE9BQU8sRUFBRSxVQUFVLEdBQUc7SUFDeEIsUUFBUSxTQUFTLEdBQUcsR0FBRyxNQUFNLEdBQUc7SUFDaEMsRUFBRSxNQUFNLFNBQVMsRUFBRTtXQUNuQixFQUFFOzs7QUFFTixnQkFBTTs7V0FBUyxFQUFFLElBQUksRUFBRTs7O0FBRXZCLGdCQUFNOzs7O0lBQ0YsSUFBTyxFQUFFLE1BQU0sT0FBSyxFQUFFLElBQUk7SUFDMUIsTUFBTyxFQUFFLFlBQVk7SUFDckIsT0FBTyxPQUFPLE1BQU0sSUFBRSxNQUFJO0lBQzFCLEVBQUUsYUFBYSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sR0FBRztJQUN2QyxLQUFNLEVBQUUsTUFBTTtJQUNkO21CQUNxQixFQUFFLGNBQW5CLEtBQU0sbUJBQUksV0FBQTs7UUFDVixJQUFJO2FBQ0EsSUFBSyxPQUFJOztZQUNULEtBQUssS0FBRyxJQUFJLElBQUUsRUFBRSxnQkFBYztZQUM5QixPQUFNLEtBQUssT0FBTSxHQUFHLE1BQU8sS0FBSyxJQUFFLE9BQU0sR0FBRyxNQUFPLEtBQUssSUFBRSxPQUFNLEdBQUcsTUFBTSxNQUFNOztRQUNsRixJQUFJLEtBQUssRUFBRSxRQUFRLE9BQU87O1dBQzlCOzs7QUFFSixzQkFBWSxNQUFLOzs7O0lBQ2I7SUFDQSxRQUFRLFFBQVE7SUFDaEIsUUFBUSxrQkFBUyxJQUFHLElBQUcsSUFBRyxJQUFHLElBQUcsR0FBRTs7WUFBbUMsT0FBTTs7bUJBQWxDLE1BQU0sTUFBTSxHQUFHLEdBQUcsR0FBRzs7Ozs7UUFFMUQ7Ozs7UUFFQSxRQUFRLFFBQVE7O1dBQ3BCOzs7QUFFSjs7V0FBZ0IsVUFBVTs7ZUFBbUIsRUFBRTs7OztBQUMvQzs7V0FBZ0IsVUFBVTs7ZUFBbUIsRUFBRTs7OztBQUMvQzs7V0FBZ0IsVUFBVTs7ZUFBbUIsRUFBRTs7Ozs7OztRQU12QyxNQUFNLHdCQUF3QjtRQUN4QixRQUFOLElBQUksSUFBSztRQUNULElBQUk7UUFDWSxRQUFoQixFQUFFLFlBQVksR0FBSTtRQUNaLFFBQU4sSUFBSSxJQUFLLGFBQWEsYUFBYTtRQUM3QixRQUFOLElBQUksSUFBSztRQUNULE1BQU0sa0JBQWtCO1FBQ3hCLElBQUk7UUFDRSxRQUFOLElBQUksSUFBSyxhQUFhO1FBQ2hCLFFBQU4sSUFBSSxJQUFLLFVBQVU7Ozs7UUFJbkIsTUFBTSx3QkFBd0I7UUFDOUIsSUFBSTtRQUNKLEtBQUssRUFBRSxZQUFZO1FBQ0gsUUFBaEIsRUFBRSxZQUFZLEdBQUk7UUFDbEIsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFO1FBQ1UsU0FBeEIsRUFBRSxZQUFZLE9BQU0sSUFBTTs7OztRQUkzQixNQUFNLHdCQUF3QjtRQUM5QixJQUFJO1FBQ0osRUFBRSxNQUFNLGFBQWEsR0FBRyxLQUFJLE9BQU87UUFDekIsUUFBVixZQUFjLElBQUksRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUU7UUFDbEMsRUFBRSxNQUFNLGFBQWEsR0FBRyxJQUFJLEVBQUUsS0FBSSxLQUFLLEVBQUUsT0FBTztRQUN0QyxRQUFWLFlBQWMsSUFBSSxFQUFFLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxJQUFJLElBQUksR0FBRyxFQUFFO1FBQy9DLE1BQU0sa0JBQWtCO1FBQ3hCLElBQUk7UUFDSixFQUFFLE1BQU0sYUFBYSxHQUFHLEtBQUksT0FBTztRQUN6QixRQUFWLFlBQWMsSUFBSSxFQUFFLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRTs7OztRQUlsQyxNQUFNLHdCQUF3QjtRQUM5QixJQUFJO1FBQ0osRUFBRSxNQUFNLGFBQWEsRUFBRSxLQUFJLE9BQU87UUFDbEMsRUFBRSxNQUFNLGdCQUFnQixFQUFFLEVBQUUsR0FBRztRQUNsQixRQUFiLGVBQWlCLElBQUksRUFBRSxHQUFHO1FBQzFCLEVBQUUsTUFBTSxnQkFBZ0IsR0FBRyxFQUFFLEVBQUU7UUFDbEIsUUFBYixlQUFpQixJQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksR0FBRyxHQUFHO1FBQ3hDLEVBQUUsTUFBTSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUU7UUFDakIsUUFBYixlQUFpQixJQUFJLEVBQUUsR0FBRyxLQUFLLElBQUksR0FBRyxHQUFHOzs7O1FBSXpDLE1BQU0sd0JBQXdCO1FBQzlCLElBQUk7UUFDSixFQUFFLE1BQU0sZ0JBQWdCLEdBQUcsRUFBRSxHQUFHO1FBQ25CLFFBQWIsZUFBaUIsSUFBSSxFQUFFLEdBQUc7UUFDMUIsRUFBRSxNQUFNLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUUsRUFBRSxFQUFFO1FBQzVCLFFBQWIsZUFBaUIsSUFBSSxFQUFFLEdBQUcsS0FBSyxJQUFJLEdBQUcsR0FBRyJ9
//# sourceURL=../../../kode/ked/test/wrapmap.kode
