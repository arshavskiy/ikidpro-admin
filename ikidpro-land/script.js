// IkidPro Landing Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all components
  initNavigation();
  initScrollAnimations();
  initParticleEffects();
  initAnalyticsDemo();
  initIntelligenceDemo();
  initSmoothScrolling();
  handleWaitlistForm();
});

const form = document.getElementById("waitlist-form");

// Navigation functionality
function initNavigation() {
  const nav = document.querySelector("nav");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  // Add scroll effect to navigation
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle (if implemented)
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

  // Close mobile menu when clicking on links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu) {
        mobileMenu.classList.remove("open");
      }
    });
  });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        // Trigger counter animations
        if (entry.target.classList.contains("stat-counter")) {
          animateCounter(entry.target);
        }

        // Trigger progress bar animations
        if (entry.target.classList.contains("progress-bar")) {
          animateProgressBar(entry.target);
        }
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  document
    .querySelectorAll(".feature-card, .stat-counter, .progress-bar")
    .forEach((el) => {
      el.classList.add("fade-in-section");
      observer.observe(el);
    });
}

// Particle effects for hero section
function initParticleEffects() {
  const heroSection = document.querySelector("section");
  if (!heroSection) return;

  // Create floating particles
  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    particle.className = "hero-particle will-change-transform";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = 6 + Math.random() * 4 + "s";

    // Random colors
    const colors = ["#22d3ee", "#a855f7", "#3b82f6"];
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    heroSection.appendChild(particle);
  }
}

// Analytics dashboard demo
function initAnalyticsDemo() {
  const progressBars = document.querySelectorAll(".h-2 > div");

  // Animate progress bars periodically
  setInterval(() => {
    progressBars.forEach((bar) => {
      const randomWidth = 60 + Math.random() * 30; // 60-90%
      bar.style.width = randomWidth + "%";
    });
  }, 3000);

  // Update stats periodically
  // const statsElements = document.querySelectorAll(".text-2xl.font-bold");
  // const statsData = [
  //   ["98.2°F", "98.1°F", "98.3°F", "98.0°F"],
  //   ["7.5h", "7.8h", "7.2h", "7.6h"],
  // ];

  // let statIndex = 0;
  // setInterval(() => {
  //   statsElements.forEach((element, index) => {
  //     if (statsData[index]) {
  //       element.textContent =
  //         statsData[index][statIndex % statsData[index].length];
  //     }
  //   });
  //   statIndex++;
  // }, 2000);
}

// Intelligence engine demo
function initIntelligenceDemo() {
  const statusIndicators = document.querySelectorAll(".w-3.h-3");
  const statusTexts = document.querySelectorAll(".text-sm");

  const statuses = [
    { color: "bg-green-400", text: "Active", textColor: "text-green-400" },
    { color: "bg-blue-400", text: "Monitoring", textColor: "text-blue-400" },
    { color: "bg-purple-400", text: "Learning", textColor: "text-purple-400" },
    { color: "bg-cyan-400", text: "Ready", textColor: "text-cyan-400" },
  ];

  // Animate status indicators
  statusIndicators.forEach((indicator, index) => {
    if (statuses[index]) {
      setInterval(() => {
        indicator.style.opacity = "0.3";
        setTimeout(() => {
          indicator.style.opacity = "1";
        }, 500);
      }, 2000 + index * 500);
    }
  });

  // Update insights periodically
  const insights = [
    "• Sleep pattern improved by 15%",
    "• Activity level within healthy range",
    "• No anomalies detected today",
    "• Heart rate variability optimal",
    "• Temperature readings normal",
    "• Growth tracking on schedule",
  ];

  const insightsList = document.querySelector(".space-y-2");
  if (insightsList) {
    setInterval(() => {
      const randomInsights = insights
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      insightsList.innerHTML = randomInsights
        .map(
          (insight) => `<div class="text-sm text-slate-300">${insight}</div>`
        )
        .join("");
    }, 5000);
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop =
          target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Counter animation
function animateCounter(element) {
  const target = parseInt(element.textContent.replace(/[^\d]/g, ""));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  };

  updateCounter();
}

// Progress bar animation
function animateProgressBar(element) {
  const bar = element.querySelector(".h-full");
  if (bar) {
    const targetWidth = bar.style.width || "0%";
    bar.style.width = "0%";

    setTimeout(() => {
      bar.style.transition = "width 1.5s ease-out";
      bar.style.width = targetWidth;
    }, 200);
  }
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".hero-particle");

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.1;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
});

// Feature card hover effects
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
    this.style.boxShadow = "0 20px 40px rgba(34, 211, 238, 0.15)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
    this.style.boxShadow = "none";
  });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Performance monitoring
function logPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        console.log(
          "Page load time:",
          navigation.loadEventEnd - navigation.loadEventStart,
          "ms"
        );
      }, 0);
    });
  }
}

// Initialize performance monitoring
logPerformance();

// Error handling
window.addEventListener("error", (e) => {
  console.error("JavaScript error:", e.error);
});

// Resize handler for responsive adjustments
window.addEventListener(
  "resize",
  debounce(() => {
    // Recalculate any position-dependent elements
    const particles = document.querySelectorAll(".hero-particle");
    particles.forEach((particle) => {
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
    });
  }, 250)
);

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Contact form handling (if implemented)
function handleContactForm() {
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleContactForm();
      console.log("Contact form submitted");
    });
  }
}

// Newsletter signup (if implemented)
function handleNewsletterSignup() {
  const newsletter = document.querySelector("#newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", (e) => {
      e.preventDefault();
      handleNewsletterSignup();
      console.log("Newsletter signup submitted");
    });
  }
}

// Waitlist form handling
function handleWaitlistForm() {
  const waitlistForm = document.getElementById("waitlist-form");
  const submitButton = document.getElementById("waitlist-submit");
  const successMessage = document.getElementById("waitlist-success");
  const errorMessage = document.getElementById("waitlist-error");
  const nameInput = document.getElementById("waitlist-name");
  const emailInput = document.getElementById("waitlist-email");

  if (waitlistForm) {
    waitlistForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Hide previous messages
      successMessage.classList.add("hidden");
      errorMessage.classList.add("hidden");

      // Disable submit button and show loading state
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<i class="fas fa-spinner animate-spin mr-2"></i>Joining...';

      try {
        // Get form data
        const formData = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          updates: document.getElementById("updates-checkbox").checked,
          timestamp: new Date().toISOString(),
          source: "landing-page",
        };

        // Validate inputs
        if (!formData.name || !formData.email) {
          throw new Error("Please fill in all required fields");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error("Please enter a valid email address");
        }

        // Simulate API call (replace with actual endpoint)
        await sendWaitlistSignup(formData);

        // Show success message
        successMessage.classList.remove("hidden");

        // Reset form
        waitlistForm.reset();

        // Track signup (if analytics is implemented)
        if (typeof gtag !== "undefined") {
          gtag("event", "waitlist_signup", {
            event_category: "engagement",
            event_label: "landing_page",
          });
        }

        console.log("Waitlist signup successful:", formData);
      } catch (error) {
        console.error("Waitlist signup error:", error);
        errorMessage.textContent =
          error.message || "Something went wrong. Please try again.";
        errorMessage.classList.remove("hidden");
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.innerHTML =
          '<i class="fas fa-paper-plane mr-2"></i>Join Waitlist';
      }
    });

    // Real-time validation
    emailInput.addEventListener("blur", () => {
      const email = emailInput.value.trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput.classList.add("border-red-500");
      } else {
        emailInput.classList.remove("border-red-500");
      }
    });

    nameInput.addEventListener("blur", () => {
      const name = nameInput.value.trim();
      if (name && name.length < 2) {
        nameInput.classList.add("border-red-500");
      } else {
        nameInput.classList.remove("border-red-500");
      }
    });
  }
}

// Simulate waitlist signup (replace with actual API call)
async function sendWaitlistSignup(formData) {
  try {
    const res = await fetch("http://localhost:3333/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        source: formData.source,
        notes: "Optional notes",
      }),
    });

    if (!res.ok) throw new Error("Something went wrong. Try again.");

    return await res.json();
  } catch (error) {
    console.log("API error:", error);
  }
}
