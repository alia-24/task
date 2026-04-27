document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");

      if (navLinks.classList.contains("active")) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "initial";
      }
    });
  }

  document.querySelectorAll(".nav-links a").forEach((linkbutton) => {
    linkbutton.addEventListener("click", () => {
      hamburger?.classList.remove("active");
      navLinks?.classList.remove("active");
      body.style.overflow = "initial";
    });
  });

  const filterBtns = document.querySelectorAll(".filter-btn");
  const workCards = document.querySelectorAll(".work-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      workCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        card.style.opacity = "0";
        setTimeout(() => {
          if (filterValue === "all" || category === filterValue) {
            card.style.display = "block";
            setTimeout(() => (card.style.opacity = "1"), 50);
          } else {
            card.style.display = "none";
          }
        }, 300);
      });
    });
  });

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you! Your message has been sent successfully.!");
      contactForm.reset();
    });
  }
});
