// Generates the First Light multi-page preview from shared templates + real content
// (ported from the Astro rebuild). Run: node generate.mjs
import { promises as fs } from 'node:fs';
import path from 'node:path';

const B = '/nbr-design-preview/';               // GitHub Pages base path
const PHONE = '(760) 762-3605', TEL = 'tel:+17607623605';
const EMAIL = 'info@newbeginningsrecovery.com';
const ADDR = '34620 Via Josefina, Rancho Mirage, CA 92270';

const svgPhone = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 4h4l2 5-3 2a12 12 0 006 6l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z"/></svg>';
const svgShield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z"/><path d="M9 12l2 2 4-4"/></svg>';
const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6L9 17l-5-5"/></svg>';

const NAV = [
  ['about', 'About', 'about.html'],
  ['programs', 'Programs', 'programs.html'],
  ['wellness', 'Wellness', 'wellness.html'],
  ['family', 'Family', 'family.html'],
  ['virtual-tour', 'Virtual Tour', 'virtual-tour.html'],
  ['resources', 'Resources', 'resources.html'],
  ['contact', 'Contact', 'contact.html'],
];

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function navHTML(active) {
  const links = NAV.map(([k, label, href]) =>
    `<a href="${B}${href}"${k === active ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return `<nav class="nav" id="nav"><div class="wrap nav-inner">
    <a href="${B}" class="brand" aria-label="New Beginnings Recovery — home"><img src="${B}images/logo-primary-light.svg" alt="New Beginnings Recovery" /></a>
    <div class="nav-links" id="navlinks">${links}</div>
    <div class="nav-cta">
      <button class="nav-theme" id="themeToggle" aria-label="Switch day / night theme" title="Theme"></button>
      <a class="nav-phone" href="${TEL}">${svgPhone}<span class="num">${PHONE}</span></a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div></div></nav>`;
}

const FOOTER = `<footer><div class="wrap">
  <div class="disclaimer"><strong>In an emergency, call 911.</strong> If you or someone else is in crisis, call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline), available 24/7. This website is not a substitute for emergency medical care.</div>
  <div class="foot-grid">
    <div>
      <img src="${B}images/logo-primary-light.svg" alt="New Beginnings Recovery" />
      <p>${ADDR.replace(', Rancho', '<br>Rancho')}</p>
      <p><a href="${TEL}">${PHONE}</a> · available 24/7</p>
      <p style="color:#8B8474">DHCS License #330232AP · Exp. 07/31/2027</p>
    </div>
    <div><h4>Explore</h4>
      <a href="${B}about.html">About</a><a href="${B}programs.html">Programs</a><a href="${B}wellness.html">Wellness</a><a href="${B}family.html">Family</a><a href="${B}virtual-tour.html">Virtual Tour</a><a href="${B}resources.html">Resources</a><a href="${B}contact.html">Contact</a></div>
    <div><h4>Compare</h4>
      <a href="${B}design-audit.html">Design audit</a><a href="${B}first-light.html">Original concept</a><a href="https://williamparrish-michael.github.io/newbeginnings-recovery/">Rebuild (Astro)</a></div>
  </div>
  <div class="foot-bottom"><span>© 2026 New Beginnings Recovery · design preview</span><span>Confidential care · HIPAA &amp; 42 CFR Part 2</span></div>
</div></footer>`;

const CALLBAR = `<nav class="callbar" aria-label="Quick contact">
  <a class="cb-call" href="${TEL}" aria-label="Call New Beginnings Recovery 24/7">${svgPhone}Call 24/7</a>
  <a class="cb-verify" href="${B}verify-insurance.html">${svgShield}Verify insurance</a></nav>`;

function shell({ title, desc, main, active = '' }) {
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<meta name="theme-color" content="#0B0E13" />
<script>(function(){try{var s=localStorage.getItem('nbr-theme');if(s==='light'||s==='dark')document.documentElement.setAttribute('data-theme',s);}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" />
<link rel="stylesheet" href="${B}assets/site.css" />
</head>
<body>
<div class="preview-flag">Design preview · not the live site</div>
${navHTML(active)}
${main}
${FOOTER}
${CALLBAR}
<script src="${B}assets/app.js"></script>
</body>
</html>`;
}

// ---- content helpers ----
const pageHero = ({ eyebrow, title, lede, image, alt = '' }) => `
<header class="page-hero${image ? ' has-image' : ''}">
  <div class="wrap${image ? ' ph-grid' : ''}">
    <div><span class="eyebrow reveal">${eyebrow}</span><h1 class="reveal">${title}</h1>${lede ? `<p class="lede reveal">${lede}</p>` : ''}</div>
    ${image ? `<div class="ph-art reveal"><img src="${B}images/${image}" alt="${alt}" loading="eager" /></div>` : ''}
  </div>
</header>`;

const faq = (items, title = 'Frequently asked questions') => `
<section class="section"><div class="wrap">
  <h2 class="reveal" style="font-size:clamp(1.6rem,1.3rem + 1.4vw,2.2rem)">${title}</h2>
  <div class="faq-list reveal">
    ${items.map(it => `<details class="faq-item"><summary>${it.q}</summary><p>${it.a}</p></details>`).join('')}
  </div>
</div></section>`;

const steps = items => `<ol class="steps">${items.map((s, i) => `<li><span class="num">${i + 1}</span><div><h3>${s.t}</h3><p>${s.d}</p></div></li>`).join('')}</ol>`;
const features = (items, three) => `<div class="feature-grid${three ? ' three' : ''}">${items.map(f => `<div class="feature"><h3>${f.t}</h3><p>${f.d}</p></div>`).join('')}</div>`;
const list = items => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;

const ctaBand = (title = 'Ready when you are.', text = 'Confidential help, most major insurance accepted. Talk to our admissions team today.') => `
<section class="section"><div class="wrap"><div class="panel reveal">
  <h2>${title}</h2><p>${text}</p>
  <div class="hero-actions"><a class="btn btn-primary" href="${TEL}">${svgPhone}Call ${PHONE}</a><a class="btn btn-ghost" href="${B}verify-insurance.html">Verify your insurance</a></div>
</div></div></section>`;

// ============================ PAGES ============================
const pages = {};

// ---- HOME ----
pages['index.html'] = shell({ active: '', title: 'New Beginnings Recovery — Design Preview', desc: 'Premium redesign concept for New Beginnings Recovery — private medical detox and residential addiction treatment in Rancho Mirage, California.', main: `
<header class="hero" id="top">
  <div class="hero-photo" style="background-image:url('${B}images/photo-160.jpg')" aria-hidden="true"></div>
  <div class="hero-scrim" aria-hidden="true"></div>
  <div class="wrap hero-inner">
    <span class="eyebrow">Private detox &amp; residential care · Rancho Mirage</span>
    <h1>A calmer place<br>to <em>begin again.</em></h1>
    <p class="lead">Physician-led medical detox and residential treatment in a private Coachella Valley estate. Around-the-clock care, complete discretion, and a team that answers the moment you call.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="${TEL}">${svgPhone}Call 24/7 — ${PHONE}</a>
      <a class="btn btn-ghost" href="${B}verify-insurance.html">Verify your insurance</a>
    </div>
    <div class="hero-trust">
      <span>${tick}DHCS licensed</span><span>${tick}LegitScript certified</span><span>${tick}Confidential — HIPAA &amp; 42 CFR Part 2</span>
    </div>
  </div>
</header>
<div class="accbar"><div class="wrap">
  <div class="acc"><img src="${B}images/badges/dhcs-logo.png" alt="California DHCS" /><div>State of California — DHCS<small>License #330232AP · Exp. 07/31/2027</small></div></div>
  <div class="acc"><img src="${B}images/badges/legitscript-seal-example.png" alt="LegitScript Certified" /><div>LegitScript<small>Certified treatment provider</small></div></div>
  <div class="acc"><span class="chip">${svgShield}</span><div>Confidential care<small>HIPAA &amp; 42 CFR Part 2</small></div></div>
  <div class="acc"><span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></span><div>Admissions 24/7<small>Most major PPO plans accepted</small></div></div>
</div></div>
<section class="band empathy"><div class="wrap">
  <p class="eyebrow reveal">If today is the day</p>
  <p class="big reveal">You don't have to figure this out alone. <span class="soft">The hardest part is the phone call. We'll take it from there.</span></p>
  <div class="cols">
    <p class="reveal"><strong>It moves fast.</strong> Withdrawal from alcohol, benzodiazepines, or opioids can turn dangerous within hours. Medical supervision makes it safe.</p>
    <p class="reveal"><strong>It's private.</strong> A quiet residence, not a hospital ward. What you tell us is protected by HIPAA and federal Part 2 confidentiality.</p>
    <p class="reveal"><strong>It starts today.</strong> Admissions are open around the clock. Most people who call in the morning are settled in by evening.</p>
  </div>
</div></section>
<section class="band" id="programs"><div class="wrap">
  <div class="section-head"><span class="eyebrow reveal">How we help</span><h2 class="reveal">Safe detox. Real treatment.<br>One private place.</h2><p class="reveal">Every stay is built around one person: medically, clinically, and personally. Care stays with you from the first night through the transition home.</p></div>
  <div class="cards">
    <a class="card reveal" href="${B}programs/medical-detox.html"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10" stroke-linecap="round"/></svg></span><h3>Medical Detox</h3><p>24/7 physician and nursing oversight, comfort medications, and continuous monitoring so withdrawal is managed safely, not endured.</p></a>
    <a class="card reveal" href="${B}programs/residential.html"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg></span><h3>Residential Rehab</h3><p>A structured, unhurried stay in a private estate. Individual therapy, groups, and whole-person care that treats the reasons underneath the use.</p></a>
    <a class="card reveal" href="${B}programs/dual-diagnosis.html"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21c-5-3-9-6-9-11a5 5 0 019-3 5 5 0 019 3c0 5-4 8-9 11z"/></svg></span><h3>Dual Diagnosis</h3><p>Addiction rarely travels alone. We treat anxiety, depression, and trauma alongside substance use, because lasting recovery needs both.</p></a>
    <a class="card reveal" href="${B}family.html"><span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="10" r="2.4"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/></svg></span><h3>Family Support</h3><p>Addiction affects the whole family. Guided sessions and clear, HIPAA-appropriate updates help the people who love you heal too.</p></a>
  </div>
</div></section>
<section class="band" id="care" style="background:linear-gradient(180deg,var(--bg),var(--bg-2))"><div class="wrap split">
  <div class="split-art reveal"><img src="${B}images/photo-171.jpg" alt="A calm interior space at New Beginnings Recovery in Rancho Mirage" loading="lazy" /></div>
  <div>
    <span class="eyebrow reveal">What care feels like here</span>
    <h2 class="reveal" style="font-size:clamp(1.9rem,3.8vw,2.7rem);margin-top:1rem">Recovery in a place that feels like rest, not a hospital.</h2>
    <ul class="checklist">
      <li class="reveal"><span class="tick">${tick}</span><div><strong>Around-the-clock medical team</strong><span class="d">Doctors and nurses on site 24/7, so the safest option is never far away.</span></div></li>
      <li class="reveal"><span class="tick">${tick}</span><div><strong>A private, low-census setting</strong><span class="d">A quiet, comfortable residence in Rancho Mirage. Genuinely discreet.</span></div></li>
      <li class="reveal"><span class="tick">${tick}</span><div><strong>One plan, built for you</strong><span class="d">Therapy, psychiatry, and whole-person care (nutrition, movement, mindfulness) in one coordinated plan.</span></div></li>
      <li class="reveal"><span class="tick">${tick}</span><div><strong>A real plan for after</strong><span class="d">You leave with a concrete next step, not a discharge paper and a handshake.</span></div></li>
    </ul>
  </div>
</div></section>
${ctaBand('Find out if your insurance covers treatment.', 'A quick, confidential benefits check — no obligation, and we never share your information.')}
` });

// ---- ABOUT ----
pages['about.html'] = shell({ active: 'about', title: 'About — New Beginnings Recovery', desc: 'A private detox and residential addiction treatment center in Rancho Mirage, founded on more than 20 years of healthcare experience.', main: `
${pageHero({ eyebrow: 'About Us', title: 'The kind of treatment center you’d want for your own family', lede: 'New Beginnings Recovery began with a vision: a place where safety is never in question, where compassion leads the way, and where healing is supported at every level.', image: 'photo-165.jpg', alt: 'New Beginnings Recovery in Rancho Mirage, California' })}
<section class="section"><div class="wrap prose">
  <h2>Healthcare experience, human motivation</h2>
  <p>The foundation of New Beginnings Recovery is rooted in decades of professional work across hospital systems, behavioral health programs, and addiction medicine. Founded by someone with more than 20 years of healthcare experience, the program combines expert medical care, a restorative setting, and dignified treatment: clinical credibility paired with a deep understanding of families facing addiction.</p>
  <h2>Why we exist</h2>
  <p>Families deserve a treatment center they can trust — one that puts safety, dignity, and compassion first.</p>
  ${features([{ t: 'Safety first', d: 'Every client is medically monitored and cared for with dignity.' }, { t: 'Trustworthy treatment', d: 'Built on evidence, guided by healthcare professionals.' }, { t: 'Compassion always', d: 'Because recovery is not only a medical process. It’s a human one.' }], true)}
  <h2>Our mission &amp; vision</h2>
  <p><strong>Mission:</strong> To provide safe, compassionate, and clinically sound treatment for individuals struggling with addiction, while restoring hope to the families who love them.</p>
  <p><strong>Vision:</strong> A community where addiction is met with dignity and healing, not stigma or fear. A place where people across Rancho Mirage, Palm Springs, and the Coachella Valley can access treatment they trust, close to home.</p>
</div></section>
<section class="section" style="background:var(--surface-2)"><div class="wrap prose" style="max-width:52rem">
  <h2>Admissions, step by step</h2>
  ${steps([{ t: 'Confidential call', d: 'A private call where our team listens, answers questions, and determines fit.' }, { t: 'Pre-assessment', d: 'A short, confidential assessment of needs, history, and goals to create a personalized care plan.' }, { t: 'Insurance & payment support', d: 'We review your benefits, explain coverage, provide clear cost information, and work directly with providers.' }, { t: 'Arrival & welcome', d: 'We guide you through what to bring, travel, and arrival details.' }, { t: 'Medical detox & intake', d: 'A full medical intake with 24/7 licensed medical supervision.' }, { t: 'Transition into treatment', d: 'Move into the residential program with therapy, wellness, and regular family updates.' }])}
  <div class="callout"><p><strong>Insurance &amp; payment:</strong> Most major insurance plans accepted, with direct verification and billing support, flexible options for self-pay, and dedicated staff to walk families through every step.</p></div>
</div></section>
${faq([{ q: 'How long does admissions take?', a: 'Admissions can often be completed the same day, and our team is available 24/7.' }, { q: 'What if I’m calling for a loved one?', a: 'Many admissions are initiated by family members. Our team is trained to provide compassionate, confidential support.' }, { q: 'Do you provide transportation?', a: 'Yes — we can assist with local transportation in the Palm Springs and Coachella Valley area.' }, { q: 'What if insurance doesn’t cover everything?', a: 'We review all options and help find solutions to make treatment accessible, including flexible payment options for self-pay.' }], 'Admissions FAQs')}
${ctaBand('Begin the process today', 'Quick, confidential insurance verification and a 24/7 admissions team ready to help.')}
` });

// ---- PROGRAMS OVERVIEW ----
pages['programs.html'] = shell({ active: 'programs', title: 'Programs — New Beginnings Recovery', desc: 'Medically supervised detox, residential treatment, and dual-diagnosis support in Rancho Mirage and the Coachella Valley.', main: `
${pageHero({ eyebrow: 'Our Programs', title: 'Addiction treatment in Rancho Mirage &amp; Palm Springs', lede: 'Evidence-based, compassionate care for individuals and families across the Coachella Valley — from the first supervised days of detox through residential rehab.', image: 'photo-162.jpg', alt: 'New Beginnings Recovery facility in Rancho Mirage, California' })}
<section class="section"><div class="wrap">
  <div class="prose"><h2>Comprehensive care, compassionate support</h2><p>At New Beginnings Recovery, we provide addiction treatment designed to support clients from the very beginning of their recovery journey forward — combining more than 20 years of healthcare experience with trusted medical expertise in a restorative environment.</p></div>
  <div class="prog-grid" style="margin-top:2.4rem">
    <a class="prog reveal" href="${B}programs/medical-detox.html"><h3>Medical Detox</h3><p>24/7 supervision and licensed medical support to withdraw safely from alcohol, opioids, benzodiazepines, stimulants, and other substances — comfort-focused care in a private, serene setting.</p><span class="more">Learn more →</span></a>
    <a class="prog reveal" href="${B}programs/residential.html"><h3>Residential Rehab</h3><p>After detox, clients live on-site where therapy, wellness services, and daily structure build a strong foundation for long-term recovery.</p><span class="more">Learn more →</span></a>
    <a class="prog reveal" href="${B}programs/dual-diagnosis.html"><h3>Dual Diagnosis Support</h3><p>Care that treats substance use and co-occurring mental health challenges — anxiety, depression, and unresolved trauma — together.</p><span class="more">Learn more →</span></a>
  </div>
  <div class="prog-grid" style="margin-top:1.1rem">
    <a class="prog reveal" href="${B}programs/drug-detox.html"><h3>Drug Detox</h3><p>Compassionate, medically supervised detox for opioids, stimulants, benzodiazepines, and polysubstance use.</p><span class="more">Learn more →</span></a>
    <a class="prog reveal" href="${B}programs/alcohol-detox.html"><h3>Alcohol Detox</h3><p>Safe, 24/7 medically supervised alcohol detox through withdrawal, minutes from Palm Springs.</p><span class="more">Learn more →</span></a>
    <a class="prog reveal" href="${B}wellness.html"><h3>Holistic Wellness</h3><p>Optional nutrition counseling, Ayurveda, and mindfulness that complement clinical treatment.</p><span class="more">Learn more →</span></a>
  </div>
</div></section>
<section class="section" style="background:var(--surface-2)"><div class="wrap prose">
  <h2>Serving the Coachella Valley</h2>
  <p>New Beginnings is a trusted local option for safe, compassionate addiction treatment serving Rancho Mirage, Palm Springs, Cathedral City, Indio, and Riverside County. Our programs address alcohol, opioids, prescription medications, and multiple substances — always with dignity and respect.</p>
</div></section>
${faq([{ q: 'What types of addiction treatment programs do you offer?', a: 'Medically supervised detox, residential treatment, dual diagnosis support, and personalized therapy plans.' }, { q: 'How do I know which program is right for me?', a: 'Our admissions specialists conduct confidential assessments to determine the appropriate level of care based on substance use history, medical needs, and treatment goals.' }, { q: 'Are your programs covered by insurance?', a: 'Many major insurance plans are accepted. Our team can help verify your coverage and explore payment options.' }, { q: 'What should I expect during treatment?', a: 'Structured therapy, medical care, wellness activities, and skill-building in a supportive environment designed to stabilize health and develop tools for long-term sobriety.' }])}
${ctaBand()}
` });

// ---- PROGRAM: MEDICAL DETOX ----
pages['programs/medical-detox.html'] = shell({ active: 'programs', title: 'Medical Detox — New Beginnings Recovery', desc: 'Medically supervised, 24/7 detox for alcohol, opioids, benzodiazepines, and stimulants in Rancho Mirage.', main: `
${pageHero({ eyebrow: 'Medical Detox', title: 'A safe first step toward recovery', lede: 'Clients are cared for 24/7 by licensed medical professionals in a serene setting just minutes from Palm Springs — so families can feel relief knowing their loved one is safe and supported.', image: 'photo-108.jpg', alt: 'New Beginnings Recovery private treatment facility in Rancho Mirage' })}
<section class="section"><div class="wrap prose">
  <h2>Why detox is the first step</h2>
  <p>Detox is the process of clearing alcohol or drugs from the body — but it isn’t just physical. It’s the moment when someone chooses recovery, and that choice deserves the highest level of care. Without medical support, withdrawal can be dangerous:</p>
  <ul><li><strong>Alcohol</strong> withdrawal can cause seizures or delirium tremens (DTs).</li><li><strong>Opioid</strong> withdrawal may not be fatal, but it is extremely painful and often leads to relapse.</li><li><strong>Benzodiazepine</strong> withdrawal can be life-threatening if not managed carefully.</li><li><strong>Stimulant</strong> withdrawal often brings intense depression, anxiety, and cravings.</li></ul>
  <div class="callout"><p>According to the CDC, alcohol misuse is responsible for over 178,000 deaths in the U.S. each year. SAMHSA research shows that medically supervised detox increases the likelihood of continuing into treatment instead of relapsing.</p></div>
</div></section>
<section class="section" style="background:var(--surface-2)"><div class="wrap prose" style="max-width:52rem">
  <h2>The medical detox process</h2><p>Detox at New Beginnings is structured, supportive, and designed to reduce fear.</p>
  ${steps([{ t: 'Medical intake', d: 'A full evaluation of medical history, substance use, and overall health.' }, { t: 'Stabilization', d: '24/7 monitoring with medications and comfort supports as needed.' }, { t: 'Ongoing support', d: 'Compassionate staff available day and night to ease fears and build trust.' }, { t: 'Transition into rehab', d: 'Once stabilized, clients move into our residential rehab program to continue healing.' }])}
  <h2 style="margin-top:2.6rem">How long does detox last?</h2><p>The length of detox varies based on the substance and individual history. Our medical team creates an individualized plan so families always know what to expect.</p>
  ${features([{ t: 'Alcohol', d: '3–7 days, sometimes longer.' }, { t: 'Opioids', d: '5–10 days depending on duration and substance.' }, { t: 'Benzodiazepines', d: 'Several weeks, requiring a slow taper.' }, { t: 'Stimulants', d: '3–5 days for physical symptoms, with additional emotional recovery.' }])}
</div></section>
<section class="section"><div class="wrap prose">
  <h2>Optional wellness supports during detox</h2>
  <p>While medical care is always the foundation, clients may choose optional services that support overall well-being: nutrition counseling with a registered dietitian, mindfulness and meditation practices, and Ayurveda-inspired wellness practices. These supports are optional and designed to make detox more holistic and restorative.</p>
  <p><a href="${B}programs/residential.html">See what comes next: residential rehab →</a></p>
</div></section>
${faq([{ q: 'What happens during medical detox?', a: 'Clients are medically monitored, provided with medications when needed, and supported to ease withdrawal symptoms safely.' }, { q: 'How long does detox take?', a: 'Most detox programs last 3–10 days, though benzodiazepine detox may require a longer taper.' }, { q: 'Can you detox at home?', a: 'Detoxing at home can be unsafe. Alcohol and benzodiazepine withdrawal can be life-threatening without medical support.' }, { q: 'What happens after detox?', a: 'Detox is the first step. After stabilization, clients transition into residential rehab to begin therapy and build long-term recovery skills.' }, { q: 'Do you accept insurance for detox?', a: 'Many major insurance plans are accepted, and our admissions team can verify your benefits to help you.' }], 'FAQs about medical detox')}
${ctaBand('Begin detox safely today', 'Detox is the first step — but it should never be faced alone. Confidential insurance verification and a 24/7 admissions team.')}
` });

// ---- PROGRAM: RESIDENTIAL ----
pages['programs/residential.html'] = shell({ active: 'programs', title: 'Residential Rehab — New Beginnings Recovery', desc: 'Structured, compassionate residential addiction treatment in Rancho Mirage — therapy, wellness, and 24/7 support in a private desert setting.', main: `
${pageHero({ eyebrow: 'Residential Rehab', title: 'A safe place for healing', lede: 'Residential rehab is more than a program — it’s a chance to step away from the chaos of addiction and begin again in a safe, structured, and compassionate environment.', image: 'photo-159.jpg', alt: 'The residential setting at New Beginnings Recovery in Rancho Mirage' })}
<section class="section"><div class="wrap prose">
  <h2>What is residential rehab?</h2><p>Residential (inpatient) rehab is a structured program where clients live on-site during recovery. It provides 24/7 support and supervision, a safe space away from triggers and daily stressors, a structured daily routine that builds stability, and access to therapies, wellness services, and community support.</p>
  <h2>A day in residential rehab</h2>
  ${features([{ t: 'Morning', d: 'Individual or group therapy, guided reflection, or wellness activities.' }, { t: 'Afternoon', d: 'Skill-building, relapse-prevention groups, or family sessions.' }, { t: 'Evening', d: 'Community meals, mindfulness practices, or quiet time to recharge.' }], true)}
  <h2>Therapies offered</h2>${list(['Individual counseling', 'Group therapy', 'Family therapy', 'Trauma-informed care', 'Relapse-prevention training'])}
  <h2>Treating mental health alongside addiction</h2><p>Addiction rarely exists in isolation. Many clients also experience anxiety, depression, or the weight of unresolved trauma. Our program treats both substance use and co-occurring mental health challenges together. <a href="${B}programs/dual-diagnosis.html">Learn about dual-diagnosis support →</a></p>
  <h2>The Rancho Mirage environment</h2><p>Our private property offers a sparkling pool for rest and reflection, private courtyards framed by desert and mountain views, and warm, modern interiors that feel safe and restorative. The setting reminds clients daily: recovery is not punishment — it is a return to life.</p>
</div></section>
${faq([{ q: 'What happens in residential rehab?', a: 'Clients live on-site and participate in a structured schedule of therapy, wellness, and recovery activities. Meals, housing, and 24/7 support are included.' }, { q: 'How long is inpatient rehab?', a: 'Most programs last 30–90 days, depending on personal needs, progress, and goals.' }, { q: 'Is residential rehab effective?', a: 'Research shows inpatient rehab can significantly improve recovery outcomes compared to outpatient care alone, especially for those with severe addictions.' }, { q: 'What should I bring to rehab?', a: 'Comfortable clothing, personal hygiene items, and any necessary medications. Our admissions team provides a full packing list.' }, { q: 'Is residential rehab covered by insurance?', a: 'Many major insurance plans are accepted. Our admissions team can verify benefits and walk you through coverage options.' }], 'FAQs about residential rehab')}
${ctaBand('Begin residential rehab today', 'Our admissions team is available 24/7, with confidential insurance verification and flexible payment options.')}
` });

// ---- PROGRAM: DUAL DIAGNOSIS ----
pages['programs/dual-diagnosis.html'] = shell({ active: 'programs', title: 'Dual Diagnosis Support — New Beginnings Recovery', desc: 'Integrated care for addiction and co-occurring mental health challenges within our residential program in Rancho Mirage.', main: `
${pageHero({ eyebrow: 'Dual Diagnosis', title: 'Treating mental health alongside addiction', lede: 'Addiction rarely exists in isolation. Many clients also experience anxiety, depression, or the weight of unresolved trauma.', image: 'photo-148.jpg', alt: 'A calm, private space at New Beginnings Recovery in Rancho Mirage' })}
<section class="section"><div class="wrap prose">
  <p>At New Beginnings Recovery, our program treats both substance use and co-occurring mental health challenges together — because lasting recovery rarely comes from treating one alone. Dual-diagnosis support is woven into our residential program, where individual counseling, group therapy, trauma-informed care, and family involvement address the whole person.</p>
  <p>Care is individualized: our clinical team works with each client to understand what’s driving the addiction and to build a plan that supports both mental health and sobriety.</p>
  <div class="callout"><p>Dual-diagnosis care at New Beginnings is delivered within our residential program. <a href="${B}programs/residential.html">Explore residential rehab →</a></p></div>
</div></section>
${ctaBand('Talk to someone who understands', 'A confidential conversation with our admissions team is the first step. Most major insurance accepted.')}
` });

// ---- PROGRAM: DRUG DETOX ----
pages['programs/drug-detox.html'] = shell({ active: 'programs', title: 'Drug Detox — New Beginnings Recovery', desc: 'Compassionate, medically supervised drug detox in Rancho Mirage and the Coachella Valley for opioids, stimulants, benzodiazepines, and polysubstance use.', main: `
${pageHero({ eyebrow: 'Drug Detox', title: 'Drug detox in the Coachella Valley', lede: 'When use stops after prolonged or heavy use, withdrawal can be uncomfortable or dangerous. We provide compassionate support as individuals safely begin recovery.', image: 'photo-141.jpg', alt: 'New Beginnings Recovery treatment center in Rancho Mirage, California' })}
<section class="section"><div class="wrap prose">
  <h2>What is drug detox?</h2><p>Drug detox is the process of clearing drugs from the body while managing withdrawal symptoms in a safe, supportive environment. When someone develops a physical dependence, the body adapts to the drug being present; when use stops, withdrawal occurs as the body works to regain balance.</p>
  <h2>Substances that may require detox</h2>${list(['Opioids (heroin, fentanyl, prescription pain medications)', 'Methamphetamine', 'Cocaine and crack cocaine', 'Benzodiazepines (such as Xanax or Valium)', 'Prescription drug misuse', 'Polysubstance use'])}
  <h2>How drug detox helps</h2><ul><li><strong>Monitoring and stabilization</strong> — support during withdrawal helps individuals remain safe as their bodies adjust.</li><li><strong>Symptom management</strong> — care focuses on keeping individuals as comfortable as possible while symptoms pass.</li><li><strong>Emotional support</strong> — compassionate support helps individuals stay motivated through a challenging process.</li><li><strong>Transition to treatment</strong> — afterward, individuals are better prepared to continue recovery through therapy and structured care.</li></ul>
</div></section>
${faq([{ q: 'How do I know if I need drug detox?', a: 'You may need drug detox if you experience withdrawal symptoms when you stop using or try to cut back — nausea, sweating, anxiety, irritability, muscle aches, insomnia, or strong cravings.' }, { q: 'What are common drug withdrawal symptoms?', a: 'They vary by substance and may include nausea, fatigue, anxiety, sweating, tremors, mood changes, sleep disturbances, and intense cravings.' }, { q: 'Is drug detox dangerous without supervision?', a: 'Detoxing from certain substances without supervision can be risky. A structured environment helps ensure safety and support.' }, { q: 'Can people detox from multiple substances at once?', a: 'Yes. Detox programs can monitor and manage withdrawal across multiple substances (polysubstance use).' }, { q: 'What happens after drug detox?', a: 'Detox is usually the first step. Afterward, many people continue through residential rehab, outpatient programs, therapy, or counseling.' }], 'FAQs about drug detox')}
<section class="section" style="background:var(--surface-2)"><div class="wrap prose">
  <h2>Trusted resources</h2>
  <ul class="link-list"><li><a href="https://www.samhsa.gov/" rel="noopener nofollow" target="_blank">SAMHSA — Detox &amp; Treatment Information →</a></li><li><a href="https://www.cdc.gov/alcohol/" rel="noopener nofollow" target="_blank">CDC — Alcohol &amp; Withdrawal Data →</a></li><li><a href="https://nida.nih.gov/" rel="noopener nofollow" target="_blank">NIDA — Withdrawal &amp; Treatment Research →</a></li><li><a href="https://www.niaaa.nih.gov/" rel="noopener nofollow" target="_blank">NIAAA — Alcohol Facts &amp; Statistics →</a></li></ul>
</div></section>
${ctaBand('Begin detox safely today', 'Detox is the first step — but it should never be faced alone. Confidential insurance verification and a 24/7 admissions team.')}
` });

// ---- PROGRAM: ALCOHOL DETOX ----
pages['programs/alcohol-detox.html'] = shell({ active: 'programs', title: 'Alcohol Detox — New Beginnings Recovery', desc: 'Safe, medically supervised alcohol detox in Rancho Mirage and the Coachella Valley — 24/7 care through withdrawal.', main: `
${pageHero({ eyebrow: 'Alcohol Detox', title: 'Alcohol detox in the Coachella Valley', lede: 'Alcohol withdrawal can range from uncomfortable to dangerous. We help individuals begin recovery with safe, supportive detox — cared for 24/7 by licensed medical professionals.', image: 'photo-131.jpg', alt: 'New Beginnings Recovery residential facility in the Coachella Valley' })}
<section class="section"><div class="wrap prose">
  <h2>What is alcohol detox?</h2><p>Alcohol detox is the process of allowing the body to safely eliminate alcohol while managing withdrawal symptoms. When someone becomes physically dependent on alcohol, the body adjusts to its presence; when drinking suddenly stops, the nervous system can become overactive, leading to withdrawal.</p>
  <h2>How alcohol detox helps</h2><ul><li><strong>Medical monitoring</strong> — supervision during withdrawal helps ensure safety and allows symptoms to be addressed quickly.</li><li><strong>Supportive care</strong> — compassionate encouragement helps individuals stay comfortable and supported.</li><li><strong>Stabilization</strong> — the goal is to help individuals safely move through withdrawal so they can begin ongoing treatment.</li><li><strong>Transition to treatment</strong> — afterward, individuals are better prepared to continue recovery.</li></ul>
  <h2>Alcohol detox and ongoing recovery</h2><p>Detox alone does not treat the underlying causes of addiction. While it helps the body stabilize, long-term recovery often requires continued support such as therapy, counseling, and structured treatment. At New Beginnings, individuals can transition from alcohol detox directly into residential care.</p>
</div></section>
${faq([{ q: 'How do I know if I need alcohol detox?', a: 'You may need alcohol detox if you experience withdrawal symptoms when you stop drinking — shaking, anxiety, sweating, nausea, headaches, or trouble sleeping.' }, { q: 'How long does alcohol detox usually take?', a: 'Many people begin experiencing withdrawal within several hours of their last drink. Symptoms often peak in the first few days and improve over about five to seven days.' }, { q: 'Is medical supervision important during alcohol detox?', a: 'Yes. Alcohol withdrawal can lead to serious complications. Medical supervision helps ensure safety by monitoring symptoms and providing support.' }, { q: 'What happens after alcohol detox?', a: 'Detox is typically the first step. Afterward, many people transition into residential rehab, outpatient programs, counseling, or therapy.' }, { q: 'Do you accept insurance for detox?', a: 'Many major insurance plans are accepted, and our admissions team can verify your benefits to help you.' }], 'FAQs about alcohol detox')}
${ctaBand('Begin detox safely today', 'Detox is the first step — but it should never be faced alone. Confidential insurance verification and a 24/7 admissions team.')}
` });

// ---- WELLNESS ----
pages['wellness.html'] = shell({ active: 'wellness', title: 'Wellness Services — New Beginnings Recovery', desc: 'Optional, supplemental wellness — nutrition counseling, Ayurveda-inspired practices, and mindfulness — that complement clinical addiction treatment in Rancho Mirage.', main: `
${pageHero({ eyebrow: 'Wellness Services', title: 'Whole-person healing in recovery', lede: 'Recovery isn’t only about breaking free from drugs or alcohol — it’s about learning to live fully again. Our wellness services are optional and supplemental, offered alongside medical and therapeutic care.', image: 'photo-176.jpg', alt: 'A restful space at New Beginnings Recovery in Rancho Mirage' })}
<section class="section"><div class="wrap prose">
  <h2>Nutrition counseling: rebuilding from within</h2><p>Substance use often leaves the body starved of what it needs most. With the guidance of a registered dietitian, clients can begin to restore what addiction has taken away.</p>
  ${features([{ t: 'Stability', d: 'Balanced meals regulate blood sugar, reducing mood swings and cravings.' }, { t: 'Healing', d: 'Nutrients strengthen the liver, heart, and digestive system, repairing damage from substance use.' }, { t: 'Resilience', d: 'Better sleep, stronger immunity, and restored energy help clients engage more deeply in therapy.' }, { t: 'Hope', d: 'Small wins — improved appetite, energy, and mood — remind clients that change is possible.' }])}
  <h2>Ayurveda &amp; mind-body practices</h2><p>Our founder’s passion for Ayurveda and holistic healing shapes the spirit of New Beginnings. These services are not part of our licensed treatment program; clients who wish to explore them may do so as optional supports.</p>
  ${list(['Yoga-inspired movement to restore calm and connection with the body.', 'Meditation and mindfulness to reduce stress and cravings.', 'Breathwork and reflection to quiet the nervous system.', 'Lifestyle balance strategies that help rebuild everyday structure.'])}
  <h2>The Rancho Mirage setting</h2><p>Wellness is also about environment. The desert sun, mountain views, and private courtyards of our Rancho Mirage property create a natural sense of peace. The pool offers a place for renewal, while quiet spaces allow reflection and calm.</p>
</div></section>
<section class="section" style="background:var(--surface-2)"><div class="wrap">
  <div class="section-head"><span class="eyebrow reveal">Explore each service</span><h2 class="reveal">Optional supports, tailored to you</h2></div>
  <div class="svc-grid">
    <div class="svc reveal"><img src="${B}images/wellness/mindfulness.jpeg" alt="" loading="lazy" onerror="this.style.display='none'" /><div class="svc-body"><h3>Mindfulness</h3><p>Practical skills to notice cravings and hard emotions — and let them pass.</p></div></div>
    <div class="svc reveal"><img src="${B}images/wellness/nutrition-counseling.jpeg" alt="" loading="lazy" onerror="this.style.display='none'" /><div class="svc-body"><h3>Nutrition counseling</h3><p>Rebuilding the body after substance use to steady mood, energy, and cravings.</p></div></div>
    <div class="svc reveal"><img src="${B}images/wellness/ayurveda.jpeg" alt="" loading="lazy" onerror="this.style.display='none'" /><div class="svc-body"><h3>Ayurveda</h3><p>Ayurveda-inspired rhythm and calm to restore balance in early recovery.</p></div></div>
  </div>
</div></section>
${faq([{ q: 'What wellness services do you offer?', a: 'A range of optional, supplemental services — including mindfulness practice, yoga-inspired movement, nutritional counseling, Ayurveda, and stress-management support.' }, { q: 'Are wellness services included in treatment programs?', a: 'Yes — wellness services are integrated into detox and residential treatment plans, complementing clinical care with physical and emotional support.' }, { q: 'Do you offer personalized wellness plans?', a: 'Yes — our clinical and wellness teams collaborate to tailor wellness plans to each client’s needs.' }], 'FAQs about wellness services')}
${ctaBand('Begin whole-person healing today', 'Every client receives safe, evidence-based care, with the option to explore services that strengthen body, mind, and spirit.')}
` });

// ---- FAMILY ----
pages['family.html'] = shell({ active: 'family', title: 'Family Support — New Beginnings Recovery', desc: 'Guidance, education, family therapy, and communication for the families of people in addiction treatment — within HIPAA privacy protections — in Rancho Mirage.', main: `
${pageHero({ eyebrow: 'For Families', title: 'You don’t have to walk this alone', lede: 'Families often carry fear, confusion, and heartbreak. At New Beginnings Recovery, we believe families deserve care, too — with guidance, resources, and communication wherever possible.', image: 'photo-178.jpg', alt: 'The welcoming setting at New Beginnings Recovery in Rancho Mirage' })}
<section class="section"><div class="wrap prose">
  <h2>Respecting privacy, supporting families</h2><p>Addiction treatment takes place in a healthcare setting, which means we are guided by confidentiality laws such as HIPAA that protect every client’s privacy and dignity.</p>
  <ul><li>If your loved one <strong>signs a release of information</strong>, our staff can share updates, answer questions, and involve you directly in their care.</li><li>If your loved one <strong>chooses not to sign a release</strong>, we cannot share details — but that does not mean you are left out. We still provide education, resources, and emotional support.</li></ul>
  <h2>Education &amp; resources</h2><p>We help families understand the disease model of addiction, the withdrawal and detox process, the structure of residential rehab, and what to expect during early recovery — so you feel informed and empowered.</p>
  <h2>Family therapy &amp; groups</h2><p>When clinically appropriate, we offer family therapy sessions to rebuild trust, improve communication, establish healthy boundaries, and provide space for honest, guided conversations.</p>
  <h2>Guidance for your own healing</h2><p>Families often feel pressure to fix their loved one — but recovery is their choice. What you can do is care for yourself: understand addiction as an illness, manage stress with healthy coping strategies, encourage recovery without enabling, and build resilience. Your strength supports your loved one.</p>
</div></section>
${faq([{ q: 'What is family support in addiction recovery?', a: 'Education, therapy, and communication tools that help loved ones understand addiction, heal relationships, and strengthen the recovery process for the whole family.' }, { q: 'Why is family involvement important?', a: 'Involving family can improve outcomes by reinforcing healthy boundaries, increasing emotional support, and helping loved ones participate in aftercare planning.' }, { q: 'Do you offer family therapy?', a: 'Yes — we provide family therapy sessions to help family members learn communication skills, rebuild trust, and support their loved one’s recovery.' }, { q: 'How can families stay involved during treatment?', a: 'Through scheduled sessions, phone or video check-ins, educational resources, and structured therapy designed to include loved ones — within healthcare privacy boundaries.' }], 'FAQs about family support')}
${ctaBand('Begin healing together', 'Recovery is not just for the individual — it’s for the family, too. Talk to our admissions team about how you can be involved.')}
` });

// ---- VIRTUAL TOUR ----
const tourNums = ['160', '159', '165', '162', '166', '176', '148', '178', '131', '141', '108', '171'];
pages['virtual-tour.html'] = shell({ active: 'virtual-tour', title: 'Virtual Tour — New Beginnings Recovery', desc: 'Take a closer look at the private Rancho Mirage property where detox and residential recovery happen.', main: `
${pageHero({ eyebrow: 'Virtual Tour', title: 'Take a closer look at where healing begins', lede: 'Our Rancho Mirage property is intentionally unlike a hospital — calm, private, and comfortable. Browse the spaces where detox and residential recovery happen.' })}
<section class="section"><div class="wrap">
  <div class="gallery reveal">
    ${tourNums.map(n => `<figure><img src="${B}images/photo-${n}.jpg" alt="New Beginnings Recovery — Rancho Mirage, California" loading="lazy" /></figure>`).join('')}
  </div>
</div></section>
${ctaBand('Come see it in person', 'The best way to understand New Beginnings is to talk with our team. Confidential, 24/7.')}
` });

// ---- RESOURCES ----
pages['resources.html'] = shell({ active: 'resources', title: 'Resources — New Beginnings Recovery', desc: 'Crisis lines and trusted resources on addiction, detox, and recovery from New Beginnings Recovery in Rancho Mirage.', main: `
${pageHero({ eyebrow: 'Resources', title: 'Help, information, and a place to start', lede: 'If you or someone you love is struggling, you’re not alone. Start with the support lines below, then reach out when you’re ready.', image: 'photo-166.jpg', alt: 'New Beginnings Recovery in the Coachella Valley' })}
<section class="section"><div class="wrap">
  <h2 class="reveal" style="font-size:1.5rem;margin-bottom:1.2rem">Immediate support</h2>
  <div class="res-grid">
    <a class="res reveal" href="tel:988"><h3>988 Suicide &amp; Crisis Lifeline</h3><p>Call or text 988, 24/7, free and confidential.</p></a>
    <a class="res reveal" href="tel:18006624357"><h3>SAMHSA National Helpline</h3><p>1-800-662-HELP (4357) — free, confidential, 24/7 treatment referral and information.</p></a>
    <a class="res reveal" href="tel:911"><h3>Emergency</h3><p>If someone is in immediate danger, call 911.</p></a>
  </div>
  <h2 class="reveal" style="font-size:1.5rem;margin:2.4rem 0 1.2rem">Learn more</h2>
  <ul class="link-list reveal"><li><a href="https://www.samhsa.gov/find-help" rel="noopener nofollow" target="_blank">SAMHSA — Find Help &amp; Treatment →</a></li><li><a href="https://nida.nih.gov/" rel="noopener nofollow" target="_blank">NIDA — Drugs, Brains, and Behavior →</a></li><li><a href="https://www.niaaa.nih.gov/" rel="noopener nofollow" target="_blank">NIAAA — Alcohol &amp; Your Health →</a></li><li><a href="https://www.cdc.gov/alcohol/" rel="noopener nofollow" target="_blank">CDC — Alcohol Use &amp; Your Health →</a></li><li><a href="https://www.dhcs.ca.gov/" rel="noopener nofollow" target="_blank">CA Dept. of Health Care Services — Substance Use →</a></li></ul>
</div></section>
${ctaBand()}
` });

// ---- CONTACT ----
pages['contact.html'] = shell({ active: 'contact', title: 'Contact — New Beginnings Recovery', desc: 'Reach New Beginnings Recovery in Rancho Mirage, California. Confidential admissions available 24/7 by phone.', main: `
${pageHero({ eyebrow: 'Contact Us', title: 'Reach out — confidentially, any time', lede: 'Whether you’re calling for yourself or someone you love, our admissions team is here to listen. Most conversations start with a simple, private phone call.', image: 'photo-169.jpg', alt: 'New Beginnings Recovery in Rancho Mirage, California' })}
<section class="section"><div class="wrap contact-grid">
  <div>
    <div class="contact-card reveal"><span class="k">Call (24/7)</span><a class="big" href="${TEL}">${PHONE}</a></div>
    <div class="contact-card reveal"><span class="k">Email</span><a class="big" href="mailto:${EMAIL}">${EMAIL}</a><p class="note">Please don’t include sensitive health details in email — call us for anything confidential.</p></div>
    <div class="contact-card reveal"><span class="k">Visit</span><address>${ADDR}</address><p class="note">Serving Rancho Mirage, Palm Springs, Cathedral City, Indio &amp; the Coachella Valley.</p></div>
  </div>
  <div class="prose">
    <h2>What happens when you call</h2>
    <p>Your first call is private and pressure-free. Our team listens, answers your questions, and helps determine whether New Beginnings is the right fit — then walks you through insurance and next steps.</p>
    <p>Prefer to start with insurance? We can run a quick, confidential benefits check. <a href="${B}verify-insurance.html">Verify your insurance →</a></p>
    <div class="callout"><p>Our secure online intake connects directly to our admissions system. For anything involving health or insurance details, the fastest and most private way to reach us is by phone — please don’t send health details by email.</p></div>
    <p style="margin-top:1.4rem"><a class="btn btn-primary" href="${TEL}">${svgPhone}Call ${PHONE}</a></p>
    <p style="margin-top:1.4rem"><strong>In crisis?</strong> If you or someone you know is in immediate danger, call 911. For mental-health crisis support, call or text <a href="tel:988">988</a>, the Suicide &amp; Crisis Lifeline.</p>
  </div>
</div></section>
` });

// ---- VERIFY INSURANCE ----
pages['verify-insurance.html'] = shell({ active: 'contact', title: 'Verify Your Insurance — New Beginnings Recovery', desc: 'Confidentially check whether your insurance covers detox and residential addiction treatment at New Beginnings Recovery. Most major plans accepted.', main: `
${pageHero({ eyebrow: 'Insurance', title: 'Find out if your insurance covers treatment', lede: 'A quick, confidential benefits check — no obligation. Most major insurance plans are accepted, and we never share your information.', image: 'photo-180.jpg', alt: 'New Beginnings Recovery private facility in Rancho Mirage, California' })}
<section class="section"><div class="wrap prose" style="max-width:52rem">
  <h2>How verification works</h2>
  ${steps([{ t: 'Call or reach out', d: 'A quick, confidential conversation with our admissions team — no obligation.' }, { t: 'We check your benefits', d: 'We contact your insurer directly to confirm what your plan covers for detox and residential treatment.' }, { t: 'We explain your options', d: 'Clear information on coverage, any out-of-pocket costs, and flexible payment options if you’re self-pay.' }])}
  <h2 style="margin-top:2.6rem">What to have ready</h2>
  ${list(['The name of your insurance provider', 'Your member ID (from your insurance card)', 'A good phone number where we can reach you'])}
  <div class="callout" style="margin-top:1.6rem"><p><strong>Your privacy comes first.</strong> For anything involving health or insurance details, please call us directly rather than sending them by email. We handle your information confidentially and never sell or share it for advertising.</p></div>
  <p style="margin-top:1.6rem"><a class="btn btn-primary" href="${TEL}">${svgPhone}Call ${PHONE} to verify</a></p>
</div></section>
` });

// ============================ WRITE ============================
for (const [file, html] of Object.entries(pages)) {
  const out = path.join(process.cwd(), file);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, html);
}
console.log('Generated', Object.keys(pages).length, 'pages:', Object.keys(pages).join(', '));
