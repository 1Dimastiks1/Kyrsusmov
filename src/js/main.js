// Відкриття модалки з можливістю підставляти динамічний заголовок
function openModal(serviceName = "Записатися на консультацію") {
  const modal = document.getElementById("callbackModal");
  const modalTitle = document.getElementById("modalTitle");

  if (modalTitle) {
    modalTitle.textContent = serviceName;
  }

  modal.classList.add("is-open");
}

function closeModal() {
  document.getElementById("callbackModal").classList.remove("is-open");
}

// Аккордеон для FAQ
function toggleFaq(element) {
  const faqItem = element.parentElement;
  faqItem.classList.toggle("active");
}

// Обробка форми
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("clientName").value;
  const phone = document.getElementById("clientPhone").value;

  console.log("Дані з форми:", { name, phone });

  alert(
    `Дякуємо, ${name}! Заявку успішно прийнято. Ми зателефонуємо вам найближчим часом.`,
  );

  document.getElementById("clientName").value = "";
  document.getElementById("clientPhone").value = "";
  closeModal();
}
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".theme-toggle-btn");
  const currentTheme = localStorage.getItem("theme") || "dark";

  document.documentElement.setAttribute("data-theme", currentTheme);

  if (toggleBtn) {
    toggleBtn.textContent = currentTheme === "dark" ? "☀️" : "🌙";

    toggleBtn.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      let newTheme = theme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
  }
});