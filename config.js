/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "memory"        → Secret-number memory reveal with two countdowns
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Three-image gallery with captions and birthday wish
 *   "confetti"      → Side-cannon confetti animation
 *   "voice"         → Duck the music and play a recorded voice message
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Khánh Trường",
  assetVersion: "20260826-voice-button-3",
  giftUrl: "https://huynhcongtien30303.github.io/Happy-Birthday-KhanhTruong/",
  music: "./music/ILoveYouSo.mp3",      // Place your music in the music/ folder
  musicVolume: 0.6,                      // Music volume: 0 (mute) to 1 (maximum)

  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#8b5cf6",           // Main color (violet)
    accent: "#60a5fa",            // Secondary accent color (sky blue)
    dark: {
      background: "#0f172a",      // Slate 900
      text: "#f1f5f9",            // Slate 100
    },
    light: {
      background: "#fafaf9",      // Stone 50
      text: "#1e293b",            // Slate 800
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "dark",

  // ── Opening Number Game ──────────────────────────────────────
  game: {
    enabled: true,
    secretCode: "WlACAh9d",          // Encoded answer; see decodeGameSecret() in script/main.js
    maxAttempts: 10,
    giftButtonTeaseSeconds: 6,       // Seconds the gift button dodges the mouse; use 0 to disable
  },

  // ── Sections ──────────────────────────────────────────────────
  // Add, remove, duplicate, or reorder as you wish!
  sections: [
    {
      type: "greeting",
      title: "Hi",
      subtitle: "Weoooo... hôm nay sinh nhật của ai nè!!!",
    },
    {
      type: "countdown",
      from: 3,                    // Countdown from this number
    },
    {
      type: "announcement",
      text: "It's your birthday!!",
    },
    {
      type: "chatbox",
      message:
        "Happy Birthdayyy!!! 🎂🎉. Chúc ông tủi mới tràn ngập niềm vui, sức khỏe và gặp thật nhiều may mắn nha! Mong ông sẽ có thêm thật nhiều ngày vui, nhiều chuyện hay ho để nhớ, gặp được những người thú vị và có thật nhiều khoảnh khắc mà sau này nhìn lại vẫn thấy vui vì ngày đó mình đã có mặt",
      buttonText: "Send",
    },
    {
      type: "ideas",
      lines: [
        "Ban đầu tui định làm 1 cái gì đó đơn giản thoi",
        "Nhưng tui nghĩ lại",
        "Tui muốn làm một điều gì đó thật <strong>đặc biệt</strong>",
        "Vì...",
        "Ông là người <span>đặc biệt</span>",
      ],
      bigLetters: "SO",
    },
    {
      type: "memory",
      question: "Ông có biết dãy số ở trò chơi đầu tiên có ý nghĩa gì khum???",
      prompt: "Đoán thử đi kkk",
      hint: "Gợi ý xíu nè: đó là một mốc thời gian",
      revealTitle: "Đoán ra chưa ?",
      revealText: "Đó là một ngày mà từ đó câu chuyện này bắt đầu.",
      countdownFrom: 5,
    },
    {
      type: "stars",
      count: 40,
    },
    {
      type: "balloons",
      count: 25,
    },
    {
      type: "profile",
      images: [
        { src: "img/KhanhTruong_1.jpg", alt: "", caption: "Máy tập đùi sau chứ hong phải máy tập lưng dưới ông êiii" },
        { src: "img/KhanhTruong_2.jpg", alt: "", caption: "Đi ăn bòa, bận áo đỏ, khen áo đẹp cái thấy bận quài kkk. Ê nói chứ đẹp thiệt hợp dáng" },
        { src: "img/KhanhTruong_3.jpg", alt: "", caption: "Xin bài tập người ta xong rồi ngủ" },
      ],
      wishTitle: "Happy Birthday!",
      wishText: "Luôn vui vẻ, ít nhậu lại và khum được hút thuốc. Dễ thường thì phải cười nhiều :)",
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 120,
      duration: 6,
    },
    {
      type: "voice",
      text: "Có cái này tui muốn nói…",
      buttonText: "Phát lời nhắn",
      audio: "music/HPBD_KTruong.mp3", // Thêm file ghi âm của bạn vào đường dẫn này
      duckVolume: 0.12,                   // Âm lượng nhạc nền trong lúc phát lời thoại
    },
    {
      type: "closing",
      text: "Oke, vậy là hết rồi. Seo món quà này oke hong ? Hãy ra tín hiệu nếu ông thích nó hehe !!!",
      replayText: "Or click, if you want to watch it again.",
    },
  ],
};
