'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path'),crypto=require('node:crypto');
const source=fs.readFileSync(path.join(__dirname,'../desktop-login.js'),'utf8');
const state='a'.repeat(32),challenge='b'.repeat(43);
function page(query,session={}){
  const nodes=new Map(),calls=[];
  const document={getElementById(id){if(!nodes.has(id))nodes.set(id,{hidden:true,disabled:false,textContent:'',value:'test@example.test',handlers:{},addEventListener(k,v){this.handlers[k]=v;},reportValidity:()=>true});return nodes.get(id);}};
  const sessionStorage={getItem:k=>k in session?session[k]:null,setItem(k,v){session[k]=String(v);},removeItem(k){delete session[k];}};
  const location={search:query,pathname:'/desktop-login.html',origin:'https://lignoai.ch',assign(u){calls.push(['assign',u]);},replace(u){calls.push(['replace',u]);}};
  const scope={URL,URLSearchParams,AbortSignal,TextEncoder,Uint8Array,Uint32Array,DataView,Math,JSON,document,sessionStorage,location,history:{replaceState(...args){calls.push(['history',...args]);}},fetch:async(url,options)=>{calls.push(['request',url,options]);return {ok:true,json:async()=>({})};}};
  vm.runInNewContext(source,scope);return {nodes:{get:id=>document.getElementById(id)},calls,session};
}
const sha224=s=>crypto.createHash('sha224').update(s).digest('hex');
(async()=>{
 const login=page('?state='+state+'&code_challenge='+challenge);
 assert.equal(login.nodes.get('login').hidden,false);
 await login.nodes.get('login').handlers.submit({preventDefault(){}});
 const request=login.calls.find(c=>c[0]==='request'),body=JSON.parse(request[2].body);
 assert.equal(body.code_challenge,challenge);assert.equal(body.code_challenge_method,'s256');assert.equal(body.create_user,false);
 assert.equal(new URL(request[1]).searchParams.get('redirect_to'),'https://lignoai.ch/desktop-login.html?state='+state);
 assert.equal(login.nodes.get('codeForm').hidden,false,'code form appears after the e-mail was sent');

 // Code from the e-mail: rebuild the link token and follow the link path (magiclink for login)
 login.nodes.get('code').value='3492 0459';
 login.nodes.get('codeForm').handlers.submit({preventDefault(){}});
 const go=new URL(login.calls.find(c=>c[0]==='assign')[1]);
 assert.equal(go.origin+go.pathname,'https://djijagmwottlscxguimc.supabase.co/auth/v1/verify');
 assert.equal(go.searchParams.get('token'),'pkce_'+sha224('test@example.test34920459'),'token equals the link token');
 assert.equal(go.searchParams.get('type'),'magiclink');
 assert.equal(go.searchParams.get('redirect_to'),'https://lignoai.ch/desktop-login.html?state='+state);
 const pending=JSON.parse(login.session['lignocad-desktop-otp']);assert.deepEqual(pending.tried,['magiclink']);
 // Known vectors from real Supabase e-mails
 const vec=page('?state='+state+'&code_challenge='+challenge);
 vec.nodes.get('email').value='Sebastian.Koukoui+lignotest@gmail.com';
 await vec.nodes.get('login').handlers.submit({preventDefault(){}});
 vec.nodes.get('code').value='34920459';vec.nodes.get('codeForm').handlers.submit({preventDefault(){}});
 assert.equal(new URL(vec.calls.find(c=>c[0]==='assign')[1]).searchParams.get('token'),'pkce_68d57506907120ae525a4224d6cf2dd2180e8f355988e22ad7035376');
 // Invalid code input is rejected locally
 const short=page('?state='+state+'&code_challenge='+challenge);
 await short.nodes.get('login').handlers.submit({preventDefault(){}});
 short.nodes.get('code').value='12';short.nodes.get('codeForm').handlers.submit({preventDefault(){}});
 assert.equal(short.calls.some(c=>c[0]==='assign'),false);

 // Wrong link type once: retry with the other type, then give up with a clear message
 const store={'lignocad-desktop-otp':JSON.stringify({state,hash:'c'.repeat(56),tried:['magiclink']})};
 const retry=page('?state='+state+'&error=access_denied&error_code=otp_expired',store);
 const again=new URL(retry.calls.find(c=>c[0]==='replace')[1]);
 assert.equal(again.searchParams.get('type'),'signup');
 const gaveUp=page('?state='+state+'&error=access_denied&error_code=otp_expired',store);
 assert.match(gaveUp.nodes.get('status').textContent,/Code stimmt nicht/);assert.equal('lignocad-desktop-otp' in store,false);

 login.nodes.get('mode').handlers.click({preventDefault(){}});
 assert.equal(login.nodes.get('termsRow').hidden,false,'terms checkbox shown for registration');
 const before=login.calls.filter(c=>c[0]==='request').length;
 await login.nodes.get('login').handlers.submit({preventDefault(){}});
 assert.equal(login.calls.filter(c=>c[0]==='request').length,before,'no account without accepted terms');
 assert.match(login.nodes.get('status').textContent,/Nutzungsbedingungen/);
 login.nodes.get('terms').checked=true;
 await login.nodes.get('login').handlers.submit({preventDefault(){}});
 const signup=JSON.parse(login.calls.filter(c=>c[0]==='request').at(-1)[2].body);
 assert.equal(signup.create_user,true);assert.equal(signup.data.terms_version,'2026-09-24');assert.equal(signup.data.signup_source,'desktop');assert.ok(signup.data.consent_at);
 assert.equal('data' in body,false,'login request carries no metadata');
 // The app can open the page straight in registration mode
 const reg=page('?state='+state+'&code_challenge='+challenge+'&mode=register');
 assert.equal(reg.nodes.get('termsRow').hidden,false);assert.equal(reg.nodes.get('tabRegister').className,'on');
 reg.nodes.get('terms').checked=true;await reg.nodes.get('login').handlers.submit({preventDefault(){}});
 assert.equal(JSON.parse(reg.calls.find(c=>c[0]==='request')[2].body).create_user,true);
 reg.nodes.get('tabLogin').handlers.click();assert.equal(reg.nodes.get('termsRow').hidden,true);
 const code='11111111-1111-4111-8111-111111111111',returned=page('?state='+state+'&code='+code+'&redirect_to=https://evil.example');
 assert.equal(returned.nodes.get('openApp').href,'lignocad://auth/callback?state='+state+'&code='+code);
 assert.equal(returned.calls.find(c=>c[0]==='history').at(-1),'/desktop-login.html','callback code removed from address bar');
 const invalid=page('?code='+code);assert.match(invalid.nodes.get('status').textContent,/Öffne LignoCAD/);
 const expired=page('?state='+state+'&error=access_denied');assert.match(expired.nodes.get('status').textContent,/abgelaufen/);
 console.log('PASS: website login/registration, terms consent on registration, register mode and tabs, e-mail code as link token, type retry, app PKCE challenge, fixed return target, expired and malformed callbacks');
})().catch(e=>{console.error(e);process.exitCode=1;});
