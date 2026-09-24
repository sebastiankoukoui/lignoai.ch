'use strict';
(function(){
  const base='https://djijagmwottlscxguimc.supabase.co';
  const key='sb_publishable_ON8omA_Oi-uwTLBkQE6_5A_35SmXxpf';
  const q=new URLSearchParams(location.search),state=q.get('state'),challenge=q.get('code_challenge'),code=q.get('code');
  const el=id=>document.getElementById(id),message=text=>{el('status').textContent=text;};
  const PENDING='lignocad-desktop-otp';
  const TERMS_VERSION='2026-09-24'; // gleiche Version wie TERMS_VERSION in index.html
  let create=false;
  // Never accept a callback URL supplied by the visitor. Only the fixed app
  // scheme is used; no session token or verifier is put into a browser URL.
  if(!/^[A-Za-z0-9_-]{32}$/.test(state||'')){
    message('Öffne LignoCAD und klicke dort auf „Auf LignoAI anmelden“. Dann kannst du dich hier anmelden oder registrieren.');return;
  }
  const store={
    get(){try{const p=JSON.parse(sessionStorage.getItem(PENDING)||'null');return p&&p.state===state?p:null;}catch{return null;}},
    set(p){try{sessionStorage.setItem(PENDING,JSON.stringify(p));}catch{}},
    clear(){try{sessionStorage.removeItem(PENDING);}catch{}}
  };
  const returnUrl=()=>{const r=new URL(location.pathname,location.origin);r.searchParams.set('state',state);return r.href;};
  // The e-mail code and the e-mail link carry the same secret: the link token is
  // "pkce_" + SHA-224(email + code). Rebuilding the link lets the code take exactly
  // the link's path, so the app still receives only a PKCE auth code for its own verifier.
  const verifyUrl=(hash,type)=>base+'/auth/v1/verify?token=pkce_'+hash+'&type='+type+'&redirect_to='+encodeURIComponent(returnUrl());
  if(q.has('error')||q.has('error_code')){
    const pending=store.get();
    if(pending&&pending.tried.length<2){
      const next=pending.tried[0]==='signup'?'magiclink':'signup';
      pending.tried.push(next);store.set(pending);
      location.replace(verifyUrl(pending.hash,next));return;
    }
    store.clear();
    message(pending?'Der Code stimmt nicht oder ist abgelaufen. Starte die Anmeldung in LignoCAD erneut.':'Der Anmeldelink ist ungültig oder abgelaufen. Starte die Anmeldung in LignoCAD erneut.');
    history.replaceState(null,'',location.pathname);return;
  }
  if(code){
    store.clear();
    history.replaceState(null,'',location.pathname);
    if(!/^[A-Za-z0-9_-]{16,512}$/.test(code)){message('Ungültige Anmelderückkehr. Bitte in der App neu starten.');return;}
    el('heading').textContent='Zurück zu LignoCAD';
    el('intro').textContent='Deine E-Mail-Adresse wurde bestätigt. Schliesse die Anmeldung jetzt in der App ab.';
    const target=new URL('lignocad://auth/callback');target.searchParams.set('state',state);target.searchParams.set('code',code);
    el('openApp').href=target.href;el('openApp').hidden=false;el('help').hidden=false;
    message('Klicke auf „LignoCAD öffnen“. Die App prüft danach deine Lizenz.');
    el('openApp').addEventListener('click',()=>message('Die Rückkehr zur App wurde angefordert. Erst die App kann bestätigen, ob Anmeldung und Lizenzprüfung erfolgreich waren.'));
    return;
  }
  if(!/^[A-Za-z0-9_-]{43}$/.test(challenge||'')){
    message('Die Anmeldeanfrage ist unvollständig. Bitte in LignoCAD erneut starten.');return;
  }
  el('login').hidden=false;el('tabs').hidden=false;message('');
  // The app can open this page directly in registration mode with &mode=register
  const setMode=value=>{
    create=value;
    el('heading').textContent=create?'LignoAI-Konto erstellen':'In LignoCAD anmelden';
    el('submit').textContent=create?'Konto erstellen und E-Mail bestätigen':'Anmeldelink senden';
    el('mode').textContent=create?'Bereits ein Konto? Anmelden':'Noch kein Konto? Konto erstellen';
    el('termsRow').hidden=!create;
    el('tabLogin').className=create?'':'on';el('tabRegister').className=create?'on':'';
  };
  el('mode').addEventListener('click',event=>{event.preventDefault();setMode(!create);});
  el('tabLogin').addEventListener('click',()=>setMode(false));
  el('tabRegister').addEventListener('click',()=>setMode(true));
  if(q.get('mode')==='register')setMode(true);
  let sentTo='';
  el('login').addEventListener('submit',async event=>{
    event.preventDefault();if(!el('login').reportValidity())return;
    if(create&&!el('terms').checked){message('Bitte akzeptiere die Nutzungsbedingungen, damit wir dein Konto erstellen können.');return;}
    el('submit').disabled=true;
    const email=el('email').value.trim().toLowerCase();
    try{
      const res=await fetch(base+'/auth/v1/otp?redirect_to='+encodeURIComponent(returnUrl()),{
        method:'POST',signal:AbortSignal.timeout(20000),headers:{apikey:key,'Content-Type':'application/json'},
        // user metadata is only stored when the account is created, like on the website registration
        body:JSON.stringify({email,create_user:create,code_challenge:challenge,code_challenge_method:'s256',
          ...(create?{data:{terms_version:TERMS_VERSION,consent_at:new Date().toISOString(),signup_source:'desktop'}}:{})})
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok){
        if(res.status===429)throw Error('Zu viele E-Mail-Anfragen. Bitte warte einige Minuten.');
        if(data.error_code==='email_address_not_authorized')throw Error('Der E-Mail-Versand ist für diese Adresse noch nicht eingerichtet. Bitte kontaktiere LignoAI.');
        if(data.error_code==='signup_disabled'||data.error_code==='user_not_found')throw Error('Kein Konto gefunden. Wähle „Konto erstellen“.');
        throw Error('Die E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.');
      }
      sentTo=email;el('codeForm').hidden=false;
      message('Öffne den Link in deiner E-Mail auf diesem Computer. Liest du die E-Mail auf einem anderen Gerät, gib unten den Code aus der E-Mail ein.');
    }catch(error){message(error.name==='TimeoutError'?'Zeitüberschreitung. Bitte erneut versuchen.':error.message||'Verbindung fehlgeschlagen.');}
    finally{el('submit').disabled=false;}
  });
  el('codeForm').addEventListener('submit',event=>{
    event.preventDefault();
    const digits=el('code').value.replace(/\D/g,'');
    if(!sentTo){message('Bitte fordere zuerst die E-Mail an.');return;}
    if(!/^\d{6,10}$/.test(digits)){message('Bitte gib den ganzen Code aus der E-Mail ein.');return;}
    const hash=sha224(sentTo+digits),type=create?'signup':'magiclink';
    store.set({state,hash,tried:[type]});
    el('codeSubmit').disabled=true;message('Code wird geprüft …');
    location.assign(verifyUrl(hash,type));
  });

  // SHA-224 (FIPS 180-4). Web Crypto offers SHA-256 but not SHA-224, which the link token uses.
  function sha224(text){
    const K=[],isPrime=n=>{for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;};
    for(let n=2;K.length<64;n++)if(isPrime(n))K.push((Math.cbrt(n)%1)*4294967296>>>0);
    const H=[0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4];
    const bytes=new TextEncoder().encode(text),len=((bytes.length+9+63)>>6)<<6,buf=new Uint8Array(len),view=new DataView(buf.buffer);
    buf.set(bytes);buf[bytes.length]=0x80;
    view.setUint32(len-8,Math.floor(bytes.length/0x20000000));view.setUint32(len-4,(bytes.length*8)>>>0);
    const w=new Uint32Array(64),rot=(x,n)=>(x>>>n)|(x<<(32-n));
    for(let off=0;off<len;off+=64){
      for(let t=0;t<16;t++)w[t]=view.getUint32(off+t*4);
      for(let t=16;t<64;t++){
        const s0=rot(w[t-15],7)^rot(w[t-15],18)^(w[t-15]>>>3),s1=rot(w[t-2],17)^rot(w[t-2],19)^(w[t-2]>>>10);
        w[t]=(w[t-16]+s0+w[t-7]+s1)>>>0;
      }
      let [a,b,c,d,e,f,g,h]=H;
      for(let t=0;t<64;t++){
        const t1=(h+(rot(e,6)^rot(e,11)^rot(e,25))+((e&f)^(~e&g))+K[t]+w[t])>>>0;
        const t2=((rot(a,2)^rot(a,13)^rot(a,22))+((a&b)^(a&c)^(b&c)))>>>0;
        h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
      }
      [a,b,c,d,e,f,g,h].forEach((v,i)=>{H[i]=(H[i]+v)>>>0;});
    }
    return H.slice(0,7).map(v=>v.toString(16).padStart(8,'0')).join('');
  }
})();
