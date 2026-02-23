var eo=function(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3);};
var cl=function(v,a,b){return Math.max(a,Math.min(b,v));};
var lr=function(a,b,t){return a+(b-a)*t;};
function rr(c,x,y,w,h,r,f,s,sw){
  c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();
  if(f){c.fillStyle=f;c.fill();}
  if(s){c.strokeStyle=s;c.lineWidth=sw||1;c.stroke();}
}

// Background Particles
(function(){
  var cv=document.getElementById('bgc'),ctx=cv.getContext('2d');
  cv.width=1280;cv.height=720;
  var pts=[];
  for(var i=0;i<40;i++) pts.push({x:Math.random()*1280,y:Math.random()*720,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.2+.4});
  (function loop(){
    ctx.clearRect(0,0,1280,720);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>1280)p.vx*=-1;if(p.y<0||p.y>720)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(71,85,105,.5)';ctx.fill();
    }
    for(var i=0;i<pts.length;i++){
      for(var j=i+1;j<pts.length;j++){
        var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ctx.beginPath();ctx.strokeStyle='rgba(71,85,105,'+(1-d/110)*.25+')';ctx.lineWidth=.5;ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();}
      }
    }
    requestAnimationFrame(loop);
  })();
})();

// Arrow Particle Flows
function initArrow(id,col){
  var cv=document.getElementById(id);if(!cv)return;
  var ctx=cv.getContext('2d'),W=cv.width,H=cv.height;
  var pts=[];
  for(var i=0;i<5;i++) pts.push({t:i/5,s:.0045+Math.random()*.003});
  (function loop(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){
      var p=pts[i];p.t+=p.s;if(p.t>1)p.t-=1;
      var y=20+p.t*130,a=p.t<.12?p.t/.12:p.t>.88?(1-p.t)/.12:1;
      ctx.beginPath();ctx.arc(W/2,y,2.5,0,Math.PI*2);
      ctx.fillStyle=col.replace('$',''+(a*.85));ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
}
setTimeout(function(){
  initArrow('ap1','rgba(245,158,11,$)');
  initArrow('ap2','rgba(168,85,247,$)');
},900);

// Phase 1: Rule-Based Systems
function initP1(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  var CY=300,RL=['"free money"?','links > 5?','unknown sender?'];
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  function drawMail(cx,cy,sz,a,col){
    ctx.save();ctx.globalAlpha=a;
    var w=sz*1.6,h=sz;
    rr(ctx,cx-w/2,cy-h/2,w,h,4,'rgba(30,41,59,.9)',col,1.5);
    ctx.beginPath();ctx.moveTo(cx-w/2,cy-h/2);ctx.lineTo(cx,cy+h*.28);ctx.lineTo(cx+w/2,cy-h/2);
    ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  }
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CY)/CY,cx=W/2,eY=H*.1,rY=[H*.3,H*.52,H*.74],rW=W*.72,rH=H*.13;
    var eA=n<.07?eo(n/.07):n>.87?cl(1-(n-.87)/.1,0,1):1;
    drawMail(cx,eY+(n<.07?lr(-25,0,eo(n/.07)):0),18,eA,'#f59e0b');
    if(n>.07&&n<.87){
      ctx.save();ctx.globalAlpha=.2;ctx.strokeStyle='#334155';ctx.lineWidth=1;
      ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,eY+11);ctx.lineTo(cx,rY[0]-rH/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    }
    for(var i=0;i<3;i++){
      var rs=.12+i*.18,isA=n>=rs&&n<rs+.18,isD=n>=rs+.18&&n<.87;
      var rA=n<rs?0:n<rs+.04?eo((n-rs)/.04):n>.87?cl(1-(n-.87)/.1,0,1):1;
      if(rA<=0)continue;
      if(i>0){
        ctx.save();ctx.globalAlpha=rA*.2;ctx.strokeStyle='#334155';ctx.lineWidth=1;
        ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx,rY[i-1]+rH/2);ctx.lineTo(cx,rY[i]-rH/2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
      }
      ctx.save();ctx.globalAlpha=rA;
      rr(ctx,cx-rW/2,rY[i]-rH/2,rW,rH,6,isA?'rgba(245,158,11,.12)':isD?'rgba(30,41,59,.6)':'rgba(15,23,42,.7)',isA?'#f59e0b':isD?'#334155':'#1e293b',isA?1.5:1);
      ctx.fillStyle=isA?'#fbbf24':'#64748b';
      ctx.font=(isA?'600 ':'400 ')+Math.round(W*.037)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(RL[i],cx,rY[i]);
      if(isD){
        var rx=cx+rW/2+16;
        ctx.beginPath();ctx.arc(rx,rY[i],10,0,Math.PI*2);ctx.fillStyle='rgba(34,197,94,.15)';ctx.fill();
        ctx.strokeStyle='#22c55e';ctx.lineWidth=1.5;ctx.stroke();
        ctx.fillStyle='#22c55e';ctx.font='bold '+Math.round(W*.042)+'px Inter';ctx.fillText('\u2713',rx,rY[i]+1);
      }
      ctx.restore();
    }
    if(n>.67&&n<.87){
      var bA=n<.71?eo((n-.67)/.04):n>.83?cl(1-(n-.83)/.04,0,1):1;
      ctx.save();ctx.globalAlpha=bA;
      var g=ctx.createRadialGradient(cx,H*.5,0,cx,H*.5,W*.4);
      g.addColorStop(0,'rgba(239,68,68,.12)');g.addColorStop(1,'rgba(239,68,68,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      rr(ctx,cx-W*.3,H*.42,W*.6,H*.16,8,'rgba(239,68,68,.15)','#ef4444',2);
      ctx.fillStyle='#fca5a5';ctx.font='bold '+Math.round(W*.054)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('BLOCKED',cx,H*.5);
      ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.pc').addEventListener('click',function(){frame=0;});
}

// Phase 2: Machine Learning — Layman-friendly
function initP2(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  var CY=320;
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  var examples=[
    {label:'SPAM',col:'#ef4444',bg:'rgba(239,68,68,.15)',icon:'\uD83D\uDCB8'},
    {label:'HAM', col:'#22c55e',bg:'rgba(34,197,94,.15)', icon:'\uD83D\uDCE7'},
    {label:'SPAM',col:'#ef4444',bg:'rgba(239,68,68,.15)',icon:'\uD83C\uDF81'},
    {label:'HAM', col:'#22c55e',bg:'rgba(34,197,94,.15)', icon:'\uD83D\uDCE7'},
    {label:'SPAM',col:'#ef4444',bg:'rgba(239,68,68,.15)',icon:'\uD83D\uDCB0'},
    {label:'HAM', col:'#22c55e',bg:'rgba(34,197,94,.15)', icon:'\uD83D\uDCE7'}
  ];
  function rrx(x,y,w,h,r){if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var n=(frame%CY)/CY,cx=W/2;

    // Scene 1: Labeled examples appear (0 to 0.40)
    if(n<0.44){
      var showN=Math.floor(eo(cl(n/0.38,0,1))*examples.length);
      var ew=W*.26,eh=H*.28,gx=(W-3*ew)/4,gy=(H-2*eh)/3;
      for(var i=0;i<showN;i++){
        var ex=examples[i];
        var col2=i%3,row=Math.floor(i/3);
        var bx=gx+col2*(ew+gx),by=gy+row*(eh+gy);
        var iA=i===showN-1?cl(n*examples.length/0.38-i,0,1):1;
        ctx.save();ctx.globalAlpha=iA;
        ctx.fillStyle=ex.bg;ctx.strokeStyle=ex.col;ctx.lineWidth=1.5;
        ctx.beginPath();rrx(bx,by,ew,eh,6);ctx.fill();ctx.stroke();
        ctx.font=Math.round(eh*.42)+'px Inter,sans-serif';
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ex.icon,bx+ew/2,by+eh*.38);
        ctx.fillStyle=ex.col;ctx.font='bold '+Math.round(eh*.26)+'px Montserrat,sans-serif';
        ctx.fillText(ex.label,bx+ew/2,by+eh*.78);
        ctx.restore();
      }
      if(n>.12){
        ctx.save();ctx.globalAlpha=cl((n-.12)/.08,0,1)*.55;
        ctx.fillStyle='#64748b';ctx.font=Math.round(H*.08)+'px Inter,sans-serif';
        ctx.textAlign='center';ctx.fillText('Feed labeled examples to the model',cx,H*.94);
        ctx.restore();
      }
    }

    // Scene 2: Model learning (0.34 to 0.68)
    if(n>0.34&&n<0.69){
      var lA=n<0.37?eo((n-0.34)/0.03):n>0.66?cl(1-(n-0.66)/0.03,0,1):1;
      var lP=cl((n-0.37)/0.29,0,1);
      ctx.save();ctx.globalAlpha=lA;
      ctx.fillStyle='#c084fc';ctx.font='bold '+Math.round(H*.1)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.fillText('Model is learning...',cx,H*.15);
      var br=H*.27;
      var bg2=ctx.createRadialGradient(cx,H*.5,0,cx,H*.5,br);
      bg2.addColorStop(0,'rgba(168,85,247,.22)');bg2.addColorStop(1,'rgba(168,85,247,.04)');
      ctx.beginPath();ctx.arc(cx,H*.5,br,0,Math.PI*2);ctx.fillStyle=bg2;ctx.fill();
      ctx.strokeStyle='#a855f7';ctx.lineWidth=2;ctx.stroke();
      var nc=Math.floor(lP*14);
      for(var i=0;i<nc;i++){
        var a1=i*0.52+frame*.018,a2=a1+1.2+i*.31;
        var r1=br*(.25+Math.sin(i*1.7)*.25),r2=br*(.25+Math.cos(i*2.1)*.25);
        ctx.save();ctx.globalAlpha=lA*.4;ctx.strokeStyle='#c084fc';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(cx+Math.cos(a1)*r1,H*.5+Math.sin(a1)*r1);
        ctx.lineTo(cx+Math.cos(a2)*r2,H*.5+Math.sin(a2)*r2);ctx.stroke();ctx.restore();
      }
      ctx.font=Math.round(br*.7)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\uD83E\uDDE0',cx,H*.5);
      var bpx=cx-W*.3,bpy=H*.82,bpw=W*.6,bph=H*.08;
      ctx.fillStyle='rgba(168,85,247,.12)';ctx.beginPath();rrx(bpx,bpy,bpw,bph,4);ctx.fill();
      ctx.fillStyle='rgba(168,85,247,.65)';ctx.beginPath();rrx(bpx,bpy,bpw*lP,bph,4);ctx.fill();
      ctx.strokeStyle='#a855f7';ctx.lineWidth=1;ctx.beginPath();rrx(bpx,bpy,bpw,bph,4);ctx.stroke();
      ctx.fillStyle='#c084fc';ctx.font=Math.round(H*.08)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(Math.round(lP*100)+'% trained',cx,bpy+bph+4);
      ctx.restore();
    }

    // Scene 3: New email classified (0.62 to 0.90)
    if(n>0.62&&n<0.91){
      var cA=n<0.65?eo((n-0.62)/0.03):n>0.88?cl(1-(n-0.88)/0.03,0,1):1;
      var cP=cl((n-0.65)/0.23,0,1);
      ctx.save();ctx.globalAlpha=cA;
      ctx.fillStyle='#94a3b8';ctx.font=Math.round(H*.09)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('New email arrives...',cx,H*.06);
      var ew2=W*.3,eh2=H*.42,ebx=cx-ew2/2,eby=H*.16;
      ctx.fillStyle='rgba(30,41,59,.85)';
      ctx.strokeStyle=cP>.45?'#ef4444':'#475569';ctx.lineWidth=cP>.45?2:1.5;
      ctx.beginPath();rrx(ebx,eby,ew2,eh2,8);ctx.fill();ctx.stroke();
      ctx.font=Math.round(eh2*.46)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\uD83D\uDCE7',cx,eby+eh2*.38);
      if(cP<0.45){
        ctx.fillStyle='#64748b';ctx.font='bold '+Math.round(eh2*.38)+'px Montserrat,sans-serif';
        ctx.fillText('?',cx,eby+eh2*.78);
      } else {
        var rA2=cl((cP-0.45)/0.25,0,1);
        ctx.globalAlpha=cA*rA2;
        var rg=ctx.createRadialGradient(cx,H*.5,0,cx,H*.5,W*.35);
        rg.addColorStop(0,'rgba(239,68,68,.15)');rg.addColorStop(1,'rgba(239,68,68,0)');
        ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);
        ctx.fillStyle='#ef4444';ctx.font='bold '+Math.round(eh2*.38)+'px Montserrat,sans-serif';
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('SPAM',cx,eby+eh2*.78);
      }
      if(cP>0.15){
        ctx.globalAlpha=cA*cl((cP-0.15)/0.2,0,1)*.65;
        ctx.strokeStyle='#a855f7';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);
        ctx.beginPath();ctx.moveTo(cx,H*.65);ctx.lineTo(cx,eby+eh2+4);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#c084fc';ctx.font=Math.round(H*.085)+'px Inter,sans-serif';
        ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('Model predicts',cx,H*.68);
      }
      ctx.restore();
    }

    // Scene 4: Pattern Learned! (0.88 to 1.0)
    if(n>0.88){
      var sA=eo(cl((n-0.88)/0.07,0,1));
      ctx.save();ctx.globalAlpha=sA;
      var sg=ctx.createRadialGradient(cx,H*.5,0,cx,H*.5,W*.4);
      sg.addColorStop(0,'rgba(34,197,94,.14)');sg.addColorStop(1,'rgba(34,197,94,0)');
      ctx.fillStyle=sg;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#22c55e';ctx.font='bold '+Math.round(H*.13)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u2713 Pattern Learned!',cx,H*.5);
      ctx.restore();
    }

    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.pc').addEventListener('click',function(){frame=0;});
}

// Phase 3: Deep Learning Neural Network
function initP3(el){
  var ctx=el.getContext('2d'),W=0,H=0,frame=0;
  var PASS=110;
  var layers=[4,5,5,4,2];
  var lcols=['#60a5fa','#a78bfa','#818cf8','#6ee7b7','#2dd4bf'];
  var llbls=['Input','Hidden 1','Hidden 2','Hidden 3','Output'];
  function rsz(){W=el.offsetWidth;H=el.offsetHeight;el.width=W;el.height=H;}rsz();
  function getNodes(){
    var nd=[];
    for(var l=0;l<layers.length;l++){
      var lx=W*(.1+l*.2);
      for(var n=0;n<layers[l];n++){
        var ly=H*(.5-(layers[l]-1)*.5*.15)+n*H*.15;
        nd.push({l:l,n:n,x:lx,y:ly});
      }
    }
    return nd;
  }
  (function loop(){
    ctx.clearRect(0,0,W,H);
    var t=(frame%PASS)/PASS;
    var nd=getNodes();
    var aL=Math.floor(t*(layers.length+1));
    for(var i=0;i<nd.length;i++){
      for(var j=0;j<nd.length;j++){
        if(nd[j].l!==nd[i].l+1)continue;
        var ca=nd[i].l<aL?.18:.05;
        ctx.save();ctx.globalAlpha=ca;ctx.strokeStyle=nd[i].l<aL?lcols[nd[i].l]:'#1e293b';ctx.lineWidth=.8;
        ctx.beginPath();ctx.moveTo(nd[i].x,nd[i].y);ctx.lineTo(nd[j].x,nd[j].y);ctx.stroke();ctx.restore();
      }
    }
    if(aL>0&&aL<layers.length){
      var sigT=(t*(layers.length+1))%1;
      var fL=nd.filter(function(n){return n.l===aL-1;});
      var tL=nd.filter(function(n){return n.l===aL;});
      fL.forEach(function(fn){
        tL.forEach(function(tn){
          ctx.save();ctx.globalAlpha=.7;ctx.beginPath();
          ctx.arc(lr(fn.x,tn.x,sigT),lr(fn.y,tn.y,sigT),2.5,0,Math.PI*2);
          ctx.fillStyle=lcols[fn.l];ctx.fill();ctx.restore();
        });
      });
    }
    nd.forEach(function(n){
      var isA=n.l<aL,isC=n.l===aL;
      ctx.save();
      if(isA||isC){ctx.globalAlpha=isA?.15:.25;ctx.beginPath();ctx.arc(n.x,n.y,14,0,Math.PI*2);ctx.fillStyle=lcols[n.l];ctx.fill();}
      ctx.globalAlpha=isA?.9:isC?.7:.35;
      ctx.beginPath();ctx.arc(n.x,n.y,8,0,Math.PI*2);
      ctx.fillStyle=isA||isC?lcols[n.l]:'rgba(30,41,59,.8)';ctx.fill();
      ctx.strokeStyle=lcols[n.l];ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
    });
    for(var l=0;l<layers.length;l++){
      var lx=W*(.1+l*.2),isA=l<aL;
      ctx.save();ctx.globalAlpha=isA?.8:.3;ctx.fillStyle=lcols[l];
      ctx.font=(isA?'600 ':'400 ')+Math.round(W*.026)+'px Inter,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText(llbls[l],lx,H*.88);ctx.restore();
    }
    if(aL>=layers.length){
      var oA=cl((t*(layers.length+1)-layers.length)/.5,0,1);
      ctx.save();ctx.globalAlpha=oA;
      rr(ctx,W*.76,H*.36,W*.2,H*.28,6,'rgba(20,184,166,.12)','#14b8a6',1.5);
      ctx.fillStyle='#2dd4bf';ctx.font='bold '+Math.round(W*.032)+'px Montserrat,sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('Cat!',W*.86,H*.5);
      ctx.restore();
    }
    frame++;requestAnimationFrame(loop);
  })();
  el.closest('.pc').addEventListener('click',function(){frame=0;});
}

// Auto-Sequence Spotlight
(function(){
  var cards=[document.getElementById('c1'),document.getElementById('c2'),document.getElementById('c3')];
  var cur=0;
  function next(){
    cards.forEach(function(c){c.classList.remove('sp');});
    cards[cur].classList.add('sp');
    cur=(cur+1)%cards.length;
  }
  next();
  setInterval(next,4000);
})();

// Init
window.addEventListener('load',function(){
  setTimeout(function(){
    initP1(document.getElementById('cv1'));
    initP2(document.getElementById('cv2'));
    initP3(document.getElementById('cv3'));
  },500);
});
