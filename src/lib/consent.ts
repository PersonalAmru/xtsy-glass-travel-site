export const CONSENT_KEY = 'xtsy_consent_v2';
// Previous versions forced analytics on and therefore are not explicit opt-ins.
export const CONSENT_VERSION = '3.0';
export const CONSENT_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;
export const DENIED_PREFERENCES = { necessary: true, analytics: false, marketing: false, personalization: false };

export function parseConsent(raw: string | null, now = Date.now()) {
  try {
    const prefs = JSON.parse(raw ?? 'null');
    const age = now - Date.parse(prefs?.timestamp);
    if (prefs?.version !== CONSENT_VERSION || !Number.isFinite(age) || age < 0 || age >= CONSENT_VALIDITY_MS) return null;
    if (['analytics', 'marketing', 'personalization'].some(key => typeof prefs[key] !== 'boolean')) return null;
    return { ...DENIED_PREFERENCES, ...prefs, necessary: true } as typeof DENIED_PREFERENCES & { timestamp: string; version: string };
  } catch { return null; }
}

export function readConsent() {
  try { return parseConsent(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}

/** Runs before any tag: real Consent Mode commands, not only custom GTM events. */
export const CONSENT_BOOTSTRAP_SCRIPT = `
(function(w,d){
  w.dataLayer=w.dataLayer||[];
  function command(){w.dataLayer.push(arguments);}
  function config(p){return {
    analytics_storage:p.analytics?'granted':'denied',
    ad_storage:p.marketing?'granted':'denied',
    ad_user_data:p.marketing?'granted':'denied',
    ad_personalization:p.marketing&&p.personalization?'granted':'denied',
    personalization_storage:p.personalization?'granted':'denied',
    functionality_storage:'granted',security_storage:'granted'
  };}
  var denied={necessary:true,analytics:false,marketing:false,personalization:false};
  command('consent','default',config(denied));
  command('set','ads_data_redaction',true);
  command('set','url_passthrough',false);
  w.dataLayer.push(Object.assign({event:'consent_default'},config(denied)));
  w.__xtsyConsent=denied;
  function clearCookies(p){
    if(!p.analytics){
      ['xtsy_vid','xtsy_visitor_id','xtsy_visit_count'].forEach(function(k){try{w.localStorage.removeItem(k);}catch(e){}});
      ['xtsy_sid','xtsy_last_activity','xtsy_session','xtsy_session_id','xtsy_session_ts','xtsy_visit_counted','xtsy_ai_referral_source'].forEach(function(k){try{w.sessionStorage.removeItem(k);}catch(e){}});
    }
    var names=d.cookie.split(';').map(function(c){return c.split('=')[0].trim();});
    var hosts=d.location.hostname.split('.'),domains=[''];
    for(var i=0;i<hosts.length-1;i++) domains.push('.'+hosts.slice(i).join('.'));
    var paths=['/'],segments=d.location.pathname.split('/').filter(Boolean),path='';
    segments.forEach(function(s){path+='/'+s;paths.push(path,path+'/');});
    names.forEach(function(name){
      var analytics=/^(_ga(?:_|$)|_gid$|_gat|_gac_|_hj|_cs_|csMatching)/.test(name);
      var ads=/^(_gcl_|_gads|_gpi|_fbp$|_fbc$)/.test(name);
      if((analytics&&!p.analytics)||(ads&&!p.marketing)) domains.forEach(function(domain){paths.forEach(function(path){
        d.cookie=name+'=; Max-Age=0; path='+path+(domain?'; domain='+domain:'');
      });});
    });
  }
  w.__xtsyApplyConsent=function(p){
    var previous=w.__xtsyConsent;
    w.__xtsyConsent=p;
    command('consent','update',config(p));
    w.dataLayer.push(Object.assign({event:'consent_update'},config(p)));
    clearCookies(p);
    // Unload already-running third-party code on revocation; deleting a script alone cannot stop it.
    if(previous&&((previous.analytics&&!p.analytics)||(previous.marketing&&!p.marketing))&&
      (w.__activeGTMContainer||w.__cs_uxa_loaded)) w.setTimeout(function(){w.location.reload();},0);
  };
  try {
    var p=JSON.parse(w.localStorage.getItem('${CONSENT_KEY}')||'null');
    var age=Date.now()-Date.parse(p&&p.timestamp);
    if(p&&p.version==='${CONSENT_VERSION}'&&age>=0&&age<${CONSENT_VALIDITY_MS}&&
      ['analytics','marketing','personalization'].every(function(k){return typeof p[k]==='boolean';})) w.__xtsyApplyConsent(p);
    else clearCookies(denied);
  } catch(e){clearCookies(denied);}
})(window,document);
`;

export const GTM_CONSENT_LOADER_SCRIPT = `
(function(w,d){
  var loaded=false;
  function load(){
    var p=w.__xtsyConsent;
    if(loaded||!p||(!p.analytics&&!p.marketing))return;
    loaded=true;
    var container=w.__isLovableAdmin?'GTM-MS23NHMF':'GTM-5FXJ9QBK';
    w.__activeGTMContainer=container;
    w.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
    var script=d.createElement('script');script.async=true;
    script.src='https://www.googletagmanager.com/gtm.js?id='+container;
    d.head.appendChild(script);
  }
  w.addEventListener('consent-update',load);
  load();
})(window,document);
`;

declare global {
  interface Window {
    __xtsyApplyConsent?: (prefs: typeof DENIED_PREFERENCES) => void;
    __xtsyConsent?: typeof DENIED_PREFERENCES;
  }
}