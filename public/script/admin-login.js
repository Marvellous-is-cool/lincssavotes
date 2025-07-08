/**
 * Admin Login Animation Script
 * Creates an animated background with particles and interactive elements
 */

document.addEventListener("DOMContentLoaded", function () {
  const particlesContainer = document.getElementById("particles");

  // Create animated particles
  for (let i = 0; i < 30; i++) {
    createParticle(particlesContainer);
  }

  // Add interactive effect on form inputs
  const formInputs = document.querySelectorAll(".form-floating input");
  formInputs.forEach((input) => {
    // Flash effect when focusing inputs
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focus-flash");
      setTimeout(() => {
        this.parentElement.classList.remove("focus-flash");
      }, 500);
    });

    // Ripple effect when clicking
    input.addEventListener("click", function (e) {
      createRipple(e.clientX, e.clientY);
    });
  });

  // Add ripple effect on button
  const loginButton = document.querySelector(".btn-login");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      const rect = this.getBoundingClientRect();
      createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  }

  // Add hover effect to logo
  const logo = document.querySelector(".logo-container img");
  if (logo) {
    logo.addEventListener("mouseover", function () {
      this.style.transform = "scale(1.1) rotate(5deg)";
      this.style.filter = "drop-shadow(0 0 15px rgba(255,255,255,0.5))";
    });

    logo.addEventListener("mouseout", function () {
      this.style.transform = "";
      this.style.filter = "";
    });
  }
});

function createParticle(container) {
  const particle = document.createElement("div");
  particle.className = "particle";

  // Random size between 10px and 80px
  const size = Math.floor(Math.random() * 70) + 10;
  particle.style.width = size + "px";
  particle.style.height = size + "px";

  // Random position
  const posX = Math.random() * window.innerWidth;
  const posY = Math.random() * window.innerHeight;
  particle.style.left = posX + "px";
  particle.style.top = posY + "px";

  // Random opacity
  particle.style.opacity = Math.random() * 0.5 + 0.1;

  // Random animation duration
  const duration = Math.random() * 20 + 10;
  particle.style.animationDuration = duration + "s";

  // Random animation delay
  const delay = Math.random() * 5;
  particle.style.animationDelay = delay + "s";

  container.appendChild(particle);

  // Create a glowing effect for some particles
  if (Math.random() > 0.7) {
    const glow = document.createElement("div");
    glow.className = "particle-glow";
    glow.style.width = size * 1.5 + "px";
    glow.style.height = size * 1.5 + "px";
    glow.style.left = posX - size * 0.25 + "px";
    glow.style.top = posY - size * 0.25 + "px";
    glow.style.animationDuration = duration * 0.8 + "s";
    glow.style.animationDelay = delay + "s";
    container.appendChild(glow);
  }
}

function createRipple(x, y) {
  const ripple = document.createElement("div");
  ripple.className = "ripple";
  document.body.appendChild(ripple);

  ripple.style.left = x + "px";
  ripple.style.top = y + "px";

  ripple.style.animation = "ripple-effect 1s linear";

  setTimeout(() => {
    ripple.remove();
  }, 1000);
}

// Create a typing animation for the admin subtitle
window.addEventListener("load", function () {
  const subtitle = document.querySelector(".brand-subtitle");
  if (subtitle) {
    const text = subtitle.innerHTML;
    subtitle.innerHTML = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        subtitle.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    }

    setTimeout(typeWriter, 1000);
  }
});
