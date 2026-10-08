(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// fonts: swap print->all (CSP-safe async load)
const gf=$('#gf');if(gf){if(gf.sheet)gf.media='all';else gf.addEventListener('load',()=>{gf.media='all'});setTimeout(()=>{gf.media='all'},2500)}
// menu
const b=$('.burger'),n=$('#nav');
if(b&&n){b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!o));n.classList.toggle('open',!o)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&n.classList.contains('open')){n.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()}});
$$('a',n).forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');b.setAttribute('aria-expanded','false')}))}
const y=$('#yr');if(y)y.textContent=new Date().getFullYear();

// forms
const T0=Date.now();
const dest=()=>atob('aW5mbw==')+String.fromCharCode(64)+atob('ZXlldG9hZA==')+'.'+atob('Y29t');
$$('form[data-lead]').forEach(f=>{
  let touched=false;['pointerdown','keydown','touchstart','input'].forEach(ev=>f.addEventListener(ev,()=>{touched=true},{passive:true}));
  const st=$('.status',f),btn=$('button[type=submit]',f);
  const say=(m,c)=>{st.textContent=m;st.className='status '+(c||'')};
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    if(f._honey&&f._honey.value){say('Thanks!','ok');return}
    if(!touched||Date.now()-T0<3500){say('One moment, please try again in a few seconds.','err');return}
    const d=new FormData(f);d.delete('_honey');
    const name=(d.get('name')||'').trim(),email=(d.get('email')||'').trim(),phone=(d.get('phone')||'').trim();
    if(name.length<2||name.length>80){say('Please add your name.','err');return}
    if(!/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(email)&&phone.replace(/\D/g,'').length<10){say('Please add a valid email or phone so we can reply.','err');return}
    for(const [k,v] of d.entries()){if(typeof v==='string'&&v.length>(k==='goals'?2000:200)){say('That message is a little long. Please shorten it.','err');return}}
    const body={};d.forEach((v,k)=>{body[k]=v});
    body._subject='Littleton lead: '+(body.business||name)+' (seolittletonco.com'+location.pathname+')';
    body._template='table';body._captcha='false';body.page=location.pathname;
    btn.disabled=true;say('Sending…');
    try{
      const r=await fetch(['https:','','form'+'submit.co','aj'+'ax',dest()].join('/'),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)});
      let j=null;try{j=await r.json()}catch(_){}
      if(r.ok&&j&&(j.success===true||j.success==='true')){say('Sent. Thank you! We reply within one business day. Need us sooner? Call 1-800-481-8638.','ok');f.reset()}
      else if(r.ok){say('Your message went out, but we could not confirm delivery. To be safe, call 1-800-481-8638.','err')}
      else{say('That did not go through. Please call 1-800-481-8638 and we will help right away.','err')}
    }catch(_){say('No connection. Please call 1-800-481-8638 and we will help right away.','err')}
    finally{btn.disabled=false}
  });
});

// TOOL 1: Littleton local visibility check
const vc=$('#vis-check');
if(vc){vc.addEventListener('submit',e=>{e.preventDefault();
  const qs=$$('fieldset[data-w]',vc);const left=qs.filter(q=>!$('input:checked',q)).length;if(left){const o=$('#vis-out');o.hidden=false;$('#vis-grade',o).textContent='Almost there';$('#vis-gaps',o).textContent='';$('#vis-msg',o).textContent='Answer all '+qs.length+' questions ('+left+' left) for an accurate grade. Not sure? Pick the middle option.';return}let score=0,max=0;const gaps=[];
  qs.forEach(q=>{const w=+q.dataset.w;max+=w;const v=($('input:checked',q)||{}).value;if(v==='y')score+=w;else if(v==='s')score+=w/2;if(v!=='y')gaps.push(q.dataset.gap)});
  const pct=Math.round(score/max*100),g=pct>=90?'A':pct>=75?'B':pct>=60?'C':pct>=40?'D':'F';
  const out=$('#vis-out');out.hidden=false;
  $('#vis-grade',out).textContent=g+' · '+pct+'/100';
  $('#vis-needle',out).style.left='calc('+pct+'% - 2px)';
  const ul=$('#vis-gaps',out);ul.textContent='';gaps.slice(0,6).forEach(t=>{const li=document.createElement('li');li.textContent=t;ul.appendChild(li)});
  $('#vis-msg',out).textContent=gaps.length?'These are the gaps standing between you and more Littleton calls. A full audit shows exactly how to close each one, in order.':'Strong foundation. The next gains come from content depth, links and AI citations, which a full audit maps out.';
  out.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});
})}

// TOOL 2: Littleton keyword difficulty estimator (illustrative)
const kd=$('#kd-form');
if(kd){const hard={lawyer:30,attorney:30,law:22,injury:34,dentist:24,dental:24,implant:20,orthodont:18,roof:26,roofer:26,hvac:24,furnace:18,plumber:24,plumbing:22,'med spa':22,botox:20,realtor:26,'real estate':26,insurance:28,seo:28,marketing:22,chiropract:18,therapist:14,electrician:18,landscap:12,painter:12,cleaning:12,restaurant:10,coffee:6,boutique:6,salon:10,vet:14,auto:14,mortgage:28,remodel:18,bath:14,storage:12,pest:16,moving:16};
 const local=['littleton','ken caryl','columbine','aspen grove','main street','downtown littleton','roxborough','chatfield','80120','80123','80127','80128','mineral','santa fe'];
 kd.addEventListener('submit',e=>{e.preventDefault();
  const q=($('#kd-q').value||'').toLowerCase().trim().slice(0,120);if(q.length<3)return;
  let s=34;Object.keys(hard).forEach(k=>{if(q.includes(k))s+=hard[k]});
  const words=q.split(/\s+/).filter(Boolean).length;s-=Math.max(0,words-3)*6;
  if(local.some(l=>q.includes(l)))s-=8;if(/near me/.test(q))s+=6;if(/best|top/.test(q))s+=8;if(/emergency|24|same day/.test(q))s+=5;if(/how|what|why|cost|price/.test(q))s-=10;
  s=Math.max(5,Math.min(96,Math.round(s)));
  const lab=s<35?'Easier':s<65?'Moderate':'Competitive';
  const out=$('#kd-out');out.hidden=false;$('#kd-score',out).textContent=s+'/100 · '+lab;$('#kd-needle',out).style.left='calc('+s+'% - 2px)';
  $('#kd-msg',out).textContent=s<35?'A focused page with clean local signals can compete here. The win is in speed: claim it before a competitor does.':s<65?'Winnable with a dedicated page, strong Google Business Profile signals and steady reviews. Expect a few months of compounding work.':'Crowded. You will need authority, reviews and a longer runway, or a smarter long-tail angle that wins sooner. A real audit finds that angle.';
 })}
})();
