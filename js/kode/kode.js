var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.R3=_k_.k.B256(_k_.k.R(3));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.Y4=_k_.k.B256(_k_.k.Y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6))

var args, Kode

import slash from "../kxk/slash.js"
import karg from "../kxk/karg.js"
import ansi from "../kxk/ansi.js"
import nfs from "../kxk/nfs.js"
import kstr from "../kxk/kstr.js"

import lexer from "./lexer.js"
import print from "./print.js"
import parser from "./parser.js"
import scoper from "./scoper.js"
import stripol from "./stripol.js"
import returner from "./returner.js"
import operator from "./operator.js"
import renderer from "./renderer.js"

import kulur from "../kolor/kulur.js"


Kode = (function ()
{
    function Kode (args)
    {
        this.args = args
    
        var _10_14_, _11_21_

        this["onError"] = this["onError"].bind(this)
        this.args = ((_10_14_=this.args) != null ? _10_14_ : {})
        this.args.header = ((_11_21_=this.args.header) != null ? _11_21_ : true)
        this.version = '0.2.0'
        this.literals = ['bool','num','regex','single','double','triple']
        this.atoms = this.literals.concat(['var'])
        this.lexer = new lexer(this)
        this.parser = new parser(this)
        this.scoper = new scoper(this)
        this.stripol = new stripol(this)
        this.returner = new returner(this)
        this.operator = new operator(this)
        this.renderer = new renderer(this)
    }

    Kode.prototype["onError"] = function (msg, info)
    {
        var afile, ci, li, lines, message, tok, url

        tok = null
        if (!_k_.empty((info != null ? info.tokens : undefined)) && info.tokens.length)
        {
            tok = info.tokens[0]
        }
        else if (!_k_.empty((info != null ? info.tok : undefined)))
        {
            tok = info.tok
        }
        else if (!_k_.empty((info != null ? info.line : undefined)) || !_k_.empty((info != null ? info.col : undefined)))
        {
            tok = info
        }
        lines = this.text.split(/\r?\n/)
        li = null
        ci = null
        if (!_k_.empty((tok != null ? tok.line : undefined)) && tok.line > 0 && tok.line <= lines.length)
        {
            li = tok.line
            ci = tok.col
        }
        if (!!_k_.empty(li))
        {
            li = lines.length
            ci = lines.slice(-1)[0].length
        }
        afile = slash.absolute(slash.path(this.file),process.cwd())
        url = `file://${afile}:${li}`
        message = bold(_k_.m5(slash.tilde(afile))) + _k_.m5(':') + _k_.m5(li)
        message += '\n' + ansi.link(url,this.caret(lines[li - 1],ci))
        message += '\n' + _k_.R2(_k_.y6(msg))
        throw message
    }

    Kode.prototype["caret"] = function (text, col)
    {
        var ch, hi, pad

        hi = text ? kulur.kolorizeChunks(kulur.ranges(text)) : ''
        if (!_k_.empty(col))
        {
            pad = ''
            var list = _k_.list(((text != null ? text : '')).slice(0, typeof col === 'number' ? col : -1))
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                ch = list[_a_]
                pad += ch === '\t' ? ' '.repeat(8 - pad.length % 8) : ' '
            }
            hi += `\n${pad}^`
        }
        return hi
    }

    Kode.prototype["eval"] = function (text, file, glob)
    {
        var js

        if (_k_.empty(text))
        {
            return
        }
        js = this.compile(text,file)
        return eval(js)
    }

    Kode["compile"] = function (text, opt = {})
    {
        return (new Kode(opt)).compile(text)
    }

    Kode.prototype["compile"] = function (text, file, target)
    {
        this.text = text
        this.file = file
        this.target = target
    
        var ast, msg

        this.text = kstr.stripTags(this.text)
        if (_k_.empty(_k_.trim(this.text)))
        {
            return ''
        }
        if (this.args.verbose)
        {
            console.log(this.text)
        }
        try
        {
            ast = this.ast(this.text)
            return this.renderer.render(ast,this.file,this.target)
        }
        catch (err)
        {
            msg = ""
            if (_k_.isStr(err))
            {
                msg += err
            }
            else
            {
                msg += "[internal kode compiler error]\n"
                if (!_k_.empty(err.stack))
                {
                    msg += err.stack
                }
                else
                {
                    msg += err.message
                }
                msg += "\n"
            }
            throw msg
        }
    }

    Kode.prototype["ast"] = function (text)
    {
        var ast, blocks, tokens

        tokens = this.lexer.tokenize(text)
        blocks = this.lexer.blockify(tokens)
        ast = this.parser.parse(blocks)
        ast = this.stripol.collect(ast)
        ast = this.scoper.collect(ast)
        ast = this.returner.collect(ast)
        return ast = this.operator.collect(ast)
    }

    Kode.prototype["astr"] = function (text, scopes)
    {
        return print.astr(this.ast(text),scopes)
    }

    Kode["commonDir"] = function (files)
    {
        var d, dir, dirs, f, n, p, parts

        dirs = []
        var list = _k_.list(files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            dir = slash.dir(f)
            dirs.push(dir)
        }
        if (_k_.empty(dirs))
        {
            return '/'
        }
        parts = dirs[0].split('/')
        var list1 = _k_.list(dirs)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            d = list1[_b_]
            p = d.split('/')
            n = 0
            while (n < parts.length && n < p.length && parts[n] === p[n])
            {
                n++
            }
            parts = parts.slice(0,n)
        }
        return parts.join('/') || '/'
    }

    Kode["outPath"] = function (file, outdir, root)
    {
        var rel

        rel = slash.name(file)
        if (file.startsWith(root + '/'))
        {
            rel = file.slice(root.length + 1)
        }
        return slash.absolute(slash.path(outdir,slash.swapExt(rel,'js')),process.cwd())
    }

    Kode["run"] = async function (args)
    {
        var abs, absFiles, f, file, js, kode, out, res, root, text

        if (args.verbose)
        {
            console.log('Kode.run args',args)
        }
        kode = new Kode(args)
        args = kode.args
        if (args.compile)
        {
            console.log(kode.compile(args.compile))
            process.exit(0)
        }
        if (args.eval)
        {
            console.log(kode.eval(args.eval,'eval',global))
            process.exit(0)
        }
        absFiles = []
        var list = _k_.list(args.files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            f = list[_a_]
            abs = slash.absolute(slash.path(f),process.cwd())
            absFiles.push(abs)
        }
        root = Kode.commonDir(absFiles)
        var list1 = _k_.list(args.files)
        for (var _b_ = 0; _b_ < list1.length; _b_++)
        {
            file = list1[_b_]
            file = slash.absolute(slash.path(file),process.cwd())
            if (args.verbose)
            {
                console.log(gray(file))
            }
            text = await nfs.read(file)
            if (_k_.empty(text))
            {
                console.error(_k_.Y4(_k_.r2(`can't read ${_k_.R3(_k_.y5(file))}`)))
                continue
            }
            try
            {
                if (args.outdir)
                {
                    out = Kode.outPath(file,args.outdir,root)
                    if (args.verbose)
                    {
                        console.log(out)
                    }
                    js = kode.compile(text,file,out)
                    res = await nfs.write(out,js)
                    if ((res != null ? res.error : undefined))
                    {
                        console.error(_k_.R2(_k_.y3(`can't write ${_k_.R3(_k_.y6(out))}`)))
                    }
                }
                else if (args.run)
                {
                    console.log(kode.eval(text,file,global))
                }
                else
                {
                    console.log(kode.compile(text,file))
                }
            }
            catch (err)
            {
                console.log(err)
            }
        }
    }

    return Kode
})()

export default Kode;
if (((globalThis.process != null ? globalThis.process.argv : undefined) != null) && import.meta.filename === process.argv[1])
{
    args = karg(`kode
    files       **
    eval        evaluate a string and print the result
    compile     transpile a string and print the result
    outdir      transpile files into output directory
    run         execute files                               = true
    js          print transpiled js code                    = false
    map         generate inline source maps                 = true
    header      prepend output with version header          = false -H
    verbose     log more                                    = false
    debug       debug output                                = false`)
    Kode.run(args)
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL2tvZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7OztPQUNhLFlBQU47T0FBWSxXQUFaO09BQWlCLFdBQWpCO09BQXNCLFVBQXRCO09BQTBCLFdBQTFCOztPQUNELFlBQUE7T0FBTSxZQUFBO09BQU0sYUFBQTtPQUFPLGFBQUE7T0FBTyxjQUFBO09BQVEsZUFBQTtPQUFTLGVBQUE7T0FBUyxlQUFBOztPQUMzQyxZQUFSOzs7QUFFTixRQUFEOzthQUVJLE1BQUk7O1FBQUQ7Ozs7O1FBRUMsS0FBQyxpQkFBRCxLQUFDO1FBQ0QsS0FBQyxLQUFLLG1CQUFOLEtBQUMsS0FBSyw0QkFBVTtRQUNoQixLQUFDLFVBQVc7UUFDWixLQUFDLFlBQVksT0FBTSxNQUFLLFFBQU8sU0FBUSxTQUFRO1FBQy9DLEtBQUMsUUFBVyxLQUFDLFNBQVMsUUFBUTtRQUU5QixLQUFDLFlBQWUsTUFBUztRQUN6QixLQUFDLGFBQWUsT0FBUztRQUN6QixLQUFDLGFBQWUsT0FBUztRQUN6QixLQUFDLGNBQWUsUUFBUztRQUN6QixLQUFDLGVBQWUsU0FBUztRQUN6QixLQUFDLGVBQWUsU0FBUztRQUN6QixLQUFDLGVBQWUsU0FBUzs7O29CQUk3QixzQkFBUyxLQUFJOzs7O1FBRVQsTUFBTTt3QkFFRyxlQUFBLEtBQU0sd0JBQVcsS0FBSyxPQUFPOztZQUNsQyxNQUFNLEtBQUssT0FBTzs7NkJBQ1IsZUFBQSxLQUFNOztZQUNoQixNQUFNLEtBQUs7OzZCQUNELGVBQUEsS0FBTSxrQ0FBYyxlQUFBLEtBQU07O1lBQ3BDLE1BQU07O1FBRVYsUUFBUSxLQUFDLEtBQUssTUFBTTtRQUVwQixLQUFLO1FBQ0wsS0FBSzt3QkFFSSxjQUFBLElBQUssc0JBQVMsSUFBSSxPQUFPLEtBQU0sSUFBSSxRQUFRLE1BQU07O1lBQ3RELEtBQUssSUFBSTtZQUNULEtBQUssSUFBSTs7d0JBRUE7O1lBQ1QsS0FBSyxNQUFNO1lBQ1gsS0FBSyxtQkFBVTs7UUFF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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/kode.kode
