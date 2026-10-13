var toExport = {}
var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var batched, brackets, brk, c, cells, l, line, lines, one, pairs, pos, posl, rect, rngs, segls, spans, sps, strings, strs, text

import kxk from "../../kxk.js"
let kseg = kxk.kseg
let immutable = kxk.immutable

import belt from "../edit/tool/belt.js"

toExport["tool belt"] = function ()
{
    section("cells", function ()
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
    section("extendLineRangesToPosition", function ()
    {
        lines = ['123','45','6']
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([]),[0,0],[0,2]),[[0,0,0,2]])
        compare(belt.extendLineRangesFromPositionToPosition(lines,immutable([[0,0,1,0],[2,0,3,0]]),[1,1],[0,2]),[[0,0,1,0],[2,0,3,0],[1,1,0,2]])
    })
    section("jumpDelta", function ()
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
    section("isPosInsideRange", function ()
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
    section("rangeContainsRange", function ()
    {
        compare(belt.rangeContainsRange([0,0,1,0],[0,0,0,0]),true)
        compare(belt.rangeContainsRange([0,0,1,0],[1,0,1,0]),true)
    })
    section("normalizeRanges", function ()
    {
        compare(belt.normalizeRanges([]),[])
        compare(belt.normalizeRanges([[0,1,3,4]]),[[0,1,3,4]])
        compare(belt.normalizeRanges([[0,4,3,1]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,1,0,4]]),[[3,1,0,4]])
        compare(belt.normalizeRanges([[3,4,2,4]]),[[2,4,3,4]])
        compare(belt.normalizeRanges([[0,0,9,9],[1,1,2,2]]),[[0,0,9,9],[1,1,2,2]])
        compare(belt.normalizeRanges([[1,1,2,2],[0,0,9,9]]),[[0,0,9,9],[1,1,2,2]])
    })
    section("mergeLineRanges", function ()
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
    section("rangeOfClosestWordToPos", function ()
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
    section("rangeOfWordOrWhitespaceLeftToPos", function ()
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
    section("chunkBeforePos", function ()
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
    section("chunkAfterPos", function ()
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
    section("isFullLineRange", function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isFullLineRange(lines,[0,0,0,1]),true)
        compare(belt.isFullLineRange(lines,[0,0,0,0]),true)
        compare(belt.isFullLineRange(lines,[0,1,3,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,5,1]),true)
        compare(belt.isFullLineRange(lines,[0,1,2,1]),false)
        compare(belt.isFullLineRange(lines,[1,1,3,1]),false)
    })
    section("lineIndicesForRangesAndPositions", function ()
    {
        compare(belt.lineIndicesForRangesAndPositions([],[[1,1],[1,2],[1,3]]),[1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,0,2,0]],[[1,1],[1,2],[1,3]]),[0,1,2,3])
        compare(belt.lineIndicesForRangesAndPositions([[0,1,2,2]],[[1,6],[1,5],[1,4]]),[1,2,4,5,6])
    })
    section("linesIndicesForSpans", function ()
    {
        compare(belt.lineIndicesForSpans([]),[])
        compare(belt.lineIndicesForSpans([[0,1,0]]),[1])
        compare(belt.lineIndicesForSpans([[0,1,0],[1,1,1]]),[1])
    })
    section("blockRangesForRangesAndPositions", function ()
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
    section("isSpanLineRange", function ()
    {
        lines = ['','124','abcdef']
        compare(belt.isSpanLineRange(lines,[0,1,1,1]),true)
        compare(belt.isSpanLineRange(lines,[0,0,0,0]),false)
        compare(belt.isSpanLineRange(lines,[0,1,3,1]),false)
        compare(belt.isSpanLineRange(lines,[1,1,1,2]),false)
    })
    section("isPosAfterSpan", function ()
    {
        compare(belt.isPosAfterSpan([0,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([4,0],[1,0,5]),false)
        compare(belt.isPosAfterSpan([5,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([6,0],[1,0,5]),true)
        compare(belt.isPosAfterSpan([0,1],[1,0,5]),true)
    })
    section("isPosBeforeSpan", function ()
    {
        compare(belt.isPosBeforeSpan([0,0],[1,0,3]),true)
        compare(belt.isPosBeforeSpan([1,0],[1,0,3]),false)
        compare(belt.isPosBeforeSpan([3,1],[1,0,3]),false)
    })
    section("isPosInsideSpan", function ()
    {
        compare(belt.isPosInsideSpan([0,0],[1,0,3]),false)
        compare(belt.isPosInsideSpan([1,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([2,0],[1,0,3]),true)
        compare(belt.isPosInsideSpan([3,0],[1,0,3]),false)
    })
    section("nextSpanAfterPos", function ()
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
    section("prevSpanBeforePos", function ()
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
    section("normalizePositions", function ()
    {
        compare(belt.normalizePositions([[0,0],[1,0],[2,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[0,0]]),[[0,0],[1,0],[2,0]])
        compare(belt.normalizePositions([[1,0],[2,0],[1,0]]),[[1,0],[2,0]])
        compare(belt.normalizePositions([[2,2],[3,3],[1,1]]),[[1,1],[2,2],[3,3]])
        compare(belt.normalizePositions([[2,2],[0,3],[11,1]]),[[11,1],[2,2],[0,3]])
    })
    section("lineRangeAtPos", function ()
    {
        lines = belt.seglsForText(`🌾🧑`)
        compare(belt.lineRangeAtPos(lines,[0,0]),[0,0,4,0])
    })
    section("seglRangeAtPos", function ()
    {
        lines = belt.seglsForText(`🧑🌾`)
        compare(belt.seglRangeAtPos(lines,[0,0]),[0,0,2,0])
    })
    section("lineRangesInRange", function ()
    {
        lines = belt.seglsForText(`1

12
abc`)
        compare(belt.lineRangesInRange(lines,[0,0,0,2]),[[0,0,1,0],[0,1,0,1],[0,2,2,2]])
    })
    section("splitLineRanges", function ()
    {
        lines = belt.linesForText(`1

12
abc`)
        compare(belt.splitLineRanges(lines,[[0,0,1,2]]),[[0,0,1,0],[0,1,0,1],[0,2,1,2]])
        compare(belt.splitLineRanges(lines,[[0,2,1,2],[2,2,3,2]]),[[0,2,1,2],[2,2,3,2]])
    })
    section("seglsForText", function ()
    {
        segls = belt.seglsForText(`123
456

abc
def`)
        compare(segls,[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
        section("seglsForRange", function ()
        {
            compare(belt.seglsForRange(segls,[0,0,3,4]),[['1','2','3'],['4','5','6'],[],['a','b','c'],['d','e','f']])
            compare(belt.seglsForRange(segls,[0,0,0,0]),[[]])
            compare(belt.seglsForRange(segls,[0,0,1,0]),[['1']])
            compare(belt.seglsForRange(segls,[3,0,0,1]),[[],[]])
            compare(belt.seglsForRange(segls,[3,0,1,1]),[[],['4']])
        })
    })
    section("rangesForLinesSplitAtPositions", function ()
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
    section("rangesOfStringsInText", function ()
    {
        compare(belt.rangesOfStringsInText("hello"),[])
        compare(belt.rangesOfStringsInText("he'll'o"),[[2,0,6,0]])
    })
    section("widthOfLines", function ()
    {
        text = "ｔｈｅ　ｑｕｉｃｋ　ｂｒｏｗｎ　ｆｏｘ　ｊｕｍｐｓ"
        lines = belt.linesForText(text)
        compare(belt.widthOfLines(lines),50)
    })
    section("isRangeInString", function ()
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
    section("rangesOfPairsSurroundingPositions", function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        pairs = [["'","'"],['"','"'],['#{','}'],['[',']'],['(',')']]
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfPairsSurroundingPositions(lines,pairs,posl),[[3,2,5,2],[2,3,5,3],[3,4,5,4]])
    })
    section("rangesOfNestedPairsAtPositions", function ()
    {
        lines = belt.linesForText(`01234567

'45""6'
'a#\{\}c'
[[{()}]]`)
        posl = [[4,0],[4,1],[4,2],[4,3],[4,4]]
        compare(belt.rangesOfNestedPairsAtPositions(lines,posl),[[0,2,6,2],[0,3,6,3],[0,4,7,4],[1,4,6,4],[2,4,5,4],[3,4,4,4]])
    })
    section("spansOfNestedPairsAtPositions", function ()
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
    section("openCloseSpansForPositions", function ()
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
    section("bracketIndex", function ()
    {
        compare(belt.bracketIndex(kseg.segls('abc')),[])
        compare(belt.bracketIndex(kseg.segls('')),[])
        compare(belt.bracketIndex(kseg.segls('()[]{}')),[[0,0,'('],[0,1,')'],[0,2,'['],[0,3,']'],[0,4,'{'],[0,5,'}']])
        segls = kseg.segls(`ab(
日本]`)
        compare(belt.bracketIndex(segls),[[0,2,'('],[1,2,']']])
        compare(belt.bracketIndex(kseg.segls("'a(b'")),[[0,2,'(']])
    })
    section("positionColumns", function ()
    {
        compare(belt.positionColumns([[0,0],[0,1]]),[[[0,0],[0,1]]])
        compare(belt.positionColumns([[0,0],[0,1],[1,1]]),[[[0,0],[0,1]],[[1,1]]])
    })
    section("indexOfExtremePositionInDirection", function ()
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


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVsdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4va29kZS9rZWQvdGVzdC9iZWx0LmtvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztRQWNRLElBQUksS0FBSyxhQUFhOzs7UUFNdEIsUUFBUSxLQUFLLGNBQWM7UUFFM0IsT0FBTyxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRTs0QkFDM0I7Ozs7WUFDTCxFQUFFLEtBQUssTUFBTSxJQUFJLEVBQUU7O2dCQUV2QixNQUFNLEdBQUcsR0FBRyxJQUFNLElBQUksRUFBRTtnQkFDeEIsTUFBTSxHQUFHLEdBQUcsSUFBTSxJQUFJLEVBQUU7Z0JBQ3hCLE1BQU0sR0FBRyxHQUFHO2dCQUVaLEtBQUssY0FBYyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQzFDLEtBQUssY0FBYyxNQUFNLEdBQUcsR0FBRyxFQUFFLElBQUssRUFBRSxFQUFFLEVBQUU7Z0JBRTVDLEtBQUssWUFBWSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUc7O21CQUFXLEVBQUUsS0FBSztZQUFTLElBQUksSUFBSSxJQUFJO2dCQUN2RSxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHOzttQkFBVyxFQUFFLEtBQUs7WUFBUztnQkFDM0QsS0FBSyxZQUFZLE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRzs7bUJBQVcsRUFBRSxLQUFLO1lBQVMsSUFBSSxJQUFJO2dCQUNuRSxLQUFLLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHOzttQkFBVyxFQUFFLEtBQUs7WUFBUyxJQUFJO2dCQUUvRCxLQUFLLG1CQUFtQixNQUFNLEVBQUUsR0FBRzs7bUJBQVcsRUFBRSxLQUFLO1lBQVMsSUFBSSxJQUFJLElBQUk7Ozs7UUFJMUUsU0FBUyxNQUFNLEtBQUs7Z0JBRXBCLEtBQUssdUNBQXVDLE1BQU0sZUFBZSxFQUFFLElBQUksRUFBRSxNQUFPLEVBQUUsRUFBRSxFQUFFO2dCQUN0RixLQUFLLHVDQUF1QyxNQUFNLFlBQVksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFOzs7O1FBVTdILE9BQU87Z0JBRVAsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLFVBQVc7Z0JBQ3JDLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxVQUFXO2dCQUNyQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsVUFBVztnQkFDckMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLFVBQVc7Z0JBQ3JDLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxVQUFXO1FBRXJDLE9BQU87Z0JBRVAsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEVBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxFQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssRUFBRyxHQUFHLE9BQVM7Z0JBQ25DLEtBQUssVUFBVSxLQUFLLEdBQUcsR0FBRyxPQUFTO2dCQUNuQyxLQUFLLFVBQVUsS0FBSyxHQUFHLEdBQUcsT0FBUztnQkFDbkMsS0FBSyxVQUFVLEtBQUssR0FBRyxHQUFHLE9BQVM7UUFFbkMsT0FBTztnQkFFUCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxTQUFXO2dCQUN0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsU0FBVztnQkFDdEMsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLFNBQVc7Z0JBQ3RDLEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxTQUFXO2dCQUV0QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxVQUFZO2dCQUN2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsVUFBWTtnQkFDdkMsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLFVBQVk7Z0JBQ3ZDLEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxVQUFZO2dCQUV2QyxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEVBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssRUFBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUNuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLEdBQUcsS0FBSyxPQUFPLFVBQVk7Z0JBQ25ELEtBQUssVUFBVSxLQUFLLEdBQUksR0FBRyxLQUFLLE9BQU8sVUFBWTtnQkFDbkQsS0FBSyxVQUFVLEtBQUssR0FBSSxHQUFHLEtBQUssT0FBTyxVQUFZO2dCQUVuRCxLQUFLLFVBQVUsS0FBSyxFQUFJLElBQUksS0FBSyxPQUFPLFVBQWE7Z0JBQ3JELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtnQkFDcEQsS0FBSyxVQUFVLEtBQUssRUFBSSxJQUFJLEtBQUssT0FBTyxVQUFZO2dCQUNwRCxLQUFLLFVBQVUsS0FBSyxFQUFJLElBQUksS0FBSyxPQUFPLFVBQVk7Z0JBQ3BELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtnQkFDcEQsS0FBSyxVQUFVLEtBQUssRUFBSSxJQUFJLEtBQUssT0FBTyxVQUFZO2dCQUNwRCxLQUFLLFVBQVUsS0FBSyxFQUFJLElBQUksS0FBSyxPQUFPLFVBQVk7Z0JBQ3BELEtBQUssVUFBVSxLQUFLLEVBQUksSUFBSSxLQUFLLE9BQU8sVUFBWTtnQkFDcEQsS0FBSyxVQUFVLEtBQUssRUFBSSxJQUFJLEtBQUssT0FBTyxVQUFZ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QVEsRUFBRSxPQUFRLEVBQUUsRUFBRSxJQUFJLEdBQUcsRUFBRTtnQkFDL0QsS0FBSywyQkFBMkIsUUFBUSxFQUFFLE9BQVEsRUFBRSxFQUFFLElBQUksR0FBRyxFQUFFO1FBTS9ELFFBQVEsS0FBSyxNQUFNO2dCQUluQixLQUFLLDJCQUEyQixRQUFRLEVBQUUsT0FBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUU7Z0JBQzlELEtBQUssMkJBQTJCLFFBQVEsRUFBRTs7OztnQkFJMUMsS0FBSyxhQUFhLEtBQUssTUFBTTtnQkFDN0IsS0FBSyxhQUFhLEtBQUssTUFBTTtnQkFDN0IsS0FBSyxhQUFhLEtBQUssTUFBTSxhQUN4QixFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFNM0QsUUFBUSxLQUFLLE1BQU07O2dCQUtuQixLQUFLLGFBQWEsU0FDYixFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBTW5CLEtBQUssYUFBYSxLQUFLLE1BQU0sWUFBYSxFQUFFLEVBQUU7Ozs7Z0JBVTlDLEtBQUssa0JBQTBCLEVBQUUsSUFBSSxFQUFFLFFBQVMsRUFBRSxJQUFJLEVBQUU7Z0JBQ3hELEtBQUssa0JBQTBCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTs7OztRQUl0RSxTQUFTLEdBQUcsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUU7Z0JBQ2xELEtBQUssa0NBQWtDLEtBQUssUUFBVTtnQkFDdEQsS0FBSyxrQ0FBa0MsS0FBSyxRQUFVO2dCQUN0RCxLQUFLLGtDQUFrQyxLQUFLLFNBQVU7Z0JBQ3RELEtBQUssa0NBQWtDLEtBQUssTUFBVTtRQUV0RCxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtnQkFDdkIsS0FBSyxrQ0FBa0MsS0FBSyxPQUFPLEdBQUk7Z0JBQ3ZELEtBQUssa0NBQWtDLEtBQUssT0FBTyxHQUFJO2dCQUN2RCxLQUFLLGtDQUFrQyxLQUFLLE9BQU8sR0FBSTtnQkFFdkQsS0FBSyxrQ0FBa0MsS0FBSyxRQUFRLEdBQUk7Z0JBQ3hELEtBQUssa0NBQWtDLEtBQUssUUFBUSxHQUFJO2dCQUN4RCxLQUFLLGtDQUFrQyxLQUFLLFFBQVEsR0FBSSJ9
//# sourceURL=file://kode/ked/test/belt.kode
