/* global emailjs */

// ============================================================
// 1. INITIALISATION EMAILJS
// ============================================================
(function() {
    emailjs.init("d_D9yDycoHiqW_5wp");
})();


// ============================================================
// 2. SCROLL & MOUSE HEADER (Visibilité selon l'activité)
// ============================================================
let activityTimer = null;

function showHeaderAndResetTimer() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Tout en haut de la page (moins de 30px) : la nav reste toujours visible
  if (window.scrollY <= 30) {
    header.classList.remove('scrolled', 'nav-hidden');
    if (activityTimer) clearTimeout(activityTimer);
    return;
  }

  // Si on est plus bas dans la page : on affiche le header sombre
  header.classList.add('scrolled');
  header.classList.remove('nav-hidden');

  // Relance le compte à rebours de 2 secondes d'inactivité
  if (activityTimer) clearTimeout(activityTimer);

  activityTimer = setTimeout(() => {
    if (window.scrollY > 30) {
      header.classList.add('nav-hidden');
    }
  }, 2000);
}

window.addEventListener('scroll', showHeaderAndResetTimer);
window.addEventListener('mousemove', showHeaderAndResetTimer);


// ============================================================
// 3. INITIALISATION AU CHARGEMENT DU DOM
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // --- A. ACTIVER L'ANIMATION HERO ---
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.classList.add('active');
  }

  // --- B. SMOOTH SCROLL (Défilement fluide) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // --- C. BOUTON RETOUR EN HAUT (.btn-top) ---
  const btnTop = document.querySelector('.btn-top');
  if (btnTop) {
    btnTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- D. CARROUSEL MOCKUP (HERO) ---
  const slides = document.querySelectorAll('.carousel-slide');
  const tags = document.querySelectorAll('.mockup-tags .tag');
  let currentIndex = 0;
  let autoSlideTimer = null;

  function showSlide(index) {
    if (slides.length === 0) return;
    
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    tags.forEach((tag, i) => {
      tag.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextSlide() {
    if (slides.length === 0) return;
    let newIndex = (currentIndex + 1) % slides.length;
    showSlide(newIndex);
  }

  function startAutoSlide() {
    stopAutoSlide();
    if (slides.length > 0) {
      autoSlideTimer = setInterval(nextSlide, 4000);
    }
  }

  function stopAutoSlide() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
  }

  tags.forEach((tag, index) => {
    tag.addEventListener('click', () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  startAutoSlide();

  // --- E. FORMULAIRE DE CONTACT (EMAILJS) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const submitBtn = this.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<span>Envoi en cours...</span>';
      submitBtn.disabled = true;

      emailjs.sendForm('service_rpmv38i', 'template_u32lccr', this)
        .then(function() {
          alert('Message envoyé avec succès !');
          contactForm.reset();
        }, function(error) {
          alert('Erreur lors de l\'envoi : ' + JSON.stringify(error));
        })
        .finally(function() {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  // --- F. GESTION DES ONGLETS DU SHOWROOM TEMPLATES ---
  window.switchTemplate = function(event, templateId) {
    if (event) event.preventDefault();

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    const contents = document.querySelectorAll('.showroom-content');
    contents.forEach(content => content.classList.remove('active'));

    if (event && event.currentTarget) {
      event.currentTarget.classList.add('active');
    }
    
    const targetContent = document.getElementById(templateId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  };

  // --- G. APPARITION EN CASCADE AU SCROLL (AVANTAGES) ---
  const advantageSection = document.getElementById('avantages');
  const itemsToAnimate = document.querySelectorAll('.advantage-item');

  if (advantageSection && itemsToAnimate.length > 0) {
    const observerOptions = {
      root: null,
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            itemsToAnimate.forEach(item => item.classList.add('visible'));
          }, 50);
        } else {
          itemsToAnimate.forEach(item => item.classList.remove('visible'));
        }
      });
    }, observerOptions);

    observer.observe(advantageSection);
  }

  // --- H. GESTION DU BANDEAU COOKIES ---
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");
  const openCookieSettings = document.getElementById("open-cookie-settings");

  // 1. Vérification au chargement de la page
  const cookieConsent = localStorage.getItem("dgc_cookie_consent");

  if (!cookieConsent && cookieBanner) {
    setTimeout(() => {
      cookieBanner.classList.remove("hidden");
    }, 500);
  }

  // 2. Clic sur Accepter
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("dgc_cookie_consent", "accepted");
      cookieBanner.classList.add("hidden");
    });
  }

  // 3. Clic sur Refuser
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      localStorage.setItem("dgc_cookie_consent", "declined");
      cookieBanner.classList.add("hidden");
    });
  }

  // 4. Réouverture de la bannière depuis le Footer ("Gestion des cookies")
  if (openCookieSettings && cookieBanner) {
    openCookieSettings.addEventListener("click", function (e) {
      e.preventDefault();
      cookieBanner.classList.remove("hidden");
    });
  }

});