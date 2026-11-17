// Bộ tính toán chính xác kiểu Casio: giá trị = p/q × √r × π^k (hoặc số thực khi không biểu diễn được)
(function(G){
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a};
const isO=v=>typeof v==='object',ME='Math ERROR',SE='Syntax ERROR';
const toF=v=>isO(v)?v.p/v.q*Math.sqrt(v.r)*Math.pow(Math.PI,v.k):v;
const isInt=v=>isO(v)&&v.q===1&&v.r===1&&v.k===0;
function mk(p,q,r=1,k=0){
 const F=()=>fl(q?p/q*Math.sqrt(r)*Math.pow(Math.PI,k):NaN);
 if(![p,q,r].every(Number.isSafeInteger)||q===0||r<0)return F();
 if(q<0){p=-p;q=-q}
 if(!p)return{p:0,q:1,r:1,k:0};
 for(let i=2;i*i<=r;i++)while(r%(i*i)===0){r/=i*i;p*=i}
 const g=gcd(p,q);p/=g;q/=g;
 return(k<0||k>1||!Number.isSafeInteger(p))?F():{p,q,r,k};
}
function fl(x){
 if(!isFinite(x))throw ME;
 x=+x.toPrecision(15);const n=Math.round(x);
 return(Math.abs(x)<1e15&&Math.abs(x-n)<1e-12*Math.max(1,Math.abs(x)))?mk(n,1):x;
}
const add=(a,b)=>{
 if(isO(a)&&isO(b)){if(!a.p)return b;if(!b.p)return a;
  if(a.r===b.r&&a.k===b.k)return mk(a.p*b.q+b.p*a.q,a.q*b.q,a.r,a.k)}
 return fl(toF(a)+toF(b))};
const neg=a=>isO(a)?mk(-a.p,a.q,a.r,a.k):-a;
const mul=(a,b)=>isO(a)&&isO(b)?mk(a.p*b.p,a.q*b.q,a.r*b.r,a.k+b.k):fl(toF(a)*toF(b));
const inv=a=>{if(isO(a)){if(!a.p)throw ME;return mk(a.q,a.p*a.r,a.r,-a.k)}if(!a)throw ME;return fl(1/a)};
const div=(a,b)=>mul(a,inv(b));
function sqrt(a){
 if(isO(a)&&a.k===0&&a.r===1){if(a.p<0)throw ME;return mk(1,a.q,a.p*a.q)}
 return fl(Math.sqrt(toF(a)))}
function cbrt(a){
 if(isO(a)&&a.k===0&&a.r===1){
  const c=n=>{const t=Math.round(Math.cbrt(n));return t*t*t===n?t:null},u=c(a.p),w=c(a.q);
  if(u!==null&&w!==null)return mk(u,w)}
 return fl(Math.cbrt(toF(a)))}
function pow(a,b){
 if(isInt(b)&&isO(a)&&Math.abs(b.p)<=64){
  if(!a.p&&b.p<=0)throw ME;
  let n=Math.abs(b.p),r=mk(1,1),x=a;
  while(n){if(n&1)r=mul(r,x);n>>=1;if(n)x=mul(x,x)}
  return b.p<0?inv(r):r}
 if(isO(b)&&b.p===1&&b.q===2&&b.r===1&&b.k===0)return sqrt(a);
 const x=toF(a),y=toF(b);if(x===0&&y<=0)throw ME;
 return fl(Math.pow(x,y))}
const S={0:[0,1,1],30:[1,2,1],45:[1,2,2],60:[1,2,3],90:[1,1,1]};
function sinD(n){
 n=((n%360)+360)%360;let s=1;
 if(n>180){n-=180;s=-1}if(n>90)n=180-n;
 const t=S[n];return t?mk(s*t[0],t[1],t[2]):null}
function trig(f,v,deg){
 let d=null;
 if(isO(v)){
  if(deg&&isInt(v))d=v.p;
  else if(!deg&&v.r===1&&v.k===1)d=v.p*180/v.q}
 if(d!==null&&Number.isInteger(d)){
  let s;
  if(f==='sin')s=sinD(d);else if(f==='cos')s=sinD(d+90);
  else{const c=sinD(d+90),t=sinD(d);if(c&&t){if(!c.p)throw ME;s=div(t,c)}}
  if(s)return s}
 return fl(Math[f](deg?toF(v)*Math.PI/180:toF(v)))}
function atrig(f,v,deg){
 const x=Math[f](toF(v));if(isNaN(x))throw ME;
 if(deg)return fl(x*180/Math.PI);
 const r=x/Math.PI;
 for(let q=1;q<=12;q++)if(Math.abs(r*q-Math.round(r*q))<1e-12)return mk(Math.round(r*q),q,1,1);
 return fl(x)}
function fact(a){
 if(!isInt(a)||a.p<0||a.p>69)throw ME;
 let r=1;for(let i=2;i<=a.p;i++)r*=i;return fl(r)}
function nPr(n,r){
 if(!isInt(n)||!isInt(r)||r.p<0||r.p>n.p)throw ME;
 let x=1;for(let i=0;i<r.p;i++)x*=n.p-i;return fl(x)}
function nCr(n,r){
 if(!isInt(n)||!isInt(r)||r.p<0||r.p>n.p)throw ME;
 const m=Math.min(r.p,n.p-r.p);let x=1;
 for(let i=0;i<m;i++)x=x*(n.p-i)/(i+1);
 return fl(Math.round(x))}
const RX=/\s*(\d+\.?\d*|\.\d+|sin⁻¹\(|cos⁻¹\(|tan⁻¹\(|sin\(|cos\(|tan\(|log\(|ln\(|√\(|∛\(|abs\(|nPr|nCr|Ans|π|e|[A-FXYM]|[+\-×÷^()!%])/y;
function evaluate(src,ctx){
 const T=[];let pos=0;
 while(pos<src.length){RX.lastIndex=pos;const m=RX.exec(src);if(!m)throw SE;T.push(m[1]);pos=RX.lastIndex}
 let i=0;const peek=()=>T[i],nx=()=>T[i++];
 const F={'sin(':v=>trig('sin',v,ctx.deg),'cos(':v=>trig('cos',v,ctx.deg),'tan(':v=>trig('tan',v,ctx.deg),
  'sin⁻¹(':v=>atrig('asin',v,ctx.deg),'cos⁻¹(':v=>atrig('acos',v,ctx.deg),'tan⁻¹(':v=>atrig('atan',v,ctx.deg),
  'log(':v=>fl(Math.log10(toF(v))),'ln(':v=>fl(Math.log(toF(v))),'√(':sqrt,'∛(':cbrt,
  'abs(':v=>isO(v)?mk(Math.abs(v.p),v.q,v.r,v.k):Math.abs(v)};
 const start=t=>t!==undefined&&(/^[\d.]/.test(t)||t==='('||/\($/.test(t)||/^(π|e|Ans|[A-FXYM])$/.test(t));
 const dec=t=>{const[a,b='']=t.split('.');return mk(+((a||'0')+b),Math.pow(10,b.length))};
 const E=()=>{let v=Tm();while(peek()==='+'||peek()==='-'){const o=nx(),r=Tm();v=add(v,o==='+'?r:neg(r))}return v};
 const Tm=()=>{let v=Ch();while(peek()==='×'||peek()==='÷'){const o=nx(),r=Ch();v=o==='×'?mul(v,r):div(v,r)}return v};
 const Ch=()=>{let v=U();while(start(peek()))v=mul(v,U());return v};
 const U=()=>{const t=peek();if(t==='-'){nx();return neg(U())}if(t==='+'){nx();return U()}return P()};
 const P=()=>{
  let b=Q();
  while(peek()==='nCr'||peek()==='nPr'){const o=nx(),r=Q();b=o==='nCr'?nCr(b,r):nPr(b,r)}
  if(peek()==='^'){nx();return pow(b,U())}
  return b};
 const Q=()=>{let v=A();while(peek()==='!'||peek()==='%')v=nx()==='!'?fact(v):div(v,mk(100,1));return v};
 const A=()=>{
  const t=nx();if(t===undefined)throw SE;
  if(/^[\d.]/.test(t))return dec(t);
  if(t==='('){const v=E();if(peek()===')')nx();return v}
  if(/\($/.test(t)){const v=E();if(peek()===')')nx();return F[t](v)}
  if(t==='π')return mk(1,1,1,1);
  if(t==='e')return fl(Math.E);
  if(t==='Ans')return ctx.ans;
  if(/^[A-FXYM]$/.test(t))return ctx.vars[t]||mk(0,1);
  throw SE};
 const v=E();if(i<T.length)throw SE;return v}
function dec(v,fix){
 const x=toF(v);if(x===0)return'0';
 if(fix!=null)return x.toFixed(fix);
 const a=Math.abs(x);
 if(a<1e-2||a>=1e10){let[m,e]=x.toExponential(9).split('e');return m.replace(/\.?0+$/,'')+'×10<sup>'+(+e)+'</sup>'}
 return String(+x.toPrecision(10))}
function ex(v){
 const P=Math.abs(v.p),
  n=(P===1&&(v.r>1||v.k)?'':P)+(v.r>1?'<span class="sq">√<span class="ov">'+v.r+'</span></span>':'')+(v.k?'π':'');
 return(v.p<0?'−':'')+(v.q===1?n:'<span class="fr"><span>'+n+'</span><span>'+v.q+'</span></span>')}
function fmt(v,d,fix){
 if(isO(v)&&!d&&!(isInt(v)&&Math.abs(v.p)>=1e10))return ex(v);
 return dec(v,fix)}
G.CAS={evaluate,fmt,mk,isO,toF,ME,SE};
})(typeof window!=='undefined'?window:globalThis);
