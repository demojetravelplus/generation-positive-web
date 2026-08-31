document.querySelectorAll('.domaine-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    const current = document.querySelector('.domaine-panel.active');
    document.querySelectorAll('.domaine-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    const next = document.getElementById(tab.dataset.panel);
    if(current && current !== next){
      current.classList.add('fading');
      setTimeout(()=>{
        current.classList.remove('active','fading');
        next.classList.add('active');
      }, 180);
    } else {
      next.classList.add('active');
    }
  });
});

/* Header shrinks on scroll */
const siteHeader = document.querySelector('header');
window.addEventListener('scroll', ()=>{
  siteHeader.classList.toggle('scrolled', window.scrollY > 12);
}, {passive:true});

/* Scroll-reveal for content blocks */
const revealTargets = document.querySelectorAll(
  '.card, .axis, .impact-card, .transp-item, .org-box, .cta-band, .form-card, .domaine-tabs, .domaine-panel.active, .gallery-item'
);
revealTargets.forEach((el,i)=>{
  el.classList.add('reveal','reveal-stagger');
  el.style.setProperty('--i', i % 6);
});
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.15});
revealTargets.forEach(el=>revealObserver.observe(el));

/* Active nav link tied to visible section */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav.links a[href^="#"]');
const navObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const link = document.querySelector('nav.links a[href="#'+entry.target.id+'"]');
    if(!link) return;
    if(entry.isIntersecting){
      navLinks.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    }
  });
},{rootMargin:'-45% 0px -45% 0px'});
sections.forEach(s=>navObserver.observe(s));

/* Gallery lightbox */
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCap');
let currentIdx = 0;

function openLightbox(idx){
  currentIdx = idx;
  const item = galleryItems[currentIdx];
  lightboxImg.src = item.querySelector('img').src;
  lightboxCap.textContent = item.querySelector('img').alt;
  lightbox.classList.add('open');
}
function closeLightbox(){ lightbox.classList.remove('open'); }
function showDelta(delta){
  currentIdx = (currentIdx + delta + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIdx];
  lightboxImg.src = item.querySelector('img').src;
  lightboxCap.textContent = item.querySelector('img').alt;
}
galleryItems.forEach((item,i)=> item.addEventListener('click', ()=>openLightbox(i)));
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', ()=>showDelta(-1));
document.getElementById('lightboxNext').addEventListener('click', ()=>showDelta(1));
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowRight') showDelta(1);
  if(e.key === 'ArrowLeft') showDelta(-1);
});
document.querySelector('.hamburger').addEventListener('click', ()=>{
  const nav = document.querySelector('nav.links');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  nav.style.cssText += 'position:absolute;top:64px;left:0;right:0;background:#0B3A45;flex-direction:column;padding:18px 24px;gap:16px;';
});