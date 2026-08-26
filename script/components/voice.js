(function () {
  window.Components = window.Components || {};

  window.Components.voice = {
    render(container, section) {
      const div = document.createElement("div");
      const duckVolume = Number(section.duckVolume);

      div.className = "section section-voice";
      div.dataset.duckVolume = Number.isFinite(duckVolume)
        ? Math.min(1, Math.max(0, duckVolume))
        : 0.12;
      div.innerHTML = `
        <div class="voice-card">
          <p class="voice-text"></p>
          <button class="voice-start" type="button" disabled>
            <span class="voice-start-icon" aria-hidden="true">
              <span class="voice-play-symbol">▶</span>
              <span class="voice-equalizer">
                <i></i><i></i><i></i><i></i>
              </span>
              <span class="voice-finished-symbol">✓</span>
              <span class="voice-error-symbol">!</span>
            </span>
            <span class="voice-start-label"></span>
          </button>
          <audio class="voice-audio" preload="metadata"></audio>
        </div>
      `;

      div.querySelector(".voice-text").textContent = section.text || "Có cái này tui muốn tự nói…";
      div.querySelector(".voice-start-label").textContent = section.buttonText || "Phát lời nhắn";

      const voiceAudio = div.querySelector(".voice-audio");
      if (section.audio) voiceAudio.src = section.audio;

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const card = el.querySelector(".voice-card");
      const text = el.querySelector(".voice-text");
      const startButton = el.querySelector(".voice-start");
      const startButtonLabel = el.querySelector(".voice-start-label");
      const voiceAudio = el.querySelector(".voice-audio");
      const defaultButtonText = startButtonLabel.textContent;
      let isAwaitingStart = false;
      let isPlaying = false;

      const playVoiceMessage = () => {
        if (!isAwaitingStart || isPlaying) return;

        isAwaitingStart = false;
        isPlaying = true;
        startButton.disabled = true;
        startButton.classList.remove("is-finished", "is-error");
        startButton.classList.add("is-playing");
        startButtonLabel.textContent = "Đang phát…";

        const backgroundMusic = document.querySelector(".song");
        const originalVolume = backgroundMusic ? backgroundMusic.volume : 0;
        const duckVolume = Number(el.dataset.duckVolume);
        let isFinished = false;
        let loadTimeout = null;

        const handleEnded = () => finish(true);
        const handleError = () => finish(false);

        const cleanup = () => {
          voiceAudio.removeEventListener("ended", handleEnded);
          voiceAudio.removeEventListener("error", handleError);
          if (loadTimeout) window.clearTimeout(loadTimeout);
        };

        const finish = (didPlay) => {
          if (isFinished) return;
          isFinished = true;
          isPlaying = false;
          cleanup();

          startButton.classList.remove("is-playing");
          startButton.classList.toggle("is-finished", didPlay);
          startButton.classList.toggle("is-error", !didPlay);
          startButtonLabel.textContent = didPlay ? "Đã phát xong" : "Không thể phát";

          const continueToClosing = () => tl.resume();

          if (backgroundMusic) {
            gsap.to(backgroundMusic, {
              volume: originalVolume,
              duration: 0.8,
              ease: "power1.inOut",
              onComplete: continueToClosing,
            });
          } else {
            continueToClosing();
          }
        };

        if (!voiceAudio.getAttribute("src")) {
          finish(false);
          return;
        }

        voiceAudio.addEventListener("ended", handleEnded, { once: true });
        voiceAudio.addEventListener("error", handleError, { once: true });

        if (backgroundMusic) {
          gsap.to(backgroundMusic, {
            volume: Math.min(originalVolume, duckVolume),
            duration: 0.9,
            ease: "power1.inOut",
          });
        }

        try {
          voiceAudio.currentTime = 0;
        } catch (error) {
          // Some browsers do not allow seeking before metadata is available.
        }

        let playResult;
        try {
          playResult = voiceAudio.play();
        } catch (error) {
          finish(false);
          return;
        }

        if (playResult && typeof playResult.then === "function") {
          playResult.catch(handleError);
        }

        // Do not leave the presentation paused when the future MP3 is not there yet.
        loadTimeout = window.setTimeout(() => {
          if (voiceAudio.readyState === 0) finish(false);
        }, 5000);
      };

      const waitForVoiceStart = () => {
        isAwaitingStart = true;
        isPlaying = false;
        startButton.disabled = false;
        startButton.classList.remove("is-playing", "is-finished", "is-error");
        startButtonLabel.textContent = defaultButtonText;
        gsap.set(startButton, {
          display: "inline-flex",
          visibility: "visible",
          opacity: 1,
          y: 0,
        });
        tl.pause();
      };

      startButton.addEventListener("click", playVoiceMessage);

      tl.set(el, {
        visibility: "visible",
        opacity: 1,
      })
      .from(card, {
        opacity: 0,
        y: 28,
        scale: 0.94,
        duration: 0.7,
        ease: "power3.out",
      })
      .from(text, {
        opacity: 0,
        y: 14,
        duration: 0.55,
      }, "-=0.25")
      .call(waitForVoiceStart, null, "+=0.3")
      .to(card, {
        opacity: 0,
        y: -22,
        duration: 0.6,
      }, "+=0.8")
      .set(el, {
        visibility: "hidden",
        opacity: 0,
      });
    },
  };
})();
