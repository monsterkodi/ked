var toExport = {}
var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var a, b, e, editorFor, h, hed, lines, posl, result, rngs, words

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import harness from "../util/harness.js"

import editor from "../edit/editor.js"

import belt from "../edit/tool/belt.js"

import color from "../theme/color.js"
import theme from "../theme/theme.js"


hed = function (cols = 40, rows = 10, ext = 'md', feats = [])
{
    var e, h

    h = new harness
    e = new editor(h.screen,'editor',feats)
    e.layout(0,0,cols,rows)
    e.state.syntax.setExt(ext)
    e.state.applyScales({enable:true,md:{h1:3,h2:2}})
    e.grabFocus()
    return [h,e]
}

editorFor = function (lines)
{
    var e, h

    h = new harness({cols:30,rows:9})
    e = new editor(h.screen,'test_editor_syntax_color',[])
    e.state.syntax.ext = 'kode'
    e.state.loadLines(lines)
    return e
}
toExport["edit"] = async function ()
{
    await section("delete cursor line", async function ()
    {
        var _a_ = hed(); h = _a_[0]; e = _a_[1]

        e.state.loadLines(['line a','','','line d'])
        h.key(e,'down')
        compare(e.state.mainCursor()[1],1)
        h.key(e,'cmd+x')
        compare(e.state.mainCursor()[1],1)
        compare(kseg.str(e.state.s.lines),"line a\n\nline d")
    })
    await section("select", async function ()
    {
        var _b_ = hed(); h = _b_[0]; e = _b_[1]

        e.state.loadLines(['','line b','line c','line d'])
        h.key(e,'shift+down')
        compare(e.state.mainCursor()[1],1)
        compare(e.state.s.selections,[[0,0,0,1]])
        h.key(e,'shift+down')
        compare(e.state.mainCursor()[1],2)
        compare(e.state.s.selections,[[0,0,0,2]])
        h.key(e,'shift+down')
        compare(e.state.mainCursor()[1],3)
        compare(e.state.s.selections,[[0,0,0,3]])
    })
    await section("ascii header", async function ()
    {
        var _c_ = hed(); h = _c_[0]; e = _c_[1]

        e.state.loadLines(['x = y'])
        e.state.setCursors([[2,0]])
        h.key(e,'ctrl+3')
        compare(kseg.str(e.state.s.lines),'x = y')
        compare(e.state.mainCursor(),[2,0])
    })
    await section("selection", async function ()
    {
        var _d_ = hed(); h = _d_[0]; e = _d_[1]

        e.state.loadLines(['abcdef'])
        e.state.setCursors([[2,0]])
        e.state.setSelections([[0,0,2,0]])
        h.screen.init()
        e.draw()
        compare(h.screen.c[0][0].mark,'selection')
        compare(h.screen.c[0][1].mark,'selection')
        compare(h.screen.c[0][2].mark,'main')
        compare((!_k_.empty(h.screen.c[0][3].mark)),false)
        e.state.loadLines(['abcdef','','ghijkl','mnopqr'])
        e.state.setCursors([[4,3]])
        e.state.setSelections([[0,0,4,3]])
        h.screen.init()
        e.draw()
        compare(h.screen.c[0][0].mark,'selection')
        compare(h.screen.c[2][0].mark,'selection')
        compare(h.screen.c[3][0].mark,'selection')
        compare(h.screen.c[3][3].mark,'selection')
        compare(h.screen.c[3][4].mark,'main')
    })
    await section("highlight cells", async function ()
    {
        var _e_ = hed(); h = _e_[0]; e = _e_[1]

        e.state.loadLines(['abcdef'])
        e.state.setHighlights([[0,0,3,0]])
        e.state.setCursors([[5,0]])
        h.screen.init()
        e.draw()
        compare(h.screen.c[0][0].mark,'highlight')
        compare(h.screen.c[0][2].mark,'highlight')
        compare((!_k_.empty(h.screen.c[0][3].mark)),false)
    })
    await section("toggleCommentTypesInLineRangesAtIndices", async function ()
    {
        lines = belt.seglsForText(`code = true
# comment
# a
code = 'yes' # trailing`)
        result = belt.seglsForText(`code = true
###
comment
a
###
code = 'yes' # trailing`)
    })
    await section("deleteLineRangesAndAdjustPositions", async function ()
    {
        lines = belt.seglsForText(`1234567890
abcdefghij`)
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,0]],[[5,1]]),[lines,[[5,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,6,0]],[[5,1]]),[[kseg('123457890'),kseg('abcdefghij')],[[5,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,5,1]],[[5,1]]),[[kseg('12345fghij')],[[5,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,1,1,1]],[[0,1]]),[[kseg('1234567890'),kseg('bcdefghij')],[[0,1]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[5,0,3,1]],[[3,1]]),[[kseg('12345defghij')],[[5,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[3,0,5,1]],[[3,1]]),[[kseg('123fghij')],[[3,0]]])
        lines = belt.seglsForText(`line 1
line 2
line 3`)
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,0,6,1]],[[6,0],[6,1]]),[[kseg('line 3')],[[0,0]]])
        compare(belt.deleteLineRangesAndAdjustPositions(lines,[[0,0,6,0]],[[0,0]],false),[[kseg(''),kseg('line 2'),kseg('line 3')],[[0,0]]])
    })
    await section("insertTextAtPositions", async function ()
    {
        await section("single spans", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'',[[0,0]]),[kseg.segls('line 1\nline 2'),[[0,0]]])
            compare(belt.insertTextAtPositions(lines,'a ',[[0,0]]),[kseg.segls('a line 1\nline 2'),[[2,0]]])
            compare(belt.insertTextAtPositions(lines,'a ',[[0,0],[0,1]]),[kseg.segls('a line 1\na line 2'),[[2,0],[2,1]]])
            compare(belt.insertTextAtPositions(lines,'x',[[0,0],[2,0]]),[kseg.segls('xlixne 1\nline 2'),[[1,0],[4,0]]])
            compare(belt.insertTextAtPositions(lines,'x',[[0,0],[2,0],[6,0]]),[kseg.segls('xlixne 1x\nline 2'),[[1,0],[4,0],[9,0]]])
            compare(belt.insertTextAtPositions(lines,'z',[[0,0],[2,0],[6,0],[1,1],[2,1],[4,1]]),[kseg.segls('zlizne 1z\nlziznez 2'),[[1,0],[4,0],[9,0],[2,1],[4,1],[7,1]]])
            compare(belt.insertTextAtPositions(lines,'ｔ',[[0,0]]),[kseg.segls('ｔline 1\nline 2'),[[2,0]]])
            compare(belt.insertTextAtPositions(kseg.segls('ｔline 1\nline 2'),'ｔ',[[2,0]]),[kseg.segls('ｔｔline 1\nline 2'),[[4,0]]])
        })
        await section("multiple lines", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,0]]),[kseg.segls('a\nb\nline 1\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[2,0]]),[kseg.segls('lia\nbne 1\nline 2'),[[1,1]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,1]]),[kseg.segls('line 1\na\nb\nline 2'),[[0,3]]])
            compare(belt.insertTextAtPositions(lines,'a\n',[[0,1]]),[kseg.segls('line 1\na\nline 2'),[[0,2]]])
            lines = belt.seglsForText(`1234
5678`)
            compare(belt.insertTextAtPositions(lines,'X\nY',[[0,0],[0,1]]),[kseg.segls('X1234\nY5678'),[[1,0],[1,1]]])
            compare(belt.insertTextAtPositions(lines,'X\nY',[[0,0],[1,0],[2,0],[3,0]]),[kseg.segls('X1Y2X3Y4\n5678'),[[1,0],[3,0],[5,0],[7,0]]])
            compare(belt.insertTextAtPositions(lines,'@\n$\n%',[[0,0],[1,0],[2,0],[3,0]]),[kseg.segls('@1$2%3@4\n5678'),[[1,0],[3,0],[5,0],[7,0]]])
        })
        await section("newlines", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'\n',[[2,0]]),[kseg.segls('li\nne 1\nline 2'),[[0,1]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[6,0]]),[kseg.segls('line 1\n\nline 2'),[[0,1]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[0,1]]),[kseg.segls('line 1\n\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[2,1]]),[kseg.segls('line 1\nli\nne 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[6,1]]),[kseg.segls('line 1\nline 2\n'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[0,0],[0,1]]),[kseg.segls('\nline 1\n\nline 2'),[[0,1],[0,3]]])
            lines = belt.seglsForText(`◆1
◆2
◆3
◆4`)
            compare(belt.insertTextAtPositions(lines,'\n',[[1,0],[1,1],[1,2],[1,3]]),[kseg.segls('◆\n1\n◆\n2\n◆\n3\n◆\n4'),[[0,1],[0,3],[0,5],[0,7]]])
        })
        await section("into indented lines", async function ()
        {
            lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
            compare(belt.insertTextAtPositions(lines,'~!',[[4,1]]),[kseg.segls('◆1\n    ~!◆2\n        ◆3'),[[6,1]]])
            compare(belt.insertTextAtPositions(lines,'#{',[[2,2]]),[kseg.segls('◆1\n    ◆2\n  #{      ◆3'),[[4,2]]])
            compare(belt.insertTextAtPositions(lines,'\n',[[4,1]]),[kseg.segls('◆1\n    \n    ◆2\n        ◆3'),[[4,2]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[4,1]]),[kseg.segls('◆1\n    a\n    b\n    ◆2\n        ◆3'),[[4,3]]])
        })
    })
    await section("insertSurroundAtRanges", async function ()
    {
        lines = belt.seglsForText(`line1
line2`)
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'}',['{','}']),[kseg.segls('l{in}e1\nline2'),[[5,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],']',['[',']']),[kseg.segls('l[in]e1\nl[in]e2'),[[5,0],[5,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'{',['{','}']),[kseg.segls('l{in}e1\nline2'),[[2,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'[',['[',']']),[kseg.segls('l[in]e1\nl[in]e2'),[[2,0],[2,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],'"',['"','"']),[kseg.segls('l"in"e1\nline2'),[[5,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'"',['"','"']),[kseg.segls('l"in"e1\nl"in"e2'),[[5,0],[5,1]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],"}",['#{','}']),[kseg.segls("l\#{in}e1\nline2"),[[6,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0]],"#",['#{','}']),[kseg.segls("l\#{in}e1\nline2"),[[3,0]]])
        compare(belt.insertSurroundAtRanges(lines,[[1,0,3,0],[1,1,3,1]],'"',['"','"']),[kseg.segls('l"in"e1\nl"in"e2'),[[5,0],[5,1]]])
    })
    await section("moveLineRangesAndPositionsAtIndicesInDirection", async function ()
    {
        lines = immutable(['a','b','c'])
        rngs = immutable([])
        posl = immutable([])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1],'down'),[['a','c','b'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1,2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[0,2],'down'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1],'up'),[['b','a','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[2],'up'),[['a','c','b'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[1,2],'up'),[['b','c','a'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,posl,[0,2],'up'),[['a','b','c'],[],[]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1]]),[1],'down'),[['a','c','b'],[],[[0,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'down'),[['a','c','b'],[],[[0,2],[1,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1]]),[1],'up'),[['b','a','c'],[],[[0,0]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[1,1]]),[1],'up'),[['b','a','c'],[],[[0,0],[1,0]]])
        lines = immutable(['a','b','c','d','e'])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[0,2],[0,3]]),[1,2,3],'up'),[['b','c','d','a','e'],[],[[0,0],[0,1],[0,2]]])
        compare(belt.moveLineRangesAndPositionsAtIndicesInDirection(lines,rngs,immutable([[0,1],[0,2],[0,3]]),[1,2,3],'down'),[['a','e','b','c','d'],[],[[0,2],[0,3],[0,4]]])
    })
    await section("cachedWords", async function ()
    {
        a = belt.cachedWords('abc.def')
        b = belt.cachedWords('abc.def')
        compare(a === b,true)
        compare(a.map(function (w)
        {
            return w.word
        }),['abc','def'])
    })
    await section("prepareWordsForCompletion", async function ()
    {
        words = belt.linesForText(`Alice
Alice!
Alice!"
Alice)--
Alice,
Alice,)
Alice.
Alice:
Alice;
Alice’s
Alice’s,`)
        compare(belt.prepareWordsForCompletion('A','A',words),['Alice'])
        compare(belt.prepareWordsForCompletion('"','"',['"#fff"']),['"#fff"'])
        compare(belt.prepareWordsForCompletion('f','f',['func()']),['func','func()'])
        compare(belt.prepareWordsForCompletion('fa','fa',['f']),[])
        compare(belt.prepareWordsForCompletion('w','w',['word[@turd.length..]']),['word','word[@turd.length..]'])
        compare(belt.prepareWordsForCompletion('a.b','b',['a.b.c.d']),[])
        compare(belt.prepareWordsForCompletion('a.b.','.',['a.b.c.d']),['.b','.c','.d'])
        compare(belt.prepareWordsForCompletion('a.b.c','c',['a.b.c.d']),[])
        compare(belt.prepareWordsForCompletion('a.b.c.','.',['a.b.c.d']),['.b','.c','.d'])
        compare(belt.prepareWordsForCompletion('word','word',['word[@turd.length..]']),[])
        compare(belt.prepareWordsForCompletion('k','k',['kseg','key']),['key','kseg'])
        compare(belt.prepareWordsForCompletion('he','he',['hello','hell']),['hell','hello'])
        compare(belt.prepareWordsForCompletion('he','he',['"hello"','@hell']),['hell','hello'])
        compare(belt.prepareWordsForCompletion('a.','.',['0.1','1.234','obj.prop']),['.prop'])
        compare(belt.prepareWordsForCompletion('0.','.',['0.1','1.234','obj.prop']),['.1'])
        compare(belt.prepareWordsForCompletion('3.1','1',['1.123','1.234','obj.prop']),[])
        compare(belt.prepareWordsForCompletion('rugga','r',['rofl','rug']),['rofl','rug'])
        compare(belt.prepareWordsForCompletion('rugga','ru',['rug']),['rug'])
        compare(belt.prepareWordsForCompletion('mc','mc',['mc[0]','mc[1]']),[])
        compare(belt.prepareWordsForCompletion('@','@',['@color.dot)']),['@color','@color.dot'])
        compare(belt.prepareWordsForCompletion('@','@',["@side='left"]),['@side'])
        compare(belt.prepareWordsForCompletion('@','@',["@side='left'"]),['@side'])
        compare(belt.prepareWordsForCompletion('b','b',['a\n','b\n']),[])
        compare(belt.prepareWordsForCompletion('@img.pop','pop',['@img.pop()']),['pop()'])
    })
    await section("indentLineRangesAndPositionsAtIndices", async function ()
    {
        lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
        posl = immutable([[0,0,1,1]])
        rngs = immutable([[0,1],[1,1]])
        compare(belt.indentLineRangesAndPositionsAtIndices(lines,posl,rngs,[0,1]),[[kseg('    ◆1'),kseg('        ◆2'),kseg('        ◆3')],[[4,0,5,1]],[[4,1],[5,1]]])
    })
    await section("deindentLineRangesAndPositionsAtIndices", async function ()
    {
        lines = belt.seglsForText(`◆1
    ◆2
        ◆3`)
        posl = immutable([[0,1,1,2]])
        rngs = immutable([[0,1],[1,2]])
        compare(belt.deindentLineRangesAndPositionsAtIndices(lines,posl,rngs,[1,2]),[[kseg('◆1'),kseg('◆2'),kseg('    ◆3')],[[0,1,0,2]],[[0,1],[0,2]]])
    })
}
toExport["edit"]._section_ = true
toExport["syntaxColorAtMainCursor"] = async function ()
{
    e = editorFor(['class Foo'])
    e.state.setMainCursor(5,0)
    compare(e.syntaxColorAtMainCursor(),(color.hex(theme.syntax.keyword)))
    e.state.setMainCursor(0,0)
    compare(e.syntaxColorAtMainCursor(),(color.hex(theme.syntax.keyword)))
    e.state.setMainCursor(20,0)
    compare(e.syntaxColorAtMainCursor(),null)
}
toExport["syntaxColorAtMainCursor"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9lZGl0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ1UsVUFBQTtJQUFTO0lBQUs7O09BQ0wsY0FBWjs7T0FDWSxhQUFaOztPQUNZLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjs7O0FBRVAsZ0JBQU0sT0FBSyxJQUFHLE9BQUssSUFBRyxNQUFJLE1BQUs7Ozs7SUFDdkIsUUFBUTtJQUNSLFFBQVEsT0FBTyxFQUFFLE9BQU8sU0FBUztJQUNqQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUs7SUFDbEIsRUFBRSxNQUFNLE9BQU8sT0FBTztJQUN0QixFQUFFLE1BQU0sYUFBYSxPQUFPLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztJQUM3QyxFQUFFO1lBQ0QsRUFBRTs7O0FBRVgsc0JBQVk7Ozs7SUFDUixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE1BQU0sT0FBTyxNQUFNO0lBQ3JCLEVBQUUsTUFBTSxVQUFVO1dBQ2xCOzs7Ozs7a0JBTVksT0FBUCxZQUFFOztRQUNILEVBQUUsTUFBTSxXQUFXLFNBQVMsR0FBRyxHQUFHO1FBRWxDLEVBQUUsSUFBSSxFQUFFO2dCQUNSLEVBQUUsTUFBTSxhQUFhLEdBQUs7UUFDMUIsRUFBRSxJQUFJLEVBQUU7Z0JBQ1IsRUFBRSxNQUFNLGFBQWEsR0FBSztnQkFDMUIsS0FBSyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQVM7Ozs7a0JBSXBCLE9BQVAsWUFBRTs7UUFDSCxFQUFFLE1BQU0sV0FBVyxHQUFHLFNBQVMsU0FBUztRQUV4QyxFQUFFLElBQUksRUFBRTtnQkFDUixFQUFFLE1BQU0sYUFBYSxHQUFLO2dCQUMxQixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO1FBRS9CLEVBQUUsSUFBSSxFQUFFO2dCQUNSLEVBQUUsTUFBTSxhQUFhLEdBQUs7Z0JBQzFCLEVB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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/edit.kode
