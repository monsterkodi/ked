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
    await section("ascii header at a non word character changes nothing", async function ()
    {
        var _c_ = hed(); h = _c_[0]; e = _c_[1]

        e.state.loadLines(['x = y'])
        e.state.setCursors([[2,0]])
        h.key(e,'ctrl+3')
        compare(kseg.str(e.state.s.lines),'x = y')
        compare(e.state.mainCursor(),[2,0])
    })
    await section("selection cells are marked", async function ()
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
    })
    await section("selection through an empty line", async function ()
    {
        var _e_ = hed(); h = _e_[0]; e = _e_[1]

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
    await section("highlight cells are marked", async function ()
    {
        var _f_ = hed(); h = _f_[0]; e = _f_[1]

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
        await section("multiple lines into single cursor", async function ()
        {
            lines = belt.seglsForText(`line 1
line 2`)
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,0]]),[kseg.segls('a\nb\nline 1\nline 2'),[[0,2]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[2,0]]),[kseg.segls('lia\nbne 1\nline 2'),[[1,1]]])
            compare(belt.insertTextAtPositions(lines,'a\nb',[[0,1]]),[kseg.segls('line 1\na\nb\nline 2'),[[0,3]]])
            compare(belt.insertTextAtPositions(lines,'a\n',[[0,1]]),[kseg.segls('line 1\na\nline 2'),[[0,2]]])
        })
        await section("multiple lines into multi cursor", async function ()
        {
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
        })
        await section("single span", async function ()
        {
            compare(belt.insertTextAtPositions(lines,'~!',[[4,1]]),[kseg.segls('◆1\n    ~!◆2\n        ◆3'),[[6,1]]])
            compare(belt.insertTextAtPositions(lines,'#{',[[2,2]]),[kseg.segls('◆1\n    ◆2\n  #{      ◆3'),[[4,2]]])
        })
        await section("newline into single cursor", async function ()
        {
            compare(belt.insertTextAtPositions(lines,'\n',[[4,1]]),[kseg.segls('◆1\n    \n    ◆2\n        ◆3'),[[4,2]]])
        })
        await section("multiple lines into single cursor", async function ()
        {
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
    await section("cachedWords keeps the segmentation of a chunk", async function ()
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
    await section("uses the character left of the cursor", async function ()
    {
        e = editorFor(['class Foo'])
        e.state.setMainCursor(5,0)
        compare(e.syntaxColorAtMainCursor(),(color.hex(theme.syntax.keyword)))
    })
    await section("falls back to the character right of the cursor", async function ()
    {
        e = editorFor(['class Foo'])
        e.state.setMainCursor(0,0)
        compare(e.syntaxColorAtMainCursor(),(color.hex(theme.syntax.keyword)))
    })
    await section("returns null outside of the line", async function ()
    {
        e = editorFor(['class Foo'])
        e.state.setMainCursor(20,0)
        compare(e.syntaxColorAtMainCursor(),null)
    })
}
toExport["syntaxColorAtMainCursor"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9lZGl0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ1UsVUFBQTtJQUFTO0lBQUs7O09BQ0wsY0FBWjs7T0FDWSxhQUFaOztPQUNZLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjs7O0FBRVAsZ0JBQU0sT0FBSyxJQUFHLE9BQUssSUFBRyxNQUFJLE1BQUs7Ozs7SUFDdkIsUUFBUTtJQUNSLFFBQVEsT0FBTyxFQUFFLE9BQU8sU0FBUztJQUNqQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUs7SUFDbEIsRUFBRSxNQUFNLE9BQU8sT0FBTztJQUN0QixFQUFFLE1BQU0sYUFBYSxPQUFPLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztJQUM3QyxFQUFFO1lBQ0QsRUFBRTs7O0FBRVgsc0JBQVk7Ozs7SUFDUixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE1BQU0sT0FBTyxNQUFNO0lBQ3JCLEVBQUUsTUFBTSxVQUFVO1dBQ2xCOzs7Ozs7a0JBTVksT0FBUCxZQUFFOztRQUNILEVBQUUsTUFBTSxXQUFXLFNBQVMsR0FBRyxHQUFHO1FBRWxDLEVBQUUsSUFBSSxFQUFFO2dCQUNSLEVBQUUsTUFBTSxhQUFhLEdBQUs7UUFDMUIsRUFBRSxJQUFJLEVBQUU7Z0JBQ1IsRUFBRSxNQUFNLGFBQWEsR0FBSztnQkFDMUIsS0FBSyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQVM7Ozs7a0JBSXBCLE9BQVAsWUFBRTs7UUFDSCxFQUFFLE1BQU0sV0FBVyxHQUFHLFNBQVMsU0FBUztRQUV4QyxFQUFFLElBQUksRUFBRTtnQkFDUixFQUFFLE1BQU0sYUFBYSxHQUFLO2dCQUMxQixFQUFFLE1BQU0sRUFBRSxhQUFlLEVBQUUsRUFBRSxFQUFFO1FBRS9CLEVBQUUsSUFBSSxFQUFFO2dCQUNSLEVBQUUsTUFBTSxhQUFhLEdBQUs7Z0JBQzFCLEVBQUUsTUFBTSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7UUFFL0IsRUFBRSxJQUFJLEVBQUU7Z0JBQ1IsRUFBRSxNQUFNLGFBQWEsR0FBSztnQkFDMUIsRUFBRSxNQUFNLEVBQUUsYUFBZSxFQUFFLEVBQUUsRUFBRTs7OztrQkFJdkIsT0FBUCxZQUFFOztRQUNILEVBQUUsTUFBTSxXQUFXO1FBRW5CLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFFdkIsRUFBRSxJQUFJLEVBQUU7Z0JBRVIsS0FBSyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQVM7Z0JBQzVCLEVBQUUsTUFBTSxjQUFnQixFQUFFOzs7O2tCQUlsQixPQUFQLFlBQUU7O1FBQ0gsRUFBRSxNQUFNLFdBQVc7UUFFbkIsRUFBRSxNQUFNLGFBQWEsRUFBRTtRQUN2QixFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1FBRTlCLEVBQUUsT0FBTztRQUNULEVBQUU7Z0JBRUYsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLEtBQU87Z0JBQ3hCLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxLQUFPO2dCQUN4QixFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsS0FBTzs0QkFDakIsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLE9BQVE7Ozs7a0JBSXhCLE9BQVAsWUFBRTs7UUFDSCxFQUFFLE1BQU0sV0FBVyxTQUFTLEdBQUcsU0FBUztRQUV4QyxFQUFFLE1BQU0sYUFBYSxFQUFFO1FBQ3ZCLEVBQUUsTUFBTSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUU7UUFFOUIsRUFBRSxPQUFPO1FBQ1QsRUFBRTtnQkFFRixFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsS0FBTztnQkFDeEIsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLEtBQU87Z0JBQ3hCLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxLQUFPO2dCQUN4QixFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsS0FBTztnQkFDeEIsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLEtBQU87Ozs7a0JBSWhCLE9BQVAsWUFBRTs7UUFDSCxFQUFFLE1BQU0sV0FBVztRQUVuQixFQUFFLE1BQU0sZ0JBQWdCLEVBQUUsRUFBRSxFQUFFO1FBQzlCLEVBQUUsTUFBTSxhQUFhLEVBQUU7UUFFdkIsRUFBRSxPQUFPO1FBQ1QsRUFBRTtnQkFFRixFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsS0FBTztnQkFDeEIsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLEtBQU87NEJBQ2pCLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxPQUFROzs7O1FBSWhDLFFBQVEsS0FBSyxhQUFhOzs7O1FBTzFCLFNBQVMsS0FBSyxhQUFhOzs7Ozs7Ozs7UUFXM0IsUUFBUSxLQUFLLGFBQWE7O2dCQUsxQixLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFPLFFBQVEsRUFBRTtnQkFDL0UsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLGFBQWEsS0FBSyxpQkFBaUIsRUFBRTtnQkFDaEgsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLGlCQUFpQixFQUFFO2dCQUM5RixLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFRLEtBQUssY0FBYyxLQUFLLGdCQUFnQixFQUFFO2dCQUNoSCxLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFRLEtBQUssbUJBQW1CLEVBQUU7Z0JBQ2hHLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQVEsS0FBSyxlQUFlLEVBQUU7UUFFNUYsUUFBUSxLQUFLLGFBQWE7OztnQkFNMUIsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQVEsS0FBSyxhQUFhLEVBQUU7Z0JBR2hHLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksU0FBVSxLQUFLLElBQUksS0FBSyxVQUFVLEtBQUssYUFBYSxFQUFFOzs7Ozs7WUFNcEgsUUFBUSxLQUFLLGFBQ1Q7O29CQUtKLEtBQUssc0JBQXNCLE1BQU0sS0FBVyxFQUFFLE1BQWEsS0FBSyxNQUFNLG9CQUFvQixFQUFFO29CQUM1RixLQUFLLHNCQUFzQixNQUFNLE9BQVcsRUFBRSxNQUFhLEtBQUssTUFBTSxzQkFBc0IsRUFBRTtvQkFDOUYsS0FBSyxzQkFBc0IsTUFBTSxPQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU8sS0FBSyxNQUFNLHdCQUF3QixFQUFFLElBQUksRUFBRTtvQkFFdEcsS0FBSyxzQkFBc0IsTUFBTSxNQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU8sS0FBSyxNQUFNLHNCQUFzQixFQUFFLElBQUksRUFBRTtvQkFDcEcsS0FBSyxzQkFBc0IsTUFBTSxNQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFPLEtBQUssTUFBTSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO29CQUNqSCxLQUFLLHNCQUFzQixNQUFNLE1BQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU8sS0FBSyxNQUFNLDBCQUEwQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7b0JBRXhKLEtBQUssc0JBQXNCLE1BQU0sTUFBVyxFQUFFLE1BQU8sS0FBSyxNQUFNLHFCQUFxQixFQUFFO29CQUN2RixLQUFLLHNCQUFzQixLQUFLLE1BQU0sbUJBQW1CLE1BQVcsRUFBRSxNQUFPLEtBQUssTUFBTSxzQkFBc0IsRUFBRTs7OztZQUloSCxRQUFRLEtBQUssYUFDVDs7b0JBS0osS0FBSyxzQkFBc0IsTUFBTSxTQUFXLEVBQUUsTUFBYSxLQUFLLE1BQU0sMEJBQTBCLEVBQUU7b0JBQ2xHLEtBQUssc0JBQXNCLE1BQU0sU0FBVyxFQUFFLE1BQWEsS0FBSyxNQUFNLHdCQUEwQixFQUFFO29CQUNsRyxLQUFLLHNCQUFzQixNQUFNLFNBQVcsRUFBRSxNQUFhLEtBQUssTUFBTSwwQkFBMEIsRUFBRTtvQkFFbEcsS0FBSyxzQkFBc0IsTUFBTSxRQUFXLEVBQUUsTUFBYSxLQUFLLE1BQU0sdUJBQXVCLEVBQUU7Ozs7WUFJL0YsUUFBUSxLQUFLLGFBQ1Q7O29CQUtKLEtBQUssc0JBQXNCLE1BQU0sU0FBYyxFQUFFLElBQUksRUFBRSxNQUFvQixLQUFLLE1BQU0sa0JBQW9CLEVBQUUsSUFBSSxFQUFFO29CQUNsSCxLQUFLLHNCQUFzQixNQUFNLFNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFRLEtBQUssTUFBTSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtvQkFDOUgsS0FBSyxzQkFBc0IsTUFBTSxZQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBUSxLQUFLLE1BQU0sb0JBQW9CLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7Ozs7WUFJOUgsUUFBUSxLQUFLLGFBQ1Q7O29CQUtKLEtBQUssc0JBQXNCLE1BQU0sT0FBTyxFQUFFLE1BQU8sS0FBSyxNQUFNLHNCQUFzQixFQUFFO29CQUNwRixLQUFLLHNCQUFzQixNQUFNLE9BQU8sRUFBRSxNQUFPLEtBQUssTUFBTSxzQkFBc0IsRUFBRTtvQkFFcEYsS0FBSyxzQkFBc0IsTUFBTSxPQUFPLEVBQUUsTUFBTyxLQUFLLE1BQU0sc0JBQXNCLEVBQUU7b0JBQ3BGLEtBQUssc0JBQXNCLE1BQU0sT0FBTyxFQUFFLE1BQU8sS0FBSyxNQUFNLHNCQUFzQixFQUFFO29CQUNwRixLQUFLLHNCQUFzQixNQUFNLE9BQU8sRUFBRSxNQUFPLEtBQUssTUFBTSxzQkFBc0IsRUFBRTtvQkFFcEYsS0FBSyxzQkFBc0IsTUFBTSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU8sS0FBSyxNQUFNLHdCQUF3QixFQUFFLElBQUksRUFBRTtZQUVsRyxRQUFRLEtBQUssYUFDVDs7OztvQkFPSixLQUFLLHNCQUFzQixNQUFNLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFPLEtBQUssTUFBTSw0QkFBNEIsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTs7OztZQUk5SCxRQUFRLEtBQUssYUFDVDs7Ozs7O29CQVFBLEtBQUssc0JBQXNCLE1BQU0sT0FBTyxFQUFFLE1BQU8sS0FBSyxNQUFNLDhCQUE4QixFQUFFO29CQUM1RixLQUFLLHNCQUFzQixNQUFNLE9BQU8sRUFBRSxNQUFPLEtBQUssTUFBTSw4QkFBOEIsRUFBRTs7OztvQkFJNUYsS0FBSyxzQkFBc0IsTUFBTSxPQUFPLEVBQUUsTUFBTyxLQUFLLE1BQU0sa0NBQWtDLEVBQUU7Ozs7b0JBSWhHLEtBQUssc0JBQXNCLE1BQU0sU0FBUyxFQUFFLE1BQU8sS0FBSyxNQUFNLDBDQUEwQyxFQUFFOzs7OztRQUlsSCxRQUFRLEtBQUssYUFBYTs7Z0JBSzFCLEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLElBQUksT0FBUSxLQUFLLE1BQU0sb0JBQW9CLEVBQUU7Z0JBQ2hHLEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssSUFBSSxPQUFRLEtBQUssTUFBTSxzQkFBc0IsRUFBRSxJQUFJLEVBQUU7Z0JBRWxILEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLElBQUksT0FBUSxLQUFLLE1BQU0sb0JBQW9CLEVBQUU7Z0JBQ2hHLEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssSUFBSSxPQUFRLEtBQUssTUFBTSxzQkFBc0IsRUFBRSxJQUFJLEVBQUU7Z0JBRWxILEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLElBQUksT0FBUSxLQUFLLE1BQU0sb0JBQW9CLEVBQUU7Z0JBQ2hHLEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssSUFBSSxPQUFRLEtBQUssTUFBTSxzQkFBc0IsRUFBRSxJQUFJLEVBQUU7Z0JBRWxILEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLEtBQUssT0FBUSxLQUFLLE1BQU0sc0JBQXNCLEVBQUU7Z0JBQ25HLEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxLQUFLLEtBQUssT0FBUSxLQUFLLE1BQU0sc0JBQXNCLEVBQUU7Z0JBQ25HLEtBQUssdUJBQXVCLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssSUFBSSxPQUFRLEtBQUssTUFBTSxzQkFBc0IsRUFBRSxJQUFJLEVBQUU7Ozs7UUFJbEgsUUFBUSxXQUFXLElBQUksSUFBSTtRQUMzQixPQUFRO1FBQ1IsT0FBUTtnQkFFUixLQUFLLCtDQUErQyxNQUFNLEtBQUssTUFBTSxHQUFLLFVBQVcsSUFBSSxJQUFJO2dCQUM3RixLQUFLLCtDQUErQyxNQUFNLEtBQUssTUFBTSxHQUFLLFVBQVcsSUFBSSxJQUFJO2dCQUM3RixLQUFLLCtDQUErQyxNQUFNLEtBQUssTUFBTSxFQUFFLEdBQUcsVUFBVyxJQUFJLElBQUk7Z0JBQzdGLEtBQUssK0NBQStDLE1BQU0sS0FBSyxNQUFNLEVBQUUsR0FBRyxVQUFXLElBQUksSUFBSTtnQkFFN0YsS0FBSywrQ0FBK0MsTUFBTSxLQUFLLE1BQU0sR0FBSyxRQUFTLElBQUksSUFBSTtnQkFDM0YsS0FBSywrQ0FBK0MsTUFBTSxLQUFLLE1BQU0sR0FBSyxRQUFTLElBQUksSUFBSTtnQkFDM0YsS0FBSywrQ0FBK0MsTUFBTSxLQUFLLE1BQU0sRUFBRSxHQUFHLFFBQVMsSUFBSSxJQUFJO2dCQUMzRixLQUFLLCtDQUErQyxNQUFNLEtBQUssTUFBTSxFQUFFLEdBQUcsUUFBUyxJQUFJLElBQUk7Z0JBRTNGLEtBQUssK0NBQStDLE1BQU0sS0FBSyxZQUFZLEVBQUUsTUFBWSxHQUFHLFVBQVcsSUFBSSxJQUFJLFVBQVUsRUFBRTtnQkFDM0gsS0FBSywrQ0FBK0MsTUFBTSxLQUFLLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLFVBQVcsSUFBSSxJQUFJLFVBQVUsRUFBRSxJQUFJLEVBQUU7Z0JBQ2pJLEtBQUssK0NBQStDLE1BQU0sS0FBSyxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxVQUFXLElBQUksSUFBSSxVQUFVLEVBQUUsSUFBSSxFQUFFO2dCQUVqSSxLQUFLLCtDQUErQyxNQUFNLEtBQUssWUFBWSxFQUFFLE1BQVksR0FBRyxRQUFTLElBQUksSUFBSSxVQUFVLEVBQUU7Z0JBQ3pILEtBQUssK0NBQStDLE1BQU0sS0FBSyxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxRQUFTLElBQUksSUFBSSxVQUFVLEVBQUUsSUFBSSxFQUFFO2dCQUMvSCxLQUFLLCtDQUErQyxNQUFNLEtBQUssWUFBWSxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsUUFBUyxJQUFJLElBQUksVUFBVSxFQUFFLElBQUksRUFBRTtRQUUvSCxRQUFRLFdBQVcsSUFBSSxJQUFJLElBQUksSUFBSTtnQkFFbkMsS0FBSywrQ0FBK0MsTUFBTSxLQUFLLFlBQVksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUcsUUFBVyxJQUFJLElBQUksSUFBSSxJQUFJLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO2dCQUN6SixLQUFLLCtDQUErQyxNQUFNLEtBQUssWUFBWSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxVQUFXLElBQUksSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7Ozs7UUFJekosSUFBSSxLQUFLLFlBQVk7UUFDckIsSUFBSSxLQUFLLFlBQVk7Z0JBRXJCLE1BQUssRUFBSTtnQkFDVCxFQUFFLGNBQUs7O21CQUFNLEVBQUU7WUFBUyxNQUFNOzs7O1FBSTlCLFFBQVEsS0FBSyxhQUFhOzs7Ozs7Ozs7OztnQkFjMUIsS0FBSywwQkFBMEIsSUFBUyxJQUFTLFFBQWdDO2dCQUNqRixLQUFLLDBCQUEwQixJQUFTLEtBQVUsWUFBK0I7Z0JBQ2pGLEtBQUssMEJBQTBCLElBQVMsS0FBVSxZQUErQixPQUFPO2dCQUN4RixLQUFLLDBCQUEwQixLQUFTLE1BQVU7Z0JBQ2xELEtBQUssMEJBQTBCLElBQVMsS0FBVSwwQkFBK0IsT0FBTztnQkFDeEYsS0FBSywwQkFBMEIsTUFBUyxLQUFVO2dCQUNsRCxLQUFLLDBCQUEwQixPQUFTLEtBQVUsYUFBK0IsS0FBSyxLQUFLO2dCQUMzRixLQUFLLDBCQUEwQixRQUFTLEtBQVU7Z0JBQ2xELEtBQUssMEJBQTBCLFNBQVMsS0FBVSxhQUErQixLQUFLLEtBQUs7Z0JBQzNGLEtBQUssMEJBQTBCLE9BQVMsUUFBVTtnQkFDbEQsS0FBSywwQkFBMEIsSUFBUyxLQUFVLE9BQU8sU0FBd0IsTUFBTTtnQkFDdkYsS0FBSywwQkFBMEIsS0FBUyxNQUFVLFFBQVEsVUFBdUIsT0FBTztnQkFDeEYsS0FBSywwQkFBMEIsS0FBUyxNQUFVLFVBQVUsV0FBcUIsT0FBTztnQkFDeEYsS0FBSywwQkFBMEIsS0FBUyxLQUFVLE1BQU0sUUFBUSxjQUFpQjtnQkFDakYsS0FBSywwQkFBMEIsS0FBUyxLQUFVLE1BQU0sUUFBUSxjQUFpQjtnQkFDakYsS0FBSywwQkFBMEIsTUFBUyxLQUFVLFFBQVEsUUFBUTtnQkFDbEUsS0FBSywwQkFBMEIsUUFBUyxLQUFVLE9BQU8sU0FBd0IsT0FBTztnQkFDeEYsS0FBSywwQkFBMEIsUUFBUyxNQUFVLFNBQStCO2dCQUNqRixLQUFLLDBCQUEwQixLQUFTLE1BQVUsUUFBUTtnQkFDMUQsS0FBSywwQkFBMEIsSUFBTSxLQUFhLGlCQUErQixTQUFTO2dCQUMxRixLQUFLLDBCQUEwQixJQUFNLEtBQWEsaUJBQStCO2dCQUNqRixLQUFLLDBCQUEwQixJQUFNLEtBQWEsa0JBQStCO2dCQUNqRixLQUFLLDBCQUEwQixJQUFNLEtBQWEsTUFBTTtnQkFDeEQsS0FBSywwQkFBMEIsV0FBVyxPQUFRLGdCQUErQjs7OztRQUlqRixRQUFRLEtBQUssYUFDVDs7O1FBS0osT0FBTyxZQUFZLEVBQUUsRUFBRSxFQUFFO1FBQ3pCLE9BQU8sWUFBWSxFQUFFLElBQUksRUFBRTtnQkFDM0IsS0FBSyxzQ0FBc0MsTUFBTSxLQUFLLE1BQU0sRUFBRSxNQUFPLEtBQUssVUFBVSxLQUFLLGNBQWMsS0FBSyxpQkFBaUIsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs7OztRQUlqSixRQUFRLEtBQUssYUFDVDs7O1FBS0osT0FBTyxZQUFZLEVBQUUsRUFBRSxFQUFFO1FBQ3pCLE9BQU8sWUFBWSxFQUFFLElBQUksRUFBRTtnQkFDM0IsS0FBSyx3Q0FBd0MsTUFBTSxLQUFLLE1BQU0sRUFBRSxNQUFPLEtBQUssTUFBTSxLQUFLLE1BQU0sS0FBSyxhQUFhLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Ozs7Ozs7O1FBT25JLElBQUksV0FBVztRQUNmLEVBQUUsTUFBTSxjQUFjLEVBQUU7Z0JBRXhCLEVBQUUsMkJBQTZCLE1BQU0sSUFBSSxNQUFNLE9BQU87Ozs7UUFJdEQsSUFBSSxXQUFXO1FBQ2YsRUFBRSxNQUFNLGNBQWMsRUFBRTtnQkFFeEIsRUFBRSwyQkFBNkIsTUFBTSxJQUFJLE1BQU0sT0FBTzs7OztRQUl0RCxJQUFJLFdBQVc7UUFDZixFQUFFLE1BQU0sY0FBYyxHQUFHO2dCQUV6QixFQUFFLDBCQUE0QiJ9
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/edit.kode
