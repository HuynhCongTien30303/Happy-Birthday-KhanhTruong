(function () {
  window.Components = window.Components || {};

  const formatSecretAsDate = (secret) => {
    const digits = String(secret || "").replace(/\D/g, "");

    if (digits.length === 6) {
      return `${digits.slice(0, 2)} · ${digits.slice(2, 4)} · ${digits.slice(4)}`;
    }

    return digits;
  };

  window.Components.memory = {
    render(container, section, config) {
      const div = document.createElement("div");
      const countdownFrom = Math.max(1, Number(section.countdownFrom) || 5);
      const numbers = Array.from({ length: countdownFrom }, (_, index) => countdownFrom - index);
      const date = section.date || formatSecretAsDate(
        config.game && window.decodeGameSecret(config.game.secretCode)
      );

      div.className = "section section-memory";
      div.innerHTML = `
        <div class="memory-stage memory-question-stage">
          <p class="memory-question"></p>
          <p class="memory-prompt"></p>
        </div>

        <div class="memory-stage memory-countdown" aria-hidden="true">
          ${numbers.map((number) => `<span class="memory-countdown-num">${number}</span>`).join("")}
        </div>

        <div class="memory-stage memory-hint-stage">
          <div class="memory-hint-card">
            <p class="memory-kicker">Gợi ý nhỏ</p>
            <p class="memory-hint-text"></p>
          </div>
        </div>

        <div class="memory-stage memory-reveal-stage">
          <div class="memory-reveal-card">
            <p class="memory-date"></p>
            <p class="memory-reveal-title"></p>
            <p class="memory-reveal-text"></p>
          </div>
        </div>
      `;

      div.querySelector(".memory-question").textContent = section.question || "Ông có biết dãy số lúc đầu có ý nghĩa gì khum???";
      div.querySelector(".memory-prompt").textContent = section.prompt || "Cho ông 5 giây để đoán nha.";
      div.querySelector(".memory-hint-text").textContent = section.hint || "Đó là một mốc thời gian.";
      div.querySelector(".memory-date").textContent = date;
      div.querySelector(".memory-reveal-title").textContent = section.revealTitle || "Đoán ra chưa?";
      div.querySelector(".memory-reveal-text").textContent = section.revealText || "Đó là ngày đầu tiên tui gặp ông ở công ty.";

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const questionStage = el.querySelector(".memory-question-stage");
      const question = el.querySelector(".memory-question");
      const prompt = el.querySelector(".memory-prompt");
      const countdownStage = el.querySelector(".memory-countdown");
      const numbers = [...el.querySelectorAll(".memory-countdown-num")];
      const hintStage = el.querySelector(".memory-hint-stage");
      const hintCard = el.querySelector(".memory-hint-card");
      const revealStage = el.querySelector(".memory-reveal-stage");
      const revealCard = el.querySelector(".memory-reveal-card");
      const date = el.querySelector(".memory-date");
      const revealTitle = el.querySelector(".memory-reveal-title");
      const revealText = el.querySelector(".memory-reveal-text");

      const addCountdown = () => {
        tl.set(countdownStage, { opacity: 1 });

        numbers.forEach((number) => {
          tl.fromTo(number,
            { opacity: 0, scale: 0.55, y: 18 },
            { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "back.out(1.9)" }
          ).to(number, {
            opacity: 0,
            scale: 1.35,
            y: -18,
            duration: 0.25,
            ease: "power2.in",
          }, "+=0.5");
        });

        tl.set(countdownStage, { opacity: 0 });
      };

      tl.fromTo(questionStage,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }
      )
      .from(question, { opacity: 0, scale: 0.96, duration: 0.55 }, "-=0.25")
      .from(prompt, { opacity: 0, y: 12, duration: 0.4 })
      .to(questionStage, { opacity: 0, y: -20, duration: 0.5 }, "+=2");

      addCountdown();

      tl.fromTo(hintStage,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "back.out(1.5)" }
      )
      .from(hintCard, { boxShadow: "0 0 0 rgba(0, 0, 0, 0)", duration: 0.5 }, "-=0.3")
      .to(hintStage, { opacity: 0, y: -18, duration: 0.5 }, "+=2.4");

      addCountdown();

      tl.fromTo(revealStage,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
      .from(date, { opacity: 0, scale: 1.35, letterSpacing: "0.18em", duration: 0.8, ease: "expo.out" }, "-=0.35")
      .from(revealTitle, { opacity: 0, y: 12, duration: 0.45 }, "-=0.15")
      .from(revealText, { opacity: 0, y: 12, duration: 0.55 })
      .to(revealCard, { scale: 1.025, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut" }, "+=1.2")
      .to(revealStage, { opacity: 0, y: -20, duration: 0.6 }, "+=4.5");
    },
  };
})();
