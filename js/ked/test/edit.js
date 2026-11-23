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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9lZGl0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7O09BQ1UsVUFBQTtJQUFTO0lBQUs7O09BQ0wsY0FBWjs7T0FDWSxhQUFaOztPQUNZLFdBQVA7O09BQ08sWUFBWjtPQUFrQixZQUFsQjs7O0FBRVAsZ0JBQU0sT0FBSyxJQUFHLE9BQUssSUFBRyxNQUFJLE1BQUs7Ozs7SUFDdkIsUUFBUTtJQUNSLFFBQVEsT0FBTyxFQUFFLE9BQU8sU0FBUztJQUNqQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEtBQUs7SUFDbEIsRUFBRSxNQUFNLE9BQU8sT0FBTztJQUN0QixFQUFFLE1BQU0sYUFBYSxPQUFPLEtBQUssSUFBSSxHQUFHLEVBQUUsR0FBRztJQUM3QyxFQUFFO1lBQ0QsRUFBRTs7O0FBRVgsc0JBQVk7Ozs7SUFDUixRQUFRLFNBQVEsS0FBSyxHQUFHLEtBQUs7SUFDN0IsUUFBUSxPQUFPLEVBQUUsT0FBTztJQUN4QixFQUFFLE1BQU0sT0FBTyxNQUFNO0lBQ3JCLEVBQUUsTUFBTSxVQUFVO1dBQ2xCOzs7Ozs7a0JBTVksT0FBUCxZQUFFOztRQUNILEVBQUUsTUFBTSxXQUFXLFNBQVMsR0FBRyxHQUFHO1FBRWxDLEVBQUUsSUFBSSxFQUFFO1FBQ2dCLFFBQXhCLEVBQUUsTUFBTSxhQUFhLEdBQUs7UUFDMUIsRUFBRSxJQUFJLEVBQUU7UUFDZ0IsUUFBeEIsRUFBRSxNQUFNLGFBQWEsR0FBSztRQUNBLFFBQTFCLEtBQUssSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFTOzs7O2tCQUlwQixPQUFQLFlBQUU7O1FBQ0gsRUFBRSxNQUFNLFdBQVcsR0FBRyxTQUFTLFNBQVM7UUFFeEMsRUFBRSxJQUFJLEVBQUU7UUFDZ0IsUUFBeEIsRUFBRSxNQUFNLGFBQWEsR0FBSztRQUNMLFFBQXJCLEVBQUUsTUFBTSxFQUFFLGFBQWUsRUFBRSxFQUFFLEVBQUU7UUFFL0IsRUFBRSxJQUFJLEVBQUU7UUFDZ0IsUUFB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
//# sourceURL=../../../kode/ked/test/edit.kode
