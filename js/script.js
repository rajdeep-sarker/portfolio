const menu = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
document.body.classList.add('js-ready');
menu?.addEventListener('click', () => { const open = menu.classList.toggle('active'); nav.classList.toggle('active', open); menu.setAttribute('aria-expanded', open); });
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu?.classList.remove('active'); nav.classList.remove('active'); }));

const themeButton = document.querySelector('.theme-button');
const themeIcon = themeButton?.querySelector('i');
const setTheme = (night) => { document.body.classList.toggle('night', night); if (themeIcon) themeIcon.className = night ? 'fa-solid fa-sun' : 'fa-solid fa-moon'; localStorage.setItem('rajdeep-theme', night ? 'night' : 'day'); };
setTheme(localStorage.getItem('rajdeep-theme') === 'night');
themeButton?.addEventListener('click', () => setTheme(!document.body.classList.contains('night')));

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((item, index) => { item.style.transitionDelay = `${(index % 3) * 90}ms`; revealObserver.observe(item); });

const labelObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('section-visible');
    labelObserver.unobserve(entry.target);
  }
}), { threshold: .35 });
document.querySelectorAll('.section-label').forEach(label => labelObserver.observe(label));

document.querySelectorAll('.filters button').forEach(button => button.addEventListener('click', () => { document.querySelector('.filters .active')?.classList.remove('active'); button.classList.add('active'); const filter = button.dataset.filter; document.querySelectorAll('.project-card').forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter)); }));

window.addEventListener('scroll', () => document.documentElement.style.setProperty('--scroll', `${(window.scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100}%`), { passive: true });

const EMAILJS_PUBLIC_KEY = 'g4UUK3V4vY1rij9YI';
const EMAILJS_SERVICE_ID = 'service_kuidmrj';
const EMAILJS_TEMPLATE_ID = 'template_tbin4ai';
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSejGRYr-oZ5uWTuyIzxag2rLOjFp_LKZqHPilPxR_c2CTqrDQ/formResponse';
let emailJsLoader;

function loadEmailJs() {
  if (window.emailjs?.sendForm) return Promise.resolve(window.emailjs);
  if (!emailJsLoader) emailJsLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.async = true;
    script.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(window.emailjs); };
    script.onerror = () => reject(new Error('Email service could not load'));
    document.head.appendChild(script);
  });
  return emailJsLoader;
}

function submitToGoogleForm(form) {
  const data = new FormData(form);
  const payload = new URLSearchParams({
    'entry.175039083': data.get('from_name'),
    'entry.1972227466': data.get('from_email'),
    'entry.46353101': data.get('subject'),
    'entry.1705711033': data.get('message')
  });
  fetch(`${GOOGLE_FORM_URL}?${payload.toString()}`, { method: 'POST', mode: 'no-cors' });
}

document.getElementById('contact-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  button.disabled = true;
  button.innerHTML = 'Sending… <i class="fa-solid fa-spinner fa-spin"></i>';
  status.classList.remove('show');
  status.textContent = '';
  try {
    const emailjs = await loadEmailJs();
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
    form.reset();
    status.textContent = 'Message sent successfully. I will get back to you soon!';
    requestAnimationFrame(() => status.classList.add('show'));
  } catch (error) {
    submitToGoogleForm(form);
    form.reset();
    status.textContent = 'Message sent through the backup system. I will get back to you soon!';
    requestAnimationFrame(() => status.classList.add('show'));
  } finally {
    button.disabled = false;
    button.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
  }
});
