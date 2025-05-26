document.addEventListener("DOMContentLoaded", () => {
  // … (شريط التقدّم، العودة للأعلى، الوضع الداكن، اللغة كما في السابق) …

  // FORM VALIDATION & reCAPTCHA (contact.html only)
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = ['name','email','subject','message'];
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // مسح الأخطاء السابقة
      fields.forEach(id => {
        document.getElementById('error-'+id).textContent = '';
      });
      document.getElementById('error-recaptcha').textContent = '';

      // تحقق من كل حقل
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) {
          valid = false;
          document.getElementById('error-'+id).textContent = 'هذا الحقل مطلوب.';
        } else if (id==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
          valid = false;
          document.getElementById('error-email').textContent = 'يرجى إدخال بريد إلكتروني صالح.';
        }
      });

      // تحقق reCAPTCHA
      if (grecaptcha.getResponse().length === 0) {
        valid = false;
        document.getElementById('error-recaptcha').textContent = 'يرجى تأكيد أنك لست روبوت.';
      }

      if (!valid) return;

      // إذا أتم المستخدم جميع الخطوات بنجاح
      form.hidden = true;
      document.getElementById('success-message').hidden = false;

      // هنا يمكنك إرسال البيانات فعليًا إلى الخادم عبر fetch/AJAX
    });
  }
});

// … (دالة toggleMenu كما كانت) …
