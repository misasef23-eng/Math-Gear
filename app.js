(()=>{
const {evaluate,fmt,mk}=CAS,$=s=>document.querySelector(s);
const CSS='.lcd{background:#cdd6bd;color:#1a2216;border-radius:8px;padding:8px 10px;font:18px/1.4 ui-monospace,Menlo,Consolas,monospace}.lcd .e{opacity:.8;font-size:15px;word-break:break-all}.lcd .r{text-align:right;font-size:22px;margin-bottom:4px}.fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin:0 2px;line-height:1.15}.fr>span:first-child{border-bottom:2px solid;padding:0 3px}.fr>span+span{padding:0 3px}.sq{white-space:nowrap}.ov{border-top:2px solid;padding:0 1px}.cr{display:inline-block;width:2px;height:1.1em;background:currentColor;vertical-align:text-bottom;animation:bl 1s steps(1) infinite}@keyframes bl{50%{opacity:0}}.err{color:#a11}';
document.head.insertAdjacentHTML('beforeend','<style>'+CSS+'</style>');
const W='sin⁻¹\\(|cos⁻¹\\(|tan⁻¹\\(|sin\\(|cos\\(|tan\\(|log\\(|ln\\(|√\\(|∛\\(|abs\\(|nPr|nCr|Ans',TL=new RegExp('('+W+'|.)$'),TR=new RegExp('^('+W+'|.)');
const st={inp:'',cur:0,hist:[],deg:1,fix:null,sh:0,al:0,dec:0,hi:-1,err:'',msg:'',sto:0,ans:mk(0,1),vars:{}};
const n=d=>[d,d,'','','','','n'];
const K=[
['x⁻¹','^(-1)','x!','!'],['nCr','nCr','nPr','nPr'],['√','√(','∛','∛('],['x²','^2','x³','^3'],['^','^'],
['log','log(','10ˣ','10^(','B','B'],['ln','ln(','eˣ','e^(','C','C'],['(−)','-','','','A','A'],['(','(','Abs','abs(','Y','Y'],[')',')','','','X','X'],
['sin','sin(','sin⁻¹','sin⁻¹(','D','D'],['cos','cos(','cos⁻¹','cos⁻¹(','E','E'],['tan','tan(','tan⁻¹','tan⁻¹(','F','F'],['STO','@sto','RCL','@rcl'],['S⇔D','@sd'],
n('7'),n('8'),n('9'),['DEL','@del','','','','','o'],['AC','@ac','','','','','o'],
n('4'),n('5'),n('6'),['×','×','','','','','n'],['÷','÷','','','','','n'],
n('1'),n('2'),n('3'),['+','+','','','','','n'],['−','-','','','','','n'],
n('0'),n('.'),['×10ˣ','×10^(','π','π','e','e','n'],['Ans','Ans','','','M','M','n'],['=','@eq','','','','','eq']];
const NAV=[['SHIFT','@sh'],['ALPHA','@al'],['◀','@l'],['▶','@r'],['▲','@u'],['▼','@d']];
const kb=(k,i,c)=>`<button class="k ${c||k[6]||''}" data-i="${i}"><i>${k[2]||''}</i><b>${k[4]||''}</b>${k[0]}</button>`;
$('#keys').innerHTML=K.map((k,i)=>kb(k,i)).join('');
$('#nav').innerHTML=NAV.map((k,i)=>kb(k,100+i,'m')).join('');
$('#fx').innerHTML='<option value="">Norm</option>'+[...Array(10).keys()].map(i=>`<option value="${i}">Fix ${i}</option>`).join('');
const KEY=i=>i>=100?NAV[i-100]:K[i];
const row=(x,d)=>`<div class="e">${x.e}</div><div class="r">${fmt(x.v,d,st.fix)}</div>`;
function lcdHTML(m,caret){
 const h=st.hist.slice(-m).map((x,i,a)=>row(x,caret&&i===a.length-1&&!st.inp&&st.dec)).join('');
 const t=caret?st.inp.slice(0,st.cur)+'<span class="cr"></span>'+st.inp.slice(st.cur):st.inp;
 return h+(caret||st.inp?`<div class="e">${t}</div>`:'')+(caret&&st.err?`<div class="r err">${st.err}</div>`:'')}
function draw(){
 const l=$('#lcd');l.innerHTML=lcdHTML(6,1);l.scrollTop=l.scrollHeight;
 $('#bar').innerHTML=(st.sh?'<b>S</b>':'')+(st.al?'<b>A</b>':'')+`<span>${st.deg?'D':'R'}</span>`+(st.fix!=null?`<span>Fix ${st.fix}</span>`:'')+`<span>${st.msg}</span>`;
 $('#dr').textContent=st.deg?'Độ (Deg)':'Radian (Rad)'}
function ins(s){
 st.err='';
 if(!st.inp&&/^[+×÷^!]/.test(s))s='Ans'+s;
 st.inp=st.inp.slice(0,st.cur)+s+st.inp.slice(st.cur);st.cur+=s.length;st.hi=-1}
const ACT={
 '@eq'(){if(!st.inp)return;
  try{st.ans=evaluate(st.inp,{deg:st.deg,ans:st.ans,vars:st.vars});st.hist.push({e:st.inp,v:st.ans});st.inp='';st.cur=0;st.dec=0;st.hi=-1;st.err=''}
  catch(e){st.err=typeof e==='string'?e:'Syntax ERROR'}},
 '@sd'(){if(!st.inp&&st.hist.length)st.dec=!st.dec},
 '@sto'(){st.sto=1;st.al=1;st.msg='STO: nhấn biến A–F, X, Y, M'},
 '@rcl'(){st.al=1},
 '@del'(){const m=st.inp.slice(0,st.cur).match(TL);if(m){st.inp=st.inp.slice(0,st.cur-m[0].length)+st.inp.slice(st.cur);st.cur-=m[0].length}st.err=''},
 '@ac'(){st.inp='';st.cur=0;st.err='';st.hi=-1;st.sto=0},
 '@l'(){const m=st.inp.slice(0,st.cur).match(TL);if(m)st.cur-=m[0].length},
 '@r'(){const m=st.inp.slice(st.cur).match(TR);if(m)st.cur+=m[0].length},
 '@u'(){if(!st.hist.length)return;st.hi=st.hi<0?st.hist.length-1:Math.max(0,st.hi-1);st.inp=st.hist[st.hi].e;st.cur=st.inp.length;st.err=''},
 '@d'(){if(st.hi<0)return;st.hi++;st.inp=st.hi>=st.hist.length?(st.hi=-1,''):st.hist[st.hi].e;st.cur=st.inp.length}};
function run(s){
 st.msg='';
 if(s==='@sh'){st.sh=!st.sh;st.al=0}
 else if(s==='@al'){st.al=!st.al;st.sh=0}
 else{st.sh=st.al=0;
  if(s[0]==='@')ACT[s]();
  else if(st.sto&&/^[A-FXYM]$/.test(s)){st.vars[s]=st.ans;st.sto=0;st.msg='Đã lưu Ans vào '+s}
  else ins(s)}
 draw()}
function press(k){
 let s=k[1];
 if(st.sh&&k[3])s=k[3];else if(st.al&&k[5])s=k[5];
 run(s)}
document.addEventListener('click',e=>{const b=e.target.closest('.k');if(b)press(KEY(+b.dataset.i))});
const MAP={s:'sin(',c:'cos(',t:'tan(',l:'log(',n:'ln(',r:'√(',p:'π',a:'Ans',e:'e','*':'×','/':'÷'};
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.metaKey||e.altKey||/^(SELECT|INPUT)$/.test(e.target.tagName))return;
 const k=e.key;let s=null;
 if(/^[\d.+\-^()!%]$/.test(k))s=k;
 else if(/^[A-FXYM]$/.test(k))s=k;
 else if(MAP[k])s=MAP[k];
 else if(k==='Enter'||k==='=')s='@eq';
 else if(k==='Backspace')s='@del';
 else if(k==='Escape')s='@ac';
 else if(k==='ArrowLeft')s='@l';else if(k==='ArrowRight')s='@r';
 else if(k==='ArrowUp')s='@u';else if(k==='ArrowDown')s='@d';
 if(s){e.preventDefault();run(s)}});
$('#dr').onclick=()=>{st.deg=!st.deg;draw()};
$('#fx').onchange=e=>{st.fix=e.target.value===''?null:+e.target.value;draw()};
$('#big').onclick=()=>$('#casio').classList.toggle('big');
// Chụp màn hình LCD (kèm lịch sử) -> PNG
const say=t=>{$('#sm').textContent=t};
async function shot(copy){
 if(!st.hist.length&&!st.inp)return say('Chưa có gì để chụp, hãy tính một phép tính trước.');
 const w=420,html=lcdHTML(+$('#nh').value,0),d=document.createElement('div');
 d.style.cssText='position:fixed;left:-9999px;width:'+w+'px';d.innerHTML='<div class="lcd">'+html+'</div>';
 document.body.appendChild(d);const h=d.firstChild.offsetHeight;d.remove();
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w*2}" height="${h*2}" viewBox="0 0 ${w} ${h}"><foreignObject width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml"><style>${CSS}</style><div class="lcd">${html}</div></div></foreignObject></svg>`;
 try{
  const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();
  const c=document.createElement('canvas');c.width=w*2;c.height=h*2;c.getContext('2d').drawImage(img,0,0);
  const blob=await new Promise(r=>c.toBlob(r,'image/png'));
  if(copy&&navigator.clipboard&&window.ClipboardItem){
   try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);return say('Đã sao chép ảnh, hãy dán vào nơi cần dùng.')}catch(_){}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='may-tinh-casio.png';a.click();
  say(copy?'Trình duyệt không cho sao chép ảnh, đã tải ảnh về máy.':'Đã tải ảnh về máy.')
 }catch(_){say('Không tạo được ảnh trên trình duyệt này.')}}
$('#cp').onclick=()=>shot(1);$('#dl').onclick=()=>shot(0);
// Khu affiliate
const L={shopee:['Shopee','#ee4d2d'],tiktok:['TikTok Shop','#161823'],lazada:['Lazada','#0f146d']};
const btns=l=>Object.keys(L).map(k=>l&&l[k]?`<a class="b" style="background:${L[k][1]}" href="${l[k]}" target="_blank" rel="sponsored noopener">${L[k][0]}</a>`:`<span class="b off" title="Chưa gắn link">${L[k][0]}</span>`).join('');
const P=window.PRODUCTS||{calculators:[],items:[]};
$('#buy').innerHTML=(P.calculators[0]?btns(P.calculators[0].links):'');
$('#items').innerHTML=P.items.map(i=>`<div class="it"><div class="ph">${i.img?`<img src="${i.img}" alt="${i.name}">`:'Ảnh sản phẩm'}</div><b>${i.name}</b><div class="buy">${btns(i.links)}</div></div>`).join('');
draw();
})();
