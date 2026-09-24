'use strict';
(function(){
  const base='https://djijagmwottlscxguimc.supabase.co';
  const key='sb_publishable_ON8omA_Oi-uwTLBkQE6_5A_35SmXxpf';
  const q=new URLSearchParams(location.search),state=q.get('state'),challenge=q.get('code_challenge'),code=q.get('code');
  const el=id=>document.getElementById(id),message=text=>{el('status').textContent=text;};
  const PENDING='lignocad-desktop-otp';
  const TERMS_VERSION='2026-09-24'; // gleiche Version wie TERMS_VERSION in src/index.html
  // i18n:start (erzeugt von tools/build.cjs aus src/lang, nicht von Hand ändern)
  const I18N={
    de:{"htmlLang":"de-CH","home":"/","title":"LignoCAD anmelden · LignoAI","heading":"In LignoCAD anmelden","intro":"Melde dich mit deinem LignoAI-Konto an. Danach kannst du zur App zurückkehren.","continueText":"Du bist auf lignoai.ch angemeldet als","continueBtn":"Mit diesem Konto in LignoCAD anmelden","otherAccount":"Anderes Konto verwenden","tabLogin":"Anmelden","tabRegister":"Konto erstellen","email":"E-Mail-Adresse","termsA":"Ich akzeptiere die","termsLink":"Nutzungsbedingungen","termsB":"inklusive Lizenzbedingungen und habe die","privacyLink":"Datenschutzerklärung","termsC":" gelesen.","submitLogin":"Anmeldelink senden","submitRegister":"Konto erstellen und E-Mail bestätigen","modeToRegister":"Noch kein Konto? Konto erstellen","modeToLogin":"Bereits ein Konto? Anmelden","headingRegister":"LignoAI-Konto erstellen","code":"Code aus der E-Mail","codeSubmit":"Mit Code fortfahren","checking":"Anmeldeanfrage wird geprüft …","openApp":"LignoCAD öffnen","help":"Bestätige im Browser das Öffnen von LignoCAD. Falls nichts passiert, starte die installierte App und beginne die Anmeldung dort erneut.","footer":"Nach der Registrierung gilt deine Lizenz sofort für 14 Tage. Nach unserer Prüfung verlängern wir sie auf drei Monate. Deine Pläne bleiben auf deinem Computer.","noState":"Öffne LignoCAD und starte dort die Anmeldung. Dann kannst du dich hier anmelden oder registrieren.","codeFailed":"Der Code stimmt nicht oder ist abgelaufen. Starte die Anmeldung in LignoCAD erneut.","linkInvalid":"Der Anmeldelink ist ungültig oder abgelaufen. Starte die Anmeldung in LignoCAD erneut.","badReturn":"Ungültige Anmelderückkehr. Bitte in der App neu starten.","backHeading":"Zurück zu LignoCAD","backIntro":"Deine E-Mail-Adresse wurde bestätigt. Schliesse die Anmeldung jetzt in der App ab.","backClick":"Klicke auf „LignoCAD öffnen“. Die App prüft danach deine Lizenz.","backRequested":"Die Rückkehr zur App wurde angefordert. Erst die App kann bestätigen, ob Anmeldung und Lizenzprüfung erfolgreich waren.","incomplete":"Die Anmeldeanfrage ist unvollständig. Bitte in LignoCAD erneut starten.","handoffIntro":"Du kannst dein Konto von der Website direkt in die App übernehmen.","handoffBusy":"Anmeldung wird an LignoCAD übergeben …","handoffDone":"Klicke auf «LignoCAD öffnen», falls sich die App nicht von selbst meldet. Der Code gilt 5 Minuten.","handoffFailed":"Die Übergabe hat nicht geklappt. Melde dich unten mit «Anderes Konto verwenden» an.","acceptTerms":"Bitte akzeptiere die Nutzungsbedingungen, damit wir dein Konto erstellen können.","rateLimit":"Zu viele E-Mail-Anfragen. Bitte warte einige Minuten.","notAuthorized":"Der E-Mail-Versand ist für diese Adresse noch nicht eingerichtet. Bitte kontaktiere LignoAI.","noAccount":"Kein Konto gefunden. Wähle „Konto erstellen“.","sendFailed":"Die E-Mail konnte nicht gesendet werden. Bitte versuche es später erneut.","sent":"Öffne den Link in deiner E-Mail auf diesem Computer. Liest du die E-Mail auf einem anderen Gerät, gib unten den Code aus der E-Mail ein.","timeout":"Zeitüberschreitung. Bitte erneut versuchen.","connectionFailed":"Verbindung fehlgeschlagen.","requestFirst":"Bitte fordere zuerst die E-Mail an.","wholeCode":"Bitte gib den ganzen Code aus der E-Mail ein.","codeChecking":"Code wird geprüft …"},
    fr:{"htmlLang":"fr-CH","home":"/fr/","title":"Connexion à LignoCAD · LignoAI","heading":"Se connecter à LignoCAD","intro":"Connectez-vous avec votre compte LignoAI. Vous pourrez ensuite revenir à l’application.","continueText":"Connexion active sur lignoai.ch avec le compte","continueBtn":"Se connecter à LignoCAD avec ce compte","otherAccount":"Utiliser un autre compte","tabLogin":"Se connecter","tabRegister":"Créer un compte","email":"Adresse e-mail","termsA":"J’accepte les","termsLink":"Conditions d’utilisation","termsB":"y compris les conditions de licence et j’ai lu la","privacyLink":"Déclaration de protection des données","termsC":".","submitLogin":"Envoyer le lien de connexion","submitRegister":"Créer un compte et confirmer l’adresse e-mail","modeToRegister":"Pas encore de compte ? Créer un compte","modeToLogin":"Déjà un compte ? Se connecter","headingRegister":"Créer un compte LignoAI","code":"Code reçu par e-mail","codeSubmit":"Continuer avec le code","checking":"Vérification de la demande de connexion …","openApp":"Ouvrir LignoCAD","help":"Confirmez l’ouverture de LignoCAD dans le navigateur. Si rien ne se passe, lancez l’application installée et recommencez la connexion depuis celle-ci.","footer":"Après l’inscription, votre licence est valable immédiatement pendant 14 jours. Après vérification, nous la prolongeons à trois mois. Vos plans restent sur votre ordinateur.","noState":"Ouvrez LignoCAD et lancez la connexion depuis l’application. Vous pourrez ensuite vous connecter ou vous inscrire ici.","codeFailed":"Le code est incorrect ou a expiré. Recommencez la connexion dans LignoCAD.","linkInvalid":"Le lien de connexion n’est pas valide ou a expiré. Recommencez la connexion dans LignoCAD.","badReturn":"Retour de connexion non valide. Veuillez recommencer depuis l’application.","backHeading":"Retour à LignoCAD","backIntro":"Votre adresse e-mail a été confirmée. Terminez maintenant la connexion dans l’application.","backClick":"Cliquez sur « Ouvrir LignoCAD ». L’application vérifiera ensuite votre licence.","backRequested":"Le retour à l’application a été demandé. Seule l’application peut confirmer si la connexion et la vérification de la licence ont réussi.","incomplete":"La demande de connexion est incomplète. Veuillez recommencer dans LignoCAD.","handoffIntro":"Vous pouvez transférer votre compte directement du site web vers l’application.","handoffBusy":"Transmission de la connexion à LignoCAD …","handoffDone":"Cliquez sur « Ouvrir LignoCAD » si l’application ne réagit pas d’elle-même. Le code est valable 5 minutes.","handoffFailed":"Le transfert n’a pas abouti. Connectez-vous ci-dessous avec « Utiliser un autre compte ».","acceptTerms":"Veuillez accepter les conditions d’utilisation pour que nous puissions créer votre compte.","rateLimit":"Trop de demandes d’e-mail. Veuillez patienter quelques minutes.","notAuthorized":"L’envoi d’e-mails n’est pas encore configuré pour cette adresse. Veuillez contacter LignoAI.","noAccount":"Aucun compte trouvé. Choisissez « Créer un compte ».","sendFailed":"L’e-mail n’a pas pu être envoyé. Veuillez réessayer plus tard.","sent":"Ouvrez le lien reçu par e-mail sur cet ordinateur. Si vous lisez l’e-mail sur un autre appareil, saisissez ci-dessous le code qu’il contient.","timeout":"Délai dépassé. Veuillez réessayer.","connectionFailed":"Échec de la connexion.","requestFirst":"Veuillez d’abord demander l’e-mail.","wholeCode":"Veuillez saisir le code complet reçu par e-mail.","codeChecking":"Vérification du code …"},
    it:{"htmlLang":"it-CH","home":"/it/","title":"Accedi a LignoCAD · LignoAI","heading":"Accedi a LignoCAD","intro":"Accedi con il tuo account LignoAI. Poi potrai tornare all’app.","continueText":"Su lignoai.ch hai già effettuato l’accesso come","continueBtn":"Accedi a LignoCAD con questo account","otherAccount":"Usa un altro account","tabLogin":"Accedi","tabRegister":"Crea un account","email":"Indirizzo e-mail","termsA":"Accetto le","termsLink":"Condizioni d’uso","termsB":"comprese le condizioni di licenza, e confermo di aver letto la","privacyLink":"Dichiarazione sulla protezione dei dati","termsC":".","submitLogin":"Invia il link di accesso","submitRegister":"Crea l’account e conferma l’e-mail","modeToRegister":"Non hai ancora un account? Creane uno","modeToLogin":"Hai già un account? Accedi","headingRegister":"Crea un account LignoAI","code":"Codice ricevuto per e-mail","codeSubmit":"Continua con il codice","checking":"Verifica della richiesta di accesso …","openApp":"Apri LignoCAD","help":"Conferma nel browser l’apertura di LignoCAD. Se non succede nulla, avvia l’app installata e ricomincia l’accesso da lì.","footer":"Dopo la registrazione la tua licenza vale subito per 14 giorni. Dopo la nostra verifica la estendiamo a tre mesi. I tuoi piani restano sul tuo computer.","noState":"Apri LignoCAD e avvia l’accesso dall’app. Poi potrai accedere o registrarti qui.","codeFailed":"Il codice non è corretto o è scaduto. Ricomincia l’accesso in LignoCAD.","linkInvalid":"Il link di accesso non è valido o è scaduto. Ricomincia l’accesso in LignoCAD.","badReturn":"Ritorno dall’accesso non valido. Ricomincia dall’app.","backHeading":"Torna a LignoCAD","backIntro":"Il tuo indirizzo e-mail è stato confermato. Ora completa l’accesso nell’app.","backClick":"Clicca su «Apri LignoCAD». L’app verificherà poi la tua licenza.","backRequested":"Il ritorno all’app è stato richiesto. Solo l’app può confermare se l’accesso e la verifica della licenza sono riusciti.","incomplete":"La richiesta di accesso è incompleta. Ricomincia da LignoCAD.","handoffIntro":"Puoi trasferire il tuo account dal sito direttamente nell’app.","handoffBusy":"Trasferimento dell’accesso a LignoCAD …","handoffDone":"Clicca su «Apri LignoCAD» se l’app non si attiva da sola. Il codice vale 5 minuti.","handoffFailed":"Il trasferimento non è riuscito. Accedi qui sotto con «Usa un altro account».","acceptTerms":"Accetta le Condizioni d’uso, così possiamo creare il tuo account.","rateLimit":"Troppe richieste di e-mail. Attendi qualche minuto.","notAuthorized":"L’invio di e-mail non è ancora attivo per questo indirizzo. Contatta LignoAI.","noAccount":"Nessun account trovato. Scegli «Crea un account».","sendFailed":"Non è stato possibile inviare l’e-mail. Riprova più tardi.","sent":"Apri il link della tua e-mail su questo computer. Se leggi l’e-mail su un altro dispositivo, inserisci qui sotto il codice ricevuto.","timeout":"Tempo scaduto. Riprova.","connectionFailed":"Connessione non riuscita.","requestFirst":"Richiedi prima l’e-mail.","wholeCode":"Inserisci il codice completo ricevuto per e-mail.","codeChecking":"Verifica del codice …"},
    en:{"htmlLang":"en","home":"/en/","title":"Sign in to LignoCAD · LignoAI","heading":"Sign in to LignoCAD","intro":"Sign in with your LignoAI account. You can then return to the app.","continueText":"You are signed in on lignoai.ch as","continueBtn":"Sign in to LignoCAD with this account","otherAccount":"Use a different account","tabLogin":"Sign in","tabRegister":"Create account","email":"Email address","termsA":"I accept the","termsLink":"Terms of Use","termsB":"including the licence terms and have read the","privacyLink":"Privacy Policy","termsC":".","submitLogin":"Send sign-in link","submitRegister":"Create account and confirm email","modeToRegister":"No account yet? Create one","modeToLogin":"Already have an account? Sign in","headingRegister":"Create a LignoAI account","code":"Code from the email","codeSubmit":"Continue with code","checking":"Checking sign-in request …","openApp":"Open LignoCAD","help":"Allow your browser to open LignoCAD. If nothing happens, start the installed app and begin signing in there again.","footer":"After you sign up, your licence is valid immediately for 14 days. Once we have reviewed your registration, we extend it to three months. Your plans stay on your computer.","noState":"Open LignoCAD and start signing in from the app. You can then sign in or sign up here.","codeFailed":"The code is incorrect or has expired. Start signing in again in LignoCAD.","linkInvalid":"The sign-in link is invalid or has expired. Start signing in again in LignoCAD.","badReturn":"Invalid return from sign-in. Please start again in the app.","backHeading":"Back to LignoCAD","backIntro":"Your email address has been confirmed. Now complete the sign-in in the app.","backClick":"Click “Open LignoCAD”. The app will then check your licence.","backRequested":"The return to the app has been requested. Only the app can confirm whether the sign-in and the licence check were successful.","incomplete":"The sign-in request is incomplete. Please start again in LignoCAD.","handoffIntro":"You can take your account from the website straight into the app.","handoffBusy":"Passing your sign-in to LignoCAD …","handoffDone":"Click “Open LignoCAD” if the app does not respond by itself. The code is valid for 5 minutes.","handoffFailed":"The handover did not work. Sign in below with “Use a different account”.","acceptTerms":"Please accept the Terms of Use so that we can create your account.","rateLimit":"Too many email requests. Please wait a few minutes.","notAuthorized":"Sending emails to this address has not been set up yet. Please contact LignoAI.","noAccount":"No account found. Choose “Create account”.","sendFailed":"The email could not be sent. Please try again later.","sent":"Open the link in your email on this computer. If you are reading the email on another device, enter the code from the email below.","timeout":"The request timed out. Please try again.","connectionFailed":"Connection failed.","requestFirst":"Please request the email first.","wholeCode":"Please enter the full code from the email.","codeChecking":"Checking code …"}
  };
  // i18n:end
  // Sprache: &lang= von der App, sonst die Wahl auf lignoai.ch, sonst der Browser, sonst Deutsch
  const LANGS=Object.keys(I18N),pick=v=>{v=String(v||'').slice(0,2).toLowerCase();return LANGS.includes(v)?v:null;};
  let saved=null;try{saved=localStorage.getItem('lignoai-lang');}catch{}
  const browser=typeof navigator!=='undefined'?(navigator.languages||[navigator.language]).map(pick).find(Boolean):null;
  const lang=pick(q.get('lang'))||pick(saved)||browser||'de',T=I18N[lang];
  if(document.documentElement)document.documentElement.lang=T.htmlLang;
  if('title' in document)document.title=T.title;
  ['heading','intro','continueText','continueBtn','otherAccount','tabLogin','tabRegister','termsA','termsLink','termsB','privacyLink','termsC','codeSubmit','openApp','help','footer']
    .forEach(id=>{el(id).textContent=T[id];});
  el('emailLabel').textContent=T.email;el('codeLabel').textContent=T.code;el('submit').textContent=T.submitLogin;el('mode').textContent=T.modeToRegister;
  el('home').href=T.home;el('termsLink').href=T.home+'#/nutzungsbedingungen';el('privacyLink').href=T.home+'#/datenschutz';
  message(T.checking);
  let create=false;
  // Never accept a callback URL supplied by the visitor. Only the fixed app
  // scheme is used; no session token or verifier is put into a browser URL.
  if(!/^[A-Za-z0-9_-]{32}$/.test(state||'')){
    message(T.noState);return;
  }
  const store={
    get(){try{const p=JSON.parse(sessionStorage.getItem(PENDING)||'null');return p&&p.state===state?p:null;}catch{return null;}},
    set(p){try{sessionStorage.setItem(PENDING,JSON.stringify(p));}catch{}},
    clear(){try{sessionStorage.removeItem(PENDING);}catch{}}
  };
  const returnUrl=()=>{const r=new URL(location.pathname,location.origin);r.searchParams.set('state',state);if(lang!=='de')r.searchParams.set('lang',lang);return r.href;};
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
    message(pending?T.codeFailed:T.linkInvalid);
    history.replaceState(null,'',location.pathname);return;
  }
  if(code){
    store.clear();
    history.replaceState(null,'',location.pathname);
    if(!/^[A-Za-z0-9_-]{16,512}$/.test(code)){message(T.badReturn);return;}
    el('heading').textContent=T.backHeading;
    el('intro').textContent=T.backIntro;
    const target=new URL('lignocad://auth/callback');target.searchParams.set('state',state);target.searchParams.set('code',code);
    el('openApp').href=target.href;el('openApp').hidden=false;el('help').hidden=false;
    message(T.backClick);
    el('openApp').addEventListener('click',()=>message(T.backRequested));
    return;
  }
  if(!/^[A-Za-z0-9_-]{43}$/.test(challenge||'')){
    message(T.incomplete);return;
  }
  el('login').hidden=false;el('tabs').hidden=false;message('');
  // The app can open this page directly in registration mode with &mode=register
  const setMode=value=>{
    create=value;
    el('heading').textContent=create?T.headingRegister:T.heading;
    el('submit').textContent=create?T.submitRegister:T.submitLogin;
    el('mode').textContent=create?T.modeToLogin:T.modeToRegister;
    el('termsRow').hidden=!create;
    el('tabLogin').className=create?'':'on';el('tabRegister').className=create?'on':'';
  };
  el('mode').addEventListener('click',event=>{event.preventDefault();setMode(!create);});
  el('tabLogin').addEventListener('click',()=>setMode(false));
  el('tabRegister').addEventListener('click',()=>setMode(true));
  if(q.get('mode')==='register')setMode(true);

  // Already signed in on lignoai.ch? Offer a one-time handoff instead of a new login.
  // Only when the app says it can redeem handoff codes (&handoff=1, LignoCAD from 4.0.1-beta.9).
  const lib=typeof window!=='undefined'&&window.supabase;
  if(q.get('handoff')==='1'&&lib&&!create){
    const sb=lib.createClient(base,key,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:false,detectSessionInUrl:false,storageKey:'lignoplan-auth'}});
    sb.auth.getSession().then(({data})=>{
      const session=data&&data.session;
      if(!session||!session.user)return;
      el('continueEmail').textContent=session.user.email;
      el('continue').hidden=false;el('login').hidden=true;el('tabs').hidden=true;
      el('heading').textContent=T.heading;
      el('intro').textContent=T.handoffIntro;
      const go=async()=>{
        el('continueBtn').disabled=true;message(T.handoffBusy);
        try{
          const res=await fetch(base+'/functions/v1/app-handoff',{method:'POST',signal:AbortSignal.timeout(20000),
            headers:{apikey:key,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},
            body:JSON.stringify({type:'create',state,code_challenge:challenge})});
          const out=await res.json().catch(()=>({}));
          if(!res.ok||!/^[A-Za-z0-9_-]{43}$/.test(out.code||''))throw Error();
          const target=new URL('lignocad://auth/callback');target.searchParams.set('state',state);target.searchParams.set('handoff',out.code);
          el('continue').hidden=true;el('openApp').href=target.href;el('openApp').hidden=false;el('help').hidden=false;
          el('heading').textContent=T.backHeading;
          message(T.handoffDone);
          location.assign(target.href);
        }catch{
          el('continueBtn').disabled=false;
          message(T.handoffFailed);
        }
      };
      el('continueBtn').addEventListener('click',go);
      el('otherAccount').addEventListener('click',event=>{event.preventDefault();el('continue').hidden=true;el('login').hidden=false;el('tabs').hidden=false;message('');});
      if(q.get('auto')==='1')go();
    });
  }
  let sentTo='';
  el('login').addEventListener('submit',async event=>{
    event.preventDefault();if(!el('login').reportValidity())return;
    if(create&&!el('terms').checked){message(T.acceptTerms);return;}
    el('submit').disabled=true;
    const email=el('email').value.trim().toLowerCase();
    try{
      const res=await fetch(base+'/auth/v1/otp?redirect_to='+encodeURIComponent(returnUrl()),{
        method:'POST',signal:AbortSignal.timeout(20000),headers:{apikey:key,'Content-Type':'application/json'},
        // user metadata is only stored when the account is created, like on the website registration
        body:JSON.stringify({email,create_user:create,code_challenge:challenge,code_challenge_method:'s256',
          ...(create?{data:{terms_version:TERMS_VERSION,consent_at:new Date().toISOString(),signup_source:'desktop',lang}}:{})})
      });
      const data=await res.json().catch(()=>({}));
      if(!res.ok){
        if(res.status===429)throw Error(T.rateLimit);
        if(data.error_code==='email_address_not_authorized')throw Error(T.notAuthorized);
        if(data.error_code==='signup_disabled'||data.error_code==='user_not_found')throw Error(T.noAccount);
        throw Error(T.sendFailed);
      }
      sentTo=email;el('codeForm').hidden=false;
      message(T.sent);
    }catch(error){message(error.name==='TimeoutError'?T.timeout:error.message||T.connectionFailed);}
    finally{el('submit').disabled=false;}
  });
  el('codeForm').addEventListener('submit',event=>{
    event.preventDefault();
    const digits=el('code').value.replace(/\D/g,'');
    if(!sentTo){message(T.requestFirst);return;}
    if(!/^\d{6,10}$/.test(digits)){message(T.wholeCode);return;}
    const hash=sha224(sentTo+digits),type=create?'signup':'magiclink';
    store.set({state,hash,tried:[type]});
    el('codeSubmit').disabled=true;message(T.codeChecking);
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
