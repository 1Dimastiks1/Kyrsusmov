// =========================================================
// ПЕРШІ КИЇВСЬКІ КУРСИ — ГОЛОВНИЙ СКРИПТ v2.0
// Інтерактивний експрес-тест, калькулятор вартості,
// фільтрація курсів, акордеон FAQ, модальні вікна, тема,
// прогрес-бар, анімації reveal, лічильники, swipe-слайдер
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCourseFilter();
  initQuiz();
  initCalculator();
  initFaq();
  initModal();
  initScrollProgress();
  initBackToTop();
  initRevealAnimations();
  initCounters();
  initReviewsSlider();
  initHeroScrollHint();
});

/* --- 1. ПЕРЕМИКАННЯ СВІТЛОЇ ТА ТЕМНОЇ ТЕМИ --- */
function initTheme() {
  const toggleBtn = document.querySelector('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('pkk-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(toggleBtn, savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pkk-theme', next);
      updateThemeIcon(toggleBtn, next);
    });
  }
}

function updateThemeIcon(btn, theme) {
  if (!btn) return;
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
}

/* --- 2. МОБІЛЬНЕ МЕНЮ ТА SCROLLSPY --- */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.mobile-burger-btn');
  const navLinks = document.querySelector('.nav-links');

  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('is-active');
      const isOpen = navLinks.classList.contains('is-active');
      burgerBtn.textContent = isOpen ? '✕' : '☰';
      burgerBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        navLinks.classList.remove('is-active');
        burgerBtn.textContent = '☰';
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !burgerBtn.contains(e.target) && navLinks.classList.contains('is-active')) {
        navLinks.classList.remove('is-active');
        burgerBtn.textContent = '☰';
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ScrollSpy
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navAnchors.forEach(a => {
          if (a.getAttribute('href') === `#${sectionId}`) {
            a.style.color = 'var(--pkk-gold-brand)';
            a.style.background = 'rgba(255, 255, 255, 0.12)';
          } else {
            a.style.color = '';
            a.style.background = '';
          }
        });
      }
    });
  }, { passive: true });
}

/* --- 3. ФІЛЬТРАЦІЯ КУРСІВ --- */
function initCourseFilter() {
  const tabBtns = document.querySelectorAll('.course-filter-tabs .tab-btn');
  const courseCards = document.querySelectorAll('.courses-grid .course-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.split(' ').includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --- 4. ІНТЕРАКТИВНИЙ ЕКСПРЕС-ТЕСТ --- */
const quizQuestions = [
  {
    q: "Choose the correct sentence:",
    options: [
      "She don't like coffee in the morning.",
      "She doesn't likes coffee in the morning.",
      "She doesn't like coffee in the morning.",
      "She isn't like coffee in the morning."
    ],
    correct: 2
  },
  {
    q: "We have been living in Kamianets-Podilskyi _____ 2015.",
    options: ["for", "since", "from", "during"],
    correct: 1
  },
  {
    q: "If I _____ more free time, I would learn Italian at First Kyiv Courses.",
    options: ["have", "will have", "had", "would have"],
    correct: 2
  },
  {
    q: "The international exam requires students to show a wide _____ of vocabulary.",
    options: ["range", "length", "queue", "bundle"],
    correct: 0
  },
  {
    q: "Scarcely _____ the test when the bell rang.",
    options: ["she finished", "had she finished", "did she finished", "she had finished"],
    correct: 1
  }
];

let currentQuestionIdx = 0;
let userScore = 0;

function initQuiz() {
  renderQuizQuestion();

  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) nextBtn.addEventListener('click', handleQuizNext);

  const restartBtn = document.getElementById('quizRestartBtn');
  if (restartBtn) restartBtn.addEventListener('click', restartQuiz);
}

function renderQuizQuestion() {
  const qTitle = document.getElementById('quizQuestionTitle');
  const optionsGrid = document.getElementById('quizOptionsGrid');
  const countEl = document.getElementById('quizCount');
  const progressBar = document.getElementById('quizProgressBar');
  const nextBtn = document.getElementById('quizNextBtn');

  if (!qTitle || !optionsGrid) return;

  const currentQ = quizQuestions[currentQuestionIdx];
  qTitle.textContent = currentQ.q;
  countEl.textContent = `Питання ${currentQuestionIdx + 1} з ${quizQuestions.length}`;
  progressBar.style.width = `${((currentQuestionIdx + 1) / quizQuestions.length) * 100}%`;

  optionsGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  currentQ.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `<span class="quiz-option-letter">${letters[idx]}</span><span>${opt}</span>`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (nextBtn) nextBtn.disabled = false;
    });
    optionsGrid.appendChild(btn);
  });

  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = currentQuestionIdx === quizQuestions.length - 1 ? 'Дізнатися результат 🚀' : 'Наступне питання →';
  }
}

function handleQuizNext() {
  const selectedBtn = document.querySelector('.quiz-option-btn.selected');
  if (!selectedBtn) return;

  const letters = ['A', 'B', 'C', 'D'];
  const chosenLetter = selectedBtn.querySelector('.quiz-option-letter').textContent.trim();
  const chosenIdx = letters.indexOf(chosenLetter);

  if (chosenIdx === quizQuestions[currentQuestionIdx].correct) userScore++;
  currentQuestionIdx++;

  if (currentQuestionIdx < quizQuestions.length) {
    renderQuizQuestion();
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  const quizActiveWrap = document.getElementById('quizActiveWrap');
  const resultBox = document.getElementById('quizResultBox');
  const levelBadge = document.getElementById('quizLevelBadge');
  const resultTitle = document.getElementById('quizResultTitle');
  const resultDesc = document.getElementById('quizResultDesc');
  const ctaBtn = document.getElementById('quizResultCta');

  if (quizActiveWrap) quizActiveWrap.style.display = 'none';
  if (resultBox) resultBox.classList.add('active');

  let level = "A1 (Beginner)";
  let title = "Чудовий початок мовної подорожі!";
  let desc = "Ви володієте базовими фразами. На курсах ПКК ви швидко подолаєте мовний бар'єр та почнете вільно говорити з перших занять!";
  let courseRec = "Загальна англійська (Рівень A1/A2)";

  if (userScore >= 4) {
    level = "B2 - C1 (Advanced)";
    title = "Блискучий результат! Ви на високому рівні!";
    desc = "Ви чудово володієте граматикою та лексикою. Вам підійде підготовка до IELTS/CAE або розмовні клуби з носіями мови.";
    courseRec = "Підготовка до IELTS / CAE (Рівень B2/C1)";
  } else if (userScore >= 2) {
    level = "A2 - B1 (Intermediate)";
    title = "Міцна основа! Час переходити на рівень впевненого спілкування!";
    desc = "Ви добре розумієте ключові правила. Залишилося збагатити словниковий запас та підготуватися до НМТ чи міжнародних іспитів.";
    courseRec = "Підготовка до НМТ / Розмовний B1";
  }

  if (levelBadge) levelBadge.textContent = level;
  if (resultTitle) resultTitle.textContent = `${title} (${userScore}/${quizQuestions.length} правильних)`;
  if (resultDesc) resultDesc.textContent = desc;
  if (ctaBtn) {
    ctaBtn.textContent = `Записатися на курс: ${courseRec}`;
    ctaBtn.onclick = () => openModal(`Консультація після тесту: ${courseRec}`);
  }
}

function restartQuiz() {
  currentQuestionIdx = 0;
  userScore = 0;
  const quizActiveWrap = document.getElementById('quizActiveWrap');
  const resultBox = document.getElementById('quizResultBox');

  if (quizActiveWrap) quizActiveWrap.style.display = 'block';
  if (resultBox) resultBox.classList.remove('active');
  renderQuizQuestion();
}

/* --- 5. КАЛЬКУЛЯТОР ВАРТОСТІ --- */
function initCalculator() {
  const form = document.getElementById('costCalculatorForm');
  if (!form) return;
  form.querySelectorAll('input').forEach(input => input.addEventListener('change', calculatePrice));
  calculatePrice();
}

function calculatePrice() {
  const audience = document.querySelector('input[name="calcAudience"]:checked')?.value || 'teens';
  const format = document.querySelector('input[name="calcFormat"]:checked')?.value || 'group';

  let lessonPrice = 330, lessonsPerMonth = 8, duration = "60-90 хв", groupSize = "4–8 осіб";

  if (audience === 'kids') {
    if (format === 'group') { lessonPrice = 240; duration = "60 хв"; groupSize = "до 6 дітей"; }
    else if (format === 'intensive') { lessonPrice = 300; lessonsPerMonth = 12; duration = "60 хв"; }
    else { lessonPrice = 400; duration = "60 хв"; groupSize = "1-на-1 з викладачем"; }
  } else if (audience === 'teens' || audience === 'nmt') {
    if (format === 'group') { lessonPrice = 330; duration = "90 хв"; }
    else if (format === 'intensive') { lessonPrice = 330; lessonsPerMonth = 12; duration = "90 хв"; }
    else { lessonPrice = 450; duration = "60-90 хв"; groupSize = "1-на-1 з експертом НМТ"; }
  } else if (audience === 'adults') {
    if (format === 'group') { lessonPrice = 330; duration = "90 хв"; }
    else if (format === 'intensive') { lessonPrice = 350; lessonsPerMonth = 12; duration = "90 хв"; }
    else { lessonPrice = 500; duration = "60 хв"; groupSize = "1-на-1 (гнучкий графік)"; }
  }

  const monthlyTotal = lessonPrice * lessonsPerMonth;
  const priceEl = document.getElementById('calcMonthlyPrice');
  const lessonPriceEl = document.getElementById('calcLessonPrice');
  const detailsEl = document.getElementById('calcDetailsText');

  if (priceEl) priceEl.textContent = `${monthlyTotal.toLocaleString('uk-UA')} грн`;
  if (lessonPriceEl) lessonPriceEl.textContent = `від ${lessonPrice} грн / заняття (${duration})`;
  if (detailsEl) {
    detailsEl.innerHTML = `
      <li>✓ ${lessonsPerMonth} занять на місяць</li>
      <li>✓ Тривалість: ${duration}</li>
      <li>✓ Формат: ${groupSize}</li>
      <li>✓ Безкоштовне відпрацювання у суботу</li>
      <li>✓ Автентичні підручники Oxford/Cambridge</li>
    `;
  }
}

/* --- 6. АКОРДЕОН FAQ --- */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });
}

/* --- 7. МОДАЛЬНЕ ВІКНО --- */
function initModal() {
  const modal = document.getElementById('callbackModal');
  if (!modal) return;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}

window.openModal = function(serviceName = "Записатися на безкоштовне тестування") {
  const modal = document.getElementById('callbackModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCourseInput = document.getElementById('modalSelectedCourse');
  if (modalTitle) modalTitle.textContent = serviceName;
  if (modalCourseInput) modalCourseInput.value = serviceName;
  if (modal) { modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
};

window.closeModal = function() {
  const modal = document.getElementById('callbackModal');
  if (modal) { modal.classList.remove('is-open'); document.body.style.overflow = ''; }
};

window.handleFormSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  const nameInput = form.querySelector('input[type="text"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const courseInput = form.querySelector('input[type="hidden"]') || form.querySelector('select');
  const name = nameInput ? nameInput.value.trim() : "Шановний клієнте";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const course = courseInput ? courseInput.value : "Курси";
  const message = `Дякуємо, ${name}! 🎉\n\nВашу заявку на «${course}» успішно прийнято! Менеджер зателефонує вам за номером ${phone} протягом 15 хвилин.`;

  if (isMobileDevice()) {
    alert(message);
  } else {
    showCustomNotify(name, course, phone);
  }
  form.reset();
  closeModal();
};

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth <= 768;
}

function showCustomNotify(name, course, phone) {
  if (typeof Notify === 'undefined') {
    alert(`Дякуємо, ${name}! 🎉\n\nВашу заявку на «${course}» успішно прийнято! Менеджер зателефонує вам за номером ${phone} протягом 15 хвилин.`);
    return;
  }
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  new Notify({
    status: 'success',
    title: 'Заявку успішно прийнято!',
    text: `Дякуємо, ${name}! Вашу заявку на «${course}» успішно прийнято! Менеджер зателефонує вам за номером ${phone} протягом 15 хвилин.`,
    effect: 'fade',
    speed: 300,
    customClass: isDark ? 'dark-theme-notification' : '',
    customIcon: '',
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 5000,
    type: 'outline',
    position: 'right top',
  });
}

/* =========================================================
   НОВІ ФІШКИ v2.0
   ========================================================= */

/* --- 8. ПРОГРЕС-БАР ПРОКРУТКИ СТОРІНКИ --- */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* --- 9. КНОПКА «ВГОРУ» --- */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });
}

/* --- 10. АНІМАЦІЯ «REVEAL» ПРИ СКРОЛІ --- */
function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.section-header, .course-card, .teacher-card, .advantage-box, .review-card, .faq-item, .branch-card, .special-banner-card, .team-lead-banner, .gift-card, .calc-box, .quiz-card');

  // Додаємо клас reveal до елементів, що ще не мають його
  revealEls.forEach((el, i) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
      el.classList.add('reveal');
      // Затримка для карток в рядку
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c =>
          c.classList.contains('course-card') ||
          c.classList.contains('teacher-card') ||
          c.classList.contains('advantage-box') ||
          c.classList.contains('review-card')
        );
        const idx = siblings.indexOf(el);
        if (idx >= 0 && idx < 6) {
          el.classList.add(`reveal-delay-${idx + 1}`);
        }
      }
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

/* --- 11. АНІМОВАНІ ЛІЧИЛЬНИКИ (HERO STATS) --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const step = 16;
      const steps = Math.ceil(duration / step);
      let current = 0;
      let frame = 0;

      const tick = () => {
        frame++;
        // Easing: ease-out
        const progress = 1 - Math.pow(1 - frame / steps, 3);
        current = Math.round(target * progress);
        el.textContent = current.toLocaleString('uk-UA') + suffix;
        if (frame < steps) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('uk-UA') + suffix;
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* --- 12. КАРУСЕЛЬ ВІДГУКІВ --- */
function initReviewsSlider() {
  const track = document.getElementById('reviewsCarouselTrack');
  const viewport = document.getElementById('reviewsCarouselViewport');
  const dotsContainer = document.getElementById('reviewsCarouselDots');
  const prevBtn = document.getElementById('reviewsCarouselPrev');
  const nextBtn = document.getElementById('reviewsCarouselNext');

  if (!track || !viewport) return;

  const slides = track.querySelectorAll('.review-carousel-slide');
  const totalSlides = slides.length;
  if (!totalSlides) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  let touchStartX = 0;
  let isSwiping = false;

  function getSlidesPerView() {
    const w = window.innerWidth;
    if (w <= 680) return 1;
    if (w <= 991) return 2;
    return 3;
  }

  function getMaxIndex() {
    const spv = getSlidesPerView();
    return Math.max(0, totalSlides - spv);
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const count = maxIdx + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'reviews-carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Слайд відгуків ${i + 1}`);
      dot.addEventListener('click', () => {
        stopAutoplay();
        goToIndex(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.reviews-carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToIndex(idx) {
    const maxIdx = getMaxIndex();
    if (idx < 0) {
      currentIndex = maxIdx;
    } else if (idx > maxIdx) {
      currentIndex = 0;
    } else {
      currentIndex = idx;
    }

    const slide = slides[0];
    if (!slide) return;

    // Враховуємо ширину слайда + відступ (margin-right)
    const slideWidth = slide.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(slide);
    const marginRight = parseFloat(computedStyle.marginRight) || 0;
    const moveDist = (slideWidth + marginRight) * currentIndex;

    track.style.transform = `translateX(-${moveDist}px)`;
    updateDots();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      goToIndex(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      goToIndex(currentIndex + 1);
    });
  }

  // Touch Swipe підтримка (для телефонів та планшетів)
  viewport.addEventListener('touchstart', (e) => {
    stopAutoplay();
    touchStartX = e.touches[0].clientX;
    isSwiping = true;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToIndex(currentIndex + 1);
      } else {
        goToIndex(currentIndex - 1);
      }
    }
    isSwiping = false;
  }, { passive: true });

  // Автопрокрутка
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      goToIndex(currentIndex + 1);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  viewport.addEventListener('mouseenter', stopAutoplay);
  viewport.addEventListener('mouseleave', startAutoplay);

  // Перерахунок при зміні орієнтації або ресайзі вікна
  window.addEventListener('resize', () => {
    buildDots();
    if (currentIndex > getMaxIndex()) {
      currentIndex = getMaxIndex();
    }
    goToIndex(currentIndex);
  }, { passive: true });

  buildDots();
  goToIndex(0);
  startAutoplay();
}

/* --- 13. ПРИХОВАНИЙ HERO SCROLL-ХІНТ ПРИ СКРОЛІ --- */
function initHeroScrollHint() {
  const hint = document.getElementById('heroScrollHint');
  if (!hint) return;

  const onScroll = () => {
    if (window.scrollY > 80) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
    } else {
      hint.style.opacity = '';
      hint.style.pointerEvents = '';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- 14. ЗАКРИТИ ПРОМО-БАНЕР --- */
window.closePromoBar = function() {
  const bar = document.getElementById('promoBar');
  if (bar) {
    bar.style.transition = 'max-height 0.35s ease, opacity 0.3s ease, padding 0.35s ease';
    bar.style.overflow = 'hidden';
    bar.style.opacity = '0';
    bar.style.maxHeight = bar.offsetHeight + 'px';
    requestAnimationFrame(() => {
      bar.style.maxHeight = '0';
      bar.style.padding = '0';
    });
    setTimeout(() => bar.remove(), 380);
    sessionStorage.setItem('pkk-promo-closed', '1');
  }
};


// Не показувати промо-банер якщо вже закривали в цій сесії
(function() {
  if (sessionStorage.getItem('pkk-promo-closed')) {
    const bar = document.getElementById('promoBar');
    if (bar) bar.remove();
  }
})();
