var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r2=_k_.k.F256(_k_.k.r(2));_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.R3=_k_.k.B256(_k_.k.R(3));_k_.y3=_k_.k.F256(_k_.k.y(3));_k_.Y4=_k_.k.B256(_k_.k.Y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.y6=_k_.k.F256(_k_.k.y(6))

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

class Kode
{
    constructor (args)
    {
        this.args = args
    
        var _16_14_, _17_21_

        this.onError = this.onError.bind(this)
        this.args = ((_16_14_=this.args) != null ? _16_14_ : {})
        this.args.header = ((_17_21_=this.args.header) != null ? _17_21_ : true)
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
        var afile, li, message

        if (!_k_.empty(info))
        {
            if (!_k_.empty(info.tokens) && !_k_.empty(info.tokens[0]))
            {
                li = info.tokens[0].line
            }
            else if (!_k_.empty(info.tok))
            {
                li = info.tok.line
            }
            else if (!_k_.empty(info.line))
            {
                li = info.line
            }
        }
        afile = slash.absolute(slash.path(this.file),process.cwd())
        if (!_k_.empty(li))
        {
            afile += ':' + li
        }
        message = ansi.link("file://" + afile,afile)
        if (!_k_.empty(li))
        {
            message += `\n${li}: ` + this.text.split(/\r?\n/)[li - 1]
        }
        message += "\n" + msg
        throw message
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia29kZS5qcyIsInNvdXJjZXMiOlsiLi4vLi4va29kZS9rb2RlL2tvZGUua29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZVEsS0FBQyxpQkFBRCxLQUFDO1FBQ0QsS0FBQyxLQUFLLG1CQUFOLEtBQUMsS0FBSyw0QkFBVTtRQUNoQixLQUFDLFVBQVc7UUFDWixLQUFDLFlBQVksT0FBTSxNQUFLLFFBQU8sU0FBUSxTQUFRO1FBQy9DLEtBQUMsUUFBVyxLQUFDLFNBQVMsUUFBUTtRQUU5QixLQUFDLFlBQWUsTUFBUztRQUN6QixLQUFDLGFBQWUsT0FBUztRQUN6QixLQUFDLGFBQWUsT0FBUztRQUN6QixLQUFDLGNBQWUsUUFBUztRQUN6QixLQUFDLGVBQWUsU0FBUztRQUN6QixLQUFDLGVBQWUsU0FBUztRQUN6QixLQUFDLGVBQWUsU0FBUzs7Ozs7Ozt1QkFXaEI7OzJCQUVLLEtBQUssc0JBQWlCLEtBQUssT0FBTzs7Z0JBQ3BDLEtBQUssS0FBSyxPQUFPLEdBQUc7O2dDQUNsQixLQUFLOztnQkFDUCxLQUFLLEtBQUssSUFBSTs7Z0NBQ1osS0FBSzs7Z0JBQ1AsS0FBSyxLQUFLOzs7UUFFdEIsUUFBUSxNQUFNLFNBQVMsTUFBTSxLQUFLLEtBQUMsTUFBTyxRQUFRO3VCQUV6Qzs7WUFDTCxTQUFTLE1BQU07O1FBRW5CLFVBQVUsS0FBSyxLQUFLLFlBQVUsTUFBTzt1QkFFNUI7O1lBQ0wsZ0JBQWdCLFNBQVMsS0FBQyxLQUFLLE1BQU0sU0FBUyxLQUFHOztRQUVyRCxXQUFXLE9BQU87UUFDbEIsTUFBTTs7Ozs7OztzQkFVSzs7OztRQUVYLEtBQUssS0FBQyxRQUFRLEtBQUs7ZUFDbkIsS0FBSzs7Ozs7b0JBY3FCLEtBQUssTUFBTSxRQUFROzs7Ozs7Ozs7OzsrQkFJekIsS0FBQzs7bUJBQWxCOztZQUVVLEtBQUMsS0FBSzs7WUFBbkIsWUFBSSxLQUFDOzs7O1lBR0QsTUFBTSxLQUFDLElBQUksS0FBQzttQkFDWixLQUFDLFNBQVMsT0FBTyxJQUFLLEtBQUMsS0FBTSxLQUFDOztlQUM1Qjs7WUFDRixNQUFNOzBCQUNIOztnQkFFQyxPQUFPOzs7O2dCQUVQLE9BQU87K0JBQ0UsSUFBSTs7b0JBQ1QsT0FBTyxJQUFJOzs7O29CQUVYLE9BQU8sSUFBSTs7Z0JBQ2YsT0FBTzs7WUFDWCxNQUFNOzs7Ozs7OztRQVlWLFNBQVMsS0FBQyxNQUFNLFNBQVM7UUFDekIsU0FBUyxLQUFDLE1BQU0sU0FBUztRQUV6QixNQUFNLEtBQUMsT0FBTyxNQUFPO1FBQ3JCLE1BQU0sS0FBQyxRQUFRLFFBQVM7UUFDeEIsTUFBTSxLQUFDLE9BQU8sUUFBVTtRQUN4QixNQUFNLEtBQUMsU0FBUyxRQUFRO2VBQ3hCLE1BQU0sS0FBQyxTQUFTLFFBQVE7Ozs7O2VBRVAsTUFBTSxLQUFLLEtBQUMsSUFBSSxNQUFNOzs7Ozs7O1lBVVgsS0FBSzs7WUFBakMsWUFBSSxnQkFBZ0I7O1FBQ3BCLFdBQVcsS0FBSztRQUVoQixPQUFPLEtBQUs7WUFFVCxLQUFLOztZQUNKLFlBQUksS0FBSyxRQUFRLEtBQUs7WUFDdEIsUUFBUSxLQUFLOztZQUVkLEtBQUs7O1lBQ0osWUFBSSxLQUFLLEtBQUssS0FBSyxLQUFLLE9BQU87WUFDL0IsUUFBUSxLQUFLOzs0QkFFTCxLQUFLOzs7O1lBS2IsT0FBTyxNQUFNLFNBQVMsTUFBTSxLQUFLLE1BQU8sUUFBUTtnQkFDOUIsS0FBSzs7Z0JBQXZCLFlBQUksS0FBSzs7WUFFVCxhQUFRLElBQUksS0FBSzswQkFFUjs7Z0JBQVUsd0RBQWdDO2dCQUFZOzs7O29CQUl2RCxLQUFLOztvQkFDVyxNQUFNLE1BQU0sU0FBUyxNQUFNLFFBQVEsTUFBTSxLQUFLLEtBQUssT0FBTyxNQUFNLEtBQUssT0FBTyxNQUFPLFFBQVE7d0JBQ2hGLEtBQUs7O3dCQUFoQixZQUFJOztvQkFDSixLQUFNLEtBQUssUUFBUSxLQUFNLEtBQU07b0JBQy9CLFlBQU8sSUFBSSxNQUFNLElBQUk7eUJBQ2xCLGNBQUEsSUFBSzs7d0JBQVcseURBQWlDOzs7eUJBQ3BFLEtBQUs7O29CQUFXLFlBQUksS0FBSyxLQUFLLEtBQUssS0FBSzs7OztvQkFDeEIsWUFBSSxLQUFLLFFBQVEsS0FBSzs7O21CQUN4Qzs7Z0JBQ0YsWUFBSTs7Ozs7O2VBQ2I7OztJQUlILE9BQU8sS0FBSzs7Ozs7Ozs7Ozs7SUFjWixLQUFLLElBQUkifQ==
//# sourceURL=file://kode/kode/kode.kode
