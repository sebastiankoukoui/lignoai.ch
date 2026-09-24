'use strict';
// One-click review for new registrations. The signed token comes from the mail to info@lignoai.ch.
// The edge function checks the signature and does all writes. This page only shows and forwards.
(function(){
  const endpoint='https://djijagmwottlscxguimc.supabase.co/functions/v1/license-admin';
  const token=new URLSearchParams(location.search).get('t')||'';
  const el=id=>document.getElementById(id),message=t=>{el('status').textContent=t;};
  history.replaceState(null,'',location.pathname); // keep the token out of history and screenshots
  const fmt=v=>v?new Date(v).toLocaleDateString('de-CH',{day:'numeric',month:'long',year:'numeric'}):'unbefristet';
  const call=async type=>{
    const res=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({type,token}),signal:AbortSignal.timeout(20000)});
    const data=await res.json().catch(()=>({}));
    if(res.status===403)throw Error('Der Link ist ungültig oder abgelaufen. Du kannst die Lizenz weiterhin direkt in Supabase anpassen.');
    if(!res.ok||!data.account)throw Error('Das hat nicht geklappt. Bitte versuche es in einem Moment nochmals.');
    return data.account;
  };
  const licenceText=a=>{
    if(!a.license)return'keine';
    if(a.license.revoked||a.license.status==='inactive')return'gesperrt';
    return a.license.plan+', gültig bis '+fmt(a.license.validUntil);
  };
  const render=a=>{
    const rows=[['Name',a.name||'nicht angegeben'],['E-Mail',a.email],['Kontotyp',a.accountTypeLabel],['Hochschule oder Firma',a.organization||'nicht angegeben'],['Registriert über',a.source],['Registriert am',fmt(a.createdAt)],['Lizenz',licenceText(a)]];
    el('rows').replaceChildren(...rows.map(([k,v])=>{const tr=document.createElement('tr');const td1=document.createElement('td'),td2=document.createElement('td');td1.textContent=k;td2.textContent=v;tr.append(td1,td2);return tr;}));
    el('details').hidden=false;
  };
  const decide=async type=>{
    el('approve').disabled=el('reject').disabled=true;message(type==='approve'?'Wird freigegeben …':'Wird abgelehnt …');
    try{
      const a=await call(type);render(a);
      message(type==='approve'?'Freigegeben. Die Lizenz gilt bis '+fmt(a.license&&a.license.validUntil)+'.':'Abgelehnt. Die Lizenz ist gesperrt.');
      el('status').className='ok';
    }catch(e){message(e.message);}
    finally{el('approve').disabled=el('reject').disabled=false;}
  };
  if(!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)){message('Dieser Link ist unvollständig. Öffne ihn direkt aus der E-Mail.');return;}
  el('approve').addEventListener('click',()=>decide('approve'));
  el('reject').addEventListener('click',()=>{if(confirm('Lizenz wirklich sperren?'))decide('reject');});
  call('info').then(a=>{
    render(a);
    message(a.decision==='approved'?'Diese Registrierung hast du bereits freigegeben.':a.decision==='rejected'?'Diese Registrierung hast du abgelehnt.':'Prüfe die Angaben und entscheide.');
  },e=>message(e.message));
})();
