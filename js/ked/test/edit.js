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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9lZGl0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUFxQlEsUUFBUSxLQUFLLGFBQWE7Ozs7UUFPMUIsU0FBUyxLQUFLLGFBQWE7Ozs7Ozs7OztRQW1CM0IsUUFBUSxLQUFLLGFBQWE7O2dCQUsxQixLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFPLFFBQVEsRUFBRTtnQkFDL0UsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLGFBQWEsS0FBSyxpQkFBaUIsRUFBRTtnQkFDaEgsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsT0FBUSxLQUFLLGlCQUFpQixFQUFFO2dCQUM5RixLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFRLEtBQUssY0FBYyxLQUFLLGdCQUFnQixFQUFFO2dCQUNoSCxLQUFLLG1DQUFtQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFRLEtBQUssbUJBQW1CLEVBQUU7Z0JBQ2hHLEtBQUssbUNBQW1DLFFBQVEsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQVEsS0FBSyxlQUFlLEVBQUU7UUFFNUYsUUFBUSxLQUFLLGFBQWE7OztnQkFNMUIsS0FBSyxtQ0FBbUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQVEsS0FBSyxhQUFhLEVBQUU7Ozs7OztZQVk1RixRQUFRLEtBQUssYUFDVDs7b0JBS0osS0FBSyxzQkFBc0IsTUFBTSxLQUFXLEVBQUUsTUFBYSxLQUFLLE1BQU0sb0JBQW9CLEVBQUU7b0JBQzVGLEtBQUssc0JBQXNCLE1BQU0sT0FBVyxFQUFFLE1BQWEsS0FBSyxNQUFNLHNCQUFzQixFQUFFO29CQUM5RixLQUFLLHNCQUFzQixNQUFNLE9BQVcsRUFBRSxJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/edit.kode
