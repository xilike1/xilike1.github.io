/* Fixed combat levels. Purchases, XP and time never change these quotas or HP. */
(function(global){
 'use strict';
 // normal, runner, tank, splitter, shielded; then HP in the same order.
 const rows=[
  [1,1.50,[60,12,0,0,0],[100,65,240,150,220],1100],
  [2,1.35,[56,20,8,0,0],[135,90,300,180,260],1800],
  [3,1.25,[54,26,12,4,0],[165,105,360,200,300],2600],
  [4,1.18,[52,28,16,12,0],[195,125,440,235,340],3700],
  [5,1.12,[50,28,20,16,6],[230,150,520,275,400],5000],
  [6,1.08,[52,28,22,20,10],[270,175,620,320,470],6500],
  [7,1.04,[52,30,26,22,14],[320,200,740,380,550],8200],
  [8,1.00,[52,32,28,26,18],[380,235,880,450,650],10200],
  [9,.97,[54,32,30,30,22],[450,275,1040,530,760],12500],
  [10,.94,[56,34,34,32,24],[530,320,1220,625,890],15100],
  [11,.91,[56,34,36,36,30],[620,375,1440,735,1040],18100],
  [12,.88,[58,36,38,38,34],[725,435,1680,860,1220],21500],
  [13,.85,[58,38,42,40,38],[850,510,1970,1010,1430],25400],
  [14,.82,[60,40,44,44,40],[995,595,2310,1180,1670],29900],
  [15,.80,[60,42,46,48,44],[1165,695,2700,1380,1950],36000]
 ];
 const types=['NORMAL','RUNNER','TANK','SPLITTER','SHIELDED'];
 const stages=rows.map(([level,interval,counts,health,guardianHP])=>Object.freeze({
  level,interval,counts:Object.freeze(Object.fromEntries(types.map((t,i)=>[t,counts[i]]))),
  hp:Object.freeze({...Object.fromEntries(types.map((t,i)=>[t,health[i]])),MINI:Math.round(health[0]*.32),BRUTE:health[2]*2,SUPPORTER:Math.round(health[0]*1.3)}),
  count:counts.reduce((s,n)=>s+n,0),speed:1+Math.min(.18,(level-1)*.012),maxAlive:Math.min(20,10+Math.floor(level*.7)),guardianHP,
 }));
 function stage(level,galaxyIndex=0){
  const lv=Math.max(1,Math.min(60,Math.floor(Number(level)||1)));
  const base=stages[Math.min(lv,15)-1],extra=Math.max(0,lv-15),counts={...base.counts};
  if(extra)counts.NORMAL+=extra*8;
  if(galaxyIndex>=2&&lv>=2){const n=Math.floor(counts.NORMAL*.12);counts.NORMAL-=n;counts.SUPPORTER=n;}
  return {...base,level:lv,count:Object.values(counts).reduce((s,n)=>s+n,0),counts,
   hp:Object.fromEntries(Object.entries(base.hp).map(([t,hp])=>[t,Math.round(hp*1.08**extra)])),
   interval:Math.max(.55,base.interval*.99**extra),guardianHP:Math.round(base.guardianHP*1.09**extra)};
 }
 function deck(spec){const list=[];for(const [type,n]of Object.entries(spec.counts))for(let i=0;i<n;i++)list.push(type);
  for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;
 }
 global.ND_LEVELS=Object.freeze({version:2,stages:Object.freeze(stages),stage,deck});
})(globalThis);
