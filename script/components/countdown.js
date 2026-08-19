(function () {
  window.Components = window.Components || {};

  window.Components.countdown = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-countdown";

      const numbers = [];
      const start = section.from || 3;
      for (let i = start; i >= 1; i--) numbers.push(i);

      div.innerHTML = `
        <div class="countdown-wrapper">
          ${numbers.map((n) => `<span class="countdown-num">${n}</span>`).join("")}
          <div class="countdown-confetti" aria-hidden="true"></div>
        </div>
      `;

      const confetti = div.querySelector(".countdown-confetti");
      const colors = ["#f472b6", "#60a5fa", "#fbbf24", "#34d399", "#c084fc"];
      const pieceCount = 60;

      for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement("span");
        const burstX = (Math.random() - 0.5) * 80;
        const burstY = -(12 + Math.random() * 38);

        piece.className = "countdown-confetti-piece";
        piece.dataset.burstX = burstX;
        piece.dataset.burstY = burstY;
        piece.dataset.fallX = burstX + (Math.random() - 0.5) * 18;
        piece.dataset.fallY = 48 + Math.random() * 25;
        piece.dataset.rotation = 360 + Math.random() * 720;
        piece.style.backgroundColor = colors[i % colors.length];
        confetti.appendChild(piece);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const nums = el.querySelectorAll(".countdown-num");
      const confetti = el.querySelector(".countdown-confetti");
      const pieces = confetti.querySelectorAll(".countdown-confetti-piece");

      nums.forEach((num) => {
        tl.fromTo(num,
          { scale: 0, opacity: 0, rotation: -180 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
        )
        .to(num, { scale: 2, opacity: 0, duration: 0.4 }, "+=0.8");
      });

      tl.set(confetti, { opacity: 1 })
      .fromTo(pieces,
        { x: 0, y: 0, scale: 0, rotation: 0, opacity: 0 },
        {
          x: (_, piece) => `${piece.dataset.burstX}vw`,
          y: (_, piece) => `${piece.dataset.burstY}vh`,
          scale: 1,
          rotation: (_, piece) => Number(piece.dataset.rotation),
          opacity: 1,
          duration: 0.8,
          stagger: { amount: 0.18, from: "random" },
          ease: "power3.out",
        }
      )
      .to(pieces, {
        x: (_, piece) => `${piece.dataset.fallX}vw`,
        y: (_, piece) => `${piece.dataset.fallY}vh`,
        rotation: (_, piece) => Number(piece.dataset.rotation) * 2.5,
        opacity: 0,
        duration: 1.5,
        stagger: { amount: 0.2, from: "random" },
        ease: "power1.in",
      }, "-=0.15")
      .set(confetti, { opacity: 0 });
    },
  };
})();
