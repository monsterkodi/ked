var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var batched, brackets, brk, c, cells, l, line, lines, one, pairs, pos, posl, rect, rngs, segls, spans, sps, strings, strs, text

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool belt"] = async function ()
{
    await section("cells", async function ()
    {
        l = belt.linesForText(`012
abc
XYZ`)
        cells = belt.cellsForLines(l)
        rect = belt.cellsInRect(cells,0,0,1,1)
        var list = _k_.list(rect)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            c = list[_a_]
            c.cell.fg = [255,0,0]
        }
        compare(cells[0][0].fg,[255,0,0])
        compare(cells[1][1].fg,[255,0,0])
        compare(cells[2][2].fg,[])
        compare(belt.clampCellRect(cells,0,0,1,1),[0,0,1,1])
        compare(belt.clampCellRect(cells,-1,-1,1,1),[0,0,1,1])
        compare(belt.cellsInRect(cells,0,0,1,1).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
        compare(belt.cellsInRect(cells,1,1,1,1).map(function (n)
        {
            return n.cell.char
        }),['b'])
        compare(belt.cellsInRect(cells,0,0,2,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','2'])
        compare(belt.cellsInRect(cells,1,2,2,2).map(function (n)
        {
            return n.cell.char
        }),['Y','Z'])
        compare(belt.cellNeighborsAtPos(cells,0,0).map(function (n)
        {
            return n.cell.char
        }),['0','1','a','b'])
    })
    await section("extendLineRangesToPosition", async function ()
    {
        lines = ['123','45','6']
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([]),[0,0],[0,2]),[[0,0,0,2]])
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([[0,0,1,0],[2,0,3,0]]),[1,1],[0,2]),[[0,0,1,0],[2,0,3,0],[1,1,0,2]])
    })
    await section("jumpDelta", async function ()
    {
        line = '1  '
        compare(belt.jumpDelta(line,0,1,['empty']),1)
        compare(belt.jumpDelta(line,1,1,['empty']),1)
        compare(belt.jumpDelta(line,2,1,['empty']),1)
        compare(belt.jumpDelta(line,3,1,['empty']),1)
        compare(belt.jumpDelta(line,4,1,['empty']),1)
        line = '    a = b ->  '
        compare(belt.jumpDelta(line,0,1,['ws']),4)
        compare(belt.jumpDelta(line,1,1,['ws']),3)
        compare(belt.jumpDelta(line,2,1,['ws']),2)
        compare(belt.jumpDelta(line,3,1,['ws']),1)
        compare(belt.jumpDelta(line,4,1,['ws']),1)
        compare(belt.jumpDelta(line,5,1,['ws']),1)
        compare(belt.jumpDelta(line,6,1,['ws']),1)
        compare(belt.jumpDelta(line,7,1,['ws']),1)
        compare(belt.jumpDelta(line,8,1,['ws']),1)
        compare(belt.jumpDelta(line,9,1,['ws']),1)
        compare(belt.jumpDelta(line,10,1,['ws']),1)
        compare(belt.jumpDelta(line,11,1,['ws']),1)
        compare(belt.jumpDelta(line,12,1,['ws']),2)
        line = '  ab += cd ;;  '
        compare(belt.jumpDelta(line,0,1,['word']),1)
        compare(belt.jumpDelta(line,1,1,['word']),1)
        compare(belt.jumpDelta(line,2,1,['word']),2)
        compare(belt.jumpDelta(line,3,1,['word']),1)
        compare(belt.jumpDelta(line,4,1,['word']),1)
        compare(belt.jumpDelta(line,5,1,['word']),1)
        compare(belt.jumpDelta(line,6,1,['word']),1)
        compare(belt.jumpDelta(line,7,1,['word']),1)
        compare(belt.jumpDelta(line,8,1,['word']),2)
        compare(belt.jumpDelta(line,9,1,['word']),1)
        compare(belt.jumpDelta(line,10,1,['word']),1)
        compare(belt.jumpDelta(line,11,1,['word']),1)
        compare(belt.jumpDelta(line,0,1,['punct']),1)
        compare(belt.jumpDelta(line,1,1,['punct']),1)
        compare(belt.jumpDelta(line,2,1,['punct']),1)
        compare(belt.jumpDelta(line,3,1,['punct']),1)
        compare(belt.jumpDelta(line,4,1,['punct']),1)
        compare(belt.jumpDelta(line,5,1,['punct']),2)
        compare(belt.jumpDelta(line,6,1,['punct']),1)
        compare(belt.jumpDelta(line,7,1,['punct']),1)
        compare(belt.jumpDelta(line,8,1,['punct']),1)
        compare(belt.jumpDelta(line,9,1,['punct']),1)
        compare(belt.jumpDelta(line,10,1,['punct']),1)
        compare(belt.jumpDelta(line,11,1,['punct']),2)
        compare(belt.jumpDelta(line,0,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,1,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,2,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,3,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,4,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,5,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,6,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,7,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,8,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,9,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,10,1,['ws','word','punct']),1)
        compare(belt.jumpDelta(line,11,1,['ws','word','punct']),2)
        compare(belt.jumpDelta(line,0,-1,['ws','word','punct']),0)
        compare(belt.jumpDelta(line,1,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,2,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,3,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,4,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,5,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,6,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,7,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,8,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,9,-1,['ws','word','punct']),-1)
        compare(belt.jumpDelta(line,10,-1,['ws','word','punct']),-2)
        compare(belt.jumpDelta(line,11,-1,['ws','word','punct']),-1)
        line = '  '
        compare(belt.jumpDelta(line,5,-1,['empty']),-3)
        compare(belt.jumpDelta(line,4,-1,['empty']),-2)
        compare(belt.jumpDelta(line,3,-1,['empty']),-1)
        compare(belt.jumpDelta(line,5,-1,['ws']),-1)
        compare(belt.jumpDelta(line,4,-1,['ws']),-1)
        compare(belt.jumpDelta(line,3,-1,['ws']),-1)
        compare(belt.jumpDelta(line,2,-1,['ws']),-2)
    })
    await section("isPosInsideRange", async function ()
    {
        compare(belt.isPosInsideRange([0,0],[0,0,1,0]),true)
        compare(belt.isPosInsideRange([1,0],[0,0,1,0]),true)
        compare(belt.isPosInsideRange([0,1],[0,0,1,0]),false)
        compare(belt.isPosInsideRange([7,1],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([7,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([5,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([10,2],[5,2,10,2]),true)
        compare(belt.isPosInsideRange([4,2],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([11,2],[5,2,10,2]),false)
        compare(belt.isPosInsideRange([7,3],[5,2,10,2]),false)
    })
    await section("rangeContainsRange", async function ()
    {
        compare(belt.rangeContainsRange([0,0,1,0],[0,0,0,0]),true)
        compare(belt.rangeContainsRange([0,0,1,0],[1,0,1,0]),true)
    })
    await section("normalizeRanges", async function ()
    {
        compare(belt.normalizeRanges([]),[])
        compare(belt.normalizeRanges([[0,1,3,4]]),[[0,1,3,4]])
        compare(belt.normalizeRanges([[0,4,3,1]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,1,0,4]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,4,2,4]]),[[2,4,3,4]])
        compare(belt.normalizeRanges([[0,0,9,9],[1,1,2,2]]),[[0,0,9,9],[1,1,2,2]])
        compare(belt.normalizeRanges([[1,1,2,2],[0,0,9,9]]),[[0,0,9,9],[1,1,2,2]])
    })
    await section("mergeLineRanges", async function ()
    {
        lines = ['1234567890','1234567890','1234567890']
        compare(belt.mergeLineRanges(lines,[[0,0,9,9],[1,1,2,2]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[1,1,2,2],[0,0,9,9],[0,0,10,0],[0,8,9,9]]),[[0,0,9,9]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[8,0,10,0]]),[[4,0,6,0],[8,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[7,0,10,0]]),[[4,0,6,0],[7,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[6,0,10,0]]),[[4,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,0,6,0],[5,0,10,0]]),[[4,0,10,0]])
        compare(belt.mergeLineRanges(lines,[[4,1,10,1],[0,2,4,2]]),[[4,1,4,2]])
    })
    await section("rangeOfClosestWordToPos", async function ()
    {
        lines = ['1 2  3   4','   ab ghij']
        compare(belt.rangeOfClosestWordToPos(lines,[0,0]),[0,0,1,0])
        compare(belt.rangeOfClosestWordToPos(lines,[1,0]),[0,0,1,0])
        compare(belt.rangeOfClosestWordToPos(lines,[2,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[3,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[4,0]),[2,0,3,0])
        compare(belt.rangeOfClosestWordToPos(lines,[5,0]),[5,0,6,0])
        compare(belt.rangeOfClosestWordToPos(lines,[0,1]),[3,1,5,1])
        compare(belt.rangeOfClosestWordToPos(lines,[5,1]),[3,1,5,1])
        compare(belt.rangeOfClosestWordToPos(lines,[6,1]),[6,1,10,1])
    })
    await section("rangeOfWordOrWhitespaceLeftToPos", async function ()
    {
        lines = ['1 2  3   4','   ab  ghij']
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[0,0]),undefined)
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[1,1]),[0,1,1,1])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(lines,[3,1]),[0,1,3,1])
        segls = kseg.segls(lines.join('\n'))
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[0,0]),undefined)
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,1]),[0,1,1,1])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[3,1]),[0,1,3,1])
        segls = kseg.segls('  🧑🌾  ab🌾cde')
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[1,0]),[0,0,1,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[2,0]),[0,0,2,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[3,0]),[2,0,3,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[4,0]),[2,0,3,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[5,0]),[3,0,4,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[6,0]),[3,0,4,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[7,0]),[4,0,5,0])
        compare(belt.rangeOfWordOrWhitespaceLeftToPos(segls,[8,0]),[4,0,6,0])
    })
    await section("chunkBeforePos", async function ()
    {
        segls = kseg.segls('\n1.4   x:z')
        compare(belt.chunkBeforePos(segls,[0,0]),'')
        compare(belt.chunkBeforePos(segls,[1,0]),'')
        compare(belt.chunkBeforePos(segls,[0,1]),'')
        compare(belt.chunkBeforePos(segls,[1,1]),'1')
        compare(belt.chunkBeforePos(segls,[3,1]),'1.4')
        compare(belt.chunkBeforePos(segls,[5,1]),'')
        compare(belt.chunkBeforePos(segls,[9,1]),'x:z')
    })
    await section("chunkAfterPos", async function ()
    {
        segls = kseg.segls('\n1.4   x:z')
        compare(belt.chunkAfterPos(segls,[0,0]),'')
        compare(belt.chunkAfterPos(segls,[1,0]),'')
        compare(belt.chunkAfterPos(segls,[0,1]),'1.4')
        compare(belt.chunkAfterPos(segls,[1,1]),'.4')
        compare(belt.chunkAfterPos(segls,[3,1]),'')
        compare(belt.chunkAfterPos(segls,[5,1]),'')
        compare(belt.chunkAfterPos(segls,[6,1]),'x:z')
        compare(belt.chunkAfterPos(segls,[7,1]),':z')
    })
    await section("isFullLineRange", async function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isFullLineRange(lines,[0,0,0,1]),true)
        compare(belt.isFullLineRange(lines,[0,0,0,0]),true)
        compare(belt.isFullLineRange(lines,[0,1,3,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,5,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,2,1]),false)
        compare(belt.isFullLineRange(lines,[1,1,3,1]),false)
    })
    await section("lineIndicesForRangesAndPositions", async function ()
    {
        compare(belt.lineIndicesForRangesAndPositions([],[[1,1],[1,2],[1,3]]),[1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,0,2,0]],[[1,1],[1,2],[1,3]]),[0,1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,1,2,2]],[[1,6],[1,5],[1,4]]),[1,2,4,5,6])
    })
    await section("linesIndicesForSpans", async function ()
    {
        compare(belt.lineIndicesForSpans([]),[])
        compare(belt.lineIndicesForSpans([[0,1,0]]),[1])
        compare(belt.lineIndicesForSpans([[0,1,0],[1,1,1]]),[1])
    })
    await section("blockRangesForRangesAndPositions", async function ()
    {
        lines = kseg.segls(`line 1
line 2`)
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[0,0],[0,1]]),[[0,0,6,1]])
        compare(belt.blockRangesForRangesAndPositions(lines,[[0,0,5,1]],[[0,0]]),[[0,0,6,1]])
        compare(belt.blockRangesForRangesAndPositions(lines,[[0,1,5,1]],[[0,0]]),[[0,0,6,1]])
        lines = kseg.segls(`line 1
line 2
line 3
line 4
line 5
line 6`)
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[1,1],[1,2],[1,3]]),[[0,1,6,3]])
        compare(belt.blockRangesForRangesAndPositions(lines,[],[[6,5],[4,3],[2,1]]),[[0,1,6,1],[0,3,6,3],[0,5,6,5]])
    })
    await section("isSpanLineRange", async function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isSpanLineRange(lines,[0,1,1,1]),true)
        compare(belt.isSpanLineRange(lines,[0,0,0,0]),false)
        compare(belt.isSpanLineRange(lines,[0,1,3,1]),false)
        compare(belt.isSpanLineRange(lines,[1,1,1,2]),false)
    })
    await section("isPosAfterSpan", async function ()
    {
        compare(belt.isPosAfterSpan([0,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([4,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([5,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([6,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([0,1],[1,0,5]),true)
    })
    await section("isPosBeforeSpan", async function ()
    {
        compare(belt.isPosBeforeSpan([0,0],[1,0,3]),true)
        compare(belt.isPosBeforeSpan([1,0],[1,0,3]),false)
        compare(belt.isPosBeforeSpan([3,1],[1,0,3]),false)
    })
    await section("isPosInsideSpan", async function ()
    {
        compare(belt.isPosInsideSpan([0,0],[1,0,3]),false)
        compare(belt.isPosInsideSpan([1,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([2,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([3,0],[1,0,3]),false)
    })
    await section("nextSpanAfterPos", async function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(belt.nextSpanAfterPos(spans,[4,0]),[6,0,8])
        compare(belt.nextSpanAfterPos(spans,[0,0]),[1,0,3])
        spans = [[0,21,11],[2,22,11],[5,23,11],[7,24,11]]
        compare(belt.nextSpanAfterPos(spans,[11,21]),[2,22,11])
        compare(belt.nextSpanAfterPos(spans,[11,22]),[5,23,11])
        compare(belt.nextSpanAfterPos(spans,[11,23]),[7,24,11])
        compare(belt.nextSpanAfterPos(spans,[11,24]),[0,21,11])
        spans = [[2,1,5],[2,2,5],[2,3,5]]
        compare(belt.nextSpanAfterPos(spans,[5,2]),[2,3,5])
        compare(belt.nextSpanAfterPos(spans,[5,3]),[2,1,5])
        compare(belt.nextSpanAfterPos(spans,[5,1]),[2,2,5])
        spans = [[1,4,3],[3,4,5]]
        compare(belt.nextSpanAfterPos(spans,[0,0]),[1,4,3])
        compare(belt.nextSpanAfterPos(spans,[3,4]),[3,4,5])
        compare(belt.nextSpanAfterPos(spans,[5,4]),[1,4,3])
    })
    await section("prevSpanBeforePos", async function ()
    {
        spans = [[1,0,3],[6,0,8],[2,1,5]]
        compare(belt.prevSpanBeforePos(spans,[0,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[1,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[2,0]),[2,1,5])
        compare(belt.prevSpanBeforePos(spans,[3,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[4,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[6,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[7,0]),[1,0,3])
        compare(belt.prevSpanBeforePos(spans,[9,0]),[6,0,8])
        compare(belt.prevSpanBeforePos(spans,[0,1]),[6,0,8])
    })
    await section("normalizePositions", async function ()
    {
        compare(belt.normalizePositions([[0,0],[1,0],[2,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[0,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[1,0]]),[[1,0],[2,0]])
        compare(belt.normalizePositions([[2,2],[3,3],[1,1]]),[[1,1],[2,2],[3,3]])
        compare(belt.normalizePositions([[2,2],[0,3],[11,1]]),[[11,1],[2,2],[0,3]])
    })
    await section("lineRangeAtPos", async function ()
    {
        lines = belt.seglsForText(`🌾🧑`)
        compare(belt.lineRangeAtPos(lines,[0,0]),[0,0,4,0])
    })
    await section("seglRangeAtPos", async function ()
    {
        lines = belt.seglsForText(`🧑🌾`)
        compare(belt.seglRangeAtPos(lines,[0,0]),[0,0,2,0])
    })
    await section("lineRangesInRange", async function ()
    {
        lines = belt.seglsForText(`1

12
abc`)
        compare(belt.lineRangesInRange(lines,[0,0,0,2]),[[0,0,1,0],[0,1,0,1],[0,2,2,2]])
    })
    await section("splitLineRanges", async function ()
    {
        lines = belt.linesForText(`1

12
abc`)
        compare(belt.splitLineRanges(lines,[[0,0,1,2]]),[[0,0,1,0],[0,1,0,1],[0,2,1,2]])
        compare(belt.splitLineRanges(lines,[[0,2,1,2],[2,2,3,2]]),[[0,2,1,2],[2,2,3,2]])
    })
    await section("seglsForText", async function ()
    {
        segls = belt.seglsForText(`123
456

abc
def`)
        compare(segls,[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
        await section("seglsForRange", async function ()
        {
            compare(belt.seglsForRange(segls,[0,0,3,4]),[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
            compare(belt.seglsForRange(segls,[0,0,0,0]),[[]])
            compare(belt.seglsForRange(segls,[0,0,1,0]),[['1']])
            compare(belt.seglsForRange(segls,[3,0,0,1]),[[],[]])
            compare(belt.seglsForRange(segls,[3,0,1,1]),[[],['4']])
        })
    })
    await section("rangesForLinesSplitAtPositions", async function ()
    {
        lines = belt.linesForText(`123
456

abc
def`)
        compare(belt.rangesForLinesSplitAtPositions(lines,[]),[])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,0]]),[[0,0,0,0],[0,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[1,0]]),[[0,0,1,0],[1,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,2]]),[[0,0,0,2],[0,2,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,0],[1,0]]),[[0,0,0,0],[0,0,1,0],[1,0,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[3,0],[3,1]]),[[0,0,3,0],[3,0,3,1],[3,1,3,4]])
        compare(belt.rangesForLinesSplitAtPositions(lines,[[0,5]]),[[0,0,3,4],[3,4,3,4]])
    })
    await section("rangesOfStringsInText", async function ()
    {
        compare(belt.rangesOfStringsInText("hello"),[])
        compare(belt.rangesOfStringsInText("he'll'o"),[[2,0,6,0]])
    })
    await section("widthOfLines", async function ()
    {
        text = "ｔｈｅ　ｑｕｉｃｋ　ｂｒｏｗｎ　ｆｏｘ　ｊｕｍｐｓ"
        lines = belt.linesForText(text)
        compare(belt.widthOfLines(lines),50)
    })
    await section("isRangeInString", async function ()
    {
        lines = belt.linesForText(`123
'456'

'abc'
def`)
        compare(belt.isRangeInString(lines,[0,0,0,0]),false)
        compare(belt.isRangeInString(lines,[0,2,0,2]),false)
        compare(belt.isRangeInString(lines,[0,3,0,3]),false)
        compare(belt.isRangeInString(lines,[1,3,5,3]),false)
        compare(belt.isRangeInString(lines,[1,1,1,1]),true)
        compare(belt.isRangeInString(lines,[1,3,2,3]),true)
        compare(belt.isRangeInString(lines,[1,3,3,3]),true)
        compare(belt.isRangeInString(lines,[1,3,4,3]),true)
    })
    await section("rangesOfPairsSurroundingPositions", async function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        pairs = [["'","'"],['"','"'],['#{','}'],['[',']'],['(',')']]
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfPairsSurroundingPositions(lines,pairs,posl),[[3,2,5,2],[2,3,5,3],[3,4,5,4]])
    })
    await section("rangesOfNestedPairsAtPositions", async function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfNestedPairsAtPositions(lines,posl),[[0,2,6,2],[0,3,6,3],[0,4,7,4],[1,4,6,4],[2,4,5,4],[3,4,4,4]])
    })
    await section("spansOfNestedPairsAtPositions", async function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.spansOfNestedPairsAtPositions(lines,posl),[[[0,2,1],[6,2,7],[0,3,1],[6,3,7],[0,4,1],[7,4,8],[1,4,2],[6,4,7],[2,4,3],[5,4,6],[3,4,4],[4,4,5]],[[0,4,1],[7,4,8],[1,4,2],[6,4,7],[2,4,3],[5,4,6],[3,4,4],[4,4,5]],[[0,2,1],[6,2,7],[0,3,1],[6,3,7]]])
    })
    lines = belt.linesForText(`[[{()}]]`)
    posl = [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]
    one = []
    var list1 = _k_.list(posl)
    for (var _b_ = 0; _b_ < list1.length; _b_++)
    {
        pos = list1[_b_]
        var _c_ = belt.spansOfNestedPairsAtPositions(lines,[pos]); sps = _c_[0]; brk = _c_[1]; strs = _c_[2]

        one = one.concat(sps)
    }
    var _d_ = belt.spansOfNestedPairsAtPositions(lines,posl); batched = _d_[0]; brk = _d_[1]; strs = _d_[2]

    compare(batched,one)
    one = []
    var list2 = _k_.list(posl)
    for (var _e_ = 0; _e_ < list2.length; _e_++)
    {
        pos = list2[_e_]
        rngs = belt.rangesOfNestedPairsAtPositions(lines,[pos])
        one = one.concat(rngs)
    }
    compare(belt.rangesOfNestedPairsAtPositions(lines,posl),one)
    compare(belt.spansOfNestedPairsAtPositions(lines,[[3,0]]),[[[0,0,1],[7,0,8],[1,0,2],[6,0,7],[2,0,3],[5,0,6],[3,0,4],[4,0,5]],[[0,0,1],[7,0,8],[1,0,2],[6,0,7],[2,0,3],[5,0,6],[3,0,4],[4,0,5]],[]])
    await section("openCloseSpansForPositions", async function ()
    {
        segls = kseg.segls(`[[{()}]]
'45""6'
'a{}c'`)
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[2,0,3],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[3,0]]),[[3,0,4],[4,0,5]])
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[[3,0,4],[4,0,5]])
        compare(belt.openCloseSpansForPositions(segls,[[5,0]]),[[2,0,3],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[[0,0,1],[7,0,8]])
        compare(belt.openCloseSpansForPositions(segls,[[0,1]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[6,1]]),[])
        compare(belt.stringDelimiterSpansForPositions(segls,[[0,1]]),[[0,1,1],[6,1,7]])
        compare(belt.stringDelimiterSpansForPositions(segls,[[6,1]]),[[0,1,1],[6,1,7]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[2,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[3,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.openCloseSpansForPositions(segls,[[4,2]])),[[2,2,3],[3,2,4]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[2,2]])),[[0,2,1],[5,2,6]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[3,2]])),[[0,2,1],[5,2,6]])
        compare(belt.normalizeSpans(belt.stringDelimiterSpansForPositions(segls,[[4,2]])),[[0,2,1],[5,2,6]])
        segls = kseg.segls(`next = lines[ap[1]][ap[0]]  `)
        compare(belt.openCloseSpansForPositions(segls,[[25,0]]),[[19,0,20],[25,0,26]])
        compare(belt.openCloseSpansForPositions(segls,[[26,0]]),[[19,0,20],[25,0,26]])
        segls = kseg.segls(`s[2]`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[[1,0,2],[3,0,4]])
        segls = kseg.segls(`x(日本)y`)
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[1,0,2],[6,0,7]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[])
        var _f_ = belt.spansOfNestedPairsAtPositions(segls,[[2,0]]); spans = _f_[0]; brackets = _f_[1]; strings = _f_[2]

        compare(spans,[[1,0,2],[6,0,7]])
        compare(brackets,[[1,0,2],[6,0,7]])
        compare(strings,[])
        compare(belt.rangesOfNestedPairsAtPositions(segls,[[2,0]]),[[1,0,6,0]])
        segls = kseg.segls(`(日本)`)
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[0,0,1],[5,0,6]])
        segls = kseg.segls(`(a)`)
        compare(belt.openCloseSpansForPositions(segls,[[20,0]]),[[0,0,1],[2,0,3]])
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[[0,0,1],[2,0,3]])
        segls = kseg.segls(`f(a,
  b,
  c)`)
        compare(belt.openCloseSpansForPositions(segls,[[2,0]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[2,2]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[40,0]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[40,2]]),[[1,0,2],[3,2,4]])
        compare(belt.openCloseSpansForPositions(segls,[[2,3]]),[])
        segls = kseg.segls(`foo(bar
baz
qux`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[4,2]]),[])
        segls = kseg.segls(`foo)bar
baz
qux`)
        compare(belt.openCloseSpansForPositions(segls,[[4,0]]),[])
        segls = kseg.segls(`foo
baz)
qux`)
        compare(belt.openCloseSpansForPositions(segls,[[3,1]]),[])
        segls = kseg.segls(`([)] x`)
        compare(belt.openCloseSpansForPositions(segls,[[1,0]]),[])
        compare(belt.openCloseSpansForPositions(segls,[[3,0]]),[])
        segls = kseg.segls(`((((((((((x))))))))))`)
        compare(belt.openCloseSpansForPositions(segls,[[10,0]]),[[9,0,10],[11,0,12]])
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[20,0,21]])
        compare(belt.openCloseSpansForPositions(segls,[[20,0]]),[[0,0,1],[20,0,21]])
        segls = kseg.segls(`(日本)a(日本)`)
        compare(belt.openCloseSpansForPositions(segls,[[0,0]]),[[0,0,1],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[[7,0,8],[12,0,13]])
        compare(belt.openCloseSpansForPositions(segls,[[8,0]]),[[7,0,8],[12,0,13]])
        segls = kseg.segls(`[a](b) c`)
        compare(belt.openCloseSpansForPositions(segls,[[6,0]]),[[3,0,4],[5,0,6]])
        compare(belt.openCloseSpansForPositions(segls,[[7,0]]),[])
    })
    await section("bracketIndex", async function ()
    {
        compare(belt.bracketIndex(kseg.segls('abc')),[])
        compare(belt.bracketIndex(kseg.segls('')),[])
        compare(belt.bracketIndex(kseg.segls('()[]{}')),[[0,0,'('],[0,1,')'],[0,2,'['],[0,3,']'],[0,4,'{'],[0,5,'}']])
        segls = kseg.segls(`ab(
日本]`)
        compare(belt.bracketIndex(segls),[[0,2,'('],[1,2,']']])
        compare(belt.bracketIndex(kseg.segls("'a(b'")),[[0,2,'(']])
    })
    await section("positionColumns", async function ()
    {
        compare(belt.positionColumns([[0,0],[0,1]]),[[[0,0],[0,1]]])
        compare(belt.positionColumns([[0,0],[0,1],[1,1]]),[[[0,0],[0,1]],[[1,1]]])
    })
    await section("indexOfExtremePositionInDirection", async function ()
    {
        posl = [[12,3],[4,4],[3,6],[10,6],[5,7],[13,8],[2,11]]
        compare(belt.indexOfExtremePositionInDirection(posl,'left'),6)
        compare(belt.indexOfExtremePositionInDirection(posl,'down'),6)
        compare(belt.indexOfExtremePositionInDirection(posl,'right'),5)
        compare(belt.indexOfExtremePositionInDirection(posl,'up'),0)
        posl = [[3,3],[3,4],[3,5]]
        compare(belt.indexOfExtremePositionInDirection(posl,'left',0),0)
        compare(belt.indexOfExtremePositionInDirection(posl,'left',1),1)
        compare(belt.indexOfExtremePositionInDirection(posl,'left',2),2)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',0),0)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',1),1)
        compare(belt.indexOfExtremePositionInDirection(posl,'right',2),2)
    })
}
toExport["tool belt"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9iZWx0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztRQWNRLElBQUksS0FBSyxhQUFhOzs7UUFNdEIsUUFBUSxLQUFLLGNBQWM7UUFFM0IsT0FBTyxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRTs0QkFDM0I7OztZQUFMO1lBQ0EsRUFBRSxLQUFLLE1BQU0sSUFBSSxFQUFFOztnQkFFdkIsTUFBTSxHQUFHLEdBQUcsSUFBTSxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQU0sSUFBSSxFQUFFO2dCQUN4QixNQUFNLEdBQUcsR0FBRztnQkFFWixLQUFLLGNBQWMsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFLLEVBQUUsRUFBRSxFQUFFO2dCQUMxQyxLQUFLLGNBQWMsTUFBTSxHQUFHLEdBQUcsRUFBRSxJQUFLLEVBQUUsRUFBRSxFQUFFO2dCQUU1QyxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTLElBQUksSUFBSSxJQUFJO2dCQUN2RSxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTO2dCQUMzRCxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLGNBQUs7O21CQUFNLEVBQUUsS0FBSztZQUFTLElBQUksSUFBSTtnQkFDbkUsS0FBSyxZQUFZLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxjQUFLOzttQkFBTSxFQUFFLEtBQUs7WUFBUyxJQUFJO2dCQUUvRCxLQUFLLG1CQUFtQixNQUFNLEVBQUUsR0FBRyxjQUFLOzttQkFBTSxFQUFFLEtBQUs7WUFBUyxJQUFJLElBQUksSUFBSTs7OztRQUkxRSxTQUFTLE1BQU0sS0FBSztnQkFFcEIsS0FBSyx1Q0FBdUMsTUFBTSxlQUFlLEVBQUUsSUFBSSxFQUFFLE1BQU8sRUFBRSxFQUFFLEVBQUU7Z0JBQ3RGLEtBQUssdUNBQXVDLE1BQU0sWUFBWSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7Ozs7UUFVN0gsT0FBTztnQkFFUCxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsVUFBVztnQkFDckMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLFVBQVc7Z0JBQ3JDLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxVQUFXO2dCQUNyQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsVUFBVztnQkFDckMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLFVBQVc7UUFFckMsT0FBTztnQkFFUCxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssR0FBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEdBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxHQUFHLEdBQUcsT0FBUztRQUVuQyxPQUFPO2dCQUVQLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxHQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLFNBQVc7Z0JBRXRDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxHQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLFVBQVk7Z0JBRXZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxHQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBRW5ELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBYTtnQkFDckQsS0FBSyxVQUFVLEtBQUssRUFBSSxJQUFJLEtBQUssT0FBTyxVQUFZO2dCQUNwRCxLQUFLLFVBQVUsS0FBSyxFQUFJLElBQUksS0FBSyxPQUFPLFVBQVk7Z0JBQ3BELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtnQkFDcEQsS0FBSyxVQUFVLEtBQUssRUFBSSxJQUFJLEtBQUssT0FBTyxVQUFZO2dCQUNwRCxLQUFLLFVBQVUsS0FBSyxFQUFJLElBQUksS0FBSyxPQUFPLFVBQVk7Z0JBQ3BELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtnQkFDcEQsS0FBSyxVQUFVLEtBQUssRUFBSSxJQUFJLEtBQUssT0FBTyxVQUFZO2dCQUNwRCxLQUFLLFVBQVUs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RSxJQUFJLEVBQUUsRUFBRTtnQkFDOUQsS0FBSywyQkFBMkIsUUFBUSxFQUFFLE9BQVEsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO2dCQUMvRCxLQUFLLDJCQUEyQixRQUFRLEVBQUUsT0FBUSxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUU7UUFNL0QsUUFBUSxLQUFLLE1BQU07Z0JBSW5CLEtBQUssMkJBQTJCLFFBQVEsRUFBRSxPQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRTtnQkFDOUQsS0FBSywyQkFBMkIsUUFBUSxFQUFFOzs7O2dCQUkxQyxLQUFLLGFBQWEsS0FBSyxNQUFNO2dCQUM3QixLQUFLLGFBQWEsS0FBSyxNQUFNO2dCQUM3QixLQUFLLGFBQWEsS0FBSyxNQUFNLGFBQ3hCLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtRQU0zRCxRQUFRLEtBQUssTUFBTTs7Z0JBS25CLEtBQUssYUFBYSxTQUNiLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFNbkIsS0FBSyxhQUFhLEtBQUssTUFBTSxZQUFhLEVBQUUsRUFBRTs7OztnQkFVOUMsS0FBSyxrQkFBMEIsRUFBRSxJQUFJLEVBQUUsUUFBUyxFQUFFLElBQUksRUFBRTtnQkFDeEQsS0FBSyxrQkFBMEIsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFOzs7O1FBSXRFLFNBQVMsR0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBSSxHQUFHLElBQUksRUFBRTtnQkFDbEQsS0FBSyxrQ0FBa0MsS0FBSyxRQUFVO2dCQUN0RCxLQUFLLGtDQUFrQyxLQUFLLFFBQVU7Z0JBQ3RELEtBQUssa0NBQWtDLEtBQUssU0FBVTtnQkFDdEQsS0FBSyxrQ0FBa0MsS0FBSyxNQUFVO1FBRXRELFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO2dCQUN2QixLQUFLLGtDQUFrQyxLQUFLLE9BQU8sR0FBSTtnQkFDdkQsS0FBSyxrQ0FBa0MsS0FBSyxPQUFPLEdBQUk7Z0JBQ3ZELEtBQUssa0NBQWtDLEtBQUssT0FBTyxHQUFJO2dCQUV2RCxLQUFLLGtDQUFrQyxLQUFLLFFBQVEsR0FBSTtnQkFDeEQsS0FBSyxrQ0FBa0MsS0FBSyxRQUFRLEdBQUk7Z0JBQ3hELEtBQUssa0NBQWtDLEtBQUssUUFBUSxHQUFJIn0=
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/belt.kode
