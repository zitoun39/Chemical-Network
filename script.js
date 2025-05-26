document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById('progress-bar');
  const backToTop   = document.getElementById('back-to-top');
  const navLinks    = document.querySelectorAll(".nav-link");
  const sections    = Array.from(navLinks, link => document.querySelector(link.getAttribute("href")));
  const darkSwitch  = document.getElementById('darkSwitch');
  const langToggle  = document.getElementById('lang-toggle');

  // 1. Progress bar + Back-to-top + Active nav
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
    backToTop.classList.toggle('show', scrollTop > 200);

    let fromTop = scrollTop + 120;
    navLinks.forEach((link,i) => {
      const sec = sections[i];
      link.classList.toggle('active',
        sec && sec.offsetTop <= fromTop && sec.offsetTop + sec.offsetHeight > fromTop
      );
    });
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 2. Dark mode persistence
  if (darkSwitch) {
    darkSwitch.checked = localStorage.getItem('dark') === 'true';
    document.body.classList.toggle('dark', darkSwitch.checked);
    darkSwitch.addEventListener('change', () => {
      localStorage.setItem('dark', darkSwitch.checked);
      document.body.classList.toggle('dark', darkSwitch.checked);
    });
  }

  // 3. Language toggle persistence
  const texts = {
    ar: {
      nav: ['الرئيسية','الخدمات','المكتبة الكيميائية','مدونة','تواصل معنا'],
      heroTitle: 'الرابطة الكيميائية',
      heroDesc: 'بوابة للكيميائيين لمشاركة المعارف وربط الموردين بالمحترفين في الجزائر وشمال إفريقيا',
      submit: 'إرسال',
      blogTitle: 'مدونة الرابطة',
      labels: ['مصادر المعرفة','الاستشارات والأدوات التفاعلية','الموارد والموردون','الخدمات المخبريّة والتحاليل','فرص وظيفية']
    },
    en: {
      nav: ['Home','Services','Library','Blog','Contact'],
      heroTitle: 'Chemical Network',
      heroDesc: 'A portal for chemists to share knowledge and connect suppliers & professionals in Algeria & North Africa',
      submit: 'Submit',
      blogTitle: 'Network Blog',
      labels: ['Knowledge Resources','Consultations & Tools','Suppliers & Resources','Lab Services & Analyses','Job Opportunities']
    }
  };
  const applyLang = lang => {
    navLinks.forEach((a,i) => a.textContent = texts[lang].nav[i]);
    document.getElementById('hero-title').textContent = texts[lang].heroTitle;
    document.getElementById('hero-desc').textContent = texts[lang].heroDesc;
    document.querySelector('.btn-submit').textContent = texts[lang].submit;
    document.querySelector('#blog h2').textContent     = texts[lang].blogTitle;
    document.querySelectorAll('.service-group h2')
            .forEach((h2,i) => h2.textContent = texts[lang].labels[i]);
    langToggle.textContent = lang === 'ar' ? 'EN' : 'AR';
    document.documentElement.lang = lang;
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  };
  let lang = localStorage.getItem('lang') || 'ar';
  applyLang(lang);
  langToggle.addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', lang);
    applyLang(lang);
  });

  // 4. Contact form validation + reCAPTCHA
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('success-message');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const fields = ['name','email','subject','message'];
      let valid = true;

      // Clear errors
      fields.forEach(id => {
        document.getElementById(`error-${id}`).textContent = '';
      });
      document.getElementById('error-recaptcha').textContent = '';

      // Category check
      const category = form.querySelector('input[name="category"]:checked');
      if (!category) {
        valid = false;
        alert('يرجى اختيار نوع المرسل.');
      }

      // Field checks
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
          valid = false;
          document.getElementById(`error-${id}`).textContent = 'هذا الحقل مطلوب.';
        } else if (id==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
          valid = false;
          document.getElementById('error-email').textContent = 'البريد الإلكتروني غير صالح.';
        }
      });

      // reCAPTCHA check
      if (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length === 0) {
        valid = false;
        document.getElementById('error-recaptcha').textContent = 'يرجى تأكيد أنك لست روبوت.';
      }

      if (!valid) return;

      // On success
      form.hidden = true;
      successBox.classList.add('show');
      // هنا يمكنك إضافة fetch/AJAX لإرسال البيانات فعلياً…
    });
  }
});

// Mobile menu toggle
function toggleMenu() {
  const nav = document.getElementById('nav-list');
  const btn = document.querySelector('.menu-toggle');
  const expanded = nav.classList.toggle('show');
  btn.setAttribute('aria-expanded', expanded);
}
