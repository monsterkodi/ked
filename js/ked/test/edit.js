var toExport = {}
var lines, posl, result, rngs, words

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool edit"] = async function ()
{
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
toExport["tool edit"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9lZGl0LmtvZGUiXSwibWFwcGluZ3MiOiI7OztPQVFVLFVBQUE7SUFBUztJQUFLOztPQUNMLFdBQVA7Ozs7OztRQVlKLFFBQVEsS0FBSyxhQUFhOzs7O1FBTzFCLFNBQVMsS0FBSyxhQUFhOzs7Ozs7Ozs7UUFtQjNCLFFBQVEsS0FBSyxhQUFhOztnQkFLMUIsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTyxRQUFRLEVBQUU7Z0JBQy9FLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQVEsS0FBSyxhQUFhLEtBQUssaUJBQWlCLEVBQUU7Z0JBQ2hILEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQVEsS0FBSyxpQkFBaUIsRUFBRTtnQkFDOUYsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLGNBQWMsS0FBSyxnQkFBZ0IsRUFBRTtnQkFDaEgsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLG1CQUFtQixFQUFFO2dCQUNoRyxLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFRLEtBQUssZUFBZSxFQUFFO1FBRTVGLFFBQVEsS0FBSyxhQUFhOzs7Z0JBTTFCLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFRLEtBQUssYUFBYSxFQUFFO2dCQUdoRyxLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLFNBQVUsS0FBSyxJQUFJLEtBQUssVUFBVSxLQUFLLGFBQWEsRUFBRTs7Ozs7O1lBWXBILFFBQVEsS0FBSyxhQUNUOztvQkFLSixLQUFLLHNCQUFzQixNQUFNLEtBQVcsRUFBRSxNQUFh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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/edit.kode
