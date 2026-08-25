(function () {
  window.Components = window.Components || {};

  window.Components.profile = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-profile";

      const gallery = document.createElement("div");
      gallery.className = "profile-gallery";
      gallery.setAttribute("role", "region");
      gallery.setAttribute("aria-label", "Trình chiếu ảnh");

      const images = Array.from({ length: 3 }, (_, index) => {
        return (section.images && section.images[index]) || {};
      });

      images.forEach((item, index) => {
        const figure = document.createElement("figure");
        const media = document.createElement("div");
        const caption = document.createElement("figcaption");

        figure.className = "profile-card";
        figure.setAttribute("aria-label", `Ảnh ${index + 1} / ${images.length}`);
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
      const captionWords = [...el.querySelectorAll(".profile-caption-word")];
      const imageHoldDuration = 4;
      const transitionDuration = 1;
      const galleryRect = gallery.getBoundingClientRect();
      const focusedWidth = Math.min(galleryRect.width * 0.88, 410);
      const slideDistance = Math.min(galleryRect.width * 0.22, 150);
      const focusStates = cards.map((card) => {
        const cardRect = card.getBoundingClientRect();

        return {
          x: galleryRect.left + galleryRect.width / 2
            - (cardRect.left + cardRect.width / 2),
          y: galleryRect.top + galleryRect.height / 2
            - (cardRect.top + cardRect.height / 2),
          scale: Math.min(3.2, focusedWidth / Math.max(cardRect.width, 1)),
        };
      });

      tl.set(wish, { opacity: 0 })
        .set(cards, {
          x: (index) => focusStates[index].x + slideDistance,
          y: (index) => focusStates[index].y,
          scale: (index) => focusStates[index].scale * 0.94,
          rotation: 2,
          opacity: 0,
          zIndex: 1,
        })
        .set(captionWords, { opacity: 0, y: 9 });

      cards.forEach((card, index) => {
        const media = card.querySelector(".profile-media");
        const words = card.querySelectorAll(".profile-caption-word");
        const transitionLabel = `profileSlide${index}`;

        tl.addLabel(transitionLabel);

        if (index === 0) {
          tl.set(card, {
            x: focusStates[index].x,
            rotation: 0,
            zIndex: 3,
          }, transitionLabel)
            .to(card, {
              opacity: 1,
              scale: focusStates[index].scale,
              duration: transitionDuration,
              ease: "power3.out",
            }, transitionLabel);
        } else {
          const previousCard = cards[index - 1];

          tl.set(card, { zIndex: 3 }, transitionLabel)
            .to(previousCard, {
              x: focusStates[index - 1].x - slideDistance,
              scale: focusStates[index - 1].scale * 0.92,
              rotation: -2,
              opacity: 0,
              duration: transitionDuration,
              ease: "power2.inOut",
            }, transitionLabel)
            .to(card, {
              x: focusStates[index].x,
              y: focusStates[index].y,
              scale: focusStates[index].scale,
              rotation: 0,
              opacity: 1,
              duration: transitionDuration,
              ease: "power3.out",
            }, `${transitionLabel}+=0.14`)
            .set(previousCard, { zIndex: 1 }, `${transitionLabel}+=${transitionDuration}`);
        }

        tl.fromTo(media,
          { scale: 1.1, filter: "blur(5px)" },
          { scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power2.out" },
          transitionLabel
        );

        if (words.length) {
          tl.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.28,
            stagger: Math.min(0.1, 0.8 / words.length),
            ease: "power2.out",
          }, `${transitionLabel}+=0.25`);
        }

        tl.to(card, { duration: imageHoldDuration });
      });

      // Expand the slideshow back into a three-photo gallery for the ending.
      tl.to(cards, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.15,
        stagger: 0.12,
        ease: "power3.out",
      })
      .set(cards, { zIndex: 1 })
      .set(wish, { opacity: 1 }, "+=0.35")
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
