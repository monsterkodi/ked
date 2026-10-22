var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}};_k_.g3=_k_.k.F256(_k_.k.g(3));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4))

var assign, precedence

import print from "./print.js"


precedence = function (o)
{
    var t, _23_20_

    if ((o != null ? o.qmrkcolon : undefined))
    {
        return 12
    }
    t = (o != null ? (_23_20_=o.operation) != null ? _23_20_.operator.text : undefined : undefined)
    switch (t)
    {
        case 'new':
            return -1

        case 'last':
        case 'first':
        case 'is':
        case 'equals':
        case 'noon':
            return 0

        case 'copy':
        case 'clone':
        case 'not':
        case 'delete':
        case 'empty':
        case 'valid':
        case '~':
            return 1

        case '*':
        case '/':
        case '%':
            return 2

        case '+':
        case '-':
            return 3

        case '<<':
        case '>>':
        case '>>>':
            return 4

        case '<':
        case '<=':
        case '>':
        case '>=':
            return 5

        case '==':
        case '!=':
        case 'eql':
            return 6

        case '&':
            return 7

        case '^':
            return 8

        case '|':
            return 9

        case 'and':
            return 10

        case 'or':
            return 11

        case '?':
        case '?:':
            return 12

        case '=':
            return 13

        case '+=':
        case '-=':
        case '*=':
        case '/=':
        case '%=':
        case '&=':
        case '^=':
        case '|=':
            return 14

        case '<<=':
        case '>>=':
        case '>>>=':
        case '&&=':
        case '||=':
        case '?=':
            return 15

        default:
            return Infinity
    }

}
assign = ['=','+=','-=','*=','/=','%=','^=','&=','|=','&&=','||=']
class Operator
{
    constructor (kode)
    {
        this.kode = kode
    
        this.verbose = this.kode.args.verbose
        this.debug = this.kode.args.debug
    }

    collect (tl)
    {
        var e, _71_19_

        if ((tl != null ? (_71_19_=tl.exps) != null ? _71_19_.length : undefined : undefined))
        {
            var list = _k_.list(tl.exps)
            for (var _a_ = 0; _a_ < list.length; _a_++)
            {
                e = list[_a_]
                this.exp(e)
            }
        }
        return tl
    }

    exp (e)
    {
        var key, v, val, _89_30_

        if (!e)
        {
            return
        }
        else if (e.type)
        {
            return
        }
        else if (e instanceof Array)
        {
            if (e.length)
            {
                var list = _k_.list(e)
                for (var _a_ = 0; _a_ < list.length; _a_++)
                {
                    v = list[_a_]
                    this.exp(v)
                }
            }
        }
        else if (e.operation)
        {
            this.op(e)
            if ((e.operation != null ? e.operation.rhs : undefined))
            {
                return this.exp(e.operation.rhs)
            }
            else if (e.qmrkcolon)
            {
                this.exp(e.qmrkcolon.mid)
                return this.exp(e.qmrkcolon.rhs)
            }
        }
        else if (e instanceof Object)
        {
            for (key in e)
            {
                val = e[key]
                if (val)
                {
                    if (val.operation)
                    {
                        this.op(val)
                    }
                    else
                    {
                        this.exp(val)
                    }
                }
            }
        }
    }

    op (e)
    {
        var c, chain, i, p, _111_19_, _111_39_, _113_40_

        chain = [e]
        c = e.operation
        while ((c.rhs != null ? c.rhs.operation : undefined) || (c.rhs != null ? c.rhs.qmrkcolon : undefined))
        {
            chain.push(c.rhs)
            c = c.rhs.operation || (c.rhs != null ? c.rhs.qmrkcolon : undefined)
        }
        if (chain.length > 1)
        {
            p = chain.map(function (i)
            {
                return precedence(i)
            })
            if (this.debug)
            {
                this.logChain(chain,p)
            }
            for (var _a_ = i = 1, _b_ = p.length; (_a_ <= _b_ ? i < p.length : i > p.length); (_a_ <= _b_ ? ++i : --i))
            {
                if (p[i] > p[i - 1])
                {
                    this.fixPrec(e)
                    break
                }
            }
        }
        else
        {
            return this.exp(e.operation.rhs)
        }
    }

    fixPrec (e)
    {
        var newlhs, newop, op, _142_23_, _142_41_, _142_52_, _142_62_, _146_32_, _146_43_, _182_54_, _182_84_, _188_32_, _188_53_

        op = e.operation || e.qmrkcolon
        if (precedence(e) < precedence(op.rhs))
        {
            if (op.operator.text === 'not' && _k_.in(((op.rhs != null ? op.rhs.incond : undefined) || ((_142_41_=op.rhs) != null ? (_142_52_=_142_41_.operation) != null ? (_142_62_=_142_52_.operator) != null ? _142_62_.text : undefined : undefined : undefined)),assign))
            {
                return
            }
            if (_k_.in(op.operator.text,assign))
            {
                return
            }
            if (_k_.in(((_146_32_=e.operation.rhs) != null ? (_146_43_=_146_32_.operation) != null ? _146_43_.operator.text : undefined : undefined),assign))
            {
                return
            }
            this.verb('swap',precedence(e),precedence(op.rhs))
            if (this.debug)
            {
                print.ast('before swap',e)
            }
            if (op.rhs.qmrkcolon)
            {
                newlhs = {operation:{lhs:op.lhs,operator:op.operator,rhs:op.rhs.qmrkcolon.lhs}}
                newop = {lhs:newlhs,qmrk:op.rhs.qmrkcolon.qmrk,mid:op.rhs.qmrkcolon.mid,colon:op.rhs.qmrkcolon.colon,rhs:op.rhs.qmrkcolon.rhs}
                delete e.operation
                e.qmrkcolon = newop
            }
            else
            {
                newlhs = {operation:{lhs:op.lhs,operator:op.operator,rhs:op.rhs.operation.lhs}}
                newop = {lhs:newlhs,operator:op.rhs.operation.operator,rhs:op.rhs.operation.rhs}
                e.operation = newop
                if ((e.operation.rhs != null ? e.operation.rhs.operation : undefined) || (e.operation.rhs != null ? e.operation.rhs.qmrkcolon : undefined))
                {
                    this.op(e.operation.rhs)
                }
            }
            if (this.debug)
            {
                return print.ast('after swap2',e)
            }
        }
        else
        {
            if ((op.rhs != null ? op.rhs.operation : undefined) || (op.rhs != null ? op.rhs.qmrkcolon : undefined))
            {
                this.op(op.rhs)
            }
            if (precedence(e) < precedence(op.rhs))
            {
                return this.fixPrec(e)
            }
        }
    }

    logChain (chain, p)
    {
        var rndr, s, _206_43_, _206_50_

        s = ''
        rndr = (function (n)
        {
            try
            {
                return _k_.w2(this.kode.renderer.plain,this.kode.renderer.node(n))
            }
            catch (e)
            {
                return print.noon(e,n)
            }
        }).bind(this)
        s += chain.map((function (i)
        {
            if (i.operation)
            {
                return rndr(i.operation.lhs) + ' ' + _k_.w3(i.operation.operator.text) + ' ' + _k_.b6(precedence(i))
            }
            else
            {
                return rndr(i.qmrkcolon.lhs) + ' ? ' + rndr(i.qmrkcolon.mid) + ' '
            }
        }).bind(this)).join(' ')
        s += ' ' + ((_206_50_=rndr((chain.slice(-1)[0].operation != null ? chain.slice(-1)[0].operation.rhs : undefined))) != null ? _206_50_ : '...')
        if (this.debug)
        {
            console.log(_k_.w4('▪'),s,_k_.g3(p))
        }
    }

    verb ()
    {
        if (this.debug)
        {
            return console.log.apply(console.log,arguments)
        }
    }
}

export default Operator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3BlcmF0b3IuanMiLCJzb3VyY2VzIjpbIi4uLy4uL2tvZGUva29kZS9vcGVyYXRvci5rb2RlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBa0JBLHVCQUFhOzs7O1NBRUksWUFBQSxFQUFHOztlQUFUOztJQUVQLEtBQUkscUJBQUEsRUFBRyw2QkFBVyxTQUFTO1lBRXBCOzthQUVIO21CQUE0Qzs7YUFDNUM7YUFBTzthQUNQO2FBQUs7YUFBUzttQkFBK0I7O2FBQzdDO2FBQU87YUFDUDthQUFNO2FBQVM7YUFBUTthQUFRO21CQUFjOzthQUM3QzthQUFJO2FBQUk7bUJBQXFDOzthQUM3QzthQUFJO21CQUF5Qzs7YUFDN0M7YUFBSzthQUFLO21CQUFtQzs7YUFDN0M7YUFBSTthQUFLO2FBQUk7bUJBQWdDOzthQUM3QzthQUFLO2FBQUs7bUJBQW1DOzthQUM3QzttQkFBNkM7O2FBQzdDO21CQUE2Qzs7YUFDN0M7bUJBQTZDOzthQUM3QzttQkFBNEM7O2FBQzVDO21CQUE0Qzs7YUFDNUM7YUFBSTttQkFBd0M7O2FBQzVDO21CQUE0Qzs7YUFDNUM7YUFBSzthQUFLO2FBQUs7YUFBSzthQUFLO2FBQUs7YUFBSzttQkFBUzs7YUFDNUM7YUFBTTthQUFNO2FBQU87YUFBTTthQUFNO21CQUFhOzs7bUJBQ0E7Ozs7QUFFcEQsVUFBVSxJQUFHLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxLQUFJLEtBQUksS0FBSSxNQUFLO0FBUWxELE1BQU07O0lBRUYsYUFBRzs7OztRQUVDLEtBQUMsVUFBVSxLQUFDLEtBQUssS0FBSztRQUN0QixLQUFDLFFBQVUsS0FBQyxLQUFLLEtBQUs7OztJQVExQixTQUFTOzs7O2FBRUYsc0JBQUEsR0FBSSx3QkFBTTs7Z0NBQ08sR0FBRzs7O2dCQUFSO2dCQUFYLEtBQUMsSUFBSTs7O2VBQ1Q7OztJQVFKLEtBQUs7Ozs7YUFHTzs7OztpQkFDSixFQUFFOzs7O2lCQUNGLGFBQUs7O2dCQUE4QixFQUFFOztvQ0FBUDs7O29CQUFMO29CQUFYLEtBQUMsSUFB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
//# sourceURL=file:///home/kodi/s/ked/kode/kode/operator.kode
