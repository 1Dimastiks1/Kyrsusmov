// =========================================================
// ПЕРШІ КИЇВСЬКІ КУРСИ — ГОЛОВНИЙ СКРИПТ
// Інтерактивний експрес-тест, калькулятор вартості,
// фільтрація курсів, акордеон FAQ, модальні вікна та тема
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCourseFilter();
  initQuiz();
  initCalculator();
  initFaq();
  initModal();
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

    // Закриття при кліку на посилання
    navLinks.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        navLinks.classList.remove('is-active');
        burgerBtn.textContent = '☰';
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Закриття при кліку поза межами меню
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !burgerBtn.contains(e.target) && navLinks.classList.contains('is-active')) {
        navLinks.classList.remove('is-active');
        burgerBtn.textContent = '☰';
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ScrollSpy для активного розділу у шапці
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

/* --- 3. ФІЛЬТРАЦІЯ КУРСІВ ЗА КАТЕГОРІЯМИ --- */
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

/* --- 4. ІНТЕРАКТИВНИЙ ЕКСПРЕС-ТЕСТ НА РІВЕНЬ --- */
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
    options: [
      "for",
      "since",
      "from",
      "during"
    ],
    correct: 1
  },
  {
    q: "If I _____ more free time, I would learn Italian at First Kyiv Courses.",
    options: [
      "have",
      "will have",
      "had",
      "would have"
    ],
    correct: 2
  },
  {
    q: "The international exam requires students to show a wide _____ of vocabulary.",
    options: [
      "range",
      "length",
      "queue",
      "bundle"
    ],
    correct: 0
  },
  {
    q: "Scarcely _____ the test when the bell rang.",
    options: [
      "she finished",
      "had she finished",
      "did she finished",
      "she had finished"
    ],
    correct: 1
  }
];

let currentQuestionIdx = 0;
let userScore = 0;

function initQuiz() {
  renderQuizQuestion();

  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', handleQuizNext);
  }

  const restartBtn = document.getElementById('quizRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartQuiz);
  }
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

  if (chosenIdx === quizQuestions[currentQuestionIdx].correct) {
    userScore++;
  }

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
  let desc = "Ви володієте базовими фразами. На курсах ПКК ви швидко подолаєте мовний бар'єр, вивчите впевнену граматику та почнете вільно говорити з перших занять!";
  let courseRec = "Загальна англійська (Рівень A1/A2)";

  if (userScore >= 4) {
    level = "B2 - C1 (Advanced)";
    title = "Блискучий результат! Ви на високому рівні!";
    desc = "Ви чудово володієте граматичними конструкціями та багатою лексикою. Вам підійде курс підготовки до IELTS/CAE або розмовні клуби з носіями мови для відточування академічної англійської.";
    courseRec = "Підготовка до IELTS / CAE (Рівень B2/C1)";
  } else if (userScore >= 2) {
    level = "A2 - B1 (Intermediate)";
    title = "Міцна основа! Час переходити на рівень впевненого спілкування!";
    desc = "Ви добре розумієте ключові правила. Залишилося збагатити активний словниковий запас, подолати труднощі складних часів та підготуватися до НМТ чи міжнародних іспитів.";
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

/* --- 5. ІНТЕРАКТИВНИЙ КАЛЬКУЛЯТОР ВАРТОСТІ --- */
function initCalculator() {
  const form = document.getElementById('costCalculatorForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('change', calculatePrice);
  });

  calculatePrice();
}

function calculatePrice() {
  const audience = document.querySelector('input[name="calcAudience"]:checked')?.value || 'teens';
  const format = document.querySelector('input[name="calcFormat"]:checked')?.value || 'group';

  let lessonPrice = 330;
  let lessonsPerMonth = 8;
  let duration = "60-90 хв";
  let groupSize = "4–8 осіб";

  if (audience === 'kids') {
    if (format === 'group') {
      lessonPrice = 240;
      duration = "60 хв";
      groupSize = "до 6 дітей";
    } else if (format === 'intensive') {
      lessonPrice = 300;
      lessonsPerMonth = 12;
      duration = "60 хв";
    } else {
      lessonPrice = 400;
      duration = "60 хв";
      groupSize = "1-на-1 з викладачем";
    }
  } else if (audience === 'teens' || audience === 'nmt') {
    if (format === 'group') {
      lessonPrice = 330;
      duration = "90 хв";
    } else if (format === 'intensive') {
      lessonPrice = 330;
      lessonsPerMonth = 12;
      duration = "90 хв";
    } else {
      lessonPrice = 450;
      duration = "60-90 хв";
      groupSize = "1-на-1 з експертом НМТ";
    }
  } else if (audience === 'adults') {
    if (format === 'group') {
      lessonPrice = 330;
      duration = "90 хв";
    } else if (format === 'intensive') {
      lessonPrice = 350;
      lessonsPerMonth = 12;
      duration = "90 хв";
    } else {
      lessonPrice = 500;
      duration = "60 хв";
      groupSize = "1-на-1 (гнучкий графік)";
    }
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

/* --- 6. ЧАСТІ ЗАПИТАННЯ (АККОРДЕОН FAQ) --- */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Закриваємо інші відкриті
      faqItems.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- 7. МОДАЛЬНЕ ВІКНО ТА ФОРМИ --- */
function initModal() {
  const modal = document.getElementById('callbackModal');
  if (!modal) return;

  // Закриття по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

window.openModal = function(serviceName = "Записатися на безкоштовне тестування") {
  const modal = document.getElementById('callbackModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCourseInput = document.getElementById('modalSelectedCourse');

  if (modalTitle) modalTitle.textContent = serviceName;
  if (modalCourseInput) modalCourseInput.value = serviceName;

  if (modal) {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function() {
  const modal = document.getElementById('callbackModal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
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

  alert(`Дякуємо, ${name}! 🎉\n\nВашу заявку на «${course}» успішно прийнято! Менеджер Перших Київських Курсів зателефонує вам за номером ${phone} протягом 15 хвилин.`);

  form.reset();
  closeModal();
};
