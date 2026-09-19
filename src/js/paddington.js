// =========================================================
// АНГЛОМОВНИЙ ПРОСТІР «ПАДІНГТОН» — ІНТЕРАКТИВНИЙ СКРИПТ
// Вікторина готовності, акордеон, модальне вікно, SimpleNotify
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Дитячий простір завжди у теплих, ніжних, сонячних тонах (без темної теми)
  document.documentElement.removeAttribute('data-theme');
  initMobileMenu();
  initQuiz();
  initFaq();
  initModal();
  initScrollSpy();
});

/* --- 2. МОБІЛЬНЕ МЕНЮ --- */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.pad-burger-btn');
  const navList = document.querySelector('.pad-nav-list');

  if (burgerBtn && navList) {
    burgerBtn.addEventListener('click', () => {
      navList.classList.toggle('is-active');
      const isOpen = navList.classList.contains('is-active');
      burgerBtn.textContent = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-active');
        burgerBtn.textContent = '☰';
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !burgerBtn.contains(e.target) && navList.classList.contains('is-active')) {
        navList.classList.remove('is-active');
        burgerBtn.textContent = '☰';
        document.body.style.overflow = '';
      }
    });
  }
}

/* --- 3. ІНТЕРАКТИВНИЙ ТЕСТ ДЛЯ БАТЬКІВ --- */
const padQuizData = [
  {
    q: "Скільки рочків вашому малюку?",
    options: [
      { text: "2 – 3 роки (перший досвід перебування без мами)", score: 2 },
      { text: "3 – 4 роки (активний дослідник, любить ігри з дітками)", score: 3 },
      { text: "4 – 6 років (підготовка до школи та активне спілкування)", score: 3 }
    ]
  },
  {
    q: "Чи був у дитини попередній контакт з англійською мовою?",
    options: [
      { text: "Зовсім ні, це буде перше знайомство", score: 2 },
      { text: "Слухає мультики або пісеньки англійською (CoComelon, Super Simple Songs)", score: 3 },
      { text: "Знає кольори, тваринок і окремі слова", score: 3 }
    ]
  },
  {
    q: "Як ваш малюк зазвичай адаптується до нових людей та середовища?",
    options: [
      { text: "Потребує трохи часу, щоб спокійно роздивитися", score: 2 },
      { text: "Швидко йде на контакт, якщо є цікаві іграшки", score: 3 },
      { text: "Дуже відкритий і легко заводить нових друзів", score: 3 }
    ]
  },
  {
    q: "Який напрямок розвитку для вас найважливіший зараз?",
    options: [
      { text: "М'яка соціалізація, спілкування з однолітками та режим", score: 2 },
      { text: "Англійська мова через гру, пісні та повне занурення", score: 3 },
      { text: "Всебічний комплекс: логіка, фітнес, творчість і підготовка до школи", score: 3 }
    ]
  }
];

let padQuizIdx = 0;
let padQuizScore = 0;

function initQuiz() {
  renderPadQuiz();

  const nextBtn = document.getElementById('padQuizNext');
  if (nextBtn) {
    nextBtn.addEventListener('click', handlePadQuizNext);
  }

  const restartBtn = document.getElementById('padQuizRestart');
  if (restartBtn) {
    restartBtn.addEventListener('click', restartPadQuiz);
  }
}

function renderPadQuiz() {
  const qTitle = document.getElementById('padQuizTitle');
  const optionsWrap = document.getElementById('padQuizOptions');
  const countEl = document.getElementById('padQuizCount');
  const nextBtn = document.getElementById('padQuizNext');

  if (!qTitle || !optionsWrap) return;

  const cur = padQuizData[padQuizIdx];
  qTitle.textContent = cur.q;
  if (countEl) countEl.textContent = `Питання ${padQuizIdx + 1} з ${padQuizData.length}`;

  optionsWrap.innerHTML = '';

  cur.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pad-quiz-btn';
    btn.setAttribute('data-score', opt.score);
    btn.innerHTML = `<span style="font-size: 18px;">✨</span> <span>${opt.text}</span>`;
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pad-quiz-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (nextBtn) nextBtn.disabled = false;
    });

    optionsWrap.appendChild(btn);
  });

  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.textContent = padQuizIdx === padQuizData.length - 1 ? 'Отримати персональну пораду 🧸' : 'Далі →';
  }
}

function handlePadQuizNext() {
  const selected = document.querySelector('.pad-quiz-btn.selected');
  if (!selected) return;

  const score = parseInt(selected.getAttribute('data-score') || '2', 10);
  padQuizScore += score;
  padQuizIdx++;

  if (padQuizIdx < padQuizData.length) {
    renderPadQuiz();
  } else {
    showPadQuizResult();
  }
}

function showPadQuizResult() {
  const quizActive = document.getElementById('padQuizActive');
  const quizResult = document.getElementById('padQuizResult');
  const resultTitle = document.getElementById('padResultTitle');
  const resultDesc = document.getElementById('padResultDesc');

  if (quizActive) quizActive.style.display = 'none';
  if (quizResult) quizResult.classList.add('active');

  let title = "«Падінгтон» стане чудовою другою домівкою для вашого малюка! 🧸";
  let desc = "Завдяки формату міні-групи (до 10 діток) та одночасній роботі викладача англійської та турботливого вихователя, адаптація проходить без сліз та стресу. Діти сприймають англійську мову на рівні рідної через тактильні ігри, творчість та музику!";

  if (padQuizScore >= 11) {
    title = "Малюк на 100% готовий до яскравих відкриттів у «Падінгтоні»! 🌟";
    desc = "Ваша дитина має високий інтерес до пізнання та гри! У нашому просторі вона знайде вірних друзів, почне вільно говорити англійською та отримає міцний фундамент для підготовки до школи.";
  }

  if (resultTitle) resultTitle.textContent = title;
  if (resultDesc) resultDesc.textContent = desc;
}

function restartPadQuiz() {
  padQuizIdx = 0;
  padQuizScore = 0;
  const quizActive = document.getElementById('padQuizActive');
  const quizResult = document.getElementById('padQuizResult');

  if (quizActive) quizActive.style.display = 'block';
  if (quizResult) quizResult.classList.remove('active');

  renderPadQuiz();
}

/* --- 4. ЧАСТІ ЗАПИТАННЯ (АККОРДЕОН FAQ) --- */
function initFaq() {
  const items = document.querySelectorAll('.pad-faq-item');
  items.forEach(item => {
    const q = item.querySelector('.pad-faq-q');
    if (!q) return;

    q.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(other => other.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- 5. МОДАЛЬНЕ ВІКНО ТА ФОРМА ЗАПИСУ --- */
function initModal() {
  const modal = document.getElementById('padModal');
  if (!modal) return;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closePadModal();
    }
  });
}

window.openPadModal = function(program = "Запис на пробний день у Падінгтон") {
  const modal = document.getElementById('padModal');
  const modalTitle = document.getElementById('padModalTitle');
  const modalInput = document.getElementById('padModalProgramInput');

  if (modalTitle) modalTitle.textContent = program;
  if (modalInput) modalInput.value = program;

  if (modal) {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
};

window.closePadModal = function() {
  const modal = document.getElementById('padModal');
  if (modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }
};

window.handlePadFormSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  const nameInput = form.querySelector('input[name="parentName"]') || form.querySelector('input[type="text"]');
  const phoneInput = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');
  const childAgeInput = form.querySelector('input[name="childAge"]') || form.querySelector('select');

  const parentName = nameInput ? nameInput.value.trim() : "Шановні батьки";
  const phone = phoneInput ? phoneInput.value.trim() : "";
  const age = childAgeInput ? childAgeInput.value : "2-6 років";

  // Використовуємо SimpleNotify бібліотеку або резервний красивий alert
  if (typeof Notify !== 'undefined') {
    new Notify({
      status: 'success',
      title: 'Заявку успішно надіслано! 🎉',
      text: `Дякуємо, ${parentName}! Ми зателефонуємо на номер ${phone} протягом 15 хвилин для узгодження візиту.`,
      effect: 'fade',
      speed: 300,
      showIcon: true,
      showCloseButton: true,
      autoclose: true,
      autotimeout: 5000,
      position: 'right top'
    });
  } else {
    alert(`Дякуємо, ${parentName}! 🎉\n\nВашу заявку на відвідування простору «Падінгтон» (вік: ${age}) успішно прийнято! Наш адміністратор зателефонує вам за номером ${phone} найближчим часом.`);
  }

  form.reset();
  closePadModal();
};

/* --- 6. SCROLLSPY --- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.pad-nav-list a.pad-nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const h = sec.offsetHeight;
      const top = sec.offsetTop - 120;
      const id = sec.getAttribute('id');

      if (scrollY > top && scrollY <= top + h) {
        navLinks.forEach(a => {
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = '#f7d077';
            a.style.background = 'rgba(255, 255, 255, 0.15)';
          } else {
            a.style.color = '';
            a.style.background = '';
          }
        });
      }
    });
  }, { passive: true });
}
