var toExport = {}
var all, before, c, cols, copied, e, h, m, mk, s, u, x, y0, y1

import clip from "../../kxk/clip.js"
import kseg from "../../kxk/kseg.js"
import post from "../../kxk/post.js"

import detector from "../util/detector.js"
import harness from "../util/harness.js"

import editor from "../edit/editor.js"
import specs from "../edit/specs.js"

import matrix from "../view/base/matrix.js"

import uniko from "../view/colmns/uniko.js"

import clippo from "../view/menu/clippo.js"

import theme from "../theme/theme.js"


mk = function (history, current)
{
    var c, e, h, opt

    h = new harness({cols:80,rows:20})
    e = new editor(h.screen,'editor',[])
    e.cells.layout(0,0,80,20)
    e.state.loadLines(['start'])
    e.state.setMainCursor(0,0)
    opt = {watch:false,readClipboard:(function ()
    {
        return current
    })}
    c = new clippo(h.screen,e,'clippo',opt)
    c.history = history
    return [h,e,c]
}
toExport["clippo"] = async function ()
{
    await section("the current clipboard text is first and selected", async function ()
    {
        var _a_ = mk(['older','oldest'],'current'); h = _a_[0]; e = _a_[1]; c = _a_[2]

        c.show()
        compare(c.history,['current','older','oldest'])
        compare(c.choices.currentIndex(),0)
        compare(c.choices.hasFocus(),true)
        compare(c.choices.state.s.selections,[])
    })
    await section("a repeated clipboard text moves to the top", async function ()
    {
        var _b_ = mk(['old','current'],'current'); h = _b_[0]; e = _b_[1]; c = _b_[2]

        c.show()
        compare(c.history,['current','old'])
    })
    await section("history entries start with a divider line", async function ()
    {
        var _c_ = mk(['one\ntwo','old'],'new'); h = _c_[0]; e = _c_[1]; c = _c_[2]

        c.show()
        compare(c.choices.state.s.lines.map(function (line)
        {
            return kseg.str(line)
        }),['','new','','one','two','','old'])
        compare(c.dividerRows,[0,2,5])
        compare(c.entryStart,[0,2,5])
    })
    await section("history entries use the detected language for highlighting", async function ()
    {
        var _d_ = mk(['const greet = (name) => name',"use ../../kxk ▪ post"],'current'); h = _d_[0]; e = _d_[1]; c = _d_[2]

        c.show()
        compare(c.choices.state.syntax.getClasses(3)[0],'keyword')
    })
    await section("the selected divider is blue with a yellow circle", async function ()
    {
        var _e_ = mk(['new','old'],'new'); h = _e_[0]; e = _e_[1]; c = _e_[2]

        c.show()
        c.draw()
        y0 = c.choices.cells.y - c.choices.state.s.view[1] + c.entryStart[0]
        y1 = c.choices.cells.y - c.choices.state.s.view[1] + c.entryStart[1]
        x = c.choices.cells.x
        compare(h.screen.get_fg(x,y0),theme.cursor.main)
        compare(h.screen.get_fg(x + 2,y0),theme.selection.span)
        compare(h.screen.get_fg(x + 2,y1),theme.finder.frame)
        h.key(c,'down')
        c.draw()
        compare(h.screen.get_fg(x,y0),theme.finder.frame)
        compare(h.screen.get_fg(x + 2,y0),theme.finder.frame)
        compare(h.screen.get_fg(x,y1),theme.cursor.main)
        compare(h.screen.get_fg(x + 2,y1),theme.selection.span)
    })
    await section("down and up move between entries", async function ()
    {
        var _f_ = mk(['new','middle','old'],'new'); h = _f_[0]; e = _f_[1]; c = _f_[2]

        c.show()
        h.key(c,'down')
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'up')
        compare(c.choices.currentIndex(),c.entryStart[0])
        h.key(c,'alt+.')
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'alt+.')
        compare(c.choices.currentIndex(),c.entryStart[2])
        h.key(c,'alt+,')
        compare(c.choices.currentIndex(),c.entryStart[1])
    })
    await section("tab moves the focus between input and history", async function ()
    {
        var _10_ = mk(['one'],'one'); h = _10_[0]; e = _10_[1]; c = _10_[2]

        c.show()
        compare(c.choices.hasFocus(),true)
        h.key(c,'tab')
        compare(c.input.hasFocus(),true)
        h.key(c,'tab')
        compare(c.choices.hasFocus(),true)
    })
    await section("typing highlights matches and down and up select them", async function ()
    {
        var _11_ = mk(['alpha','beta','alphabet'],'gamma'); h = _11_[0]; e = _11_[1]; c = _11_[2]

        c.show()
        h.key(c,'tab')
        h.type(c,'alpha')
        compare(c.matchEntries,[1,3])
        compare(c.choices.currentIndex(),c.entryStart[1])
        h.key(c,'down')
        compare(c.choices.currentIndex(),c.entryStart[3])
        h.key(c,'up')
        compare(c.choices.currentIndex(),c.entryStart[1])
    })
    await section("return inserts the selected entry and closes", async function ()
    {
        var _12_ = mk(['hello'],'hello'); h = _12_[0]; e = _12_[1]; c = _12_[2]

        c.show()
        h.key(c,'return')
        compare(c.hidden(),true)
        compare(kseg.str(e.state.s.lines),'hellostart')
        compare(e.hasFocus(),true)
    })
    await section("space inserts the selected entry without closing", async function ()
    {
        var _13_ = mk(['hello'],'hello'); h = _13_[0]; e = _13_[1]; c = _13_[2]

        c.show()
        h.key(c,'space')
        compare(c.hidden(),false)
        compare(kseg.str(e.state.s.lines),'hellostart')
    })
    await section("return inserts the entry containing the selected match", async function ()
    {
        var _14_ = mk(['alpha','beta','alphabet'],'gamma'); h = _14_[0]; e = _14_[1]; c = _14_[2]

        c.show()
        h.key(c,'tab')
        h.type(c,'alpha')
        h.key(c,'down')
        h.key(c,'return')
        compare(c.hidden(),true)
        compare(kseg.str(e.state.s.lines),'alphabetstart')
    })
}
toExport["clippo"]._section_ = true
toExport["detector"] = async function ()
{
    await section("the language of a snippet is detected", async function ()
    {
        compare(detector.detectExt(''),'kode')
        compare(detector.detectExt('ordinary words only'),'kode')
        compare(detector.detectExt('{\n  "name": "kodi",\n  "ok": true\n}'),'json')
        compare(detector.detectExt("log 'hello'"),'kode')
        compare(detector.detectExt("use ../../kxk ▪ post\nlog 'hi'"),'kode')
        compare(detector.detectExt('function foo() { const x = 1; return x; }'),'js')
        compare(detector.detectExt('async function load() { await fetch(url) }'),'js')
        compare(detector.detectExt('const greet = (name) => console.log(name)'),'js')
        compare(detector.detectExt('function f() {\n  return 1;\n}'),'js')
        compare(detector.detectExt('console.log("hi")'),'js')
        compare(detector.detectExt('interface Foo { readonly name: string }'),'ts')
        compare(detector.detectExt('const x: number = 1'),'ts')
        compare(detector.detectExt('def greet(name):\n    print(name)'),'py')
        compare(detector.detectExt('class Foo:\n    def __init__(self):\n        self.x = 1'),'py')
        compare(detector.detectExt('for f in *.txt; do cat "$f"; done'),'sh')
        compare(detector.detectExt('#!/bin/bash\necho "$HOME" | grep home'),'sh')
        compare(detector.detectExt('#!/usr/bin/fish\nset x 1'),'fish')
        compare(detector.detectExt('pub fn main() void { var x: u32 = 1; }'),'zig')
        compare(detector.detectExt('const std = @import("std");'),'zig')
        compare(detector.detectExt('#include <stdio.h>\nint main(void) { return 0; }'),'c')
        compare(detector.detectExt('template <typename T>\nclass Foo { public: T x; };'),'cpp')
        compare(detector.detectExt('@interface Foo : NSObject\n@end'),'mm')
        compare(detector.detectExt('proc greet(name: string): string =\n  echo name'),'nim')
        compare(detector.detectExt('func greet(name: String) -> String { return name }'),'swift')
        compare(detector.detectExt('using System;\nclass Program { static void Main() { Console.WriteLine("hi"); } }'),'cs')
        compare(detector.detectExt('local x = 1\nprint(x)'),'lua')
        compare(detector.detectExt('function foo()\n  return 1\nend'),'lua')
        compare(detector.detectExt('unless x then y else z'),'coffee')
        compare(detector.detectExt('x = -> 42'),'coffee')
        compare(detector.detectExt('<div class="foo">hello</div>'),'html')
        compare(detector.detectExt('<!DOCTYPE html>\n<html><body><p>hi</p></body></html>'),'html')
        compare(detector.detectExt('body { color: #fff; margin: 0; }'),'css')
        compare(detector.detectExt('body\n  color #fff\n  margin 0'),'styl')
        compare(detector.detectExt('$color: red;\n.foo { color: $color; }'),'scss')
        compare(detector.detectExt('<svg viewBox="0 0 10 10"><circle r="4"/></svg>'),'svg')
        compare(detector.detectExt('# heading\nsome **bold** text'),'md')
        compare(detector.detectExt('name: foo\nitems:\n  - a\n  - b'),'yml')
        compare(detector.detectExt('[user]\n\tname = Foo\n\temail = a@b.c'),'ini')
        compare(detector.detectExt('key = value'),'ini')
        compare(detector.detectExt('<?xml version="1.0"?><plist><dict><key>a</key></dict></plist>'),'plist')
        compare(detector.detectExt('file     = dirent.name'),'kode')
        compare(detector.detectExt('this["onFileChange"] = this["onFileChange"].bind(this)'),'js')
        compare(detector.detectExt('let slash = kxk.slash'),'js')
        compare(detector.detectExt('let kstr = kxk.kstr'),'js')
        compare(detector.detectExt('GtkWidget* window = nullptr;'),'cpp')
        compare(detector.detectExt('static JsonNode* node_null ()\n{\n    return json_node_new(JSON_NODE_NULL);\n}'),'cpp')
        compare(detector.detectExt('return json_node_new(JSON_NODE_NULL);'),'cpp')
        compare(detector.detectExt('return foo();'),'kode')
        compare(detector.detectExt('{'),'kode')
    })
}
toExport["detector"]._section_ = true
toExport["uniko"] = async function ()
{
    await section("comments are searchable and the match is case insensitive", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('GREEK')
        compare(u.matrix.numItems() > 0,true)
    })
    await section("an empty search shows the whole list again", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        all = u.matrix.numItems()
        u.filter('sqrt')
        u.filter('')
        compare(u.matrix.numItems(),all)
    })
    await section("the matrix starts focused and typing moves the focus to the input", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        compare(u.focus,'matrix')
        compare(u.matrix.selectedIndex,0)
        h.key(u,'s','s')
        compare(u.focus,'input')
        compare(u.input.current(),'s')
    })
    await section("return inserts the selected character at the cursors but keeps the picker open", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('sqrt')
        h.key(u,'return','')
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'matrix')
        compare(e.hasFocus(),false)
    })
    await section("space inserts the selected character and keeps the matrix focused", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        u.filter('sqrt')
        h.key(u,'space',' ')
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'matrix')
        compare(e.hasFocus(),false)
    })
    await section("a mouse click inserts the clicked character and keeps the matrix focused", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,14)
        u.show()
        u.filter('sqrt')
        u.onMouse({type:'press',cell:[2,3],button:'left',count:1})
        compare(kseg.str(e.state.s.lines[0]),'a√bc')
        compare(u.hidden(),false)
        compare(u.focus,'matrix')
        compare(e.hasFocus(),false)
    })
    await section("copy writes the selected character to the clipboard", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        copied = []
        before = clip.copy
        clip.copy = function (text)
        {
            return copied.push(text)
        }
        u.filter('sqrt')
        h.key(u,'cmd+c','')
        compare(copied,['√'])
        compare(u.hidden(),false)
        clip.copy = before
    })
    await section("escape closes without a change and gives the focus back", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        e.state.loadLines(['abc'])
        e.state.setMainCursor(1,0)
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        h.key(u,'esc','')
        compare(kseg.str(e.state.s.lines[0]),'abc')
        compare(u.hidden(),true)
        compare(e.hasFocus(),true)
    })
    await section("scale change", async function ()
    {
        h = new harness({cols:60,rows:30})
        e = new editor(h.screen,'test_editor',[])
        u = new uniko(h.screen,e,'test_uniko')
        u.layout(0,0,60,16)
        u.show()
        compare(u.matrix.scale,2)
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+up','')
        h.key(u,'cmd+up','')
        compare(u.matrix.scale,3)
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,2)
        h.key(u,'cmd+down','')
        h.key(u,'cmd+down','')
        compare(u.matrix.scale,1)
    })
}
toExport["uniko"]._section_ = true
toExport["matrix"] = async function ()
{
    await section("selection moves through the items in reading order", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedText(),'a')
        compare(m.moveSelection('right'),true)
        compare(m.selectedText(),'b')
        cols = m.columns()
        m.setItems(['a','b','c','d','e','f','g','h','i','j','k','l'])
        compare(m.selectedIndex,0)
        compare(m.moveSelection('down'),true)
        compare(m.selectedIndex,cols)
    })
    await section("left at the first item stays put", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('left'),false)
        compare(m.selectedIndex,0)
    })
    await section("up in the first row stays put", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        m.setItems(['a','b','c'])
        compare(m.moveSelection('up'),false)
        compare(m.selectedIndex,0)
    })
    await section("the matrix knows whether it has the focus", async function ()
    {
        h = new harness({cols:10,rows:5})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,10,5)
        compare(!m.hasFocus(),true)
        h.focus(m)
        compare(m.hasFocus(),true)
        post.emit('focus','somewhere_else')
        compare(!m.hasFocus(),true)
    })
    await section("a larger scale uses more cell rows per logical row", async function ()
    {
        h = new harness({cols:20,rows:20})
        m = new matrix(h.screen,'test_matrix')
        m.layout(0,0,20,20)
        compare(m.scale,2)
        compare(m.viewportRows(),10)
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,4),[0,1])
        m.incScale(1)
        compare(m.scale,3)
        compare(m.viewportRows(),6)
        compare(m.cellAtPos(3,3),[0,1])
        m.incScale(-1)
        m.incScale(-1)
        compare(m.scale,1)
        compare(m.viewportRows(),20)
    })
    await section("scaled cells and the selection line up at every scale", async function ()
    {
        var list = [2,3]
        for (var _15_ = 0; _15_ < list.length; _15_++)
        {
            s = list[_15_]
            h = new harness({cols:24,rows:20})
            m = new matrix(h.screen,'test_matrix')
            m.layout(0,0,24,20)
            while (m.scale < s)
            {
                m.incScale(1)
            }
            m.setItems(['a'])
            m.draw()
            x = s
            compare(h.screen.get_char(x - s,0),'')
            compare(h.screen.get_char(x,0),'a')
            compare(h.screen.get_char(x + s,0),'')
        }
    })
}
toExport["matrix"]._section_ = true
toExport._test_ = true
export default toExport


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2tvZGUva2VkL3Rlc3QvdG9vbHMua29kZSJdLCJtYXBwaW5ncyI6Ijs7O09BQ3NCLFdBQVo7T0FBaUIsV0FBakI7T0FBc0IsV0FBdEI7O09BQ1ksZUFBZjtPQUF3QixjQUF4Qjs7T0FDZSxhQUFmO09BQXNCLFlBQXRCOztPQUNlLGFBQVY7O09BQ1UsWUFBVjs7T0FDVSxhQUFUOztPQUNTLFlBQWY7OztBQUVQLGVBQU0sU0FBUTs7OztJQUNWLFFBQVEsU0FBUSxLQUFLLEdBQUcsS0FBSztJQUM3QixRQUFRLE9BQU8sRUFBRSxPQUFPO0lBQ3hCLEVBQUUsTUFBTSxPQUFPLEVBQUUsRUFBRSxHQUFHO0lBQ3RCLEVBQUUsTUFBTSxXQUFXO0lBQ25CLEVBQUUsTUFBTSxjQUFjLEVBQUU7SUFDeEIsT0FBTSxNQUFNLE1BQU07O2VBQWtCOztJQUNwQyxRQUFRLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUztJQUNuQyxFQUFFLFVBQVU7WUFDWCxFQUFFLEVBQUU7Ozs7OztrQkFNUyxJQUFJLFFBQVEsVUFBVSxZQUEvQixZQUFFLFlBQUU7O1FBRUwsRUFBRTtnQkFFRixFQUFFLFNBQVcsVUFBVSxRQUFRO2dCQUMvQixFQUFFLFFBQVEsZUFBaUI7Z0JBQzNCLEVBQUUsUUFBUSxXQUFhO2dCQUN2QixFQUFFLFFBQVEsTUFBTSxFQUFFOzs7O2tCQUlSLElBQUksTUFBTSxXQUFXLFlBQTlCLFlBQUUsWUFBRTs7UUFFTCxFQUFFO2dCQUVGLEVBQUUsU0FBVyxVQUFVOzs7O2tCQUliLElBQUksV0FBVyxPQUFPLFFBQS9CLFlBQUUsWUFBRTs7UUFFTCxFQUFFO2dCQUVGLEVBQUUsUUFBUSxNQUFNLEVBQUUsTUFBTSxjQUFLOzttQkFBUyxLQUFLLElBQUk7WUFBVSxHQUFHLE1BQU0sR0FBRyxNQUFNLE1BQU0sR0FBRztnQkFDcEYsRUFBRSxhQUFlLEVBQUUsRUFBRTtnQkFDckIsRUFBRSxZQUFlLEVBQUUsRUFBRTs7OztrQkFJWCxJ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
//# sourceURL=file:///home/kodi/s/ked/kode/ked/test/tools.kode
