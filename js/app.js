fetch('data/content.json').then(function(r){return r.json();}).then(function(STATE){
var editing=false, backup=null, artifactNS=null, menuOpen=false, msg='', motivo=0;
var DIAS=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
var MESES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
var MOTIVOS=[
  {t:'Petición de oración',s:'Oramos por ti y tu familia',m:'Hola, quiero dejar una petición de oración'},
  {t:'Acepté a Jesús',s:'Te acompañamos en tu siguiente paso',m:'Hola, acepté a Jesús y quiero saber cuál es mi siguiente paso'},
  {t:'Mi testimonio',s:'Cuéntanos lo que Dios hizo',m:'Hola, quiero compartir mi testimonio'},
  {t:'Necesito ayuda',s:'Conversemos, estamos para servirte',m:'Hola, necesito conversar con alguien de la iglesia'}
];
var app=document.getElementById('app');

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function get(p){return p.split('.').reduce(function(o,k){return o==null?o:o[k];},STATE);}
function set(p,v){var ks=p.split('.'),o=STATE;for(var i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks[ks.length-1]]=v;}
function T(p,tag,cls,extra){tag=tag||'span';
  return '<'+tag+(cls?' class="'+cls+'"':'')+(extra||'')+(editing?' contenteditable="true" data-edit="'+p+'" spellcheck="true"':'')+'>'+esc(get(p))+'</'+tag+'>';}
function digits(s){return String(s||'').replace(/\D/g,'');}
function waLink(t){return 'https://wa.me/'+digits(STATE.contacto.whatsapp)+(t?'?text='+encodeURIComponent(t):'');}
function C(){return STATE.contacto;}
function mapsLink(){return C().mapaUrl||('https://www.google.com/maps/search/?api=1&query='+C().lat+','+C().lon);}
function wazeLink(){return 'https://waze.com/ul?ll='+C().lat+','+C().lon+'&navigate=yes';}
function appleLink(){return 'https://maps.apple.com/?ll='+C().lat+','+C().lon+'&q='+encodeURIComponent('CCINT Tiempo Nuevo');}
function dms(v,pos,neg){var a=Math.abs(+v),d=Math.floor(a),mf=(a-d)*60,m=Math.floor(mf),s=((mf-m)*60).toFixed(1);return d+'° '+m+'′ '+s+'″ '+(+v<0?neg:pos);}
var ext=' target="_blank" rel="noopener"';

var I={
  fb:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z"/></svg>',
  yt:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/></svg>',
  wa:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

// ---------- schedule ----------
function nextService(onlyLive){
  var now=new Date(),best=null;
  (STATE.horarios||[]).forEach(function(h){
    if(onlyLive&&!h.vivo)return;
    var p=String(h.hora||'').split(':'),hh=+p[0]||0,mm=+p[1]||0;
    for(var add=0;add<=7;add++){
      var d=new Date(now);d.setDate(now.getDate()+add);d.setHours(hh,mm,0,0);
      if(d.getDay()!==+h.d)continue;
      var end=new Date(d.getTime()+2*3600e3);
      if(end<now)continue;
      if(!best||d<best.date)best={date:d,h:h};
      break;
    }
  });
  if(best)best.live=best.date<=now;
  return best;
}
function relTime(n){
  if(!n)return '';
  if(n.live)return 'ahora mismo';
  var ms=n.date-new Date(),m=Math.round(ms/60000),h=Math.floor(m/60),d=Math.floor(h/24);
  var today=new Date(),tom=new Date();tom.setDate(today.getDate()+1);
  if(n.date.toDateString()===today.toDateString())return h>=1?'hoy, en '+h+' h '+(m%60)+' min':'hoy, en '+m+' min';
  if(n.date.toDateString()===tom.toDateString())return 'mañana';
  return 'en '+d+' día'+(d===1?'':'s');
}
function pad(n){return (n<10?'0':'')+n;}
function tick(){
  var nl=nextService(true);
  document.querySelectorAll('[data-rel]').forEach(function(el){var t='('+relTime(nl)+')';if(el.textContent!==t)el.textContent=t;});
  document.querySelectorAll('[data-clock]').forEach(function(el){
    if(!nl){el.innerHTML='';return;}
    var s=Math.max(0,Math.floor((nl.date-new Date())/1000));
    var parts=[[Math.floor(s/86400),'días'],[Math.floor(s%86400/3600),'horas'],[Math.floor(s%3600/60),'min'],[s%60,'seg']];
    el.innerHTML=nl.live?'<div style="min-width:auto;padding:14px 18px"><b style="font-size:1.6rem">EN VIVO</b><small>transmitiendo ahora</small></div>':parts.map(function(p){return '<div><b>'+pad(p[0])+'</b><small>'+p[1]+'</small></div>';}).join('');
  });
}

// ---------- calendar ----------
var calNow=new Date(), calY=calNow.getFullYear(), calM=calNow.getMonth(), calSel=null;
var MESES_L=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function iso(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());}
function itemsOn(d){
  var key=iso(d),out=[];
  (STATE.horarios||[]).forEach(function(h){if(+h.d===d.getDay())out.push({ev:false,hora:h.hora,t:h.nombre,s:h.hora+' h'+(h.vivo?' · también en vivo por Facebook':'')});});
  (STATE.eventos||[]).forEach(function(e){if(e.fecha===key)out.push({ev:true,hora:'',t:e.titulo,s:e.texto});});
  out.sort(function(a,b){return String(a.hora).localeCompare(String(b.hora));});
  return out;
}
function calendar(){
  var first=new Date(calY,calM,1), days=new Date(calY,calM+1,0).getDate(), lead=(first.getDay()+6)%7;
  var todayKey=iso(new Date()), cells='';
  ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(function(d){cells+='<span class="dow">'+d+'</span>';});
  for(var i=0;i<lead;i++)cells+='<span class="day out" aria-hidden="true"></span>';
  for(var n=1;n<=days;n++){
    var d=new Date(calY,calM,n),k=iso(d),its=itemsOn(d);
    cells+='<button class="day'+(k===todayKey?' today':'')+(k===calSel?' sel':'')+(k<todayKey?' past':'')+'" data-day="'+k+'" aria-label="'+n+' de '+MESES_L[calM]+(its.length?', '+its.length+' actividad'+(its.length>1?'es':''):'')+'"><span class="n">'+n+'</span>'+
      its.map(function(it){return '<span class="it'+(it.ev?' ev':'')+'">'+esc((it.hora?it.hora+' ':'')+it.t)+'</span>';}).join('')+'</button>';
  }
  // agenda: selected day, or the rest of the month
  var list=[],title;
  if(calSel){var sd=new Date(calSel+'T12:00:00');itemsOn(sd).forEach(function(it){list.push({d:sd,it:it});});title=DIAS[sd.getDay()]+' '+sd.getDate()+' de '+MESES_L[sd.getMonth()].toLowerCase();}
  else{for(var m=1;m<=days;m++){var dd=new Date(calY,calM,m);if(iso(dd)<todayKey)continue;itemsOn(dd).forEach(function(it){list.push({d:dd,it:it});});}
    title=(calY===calNow.getFullYear()&&calM===calNow.getMonth()?'Lo que queda de ':'Todo ')+MESES_L[calM].toLowerCase();}
  var ag='<h4>'+esc(title)+'</h4>'+(list.length?list.slice(0,9).map(function(o){
    return '<div class="ag'+(o.it.ev?' is-ev':'')+'"><span class="d">'+o.d.getDate()+'<small>'+DIAS[o.d.getDay()].slice(0,3)+'</small></span><div><b>'+esc(o.it.t)+'</b><span>'+esc(o.it.s)+'</span></div></div>';}).join('')+(list.length>9?'<p style="padding-top:12px;color:var(--muted);font-size:.9rem">Y '+(list.length-9)+' más en el calendario.</p>':''):'<p style="padding-top:14px;color:var(--muted)">No hay actividades para este día.</p>');
  return '<div class="cal-grid rv"><div class="cal"><div class="cal-top"><h3>'+MESES_L[calM]+' '+calY+'</h3><div class="cal-nav"><button data-cal="-1" aria-label="Mes anterior">‹</button><button class="today-btn" data-cal="0">Hoy</button><button data-cal="1" aria-label="Mes siguiente">›</button></div></div>'+
    '<div class="days">'+cells+'</div><div class="legend"><span><i></i>Reunión semanal</span><span><i class="ev"></i>Evento especial</span></div></div>'+
    '<div class="agenda" id="agenda">'+ag+'</div></div>';
}
function rerenderCal(){var el=app.querySelector('.cal-grid');if(!el)return;if(editing)collect();var tmp=document.createElement('div');tmp.innerHTML=calendar();tmp.firstChild.classList.remove('rv');el.replaceWith(tmp.firstChild);}

// ---------- photo slot ----------
function photo(p,fallback,alt){
  var src=get(p),h=src?'<img src="'+esc(src)+'" alt="'+esc(alt||'')+'">':fallback;
  if(editing)h+='<div class="photo-tools"><label class="tool">'+(src?'Cambiar foto':'Subir foto')+'<input type="file" accept="image/*" data-photo="'+p+'"></label>'+(src?'<button class="tool" data-clear-photo="'+p+'">Quitar</button>':'')+'</div>';
  return h;
}
function addBtn(list,label){return editing?'<div class="tools"><button class="tool" data-add="'+list+'">+ '+label+'</button></div>':'';}
function delBtn(p){return editing?'<button class="x" data-del="'+p+'">Quitar</button>':'';}

// ---------- render ----------
function render(){
  var S=STATE,c=C(),nx=nextService(false),nl=nextService(true);
  var h='';

  // announcement
  if(nl){h+='<a class="announce" href="'+esc(c.facebook)+'"'+ext+'><div class="wrap"><span class="dot"></span>'+
    (nl.live?'<b>Estamos en vivo ahora</b> <u>Entrar a la transmisión</u>':'<b>Próxima transmisión en vivo: '+DIAS[+nl.h.d].toLowerCase()+' '+esc(nl.h.hora)+'</b><span class="cd" data-rel>('+esc(relTime(nl))+')</span><u>Ver en Facebook</u>')+'</div></a>';}

  // header
  h+='<header class="top" id="top"><div class="wrap">'+
    '<a class="brand" href="#inicio" aria-label="CCINT Tiempo Nuevo, inicio"><span class="mark" aria-hidden="true"></span><span class="wordmark"><small>CCINT</small><b>Tiempo Nuevo</b><small>Calera de Tango</small></span></a>'+
    '<nav class="nav'+(menuOpen?' open':'')+'" id="nav"><a href="#visitanos">Tu visita</a><a href="#pastores">Pastores</a><a href="#eventos">Calendario</a><a href="#acepte-a-jesus">Acepté a Jesús</a><a href="#ofrendas">Ofrendas</a><a href="#como-llegar">Cómo llegar</a></nav>'+
    '<div class="nav-cta">'+(artifactNS&&!editing?'<button class="edit-btn" id="edit-start">Editar página</button>':'')+
      '<a class="btn btn-primary" href="#en-vivo">'+I.play.replace('fill="#fff"','fill="currentColor"')+'Ver en línea</a>'+
      '<button class="menu-btn" id="menu-btn" aria-expanded="'+menuOpen+'" aria-controls="nav">'+(menuOpen?'Cerrar':'Menú')+'</button></div>'+
  '</div></header>';

  // hero
  h+='<main id="inicio"><section class="hero night" aria-label="Bienvenida"><div class="wrap hero-grid">'+
    '<div class="hero-copy">'+T('hero.eyebrow','p','eyebrow load')+
      '<h1 class="big">'+T('hero.l1','span','load d1')+T('hero.l2','span','l2 load d2')+T('hero.l3','span','l3 load d3')+'</h1>'+
      T('hero.texto','p','lede load d3')+
      '<div class="actions load d4"><a class="btn btn-light" href="#visitanos">Planifica tu visita '+I.arrow+'</a><a class="btn btn-ghost-night" href="#en-vivo">'+I.fb+'Míranos en vivo</a></div>'+
    '</div>'+
    '<div class="hero-art"><span class="ghost-word big" aria-hidden="true">Nuevo</span><div class="arch">'+photo('hero.foto','<span class="mark" aria-hidden="true"></span>','Pastor predicando en CCINT Tiempo Nuevo')+'</div></div>'+
  '</div>'+
  '<div class="times"><div class="wrap"><div class="times-label">Nuestras<br>reuniones</div>'+
    (S.horarios||[]).map(function(x,i){
      if(editing)return '<div class="slot"><label class="field">Día<select data-hor="'+i+'" data-k="d">'+DIAS.map(function(d,j){return '<option value="'+j+'"'+(+x.d===j?' selected':'')+'>'+d+'</option>';}).join('')+'</select></label>'+
        '<label class="field">Hora<input type="time" data-hor="'+i+'" data-k="hora" value="'+esc(x.hora)+'"></label>'+T('horarios.'+i+'.nombre','span','nm')+
        '<label class="field" style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-hor="'+i+'" data-k="vivo"'+(x.vivo?' checked':'')+'> En vivo por Facebook</label>'+
        '<button class="x" style="right:12px;color:var(--glow)" data-del="horarios.'+i+'">Quitar</button></div>';
      return '<div class="slot"><span class="day">'+DIAS[+x.d]+'</span><span class="hr">'+esc(x.hora)+'</span><span class="nm">'+esc(x.nombre)+'</span>'+(x.vivo?'<span class="fb"><span class="dot"></span>En vivo por Facebook</span>':'')+'</div>';
    }).join('')+
    (editing?'<div class="slot"><button class="tool" data-add="horarios">+ Agregar reunión</button></div>':'')+
  '</div></div></section>';

  // marquee
  var words=(S.marquee||'').split('·').map(function(w){return w.trim();}).filter(Boolean);
  if(editing){h+='<div class="marquee" style="white-space:normal"><div class="wrap" style="display:grid;gap:6px"><small style="opacity:.8">Frases de la cinta (sepáralas con ·)</small>'+T('marquee','p','','style="font-weight:700"')+'</div></div>';}
  else if(words.length){var seq=words.concat(words,words).map(function(w){return '<span>'+esc(w)+'</span>';}).join('');
    h+='<div class="marquee" aria-hidden="true"><div class="marquee-track">'+seq+seq+'</div></div>';}

  // verse of the week
  var V=S.versiculo;
  h+='<section class="verse" id="versiculo" aria-label="Versículo de la semana"><div class="wrap verse-grid">'+
    '<div class="verse-side rv"><p class="eyebrow">Versículo de la semana</p>'+T('versiculo.cita','p','ref')+T('versiculo.version','small')+'</div>'+
    '<div class="rv">'+T('versiculo.texto','p','verse-text')+
      '<p class="verse-note">'+T('versiculo.nota')+'</p>'+
      '<div class="verse-actions"><button class="btn btn-ghost" data-copy="'+esc('“'+V.texto+'” '+V.cita+' ('+V.version+')')+'" data-label="Copiar versículo">Copiar versículo</button>'+
      '<a class="btn btn-ghost" href="'+esc('https://wa.me/?text='+encodeURIComponent('“'+V.texto+'” '+V.cita))+'"'+ext+'>'+I.wa+'Compartir</a></div></div>'+
  '</div></section>';

  // ways
  var sun=(S.horarios||[]).map(function(x){return DIAS[+x.d]+' '+x.hora;}).join(' · ');
  h+='<section id="acompananos"><div class="wrap">'+
    '<div class="sec-head split-head rv"><div style="display:grid;gap:16px"><p class="eyebrow">Acompáñanos</p><h2 class="big">'+T('waysTitulo')+'</h2></div>'+T('waysTexto','p','lede')+'</div>'+
    '<div class="ways">'+
      '<a class="way rv" href="#como-llegar"><span class="kind">En persona</span><span class="word">Presencial</span><p>'+esc(sun)+'<br>'+esc(c.direccion)+'</p><span class="go">Cómo llegar<i>'+I.arrow+'</i></span></a>'+
      '<a class="way feature rv" href="'+esc(c.facebook)+'"'+ext+'><span class="live-pill"><span class="dot"></span>Live</span><span class="kind">Desde tu casa</span><span class="word">En vivo</span><p>Transmitimos el culto por Facebook'+(nl?' cada '+DIAS[+nl.h.d].toLowerCase()+' a las '+esc(nl.h.hora):'')+'. Conéctate y deja tu saludo.</p><span class="go">Ir a Facebook<i>'+I.arrow+'</i></span></a>'+
      (c.youtube?'<a class="way rv" href="'+esc(c.youtube)+'"'+ext+'><span class="kind">Cuando quieras</span><span class="word">Prédicas</span><p>Vuelve a ver las prédicas y reuniones en nuestro canal de YouTube.</p><span class="go">Ver canal<i>'+I.arrow+'</i></span></a>':'')+
    '</div></div></section>';

  // visit
  h+='<section id="visitanos" style="padding-top:0"><div class="wrap">'+
    '<div class="sec-head rv"><p class="eyebrow">Tu primera visita</p><h2 class="big">'+T('visitaTitulo')+'</h2>'+T('visitaTexto','p','lede')+'</div>'+
    '<div class="visit-grid">'+
      '<div class="rv"><div class="steps">'+S.visita.map(function(v,i){return '<div class="step">'+T('visita.'+i+'.t','h3')+T('visita.'+i+'.x','p')+'</div>';}).join('')+'</div>'+
        '<div class="kids"><strong>¿Vienes con niños?</strong>'+T('ninos','p')+'</div></div>'+
      '<div class="rv"><p class="faq-title">Preguntas frecuentes</p>'+S.faq.map(function(f,i){
        return '<details'+(editing||i===0?' open':'')+' style="position:relative"><summary>'+T('faq.'+i+'.q')+'</summary>'+T('faq.'+i+'.a','p','ans')+(editing?'<button class="tool" style="margin-bottom:14px" data-del="faq.'+i+'">Quitar pregunta</button>':'')+'</details>';}).join('')+
        addBtn('faq','Agregar pregunta')+'</div>'+
    '</div></div></section>';

  // live / last sermon
  var vf=S.vivo&&S.vivo.foto, tagA=editing?'div':'a';
  h+='<section class="live night" id="en-vivo"><div class="wrap live-grid">'+
    '<'+tagA+' class="poster rv"'+(editing?'':' href="'+esc(c.ultima||c.facebook)+'"'+ext+' aria-label="Ver la última prédica en Facebook"')+'>'+
      (vf?'<img src="'+esc(vf)+'" alt="Afiche de la última prédica">':'<span class="mark" aria-hidden="true"></span>')+
      '<span class="onair"><span class="dot"></span>Última prédica</span><span class="play">'+I.play+'</span>'+
      (editing?'<div class="photo-tools"><label class="tool">'+(vf?'Cambiar imagen':'Subir imagen')+'<input type="file" accept="image/*" data-photo="vivo.foto"></label></div>':'')+
    '</'+tagA+'>'+
    '<div class="live-copy rv"><p class="eyebrow">En vivo</p><h2 class="big">'+T('vivoTitulo')+'</h2>'+T('vivoTexto','p','lede')+
      (nl?'<div style="display:grid;gap:10px"><div class="clock" data-clock></div><p class="clock-cap">Próxima transmisión: <strong>'+DIAS[+nl.h.d]+' '+esc(nl.h.hora)+'</strong> · '+esc(nl.h.nombre)+'</p></div>':'')+
      '<div class="actions"><a class="btn btn-primary" href="'+esc(c.facebook)+'"'+ext+'>'+I.fb+'Ver en Facebook</a>'+(c.youtube?'<a class="btn btn-ghost-night" href="'+esc(c.youtube)+'"'+ext+'>'+I.yt+'Canal de YouTube</a>':'')+'</div></div>'+
  '</div></section>';

  // accepted jesus
  var A=S.acepte;
  h+='<section class="accept" id="acepte-a-jesus"><div class="wrap">'+
    '<div class="accept-head rv"><div style="display:grid;gap:18px"><p class="eyebrow">Acepté a Jesús</p><h2 class="big">'+T('acepte.titulo')+'</h2></div>'+
      '<div style="display:grid;gap:22px;justify-items:start">'+T('acepte.texto','p','lede')+'<a class="btn btn-white" href="'+esc(waLink('Hola, acepté a Jesús y quiero saber cuál es mi siguiente paso.'))+'"'+ext+'>'+I.wa+'Quiero hablar con alguien</a></div></div>'+
    '<div class="accept-steps">'+A.pasos.map(function(p,i){return '<div class="astep rv">'+T('acepte.pasos.'+i+'.t','h3')+T('acepte.pasos.'+i+'.x','p')+T('acepte.pasos.'+i+'.v','p','v')+'</div>';}).join('')+'</div>'+
    '<div class="prayer-box rv"><div><p class="eyebrow">Oración de fe</p>'+T('acepte.oracion','p','pray')+'</div>'+
      '<a class="btn btn-primary" href="'+esc(waLink('Hola, hoy hice la oración de fe y acepté a Jesús.'))+'"'+ext+'>Hice esta oración</a></div>'+
  '</div></section>';

  // pastors
  var ini=(S.pastores.nombres||'').split(/\s+y\s+/i).map(function(n){return n.trim()[0]||'';}).join('+');
  h+='<section id="pastores"><div class="wrap pastor-grid">'+
    '<div class="pastor-photo rv"><div class="arch">'+photo('pastores.foto','<span class="initials" aria-hidden="true">'+esc(ini)+'</span>','Pastores '+S.pastores.nombres)+'</div><span class="sig">Pastores de CCINT Tiempo Nuevo</span></div>'+
    '<div class="pastor-copy rv"><p class="eyebrow">Nuestros pastores</p>'+T('pastores.cita','p','quote')+T('pastores.citaAutor','p','quote-by')+
      T('pastores.nombres','p','pastor-names')+T('pastores.texto','p','lede')+
      '<div class="actions"><a class="btn btn-ghost" href="'+esc(waLink('Hola pastores, me gustaría conversar con ustedes.'))+'"'+ext+'>'+I.wa+'Escribir a los pastores</a></div></div>'+
  '</div></section>';

  // about
  h+='<section class="about" id="nosotros"><div class="wrap about-grid">'+
    '<div class="about-copy rv"><p class="eyebrow">Quiénes somos</p>'+T('nosotros.mision','p','mission')+T('nosotros.texto','p','lede')+
      '<div class="pillars"><div class="pillar"><b>Palabra</b><span>Enseñanza bíblica para la vida diaria</span></div><div class="pillar"><b>Presencia</b><span>Adoración que busca a Dios</span></div><div class="pillar"><b>Poder</b><span>Fe en la obra del Espíritu Santo</span></div></div></div>'+
    '<aside class="family night rv"><p class="eyebrow">Familia CCINT</p>'+
      '<dl><div><dt>Iglesia madre</dt><dd>Centro Cristiano Internacional, San Joaquín</dd></div>'+
      '<div><dt>Pastores generales</dt><dd>Billy y Claudia Bunster</dd></div>'+
      '<div><dt>Cobertura</dt><dd>Ministerios Ebenezer · Apóstol Sergio Enríquez</dd></div></dl>'+
      '<p class="soon">Cristo viene pronto</p>'+
      '<a class="btn btn-ghost-night" href="https://ccint.cl/"'+ext+'>Conoce CCINT '+I.arrow+'</a></aside>'+
  '</div></section>';

  // ministries
  h+='<section id="ministerios"><div class="wrap">'+
    '<div class="sec-head split-head rv"><div style="display:grid;gap:16px"><p class="eyebrow">Ministerios</p><h2 class="big">'+T('minTitulo')+'</h2></div>'+T('minTexto','p','lede')+'</div>'+
    '<div class="min-grid">'+S.ministerios.map(function(m,i){return '<div class="min rv">'+T('ministerios.'+i+'.n','h3')+T('ministerios.'+i+'.x','p')+delBtn('ministerios.'+i)+'</div>';}).join('')+'</div>'+
    addBtn('ministerios','Agregar ministerio')+
  '</div></section>';

  // events
  var evs=S.eventos.map(function(e,i){return {e:e,i:i};}).sort(function(a,b){return String(a.e.fecha).localeCompare(String(b.e.fecha));});
  h+='<section id="eventos" style="padding-top:0"><div class="wrap">'+
    '<div class="sec-head split-head rv"><div style="display:grid;gap:16px"><p class="eyebrow">Calendario</p><h2 class="big">'+T('evTitulo')+'</h2></div><p class="lede">Nuestras reuniones de cada semana y los eventos especiales del mes.</p></div>'+
    calendar()+
    '<p class="faq-title" style="margin-top:clamp(48px,6vw,72px)">Eventos especiales</p>'+
    '<div class="events-list">'+(evs.length?evs.map(function(o){var e=o.e,i=o.i,p=String(e.fecha||'').split('-');
      var dH=editing?'<label class="field">Fecha<input type="date" data-ev="'+i+'" value="'+esc(e.fecha)+'"></label>':'<div class="date"><span class="dd">'+esc(p[2]||'')+'</span><span class="mm">'+(MESES[(+p[1]||1)-1])+' '+esc(p[0]||'')+'</span></div>';
      var tag=e.ejemplo?(editing?'<button class="tag" data-unex="'+i+'" title="Quitar etiqueta">Ejemplo ×</button>':'<span class="tag">Ejemplo</span>'):(editing?'<button class="tag" data-del="eventos.'+i+'">Quitar</button>':'');
      return '<article class="ev rv">'+dH+'<div class="ev-body">'+T('eventos.'+i+'.titulo','h3')+T('eventos.'+i+'.texto','p')+'</div>'+tag+'</article>';}).join(''):'<p class="lede" style="padding-block:24px">No hay eventos publicados por ahora. Síguenos en Facebook para enterarte de lo próximo.</p>')+'</div>'+
    addBtn('eventos','Agregar evento')+
  '</div></section>';

  // giving
  var G=S.ofrendas, pend=G.datos.some(function(d){return /por completar/i.test(d.v);});
  h+='<section class="give night" id="ofrendas"><div class="wrap give-grid">'+
    '<div class="rv" style="display:grid;gap:22px;min-width:0"><p class="eyebrow">Ofrendas y diezmos</p><h2 class="big">'+T('ofrendas.titulo')+'</h2>'+T('ofrendas.texto','p','lede')+T('ofrendas.verso','p','give-verse')+'</div>'+
    '<div class="bank rv"><div class="bank-top"><b>Transferencia</b>'+(pend?'<span class="pending">Datos por completar</span>':'')+'</div>'+
      G.datos.map(function(d,i){var todo=/por completar/i.test(d.v);
        return '<div class="brow">'+T('ofrendas.datos.'+i+'.k','span','k')+T('ofrendas.datos.'+i+'.v','span','v'+(todo?' todo':''))+(todo||editing?'<span></span>':'<button class="cp" data-copy="'+esc(d.v)+'" data-label="Copiar">Copiar</button>')+'</div>';}).join('')+
      (pend&&!editing?'':'<button class="btn btn-primary" data-copy="'+esc(G.datos.map(function(d){return d.k+': '+d.v;}).join('\n'))+'" data-label="Copiar todos los datos">Copiar todos los datos</button>')+
    '</div></div></section>';

  // serve
  h+='<section class="serve" id="contacto"><div class="wrap serve-grid">'+
    '<div class="rv" style="display:grid;gap:20px;min-width:0"><p class="eyebrow">Estamos para servirte</p><h2 class="big">'+T('servirTitulo')+'</h2>'+T('servirTexto','p','lede')+
      '<div class="tiles" role="group" aria-label="Motivo del mensaje">'+MOTIVOS.map(function(m,i){return '<button class="tile" type="button" data-mot="'+i+'" aria-pressed="'+(motivo===i)+'"><b>'+m.t+'</b><span>'+m.s+'</span></button>';}).join('')+'</div></div>'+
    '<form class="form rv" id="prayer" novalidate><p class="form-title" id="f-title">'+esc(MOTIVOS[motivo].t)+'</p>'+
      '<label for="p-name">Tu nombre<input id="p-name" autocomplete="given-name" placeholder="Opcional"></label>'+
      '<label for="p-text">Tu mensaje<textarea id="p-text" placeholder="Escríbenos aquí"></textarea></label>'+
      '<a class="btn btn-primary" id="p-send" href="'+esc(waLink(''))+'"'+ext+'>'+I.wa+'Enviar por WhatsApp</a>'+
      '<small>Se abre WhatsApp con tu mensaje listo para enviar. Lo recibe el equipo de la iglesia.</small></form>'+
  '</div></section>';

  // directions
  h+='<section id="como-llegar"><div class="wrap">'+
    '<div class="sec-head rv"><p class="eyebrow">Cómo llegar</p></div>'+
    '<div class="dir-grid"><div class="dir-info rv">'+T('contacto.direccion','h2','addr')+
      '<p class="coords">'+esc(c.comuna)+'<br><br>'+dms(c.lat,'N','S')+' · '+dms(c.lon,'E','O')+'</p>'+
      '<div class="nav-apps"><a class="btn btn-primary" href="'+esc(mapsLink())+'"'+ext+'>'+I.pin+'Google Maps</a><a class="btn btn-ghost" href="'+esc(wazeLink())+'"'+ext+'>Waze</a><a class="btn btn-ghost" href="'+esc(appleLink())+'"'+ext+'>Apple Maps</a></div>'+
      '<div class="how"><div class="how-row"><span class="k">En auto</span>'+T('llegar.auto','p')+'</div><div class="how-row"><span class="k">En micro</span>'+T('llegar.micro','p')+'</div><div class="how-row"><span class="k">WhatsApp</span><p><span id="wa-num">'+T('contacto.whatsapp')+'</span> · <button class="link" style="background:none;border:0;padding:0;font:inherit;font-weight:700;cursor:pointer" data-copy="'+esc(c.whatsapp)+'" data-label="Copiar">Copiar</button></p></div></div>'+
      T('llegar.nota','p','lede')+
      (editing?'<div class="links-panel">'+
        '<label class="field">Página de Facebook<input type="url" id="f-fb" data-link="facebook" value="'+esc(c.facebook)+'"></label>'+
        '<label class="field">Última prédica (enlace del video)<input type="url" id="f-last" data-link="ultima" value="'+esc(c.ultima||'')+'"></label>'+
        '<label class="field">Canal de YouTube<input type="url" id="f-yt" data-link="youtube" value="'+esc(c.youtube||'')+'"></label>'+
        '<label class="field">Enlace de Google Maps<input type="url" id="f-map" data-link="mapaUrl" value="'+esc(c.mapaUrl||'')+'"></label></div>':'')+
    '</div>'+
    '<a class="map rv" href="'+esc(mapsLink())+'"'+ext+' aria-label="Abrir ubicación en Google Maps">'+
      '<svg viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+
        Array.from({length:16},function(_,i){return '<line class="grid-line" x1="'+(i*40)+'" y1="0" x2="'+(i*40)+'" y2="460"/>';}).join('')+
        Array.from({length:12},function(_,i){return '<line class="grid-line" x1="0" y1="'+(i*40)+'" x2="600" y2="'+(i*40)+'"/>';}).join('')+
        '<path class="road" d="M-20 420 C 160 360, 260 280, 300 230 S 470 60, 640 20"/><path class="road-in" d="M-20 420 C 160 360, 260 280, 300 230 S 470 60, 640 20"/>'+
        '<text class="road-label" x="360" y="190" transform="rotate(-33 360 190)">Av. Calera de Tango</text>'+
        '<circle class="ring" cx="300" cy="230" r="18"/><circle class="ring r2" cx="300" cy="230" r="18"/>'+
        '<circle cx="300" cy="230" r="11" fill="#E0676D" stroke="#fff" stroke-width="4"/>'+
      '</svg>'+
      '<span class="compass">N<svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true"><path d="M7 0l6 22-6-5-6 5z" fill="currentColor"/></svg></span>'+
      '<span class="pin-card"><b>CCINT Tiempo Nuevo</b><span>'+esc(c.paradero||'Paradero 7½')+'</span></span>'+
      '<span class="open"><span>Esquema de referencia.<br><b>Toca para abrir el mapa real.</b></span><i>Abrir mapa</i></span>'+
    '</a></div></div></section></main>';

  // footer
  h+='<footer class="night"><div class="wrap"><div class="foot-grid">'+
    '<div style="display:grid;gap:18px;align-content:start"><a class="brand" href="#inicio"><span class="mark" aria-hidden="true"></span><span class="wordmark"><small>CCINT</small><b>Tiempo Nuevo</b><small>Calera de Tango</small></span></a><p>Creemos en nuevos comienzos. Te esperamos.</p></div>'+
    '<div><h4>Reuniones</h4><ul>'+(S.horarios||[]).map(function(x){return '<li>'+DIAS[+x.d]+' · '+esc(x.hora)+'</li>';}).join('')+'</ul></div>'+
    '<div><h4>Visítanos</h4><ul><li>'+esc(c.direccion)+'</li><li>'+esc(c.comuna)+'</li><li><a href="'+esc(mapsLink())+'"'+ext+'>Abrir en Google Maps</a></li></ul></div>'+
    '<div><h4>Síguenos</h4><ul><li><a href="'+esc(c.facebook)+'"'+ext+'>Facebook</a></li>'+(c.youtube?'<li><a href="'+esc(c.youtube)+'"'+ext+'>YouTube</a></li>':'')+'<li><a href="'+esc(waLink(''))+'"'+ext+'>WhatsApp</a></li><li><a href="https://ccint.cl/"'+ext+'>ccint.cl</a></li></ul></div>'+
  '</div><div class="giant" aria-hidden="true">Tiempo Nuevo</div>'+
  '<div class="fine"><span>Iglesia de Cristo Centro Cristiano Internacional · CCINT Tiempo Nuevo</span><span>Calera de Tango, Chile</span></div></div></footer>';

  h+='<a class="wa-float" href="'+esc(waLink('Hola, tengo una consulta'))+'"'+ext+' aria-label="¿Necesitas ayuda? Escríbenos por WhatsApp">'+I.wa+'<span>¿Necesitas ayuda?</span></a>';

  if(editing){
    h+='<div class="editbar" role="region" aria-label="Modo edición"><p><strong>Modo edición.</strong> Haz clic en cualquier texto con borde punteado para cambiarlo. Sube fotos, agrega o quita reuniones, preguntas, ministerios y eventos. Los enlaces están en "Cómo llegar".</p>'+
      '<div class="btns"><button class="btn btn-ghost" id="edit-cancel">Descartar cambios</button><button class="btn btn-primary" id="edit-save">Guardar y publicar</button></div>'+(msg?'<p class="msg" role="status">'+esc(msg)+'</p>':'')+'</div>';
  }

  var pn=document.getElementById('p-name'),pt=document.getElementById('p-text'),keep=pn?[pn.value,pt.value]:null;
  app.innerHTML=h;
  if(keep){document.getElementById('p-name').value=keep[0];document.getElementById('p-text').value=keep[1];}
  updateWa();
  document.body.classList.toggle('editing',editing);
  onScroll();tick();
}

function updateWa(){
  var a=document.getElementById('p-send');if(!a)return;
  var n=document.getElementById('p-name').value.trim(),x=document.getElementById('p-text').value.trim();
  a.href=waLink(MOTIVOS[motivo].m+(n?' (soy '+n+')':'')+(x?':\n'+x:'.'));
}
function onScroll(){
  var top=document.getElementById('top'),hero=document.querySelector('.hero');if(!top||!hero)return;
  top.classList.toggle('solid',menuOpen||hero.getBoundingClientRect().bottom<80);
}
window.addEventListener('scroll',onScroll,{passive:true});

// ---------- edit plumbing ----------
function collect(){
  app.querySelectorAll('[data-edit]').forEach(function(el){set(el.getAttribute('data-edit'),el.textContent.replace(/\s+/g,' ').trim());});
  app.querySelectorAll('[data-hor]').forEach(function(el){var o=STATE.horarios[+el.getAttribute('data-hor')],k=el.getAttribute('data-k');o[k]=k==='vivo'?el.checked:(k==='d'?+el.value:el.value);});
  app.querySelectorAll('[data-ev]').forEach(function(el){STATE.eventos[+el.getAttribute('data-ev')].fecha=el.value;});
  app.querySelectorAll('[data-link]').forEach(function(el){STATE.contacto[el.getAttribute('data-link')]=el.value.trim();});
}
var BLANK={
  horarios:function(){return {d:0,hora:'19:00',nombre:'Nueva reunión',vivo:false};},
  ministerios:function(){return {n:'Nuevo ministerio',x:'Describe en una frase qué hace este ministerio.'};},
  faq:function(){return {q:'Nueva pregunta',a:'Escribe aquí la respuesta.'};},
  eventos:function(){var d=new Date();d.setDate(d.getDate()+14);return {fecha:d.toISOString().slice(0,10),titulo:'Nuevo evento',texto:'Agrega aquí los detalles: hora, lugar y a quién está dirigido.'};}
};
function resizeImage(file,cb){
  var fr=new FileReader();
  fr.onload=function(){var img=new Image();img.onload=function(){
    var max=1400,s=Math.min(1,max/Math.max(img.width,img.height)),cv=document.createElement('canvas');
    cv.width=Math.round(img.width*s);cv.height=Math.round(img.height*s);
    cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);cb(cv.toDataURL('image/jpeg',.82));};img.src=fr.result;};
  fr.readAsDataURL(file);
}
var RESET=':root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px/1.4 system-ui,sans-serif;background:#fafafa}img{max-width:100%}[hidden]{display:none!important}';
function buildDoc(){
  var css=document.getElementById('css').textContent,js=document.getElementById('app-js').textContent;
  var data=JSON.stringify(STATE).replace(/</g,'\\u003c'),close='</'+'script>';
  return '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>'+RESET+'</style></head><body>'+
    '<title>'+esc(document.title||'CCINT Tiempo Nuevo')+'</title>\n<style id="css">'+css+'</style>\n'+
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Figtree:wght@400;500;600;700;800&display=swap">\n'+
    '<div id="app"></div>\n<script type="application/json" id="data">'+data+close+'\n<script id="app-js">'+js+close+'</body></html>';
}
async function save(){
  collect();msg='Guardando…';render();
  try{await artifactNS.publish(buildDoc());msg='Publicado. La página se está recargando.';render();}
  catch(e){var code=e&&e.code;
    if(code==='conflict')msg='Alguien guardó cambios justo antes. La página se recargará con esa versión.';
    else if(['not_writer','not_granted','consent_required','capability_disabled','not_declared'].indexOf(code)>=0)msg='Solo lectura: tu cuenta no tiene permiso para editar esta página. Pide acceso de edición a quien la compartió.';
    else if(code==='too_large')msg='La página quedó muy pesada. Quita alguna foto o usa imágenes más pequeñas.';
    else if(code==='rate_limited')msg='Se guardó muchas veces seguidas. Espera un minuto y vuelve a intentar.';
    else msg='No se pudo guardar ('+(code||'error')+'). Intenta de nuevo en un momento.';
    render();}
}
function selectText(el){if(!el)return;var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);}

app.addEventListener('click',function(ev){
  var t=ev.target.closest('button,a');if(!t)return;
  if(t.id==='menu-btn'){menuOpen=!menuOpen;render();return;}
  if(t.closest('#nav')&&menuOpen){menuOpen=false;setTimeout(render,0);}
  if(t.id==='edit-start'){backup=JSON.stringify(STATE);editing=true;msg='';render();return;}
  if(t.id==='edit-cancel'){STATE=JSON.parse(backup);editing=false;msg='';render();return;}
  if(t.id==='edit-save'){save();return;}
  if(t.dataset.mot!=null){motivo=+t.dataset.mot;app.querySelectorAll('.tile').forEach(function(b){b.setAttribute('aria-pressed',String(+b.dataset.mot===motivo));});
    document.getElementById('f-title').textContent=MOTIVOS[motivo].t;updateWa();return;}
  if(t.dataset.cal!=null){var dlt=+t.dataset.cal;if(dlt===0){calY=calNow.getFullYear();calM=calNow.getMonth();}else{calM+=dlt;if(calM<0){calM=11;calY--;}if(calM>11){calM=0;calY++;}}calSel=null;rerenderCal();return;}
  if(t.dataset.day){calSel=calSel===t.dataset.day?null:t.dataset.day;rerenderCal();return;}
  if(t.dataset.copy!=null){var n=t.dataset.copy,lbl=t.dataset.label||'Copiar',fb=function(){var v=t.parentNode.querySelector('.v')||document.getElementById('wa-num');selectText(v);};
    var ok=function(){t.textContent='Copiado';setTimeout(function(){t.textContent=lbl;},1600);};
    try{navigator.clipboard.writeText(n).then(ok,fb);}catch(e){fb();}return;}
  if(!editing)return;
  if(t.dataset.add){ev.preventDefault();collect();STATE[t.dataset.add].push(BLANK[t.dataset.add]());render();return;}
  if(t.dataset.del){ev.preventDefault();collect();var p=t.dataset.del.split('.');STATE[p[0]].splice(+p[1],1);render();return;}
  if(t.dataset.unex!=null){ev.preventDefault();collect();delete STATE.eventos[+t.dataset.unex].ejemplo;render();return;}
  if(t.dataset.clearPhoto){ev.preventDefault();collect();set(t.dataset.clearPhoto,'');render();return;}
  if(t.tagName==='A'&&(t.getAttribute('href')||'').charAt(0)!=='#')ev.preventDefault();
});
// summary clicks in edit mode shouldn't toggle while typing
app.addEventListener('click',function(ev){if(editing&&ev.target.closest('summary [contenteditable]'))ev.preventDefault();},true);
app.addEventListener('change',function(ev){
  var f=ev.target.closest('[data-photo]');if(!f||!f.files[0])return;
  collect();resizeImage(f.files[0],function(url){set(f.dataset.photo,url);render();});
});
app.addEventListener('input',function(ev){if(ev.target.id==='p-name'||ev.target.id==='p-text')updateWa();});
app.addEventListener('submit',function(ev){ev.preventDefault();});
app.addEventListener('paste',function(ev){
  var el=ev.target.closest&&ev.target.closest('[contenteditable="true"]');if(!el)return;
  ev.preventDefault();document.execCommand('insertText',false,(ev.clipboardData||window.clipboardData).getData('text/plain'));
});
app.addEventListener('keydown',function(ev){
  var el=ev.target.closest&&ev.target.closest('[contenteditable="true"]');
  if(el&&ev.key==='Enter'&&el.tagName!=='P'){ev.preventDefault();el.blur();}
  if(el&&ev.key===' '&&el.closest('summary')){ev.stopPropagation();}
});

render();
setInterval(tick,1000);

if(window.claude&&window.claude.use){
  window.claude.use('artifact').then(function(ns){if(!ns)return;artifactNS=ns;
    return window.claude.use('user').then(function(u){return u&&u.canEdit?u.canEdit():true;})
      .then(function(ok){if(ok===false)artifactNS=null;render();},function(){render();});
  }).catch(function(){});
}
});
