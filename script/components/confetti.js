(function () {
  window.Components = window.Components || {};

  const COLORS = [
    "#c084fc",
    "#67e8f9",
    "#fbbf24",
    "#f472b6",
    "#34d399",
    "#fb923c",
    "#60a5fa",
    "#f9a8d4",
  ];

  window.Components.confetti = {
    overlay: true,

    render(container, section) {
      const div = document.createElement("div");
      const configuredCount = Number(section.count);
      const configuredDuration = Number(section.duration);
      const count = Number.isFinite(configuredCount)
        ? Math.min(180, Math.max(60, Math.round(configuredCount)))
        : 120;
      const emissionDuration = Number.isFinite(configuredDuration) && configuredDuration > 0
        ? configuredDuration
        : 6;

      div.className = "section section-confetti";
      div.setAttribute("aria-hidden", "true");
      div.dataset.emissionDuration = emissionDuration;

      for (let i = 0; i < count; i++) {
        const piece = document.createElement("span");
        const fromLeft = i % 2 === 0;
        const direction = fromLeft ? 1 : -1;
        const launchXRatio = direction * (0.16 + Math.random() * 0.3);
        const launchDuration = 0.65 + Math.random() * 0.35;
        const fallDuration = 2.2 + Math.random() * 1.15;

        piece.className = `confetti-piece ${fromLeft ? "from-left" : "from-right"}`;
        piece.style.backgroundColor = COLORS[i % COLORS.length];
        piece.style.width = `${5 + Math.random() * 7}px`;
        piece.style.height = `${8 + Math.random() * 12}px`;
        piece.dataset.delay = ((i + Math.random() * 0.75) / count) * emissionDuration;
        piece.dataset.launchXRatio = launchXRatio;
        piece.dataset.launchYRatio = 0.42 + Math.random() * 0.38;
        piece.dataset.fallXRatio = launchXRatio
          + direction * (0.08 + Math.random() * 0.22);
        piece.dataset.launchDuration = launchDuration;
        piece.dataset.fallDuration = fallDuration;
        piece.dataset.rotation = 360 + Math.random() * 900;
        piece.dataset.tilt = 90 + Math.random() * 360;
        div.appendChild(piece);
      }

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const pieces = [...el.querySelectorAll(".confetti-piece")];
      const startLabel = "sideConfettiStart";

      tl.addLabel(startLabel);

      pieces.forEach((piece) => {
        const delay = Number(piece.dataset.delay);
        const launchDuration = Number(piece.dataset.launchDuration);
        const fallDuration = Number(piece.dataset.fallDuration);
        const launchAt = `${startLabel}+=${delay}`;
        const fallAt = `${startLabel}+=${delay + launchDuration}`;
        const finishAt = `${startLabel}+=${delay + launchDuration + fallDuration}`;

        tl.fromTo(piece, {
          x: 0,
          y: 0,
          rotation: 0,
          rotationX: 0,
          opacity: 0,
          scale: 0.45,
        }, {
          x: () => Number(piece.dataset.launchXRatio) * window.innerWidth,
          y: () => -Number(piece.dataset.launchYRatio) * window.innerHeight,
          rotation: Number(piece.dataset.rotation),
          rotationX: Number(piece.dataset.tilt),
          opacity: 1,
          scale: 1,
          duration: launchDuration,
          ease: "power2.out",
        }, launchAt)
        .to(piece, {
          x: () => Number(piece.dataset.fallXRatio) * window.innerWidth,
          y: () => window.innerHeight * 1.18,
          rotation: Number(piece.dataset.rotation) * 2.6,
          rotationX: Number(piece.dataset.tilt) * 3,
          opacity: 1,
          duration: fallDuration,
          ease: "power1.in",
        }, fallAt)
        .set(piece, { opacity: 0 }, finishAt);
      });

      tl.to(el, { opacity: 0, duration: 0.2 });
    },
  };
})();
