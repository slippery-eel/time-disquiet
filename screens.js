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
      { text: "consume content", to: "_next_clarity" }
    ]
  },

  scroll_damn: {
    image: "_time_of_day",
    title: "\"This isn't even fun anymore.\"",
    choices: [
      { text: "i can't stop", to: "_next_clarity" }
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

  scroll_autoplay: {
    image: "_time_of_day",
    title: "\"I don't even remember clicking this.\"",
    choices: [
      { text: "oh well", to: "_next_clarity" }
    ]
  },

  scroll_radical: {
    image: "_time_of_day",
    title: "\"It's us versus them.\"",
    choices: [
      { text: "my opinions are my own", to: "_next_clarity" }
    ]
  },

  scroll_eyes: {
    image: "_time_of_day",
    title: "\"my eyes hurt\"",
    choices: [
      { text: "burn them out", to: "_next_clarity" }
    ]
  },

  scroll_meme_dark_dark: {
    image: "_time_of_day",
    title: "\"CONSUME CONTENT\"",
    choices: [
      { text: "CONSUME CONSUME", to: "_next_clarity" }
    ]
  },

  scroll_scroll: {
    image: "art/dark dark.png",
    title: "\" ... \"",
    choices: [
      { text: "scroll", to: "_next_clarity" }
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
      { text: "ughhhh", to: "_glitch_return" }
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
      { text: "go, it'll be good for you", to: "_glitch_return" },
      { text: "avoid being in public", to: "_glitch_return" }
    ]
  },

  clarity_read: {
    image: "_time_of_day_clarity",
    title: "\"I need to read this book, I've been meaning to for weeks.\"",
    choices: [
      { text: "get up and grab the book from the shelf", to: "_glitch_return" },
      { text: "sink deeper into bed", to: "_glitch_return" }
    ]
  },

  clarity_text: {
    image: "_time_of_day_clarity",
    title: "\"I should text my friend back.\"",
    choices: [
      { text: "do it right now", to: "_glitch_return" },
      { text: "respond later", to: "_glitch_return" }
    ]
  },

  clarity_sleep: {
    image: "_time_of_day_clarity",
    title: "\"I should really go to sleep.\"",
    choices: [
      { text: "put the phone down", to: "_glitch_return" },
      { text: "one last video", to: "_glitch_return" }
    ]
  },

  clarity_realization: {
    image: "_time_of_day_clarity",
    title: "\"Holy shit it's been a while, I need to get up.\"",
    choices: [
      { text: "overcome", to: "_glitch_return" },
      { text: "no", to: "_glitch_return" }
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

  clarity_giveup: {
    image: "_time_of_day_clarity",
    title: "\"I umm... I... I... What am I doing?\"",
    choices: [
      { text: "give up", to: "_glitch_return" },
      { text: "hahahaha", to: "_glitch_return" }
    ]
  },

  clarity_original_thought: {
    image: "_time_of_day_clarity",
    title: "\"When is the last time I had an original thought?\"",
    choices: [
      { text: "what's the point", to: "_glitch_return" },
      { text: "what's the point", to: "_glitch_return" }
    ]
  },

  clarity_stop: {
    image: "_time_of_day_clarity",
    title: "\"NO. I NEED TO STOP.\"",
    choices: [
      { text: "STOP", to: "_glitch_return" }
    ]
  },

};

const PHASE1_SEQUENCE = [
  'scroll_meme',
  'clarity_call',
  'scroll_news',
  'clarity_project',
  'scroll_photos',
  'clarity_gym',
  'scroll_argument',
  'clarity_read',
  'scroll_repeat',
  'clarity_clean',
];

const PHASE2_SEQUENCE = [
  'scroll_meme_dark',
  'clarity_sleep',
  'scroll_damn',
  'clarity_existential',
  'scroll_autoplay',
  'clarity_walk',
];

const PHASE3_SEQUENCE = [
  'scroll_meme_dark_dark',
  'clarity_realization',
  'scroll_eyes',
  'clarity_original_thought',
  'scroll_radical',
  'clarity_giveup',
  'clarity_stop'
];

const PHASE4_SEQUENCE = [
  'scroll_scroll',
];
