/* Gameplay balance v1. No debug profiles, gifts, or query-string configuration. */
(function (global) {
  'use strict';
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, Number(n) || 0));
  const config = Object.freeze({
    version: '2.1.0-courier', saveKey: 'neonDefense_levels_v2',
    damageGrowth: 1.10, rateGrowth: 1.06, priceGrowth: 1.14,
    weapons: Object.freeze({LASER: 350, ROCKET: 900, VOID: 1800}),
    spacecraft: 600,
    prices: Object.freeze({eDmg:70,eRate:90,eRange:60,lDmg:95,lEff:110,lRange:80,
      rDmg:130,rRate:150,rAoe:110,vDmg:140,vRate:150,vPull:120,base:90}),
    craftPrices: Object.freeze({dmg:100,spd:70,rate:100,radius:85,range:70}),
    max: Object.freeze({eDmg:60,eRate:30,eRange:20,lDmg:60,lEff:24,lRange:20,
      rDmg:60,rRate:30,rAoe:20,vDmg:60,vRate:24,vPull:20,base:10}),
  });
  function level(up, key) { return clamp(up[key], 0, config.max[key] || 60); }
  function weaponStats(kind, up, defs) {
    const d=defs[kind], g=config.damageGrowth, r=config.rateGrowth;
    if(kind==='ELECTRIC')return {dmg:d.dmg*g**level(up,'eDmg'),rate:d.rate*r**level(up,'eRate'),range:d.range*(1+.025*level(up,'eRange'))};
    if(kind==='LASER')return {dps:d.dps*g**level(up,'lDmg'),beamDur:d.beamDur*(1+.025*level(up,'lEff')),cool:d.cool/1.04**level(up,'lEff'),range:d.range*(1+.025*level(up,'lRange'))};
    if(kind==='ROCKET')return {dmg:d.dmg*g**level(up,'rDmg'),rate:d.rate*r**level(up,'rRate'),range:d.range,aoeR:d.aoeR*(1+.035*level(up,'rAoe'))};
    return {dmg:d.dmg*g**level(up,'vDmg'),cool:d.pulseCool/1.04**level(up,'vRate'),range:d.range,pulseR:d.pulseR*(1+.035*level(up,'vPull')),pull:d.pull*(1+.035*level(up,'vPull'))};
  }
  function weaponDps(kind, s) {
    if(kind==='LASER')return s.dps*s.beamDur/(s.beamDur+s.cool);
    if(kind==='VOID')return s.dmg/s.cool;
    return s.dmg*s.rate;
  }
  function price(key, lvl) { return Math.ceil((config.prices[key] || 100)*config.priceGrowth**clamp(lvl,0,60)); }
  global.ND_BALANCE=Object.freeze({config,weaponStats,weaponDps,price});
})(globalThis);
