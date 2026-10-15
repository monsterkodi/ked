var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.R3=_k_.k.B256(_k_.k.R(3));_k_.m5=_k_.k.F256(_k_.k.m(5));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.Y4=_k_.k.B256(_k_.k.Y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6))

var args

import slash from "../kxk/slash.js"
import karg from "../kxk/karg.js"
import ansi from "../kxk/ansi.js"
import nfs from "../kxk/nfs.js"

import lexer from "./lexer.js"
import print from "./print.js"
import parser from "./parser.js"
import scoper from "./scoper.js"
import stripol from "./stripol.js"
import returner from "./returner.js"
import operator from "./operator.js"
import renderer from "./renderer.js"

import kolor from "../kolor/kolor.js"

class Kode
{
    constructor (args)
    {
        this.args = args
    
        var _17_14_, _18_21_

        this.onError = this.onError.bind(this)
        this.args = ((_17_14_=this.args) != null ? _17_14_ : {})
        this.args.header = ((_18_21_=this.args.header) != null ? _18_21_ : true)
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

    onError (msg, info)
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

    caret (text, col)
    {
        var ch, hi, pad

        hi = text ? kolor.kolorizeChunks(kolor.ranges(text)) : ''
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

    eval (text, file, glob)
    {
        var js

        if (_k_.empty(text))
        {
            return
        }
        js = this.compile(text,file)
        return eval(js)
    }

    static compile (text, opt = {})
    {
        return (new Kode(opt)).compile(text)
    }

    compile (text, file, target)
    {
        this.text = text
        this.file = file
        this.target = target
    
        var ast, msg

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

    ast (text)
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

    astr (text, scopes)
    {
        return print.astr(this.ast(text),scopes)
    }

    static async run (args)
    {
        var file, js, kode, out, res, text

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
        var list = _k_.list(args.files)
        for (var _a_ = 0; _a_ < list.length; _a_++)
        {
            file = list[_a_]
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
                    out = slash.absolute(slash.swapExt(slash.path(args.outdir,slash.file(file)),'js'),process.cwd())
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
}

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL2tvZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFnQlEsS0FBQyxpQkFBRCxLQUFDO1FBQ0QsS0FBQyxLQUFLLG1CQUFOLEtBQUMsS0FBSyw0QkFBVTtRQUNoQixLQUFDLFVBQVc7UUFDWixLQUFDLFlBQVksT0FBTSxNQUFLLFFBQU8sU0FBUSxTQUFRO1FBQy9DLEtBQUMsUUFBVyxLQUFDLFNBQVMsUUFBUTtRQUU5QixLQUFDLFlBQWUsTUFBUztRQUN6QixLQUFDLGFBQWUsT0FBUztRQUN6QixLQUFDLGFBQWUsT0FBUztRQUN6QixLQUFDLGNBQWUsUUFBUztRQUN6QixLQUFDLGVBQWUsU0FBUztRQUN6QixLQUFDLGVBQWUsU0FBUztRQUN6QixLQUFDLGVBQWUsU0FBUzs7Ozs7OztRQWdDekIsTUFBTTt3QkFFRyxlQUFBLEtBQU0sd0JBQVcsS0FBSyxPQUFPOztZQUNsQyxNQUFNLEtBQUssT0FBTzs7NkJBQ1IsZUFBQSxLQUFNOztZQUNoQixNQUFNLEtBQUs7OzZCQUNELGVBQUEsS0FBTSxrQ0FBYyxlQUFBLEtBQU07O1lBQ3BDLE1BQU07O1FBRVYsUUFBUSxLQUFDLEtBQUssTUFBTTtRQUVwQixLQUFLO1FBQ0wsS0FBSzt3QkFFSSxjQUFBLElBQUssc0JBQVMsSUFBSSxPQUFPLEtBQU0sSUFBSSxRQUFRLE1BQU07O1lBQ3RELEtBQUssSUFBSTtZQUNULEtBQUssSUFBSTs7d0JBRUE7O1lBQ1QsS0FBSyxNQUFNO1lBQ1gsS0FBSyxtQkFBVTs7UUFFbkIsUUFBUSxNQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUMsTUFBTyxRQUFRO1FBSWxELGdCQUFnQixTQUFTO1FBRXpCLFVBQVUsWUFBUSxNQUFNLE1BQU0sa0JBQWMsY0FBVTtRQUN0RCxXQUFXLE9BQU8sS0FBSyxLQUFLLElBQUssS0FBQyxNQUFNLE1BQU0sS0FBRyxHQUFJO1FBQ3JELFdBQVcscUJBQWE7UUFFeEIsTUFBTTs7Ozs7OztRQU9OLEtBQVEsT0FBVSxNQUFNLGVBQWUsTUFBTSxPQUFPLFNBQVc7dUJBUXREOztZQUVMLE1BQU07a0NBQ0ssZUFBQSxPQUFPLFdBQUksVUFBSSxtQkFBQTs7OztnQkFDdEIsT0FBVSxPQUFNLE9BQVUsSUFBSSxPQUFPLElBQUksSUFBSSxTQUFTLEtBQzNDOztZQUVmLFdBQVc7O2VBRWY7Ozs7Ozs7c0JBVVc7Ozs7UUFFWCxLQUFLLEtBQUMsUUFBUSxLQUFLO2VBQ25CLEtBQUs7Ozs7O29CQWNxQixLQUFLLE1BQU0sUUFBUTs7Ozs7Ozs7Ozs7K0JBSXpCLEtBQUM7O21CQUFsQjs7WUFFVSxLQUFDLEtBQUs7O1lBQW5CLFlBQUksS0FBQzs7OztZQUdELE1BQU0sS0FBQyxJQUFJLEtBQUM7bUJBQ1osS0FBQyxTQUFTLE9BQU8sSUFBSyxLQUFDLEtBQU0sS0FBQzs7ZUFDNUI7O1lBQ0YsTUFBTTswQkFDSDs7Z0JBRUMsT0FBTzs7OztnQkFFUCxPQUFPOytCQUNFLElBQUk7O29CQUNULE9BQU8sSUFBSTs7OztvQkFFWCxPQUFPLElBQUk7O2dCQUNmLE9BQU87O1lBQ1gsTUFBTTs7Ozs7Ozs7UUFZVixTQUFTLEtBQUMsTUFBTSxTQUFTO1FBQ3pCLFNBQVMsS0FBQyxNQUFNLFNBQVM7UUFFekIsTUFBTSxLQUFDLE9BQU8sTUFBTztRQUNyQixNQUFNLEtBQUMsUUFBUSxRQUFTO1FBQ3hCLE1BQU0sS0FBQyxPQUFPLFFBQVU7UUFDeEIsTUFBTSxLQUFDLFNBQVMsUUFBUTtlQUN4QixNQUFNLEtBQUMsU0FBUyxRQUFROzs7OztlQUVQLE1BQU0sS0FBSyxLQUFDLElBQUksTUFBTTs7Ozs7OztZQVVYLEtBQUs7O1lBQWpDLFlBQUksZ0JBQWdCOztRQUNwQixXQUFXLEtBQUs7UUFFaEIsT0FBTyxLQUFLO1lBRVQsS0FBSzs7WUFDSixZQUFJLEtBQUssUUFBUSxLQUFLO1lBQ3RCLFFBQVEsS0FBSzs7WUFFZCxLQUFLOztZQUNKLFlBQUksS0FBSyxLQUFLLEtBQUssS0FBSyxPQUFPO1lBQy9CLFFBQVEsS0FBSzs7NEJBRUwsS0FBSzs7OztZQUtiLE9BQU8sTUFBTSxTQUFTLE1BQU0sS0FBSyxNQUFPLFFBQVE7Z0JBQzlCLEtBQUs7O2dCQUF2QixZQUFJLEtBQUs7O1lBRVQsYUFBUSxJQUFJLEtBQUs7MEJBRVI7O2dCQUFVLHdEQUFnQztnQkFBWTs7OztvQkFJdkQsS0FBSzs7b0JBQ1csTUFBTSxNQUFNLFNBQVMsTUFBTSxRQUFRLE1BQU0sS0FBSyxLQUFLLE9BQU8sTUFBTSxLQUFLLE9BQU8sTUFBTyxRQUFRO3dCQUNoRixLQUFLOzt3QkFBaEIsWUFBSTs7b0JBQ0osS0FBTSxLQUFLLFFBQVEsS0FBTSxLQUFNO29CQUMvQixZQUFPLElBQUksTUFBTSxJQUFJO3lCQUNsQixjQUFBLElBQUs7O3dCQUFXLHlEQUFpQzs7O3lCQUNwRSxLQUFLOztvQkFBVyxZQUFJLEtBQUssS0FBSyxLQUFLLEtBQUs7Ozs7b0JBQ3hCLFlBQUksS0FBSyxRQUFRLEtBQUs7OzttQkFDeEM7O2dCQUNGLFlBQUk7Ozs7OztlQUNiOzs7SUFJSCxPQUFPLEtBQUs7Ozs7Ozs7Ozs7O0lBY1osS0FBSyxJQUFJIn0=
//# sourceURL=file://kode/kode/kode.kode
