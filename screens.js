const SCREENS = {

  // ── Scrolling moments ────────────────────────────────────────────────────────

  scroll_meme: {
    image: "_time_of_day",
    title: "\"Funny meme haha\"",
    choices: [
      { text: "scroll", to: "_next_clarity" }
    ]
  },

  scroll_meme_dark: {
    image: "_time_of_day",
    title: "\"Funny meme haha\"",
    choices: [
      { text: "CONSUME CONTENT", to: "_next_clarity" }
    ]
  },

  scroll_damn: {
    image: "_time_of_day",
    title: "\"This isn't even fun anymore.\"",
    choices: [
      { text: "you can't stop", to: "_next_clarity" }
    ]
  },

  scroll_news: {
    image: "_time_of_day",
    title: "\"The news is so depressing.\"",
    choices: [
      { text: "keep doomscrolling", to: "_next_clarity" }
    ]
  },

  scroll_photos: {
    image: "_time_of_day",
    title: "\"This girl is so hot.\"",
    choices: [
      { text: "feel bad", to: "_next_clarity" }
    ]
  },

  scroll_repeat: {
    image: "_time_of_day",
    title: "\"I've seen this one already.\"",
    choices: [
      { text: "watch again anyway", to: "_next_clarity" }
    ]
  },

  scroll_argument: {
    image: "_time_of_day",
    title: "\"Holy shit these people are so dumb\"",
    choices: [
      { text: "type an angry reply", to: "_next_clarity" }
    ]
  },

  // ── Clarity moments ─────────────────────────────────────────────────────────

  clarity_call: {
    image: "_time_of_day_clarity",
    title: "\"Damn, I haven't called my mom in three weeks.\"",
    choices: [
      { text: "call her right now", to: "_glitch_return" },
      { text: "she's probably busy", to: "_glitch_return" }
    ]
  },

  clarity_project: {
    image: "_time_of_day_clarity",
    title: "\"Shit, I think I have an assignment due tomorrow.\"",
    choices: [
      { text: "open the class notes", to: "_glitch_return" },
      { text: "first thing in the morning", to: "_glitch_return" }
    ]
  },

  clarity_clean: {
    image: "_time_of_day_clarity",
    title: "\"I was really supposed to clean my apartment today.\"",
    choices: [
      { text: "get started now", to: "_glitch_return" },
      { text: "uhhhh", to: "_glitch_return" }
    ]
  },

  clarity_gym: {
    image: "_time_of_day_clarity",
    title: "\"I really need to go to the gym, goddam.\"",
    choices: [
      { text: "go now, I still could", to: "_glitch_return" },
      { text: "fresh start tomorrow", to: "_glitch_return" }
    ]
  },

  clarity_walk: {
    image: "_time_of_day_clarity",
    title: "\"I should at least go for a walk today.\"",
    choices: [
      { text: "go, it'll be good for me", to: "_glitch_return" },
      { text: "I don't want to be in public right now", to: "_glitch_return" }
    ]
  },

  clarity_read: {
    image: "_time_of_day_clarity",
    title: "\"I need to read this book, I've been meaning to for weeks.\"",
    choices: [
      { text: "get up and grab the book from the shelf", to: "_glitch_return" },
      { text: "I don't really want to get up right now", to: "_glitch_return" }
    ]
  },

  clarity_text: {
    image: "_time_of_day_clarity",
    title: "\"I should text my friend back.\"",
    choices: [
      { text: "do it right now", to: "_glitch_return" },
      { text: "i'll respond later", to: "_glitch_return" }
    ]
  },

  clarity_sleep: {
    image: "_time_of_day_clarity",
    title: "\"I should really go to sleep.\"",
    choices: [
      { text: "put the phone down", to: "_glitch_return" },
      { text: "one last scroll", to: "_glitch_return" }
    ]
  },

  clarity_existential: {
    image: "_time_of_day_clarity",
    title: "\"What am I actually doing with my life?\"",
    choices: [
      { text: "contemplate for a while", to: "_glitch_return" },
      { text: "don't think about it", to: "_glitch_return" }
    ]
  },

};

const SCROLL_POOL = [
  { id: "scroll_meme",   weight: 3 },
  { id: "scroll_meme_dark",   weight: 1 },
  { id: "scroll_damn",   weight: 1 },
  { id: "scroll_news",   weight: 1 },
  { id: "scroll_photos", weight: 1 },
  { id: "scroll_repeat", weight: 1 },
  { id: "scroll_argument", weight: 1 },
];

const CLARITY_POOL = [
  { id: "clarity_call",    weight: 1 },
  { id: "clarity_project", weight: 1 },
  { id: "clarity_clean",   weight: 1 },
  { id: "clarity_gym",     weight: 1 },
  { id: "clarity_walk",     weight: 1 },
  { id: "clarity_read",    weight: 1 },
  { id: "clarity_text",    weight: 1 },
  { id: "clarity_sleep",   weight: 1 },
  { id: "clarity_existential", weight: 1 },
];
