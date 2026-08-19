(function () {
  window.Components = window.Components || {};

  window.Components.profile = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-profile";

      const gallery = document.createElement("div");
      gallery.className = "profile-gallery";

      const images = Array.from({ length: 3 }, (_, index) => {
        return (section.images && section.images[index]) || {};
      });

      images.forEach((item, index) => {
        const figure = document.createElement("figure");
        const media = document.createElement("div");
        const caption = document.createElement("figcaption");

        figure.className = "profile-card";
        media.className = "profile-media";
        caption.className = "profile-caption";

        if (item.src) {
          const image = document.createElement("img");
          image.className = "profile-picture";
          image.src = item.src;
          image.alt = item.alt || item.caption || `Ảnh ${index + 1}`;
          image.loading = "eager";
          image.decoding = "async";
          media.appendChild(image);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className = "profile-placeholder";
          placeholder.setAttribute("aria-hidden", "true");
          placeholder.innerHTML = `<span>＋</span>`;
          media.appendChild(placeholder);
        }

        const captionValue = String(item.caption || "").trim();
        if (captionValue) {
          const captionText = document.createElement("span");
          const words = captionValue.split(/\s+/);

          caption.classList.add("has-caption");
          caption.setAttribute("aria-label", captionValue);
          captionText.className = "profile-caption-text";

          words.forEach((word) => {
            const wordSpan = document.createElement("span");
            wordSpan.className = "profile-caption-word";
            wordSpan.setAttribute("aria-hidden", "true");
            wordSpan.textContent = word;
            captionText.appendChild(wordSpan);
          });

          caption.appendChild(captionText);
        } else {
          caption.classList.add("is-empty");
          caption.innerHTML = "&nbsp;";
        }

        figure.append(media, caption);
        gallery.appendChild(figure);
      });

      const wish = document.createElement("div");
      const hbd = document.createElement("h3");
      const wishText = document.createElement("h5");

      wish.className = "wish";
      hbd.className = "wish-hbd";
      wishText.className = "wish-text";
      hbd.textContent = section.wishTitle || "Happy Birthday!";
      wishText.textContent = section.wishText || "";
      wish.append(hbd, wishText);
      div.append(gallery, wish);

      // Split wish title into spans for stagger animation
      hbd.innerHTML = hbd.textContent
        .split("")
        .map((ch) => `<span>${ch}</span>`)
        .join("");

      container.appendChild(div);
      return div;
    },

    animate(tl, el) {
      const gallery = el.querySelector(".profile-gallery");
      const cards = [...el.querySelectorAll(".profile-card")];
      const wish = el.querySelector(".wish");
      const galleryRect = gallery.getBoundingClientRect();
      const focusedWidth = Math.min(galleryRect.width * 0.56, 380);
      const imageHoldDuration = 7.6;

      const focusStates = cards.map((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const galleryCenterX = galleryRect.left + galleryRect.width / 2;
        const galleryCenterY = galleryRect.top + galleryRect.height / 2;

        return {
          x: galleryCenterX - cardCenterX,
          y: galleryCenterY - cardCenterY,
          scale: Math.min(
            1.9,
            Math.max(1.2, focusedWidth / Math.max(cardRect.width, 1))
          ),
        };
      });

      // Each photo gets its own scene. Together these scenes last about 30 seconds.
      tl.set(wish, { opacity: 0 })
        .set(cards, {
          x: (index) => focusStates[index].x,
          y: (index) => focusStates[index].y,
          scale: (index) => focusStates[index].scale,
          rotation: 0,
          opacity: 0,
          zIndex: 1,
        });

      cards.forEach((card) => {
        const media = card.querySelector(".profile-media");
        const captionWords = card.querySelectorAll(".profile-caption-word");

        tl.set(card, { zIndex: 4 })
          .to(card, {
            opacity: 1, duration: 0.8, ease: "power2.out",
          })
          .fromTo(media,
            { scale: 1.08, filter: "blur(4px)" },
            { scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" },
            "<"
          );

        if (captionWords.length) {
          tl.fromTo(captionWords,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              stagger: Math.min(0.12, 1 / captionWords.length),
              ease: "power2.out",
            },
            "-=0.15"
          );
        }

        tl.to(card, { duration: imageHoldDuration })
          .to(card, {
            opacity: 0, duration: 0.65, ease: "power2.in",
          })
          .set(card, { zIndex: 1 });
      });

      // Bring all three photos back into the final gallery before the wish appears.
      tl.to(cards, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
      })
      .set(cards, { zIndex: 1 })
      .set(wish, { opacity: 1 }, "+=0.5")
      // Wish title letters stagger in
      .from(el.querySelectorAll(".wish-hbd span"), {
        duration: 0.5, opacity: 0, y: -30,
        ease: "back.out(1.7)", stagger: 0.06,
      })
      // Color each letter
      .to(el.querySelectorAll(".wish-hbd span"), {
        color: "var(--primary)", duration: 0.4,
        stagger: 0.04, ease: "none",
      }, "-=0.3")
      // Wish text fades in
      .from(el.querySelector(".wish-text"), {
        duration: 0.5, opacity: 0, y: 10,
      }, "-=0.2");
    },

    exit(tl, el) {
      tl.to(el, {
        duration: 0.6, opacity: 0, y: 20,
      });
    },
  };
})();
