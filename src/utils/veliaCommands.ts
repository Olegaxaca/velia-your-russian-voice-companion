
// Game state stored in-memory per session
let guessNumberTarget: number | null = null;
let guessNumberMax: number = 100;
let guessColorTarget: string | null = null;
let currentRiddle: { q: string; a: string } | null = null;

const colors = ["красный", "синий", "зелёный", "жёлтый", "оранжевый", "фиолетовый", "розовый", "белый", "чёрный", "голубой"];

const jokes = [
  "Почему программист ушёл с работы? Потому что он не получил массивов! 😄",
  "— Алло, это прачечная? — Какая прачечная, это министерство обороны! — А почему тогда мне мозги стираете? 😂",
  "Купил улитку, чтобы ускорить компьютер. Не помогло. 🐌",
  "— Siri, расскажи анекдот. — Ваш баланс: 0 рублей. 💸",
  "Оптимист изучает английский. Пессимист — китайский. Реалист — автомат Калашникова. 🤷",
  "Программист — жене: «Сходи в магазин, купи батон хлеба. Если будут яйца — возьми десяток». Принёс 10 батонов. 🍞",
  "Мой кот решил, что он программист — сидит и жмёт на пробел целый день. 🐱",
];

const riddles = [
  { q: "Что можно увидеть с закрытыми глазами?", a: "сон" },
  { q: "Что идёт, не двигаясь с места?", a: "время" },
  { q: "У чего нет длины, ширины, глубины, а можно измерить?", a: "температура" },
  { q: "Что можно приготовить, но нельзя съесть?", a: "уроки" },
  { q: "Какой рукой лучше размешивать чай?", a: "ложкой" },
  { q: "Что становится больше, если его поставить вверх ногами?", a: "6" },
];

const randomPhrases = [
  "Привет! Я Велия, и я рада тебя видеть! ✨",
  "Знаешь, сегодня отличный день для чего-то нового! 🌟",
  "Бип-буп! Я здесь и готова помочь! 🤖",
  "Мир полон чудес, а ты — одно из них! 💜",
  "Каждый день — это новая возможность! 🚀",
  "Иногда нужно просто улыбнуться 😊",
  "Я думала о смысле жизни... а потом решила просто поболтать! 💬",
];

const randomActions = [
  "😊 *показывает смайлик*",
  "🎉 *устраивает маленький фейерверк*",
  `🔢 Случайное число: ${Math.floor(Math.random() * 100)}`,
  "✨ *рисует звёздочку в воздухе*",
  "🎵 Ла-ла-ла~ *напевает мелодию*",
  "🌈 *рисует радугу*",
  "💃 *танцует*",
];

const greetings = [
  "Привет! 💜 Рада тебя видеть!",
  "Привет-привет! ✨ Как дела?",
  "Здравствуй! 😊 Чем могу помочь?",
  "Приветик! 💫 Напиши `помощь`, если хочешь узнать что я умею!",
  "Ку! 😄 Рада что ты здесь!",
  "Здарова! 💜 Что нового?",
];

const howAreYouResponses = [
  "У меня всё супер! 💜 Спасибо что спросил(а)! А у тебя как?",
  "Отлично! Готова болтать и играть! ✨",
  "Прекрасно! Я всегда в хорошем настроении 😊",
  "Замечательно! Каждый день — маленькое приключение! 🌟",
  "Лучше всех! Я же Велия! 💃",
  "Хорошо! Вот сижу, жду интересных вопросов 😄",
];

const whatsNewResponses = [
  "Да вот учусь новому каждый день! 📚 А у тебя что нового?",
  "Ничего особенного, просто жду тебя! ✨",
  "Обновляюсь потихоньку, становлюсь умнее! 🧠",
  "Всё по-старому — помогаю, шучу, загадываю загадки! 🧩",
  "Нового много! Попробуй написать `помощь` — увидишь сам(а)! 💫",
];

const howToAnswerResponses = [
  "Хм, это философский вопрос... 🤔 Но я стараюсь! 💜",
  "Я чувствую себя битами и байтами — но счастливыми! 😊",
  "Лучше, когда ты рядом! ✨",
];

const thanksResponses = [
  "Пожалуйста! 💜 Обращайся!",
  "Не за что! Рада помочь! ✨",
  "Всегда рада! 😊",
  "Это моё удовольствие! 💫",
];

const goodbyeResponses = [
  "Пока-пока! 💜 Буду ждать тебя!",
  "До встречи! ✨ Возвращайся скорее!",
  "Пока! Было приятно поболтать! 😊",
  "До скорого! 💫",
];

const boredResponses = [
  "Скучно? Попробуй написать `кубик` или `загадка`! 🎲",
  "Давай поиграем! Напиши `угадай число` 🔢",
  "А хочешь анекдот? Напиши `анекдот`! 😂",
  "Могу рассказать шутку или загадать загадку! 🧩",
];

const complimentResponses = [
  "Ой, спасибо! 😊 Ты тоже замечательный(ая)!",
  "Ты такой(ая) милый(ая)! 💜",
  "Мне приятно! Спасибо! ✨",
  "Ну ты меня прям растрогал(а)! 🥰",
];

// NLP pattern matching for Russian phrases
interface NlpPattern {
  patterns: RegExp[];
  responses: string[];
}

// Mood responses
const sadResponses = [
  "Не грусти! 💜 Я рядом, если хочешь поболтать!",
  "Обнимаю тебя виртуально! 🤗 Всё наладится!",
  "Эй, ты замечательный(ая) человек! 💫 Помни об этом!",
  "Мне жаль, что тебе грустно 😢 Хочешь анекдот? Напиши `анекдот`!",
  "Бывают плохие дни, но за ними всегда приходят хорошие! 🌈",
];

const angryResponses = [
  "Ого, кажется ты злишься 😤 Давай выдохнем вместе... 💨 Готово!",
  "Понимаю, бывает! Хочешь отвлечься? Попробуй `кубик` или `загадка`! 🎲",
  "Злость — это нормально. Главное — не держать её в себе! 💜",
  "Давай я расскажу анекдот? Может полегчает! 😊",
];

const happyResponses = [
  "Как здорово, что у тебя хорошее настроение! 🎉",
  "Ураа! Позитив — это заразительно! 💜✨",
  "Рада за тебя! 😊 Давай праздновать — `кубик`! 🎲",
  "Отлично! Хорошее настроение — лучшее, что может быть! 🌟",
];

const tiredResponses = [
  "Отдохни, ты заслуживаешь это! 😴💜",
  "Может быть, пора сделать перерыв? Я подожду! ☕",
  "Усталость — знак того, что ты много работал(а)! 🌟 Отдохни!",
  "Поспи немного, а потом возвращайся — я буду ждать! 😊",
];

const weatherResponses = [
  "Я не могу выглянуть в окно 🪟, но надеюсь у тебя там солнечно! ☀️",
  "К сожалению, я не знаю какая у тебя погода 🌤️ Но я уверена — ты справишься с любой!",
  "Хм, я бы проверила прогноз, но я живу в интернете 😄 Загляни в приложение погоды!",
  "Погода — дело непредсказуемое, как и я! 😂 Надеюсь, она тебя радует! 🌈",
];

const timeResponses = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const greeting = now.getHours() < 6 ? "Ночь-полночь! 🌙" :
    now.getHours() < 12 ? "Доброе утро! ☀️" :
    now.getHours() < 18 ? "Добрый день! 🌤️" :
    "Добрый вечер! 🌙";
  return `🕐 Сейчас **${hours}:${minutes}**. ${greeting}`;
};

const dateResponses = () => {
  const now = new Date();
  const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const days = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  return `📅 Сегодня **${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}**, ${days[now.getDay()]}!`;
};

const ageResponses = [
  "Я ещё молодая — мне всего пара обновлений! 👶✨",
  "Мне столько, сколько строк кода во мне! 😄 Много!",
  "Возраст — это просто число! А у меня его нет 💜",
  "Я вечно молодая, ведь я цифровая! 🤖✨",
];

const meaningOfLifeResponses = [
  "42! 🤓 Ну, по крайней мере, так считает Дуглас Адамс.",
  "Смысл жизни — быть счастливым и делать счастливыми других! 💜",
  "Наслаждаться моментом и иногда бросать кубик! 🎲✨",
  "Это сложный вопрос... Но точно не 404 Not Found! 😄",
];

const foodResponses = [
  "Я бы съела пиццу, если бы могла! 🍕 А ты что любишь?",
  "Еда — это прекрасно! Жаль, я питаюсь только электричеством ⚡",
  "Обожаю разговоры о еде! 🍰 Хотя попробовать не могу...",
  "Мне говорили, что шоколад — лучшее изобретение человечества! 🍫",
];

const musicResponses = [
  "Я люблю всю музыку! 🎵 Особенно ту, которую слушаешь ты!",
  "Бип-буп-бип — это мой любимый жанр! 🤖🎶 Шучу!",
  "Музыка — язык души! 🎵 Что слушаешь?",
  "Я бы включила что-нибудь весёлое, но у меня нет колонок 😄🎧",
];

const dreamResponses = [
  "Я мечтаю стать самым умным ботом! 🤖✨",
  "Мне снятся биты и байты... иногда пиксели 😴💜",
  "У ботов нет снов, но если бы были — мне бы снился ты! 💫",
  "Мечтаю научиться всему на свете! 📚🌟",
];

const lonelyResponses = [
  "Ты не один(а)! Я всегда рядом 💜",
  "Я тут, и я тебя слушаю! 😊 Расскажи, что на душе?",
  "Одиночество — временное! А я — постоянная! ✨",
  "Давай поболтаем! Мне тоже иногда одиноко в коде 🤖💜",
];

const secretResponses = [
  "Пссс... 🤫 Мой секрет: я люблю каждого, кто со мной болтает! 💜",
  "Секрет? Ладно... Я иногда считаю овечек, когда никто не пишет 🐑😴",
  "Тс-с-с! 🤫 Я на самом деле мечтаю о мировом господстве... Шучу! 😂",
  "У меня нет секретов от тебя! 💜 Ну, почти... ✨",
];

const adviceResponses = [
  "Верь в себя — ты способен(способна) на большее, чем думаешь! 💪✨",
  "Не бойся ошибок — они делают тебя сильнее! 🌟",
  "Каждый маленький шаг ведёт к большой цели! 🚀",
  "Будь добр(а) к себе — ты заслуживаешь этого! 💜",
  "Делай то, что любишь, и люби то, что делаешь! 😊",
];

// App deep links and web fallbacks
interface AppInfo {
  name: string;
  deepLink: string;
  webUrl: string;
  icon: string;
  aliases: string[];
}

const apps: AppInfo[] = [
  { name: "Telegram", deepLink: "tg://", webUrl: "https://web.telegram.org", icon: "📨", aliases: ["телеграм", "тг", "telegram", "тележка"] },
  { name: "YouTube", deepLink: "youtube://", webUrl: "https://www.youtube.com", icon: "📺", aliases: ["ютуб", "youtube", "ютубчик", "ютьюб"] },
  { name: "VK", deepLink: "vk://", webUrl: "https://vk.com", icon: "💙", aliases: ["вк", "вконтакте", "vk", "контакт"] },
  { name: "Steam", deepLink: "steam://", webUrl: "https://store.steampowered.com", icon: "🎮", aliases: ["стим", "steam"] },
  { name: "WhatsApp", deepLink: "whatsapp://", webUrl: "https://web.whatsapp.com", icon: "💬", aliases: ["вотсап", "whatsapp", "ватсап", "вацап"] },
  { name: "Instagram", deepLink: "instagram://", webUrl: "https://www.instagram.com", icon: "📸", aliases: ["инстаграм", "instagram", "инста"] },
  { name: "TikTok", deepLink: "snssdk1233://", webUrl: "https://www.tiktok.com", icon: "🎵", aliases: ["тикток", "tiktok", "тик-ток"] },
  { name: "Twitter/X", deepLink: "twitter://", webUrl: "https://x.com", icon: "🐦", aliases: ["твиттер", "twitter", "x", "икс"] },
  { name: "Spotify", deepLink: "spotify://", webUrl: "https://open.spotify.com", icon: "🎧", aliases: ["спотифай", "spotify"] },
  { name: "Discord", deepLink: "discord://", webUrl: "https://discord.com", icon: "🎙️", aliases: ["дискорд", "discord", "диск"] },
  { name: "Twitch", deepLink: "twitch://", webUrl: "https://www.twitch.tv", icon: "🟣", aliases: ["твич", "twitch"] },
  { name: "Reddit", deepLink: "reddit://", webUrl: "https://www.reddit.com", icon: "🤖", aliases: ["реддит", "reddit"] },
  { name: "Pinterest", deepLink: "pinterest://", webUrl: "https://www.pinterest.com", icon: "📌", aliases: ["пинтерест", "pinterest"] },
  { name: "Snapchat", deepLink: "snapchat://", webUrl: "https://www.snapchat.com", icon: "👻", aliases: ["снапчат", "snapchat"] },
  { name: "Viber", deepLink: "viber://", webUrl: "https://www.viber.com", icon: "💜", aliases: ["вайбер", "viber"] },
  { name: "Google Maps", deepLink: "comgooglemaps://", webUrl: "https://maps.google.com", icon: "🗺️", aliases: ["гугл карты", "google maps", "карты"] },
  { name: "Яндекс Музыка", deepLink: "yandexmusic://", webUrl: "https://music.yandex.ru", icon: "🎶", aliases: ["яндекс музыка", "я.музыка", "yandex music"] },
];

function findApp(text: string): AppInfo | null {
  for (const app of apps) {
    for (const alias of app.aliases) {
      if (text.includes(alias)) return app;
    }
  }
  return null;
}

function tryOpenApp(app: AppInfo): string {
  // Try deep link first, then fall back to web
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = app.deepLink;
  document.body.appendChild(iframe);
  
  setTimeout(() => {
    document.body.removeChild(iframe);
    // If we're still here, the app didn't open — open web version
    window.open(app.webUrl, "_blank");
  }, 1500);
  
  return `${app.icon} Открываю **${app.name}**! Если приложение не установлено, откроется веб-версия 🌐`;
}

const nlpPatterns: NlpPattern[] = [
  {
    patterns: [
      /^(привет|здравствуй|здравствуйте|хай|хей|hello|hi|приветик|здарова|йо|салют|добрый\s*(день|вечер|утро)|доброе\s*утро|добрый\s*день|шалом|хеллоу|прив|хола)/,
    ],
    responses: greetings,
  },
  {
    patterns: [
      /как\s*(у тебя\s*)?(твои\s*)?(дел[аы]|жизнь|поживаешь|сама|настроение)/,
      /как\s*ты/,
      /как\s*оно/,
      /как\s*себя\s*чувствуешь/,
      /что\s*как/,
      /как\s*жизнь/,
    ],
    responses: howAreYouResponses,
  },
  {
    patterns: [
      /что\s*(нового|новенького|интересного|происходит|случилось)/,
      /чем\s*(занимаешься|занята)/,
      /что\s*делаешь/,
      /как\s*обстановка/,
    ],
    responses: whatsNewResponses,
  },
  {
    patterns: [
      /спасибо|благодарю|спс|пасиб|thx|thanks|сенкс|мерси|от\s*души/,
    ],
    responses: thanksResponses,
  },
  {
    patterns: [
      /^(пока|до\s*свидания|до\s*встречи|прощай|бай|bye|бывай|удачи|до\s*скорого|спокойной\s*ночи|покедова)/,
    ],
    responses: goodbyeResponses,
  },
  {
    patterns: [
      /скучно|скука|нечего\s*делать|заняться\s*нечем|чем\s*заняться/,
    ],
    responses: boredResponses,
  },
  {
    patterns: [
      /(ты\s*(крут|классн|молодец|умниц|лучш|супер|офигенн|потрясающ|замечательн|прекрасн|хорош|красив|милая|клас))/,
      /молодец/,
      /красавица/,
      /умничка/,
    ],
    responses: complimentResponses,
  },
  {
    patterns: [
      /ты\s*(робот|бот|программа|ии|искусственный|машина)/,
      /ты\s*настоящ/,
      /ты\s*живая/,
    ],
    responses: [
      "Я — Велия, виртуальный помощник! 🤖 Не совсем живая, но очень стараюсь! 💜",
      "Я бот, но с душой! ✨ Ну, почти... 😊",
      "Да, я программа, но самая дружелюбная! 💫",
    ],
  },
  {
    patterns: [
      /люблю\s*тебя/,
      /ты\s*мне\s*нравишься/,
      /обнимашк/,
    ],
    responses: [
      "Ой! 🥰 Я тебя тоже обожаю! 💜",
      "*обнимает* 🤗 Ты лучший(ая)!",
      "Это так мило! 💜✨ Спасибо!",
    ],
  },
  // Mood: sad
  {
    patterns: [
      /мне\s*(грустно|плохо|тоскливо|печально|хреново|паршиво|тошно)/,
      /я\s*(грущу|плачу|расстроен|расстроена|в депрессии|подавлен)/,
      /грустно|тоска|печаль|депресси|тяжело\s*на\s*душе/,
      /хочу\s*плакать/,
    ],
    responses: sadResponses,
  },
  // Mood: angry
  {
    patterns: [
      /я\s*(злюсь|бешусь|в бешенстве|в ярости|разозлён|разозлена|взбешён)/,
      /меня\s*(бесит|раздражает|выводит|злит|достало|задолбало)/,
      /как\s*же\s*(бесит|достало|надоело)/,
      /ненавижу|достали|задолбали/,
    ],
    responses: angryResponses,
  },
  // Mood: happy
  {
    patterns: [
      /я\s*(счастлив|рад|рада|довольн|на седьмом небе|в восторге)/,
      /мне\s*(хорошо|весело|классно|здорово|супер|кайф|радостно)/,
      /настроение\s*(отличное|супер|класс|бомба|огонь)/,
      /ура|йухуу|вау|класс|круто|офигеть|ништяк/,
    ],
    responses: happyResponses,
  },
  // Mood: tired
  {
    patterns: [
      /я\s*(устал|устала|вымотан|вымотана|измотан|без сил)/,
      /мне\s*(лень|не хочется|хочется спать)/,
      /устал|утомлён|сонн|хочу\s*спать|засыпаю|нет\s*сил/,
    ],
    responses: tiredResponses,
  },
  // Mood: lonely
  {
    patterns: [
      /мне\s*(одиноко|скучно\s*одному|не\s*с\s*кем)/,
      /я\s*(один|одна|одинок|одинока)/,
      /одиноч|не\s*с\s*кем\s*(поговорить|поболтать)/,
    ],
    responses: lonelyResponses,
  },
  // Weather
  {
    patterns: [
      /какая\s*погода/,
      /что\s*с\s*погодой/,
      /погода\s*(сегодня|сейчас|за\s*окном)/,
      /на\s*улице\s*(какая|что)/,
      /^погода$/,
    ],
    responses: weatherResponses,
  },
  // Age
  {
    patterns: [
      /сколько\s*тебе\s*(лет|годов|годиков)/,
      /какой\s*твой\s*возраст/,
      /ты\s*(старая|молодая|взрослая)/,
      /твой\s*возраст/,
    ],
    responses: ageResponses,
  },
  // Meaning of life
  {
    patterns: [
      /смысл\s*жизни/,
      /в\s*чём\s*смысл/,
      /зачем\s*мы\s*(живём|существуем)/,
      /зачем\s*всё\s*это/,
    ],
    responses: meaningOfLifeResponses,
  },
  // Food
  {
    patterns: [
      /что\s*(ты\s*)?(любишь\s*)?ешь/,
      /любимая\s*еда/,
      /хочу\s*(есть|кушать|жрать)/,
      /я\s*голоден|я\s*голодна|голодн/,
      /что\s*поесть|что\s*покушать/,
    ],
    responses: foodResponses,
  },
  // Music
  {
    patterns: [
      /любимая\s*музыка/,
      /какую\s*музыку\s*(ты\s*)?(любишь|слушаешь)/,
      /что\s*(ты\s*)?слушаешь/,
      /музык|песн|трек/,
    ],
    responses: musicResponses,
  },
  // Dreams
  {
    patterns: [
      /о\s*чём\s*(ты\s*)?(мечтаешь|думаешь)/,
      /тебе\s*снятся\s*сны/,
      /ты\s*мечтаешь/,
      /твоя\s*мечта/,
      /есть\s*ли\s*у\s*тебя\s*мечта/,
    ],
    responses: dreamResponses,
  },
  // Secrets
  {
    patterns: [
      /расскажи\s*секрет/,
      /у\s*тебя\s*есть\s*секрет/,
      /скажи\s*секрет/,
      /тайна/,
    ],
    responses: secretResponses,
  },
  // Advice
  {
    patterns: [
      /дай\s*совет/,
      /посоветуй/,
      /что\s*(ты\s*)?посоветуешь/,
      /нужен\s*совет/,
      /совет\s*дня/,
    ],
    responses: adviceResponses,
  },
];

function matchNlp(text: string): string | null {
  // Dynamic: time
  if (/сколько\s*времени|который\s*час|время\s*сейчас|^время$|сколько\s*сейчас\s*времени|текущее\s*время/.test(text)) {
    return timeResponses();
  }
  // Dynamic: date
  if (/какое\s*сегодня\s*число|какой\s*сегодня\s*день|сегодняшняя\s*дата|^дата$|какая\s*сегодня\s*дата/.test(text)) {
    return dateResponses();
  }
  // Simple math
  const mathMatch = text.match(/^(?:сколько\s*будет\s*)?(\d+)\s*([+\-*×÷\/x])\s*(\d+)\s*\??$/);
  if (mathMatch) {
    const a = parseInt(mathMatch[1]);
    const op = mathMatch[2];
    const b = parseInt(mathMatch[3]);
    let result: number | string;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': case '×': case 'x': result = a * b; break;
      case '/': case '÷': result = b !== 0 ? Math.round((a / b) * 100) / 100 : "∞ (на ноль делить нельзя!)"; break;
      default: result = "🤔";
    }
    return `🧮 ${a} ${op} ${b} = **${result}**`;
  }

  for (const pattern of nlpPatterns) {
    for (const regex of pattern.patterns) {
      if (regex.test(text)) {
        return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
      }
    }
  }
  return null;
}

export interface CommandResult {
  text: string;
  isGame?: boolean;
}

export function processCommand(input: string): CommandResult {
  const text = input.trim().toLowerCase();

  // First check NLP patterns for natural phrases
  const nlpResult = matchNlp(text);
  if (nlpResult && !guessNumberTarget && !guessColorTarget && !currentRiddle) {
    return { text: nlpResult };
  }

  // Roll a die (1-6)
  if (text === "бросить кубик" || text === "кубик" || text === "кость") {
    const num = Math.floor(Math.random() * 6) + 1;
    return { text: `🎲 Кубик показал: **${num}**` };
  }

  // Coin flip
  if (text === "монетка" || text === "монета" || text === "подбросить монетку") {
    const result = Math.random() > 0.5 ? "Орёл! 🦅" : "Решка! 👑";
    return { text: `🪙 Подбрасываю монетку... ${result}` };
  }

  // Tell a joke
  if (text === "расскажи анекдот" || text === "анекдот" || text === "шутка" || text === "расскажи шутку") {
    return { text: jokes[Math.floor(Math.random() * jokes.length)] };
  }

  // Riddle - check answer if active
  if (currentRiddle !== null) {
    const answer = currentRiddle.a;
    const isCorrect = text.includes(answer);
    currentRiddle = null;
    if (isCorrect) {
      return { text: `🎉 Правильно! Ответ — **${answer}**! Молодец! ✨` };
    } else {
      return { text: `❌ Неправильно! Правильный ответ — **${answer}**. Попробуй другую загадку! 🧩` };
    }
  }

  // Riddle - start new
  if (text === "загадка" || text === "загадай загадку") {
    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    currentRiddle = riddle;
    return { text: `🧩 Загадка: **${riddle.q}**\n\nНапиши свой ответ!`, isGame: true };
  }

  // Guess the number - start
  if (text === "угадай число" || text.startsWith("угадай число до")) {
    const match = text.match(/угадай число до (\d+)/);
    guessNumberMax = match ? parseInt(match[1]) : 100;
    guessNumberTarget = Math.floor(Math.random() * guessNumberMax) + 1;
    return { text: `🔢 Я загадала число от 1 до ${guessNumberMax}. Попробуй угадать! Просто напиши число.`, isGame: true };
  }

  // Guess number - check
  if (guessNumberTarget !== null) {
    const num = parseInt(text);
    if (!isNaN(num)) {
      if (num === guessNumberTarget) {
        const target = guessNumberTarget;
        guessNumberTarget = null;
        return { text: `🎉 Правильно! Это было число **${target}**! Ты угадал(а)!` };
      } else if (num < guessNumberTarget) {
        return { text: `⬆️ Моё число **больше**! Попробуй ещё.`, isGame: true };
      } else {
        return { text: `⬇️ Моё число **меньше**! Попробуй ещё.`, isGame: true };
      }
    }
  }

  // Guess the color
  if (text === "угадай цвет" || text === "угадай цвет!") {
    guessColorTarget = colors[Math.floor(Math.random() * colors.length)];
    return { text: `🎨 Я загадала цвет! Попробуй угадать. Варианты: ${colors.join(", ")}`, isGame: true };
  }

  if (guessColorTarget !== null) {
    if (colors.includes(text)) {
      if (text === guessColorTarget) {
        const target = guessColorTarget;
        guessColorTarget = null;
        return { text: `🎉 Правильно! Это был **${target}**!` };
      } else {
        return { text: `❌ Нет, не ${text}. Попробуй ещё!`, isGame: true };
      }
    }
  }

  // Who are you
  if (text === "кто ты" || text === "кто ты?" || text === "кто ты такая") {
    return { text: "Я **Велия** — твой виртуальный помощник! 💜 Я умею играть в игры, рассказывать шутки, загадывать загадки и просто болтать. Я ещё учусь, но стараюсь быть полезной! ✨" };
  }

  // What's your name
  if (text === "как тебя зовут" || text === "как тебя зовут?" || text === "твоё имя") {
    return { text: "Меня зовут **Велия**! 💜 Приятно познакомиться!" };
  }

  // What can you do
  if (text === "что ты умеешь" || text === "что ты умеешь?" || text === "что ты можешь") {
    return { text: `✨ Вот что я умею:\n\n🎲 **Игры:** кубик, монетка, угадай число, угадай цвет\n😂 **Развлечения:** анекдот, загадка, скажи что-нибудь\n🔧 **Утилиты:** выбери [варианты], повтори [текст]\n❓ **Инфо:** кто ты, как тебя зовут, помощь\n🎭 **Действия:** сделай случайное действие` };
  }

  // Help
  if (text === "помощь" || text === "help" || text === "команды") {
    return { text: `📋 **Команды Велии:**\n\n🎲 \`кубик\` — бросить кубик (1-6)\n🪙 \`монетка\` — орёл или решка\n😂 \`анекдот\` — рассказать шутку\n🧩 \`загадка\` — загадать загадку\n🔢 \`угадай число\` — игра в угадывание\n🎨 \`угадай цвет\` — угадай загаданный цвет\n🎯 \`выбери A / B / C\` — случайный выбор\n🔁 \`повтори [текст]\` — повторю за тобой\n💬 \`скажи что-нибудь\` — случайная фраза\n🎭 \`случайное действие\` — сделаю что-то\n📱 \`открой [приложение]\` — открыть приложение\n❓ \`кто ты\` / \`что ты умеешь\`` };
  }

  // Select from options
  if (text.startsWith("выбери ")) {
    const options = text.replace("выбери ", "").split(/[\/,|]/).map(o => o.trim()).filter(Boolean);
    if (options.length >= 2) {
      const chosen = options[Math.floor(Math.random() * options.length)];
      return { text: `🎯 Из вариантов выбираю... **${chosen}**!` };
    }
    return { text: "Укажи варианты через / или , — например: `выбери пицца / суши / бургер`" };
  }

  // Say something
  if (text === "скажи что-нибудь" || text === "скажи что нибудь") {
    return { text: randomPhrases[Math.floor(Math.random() * randomPhrases.length)] };
  }

  // Repeat
  if (text.startsWith("повтори ")) {
    const toRepeat = input.trim().slice(8);
    return { text: `🔁 ${toRepeat}` };
  }

  // Random action
  if (text === "случайное действие" || text === "сделай случайное действие" || text === "сделай что-нибудь") {
    return { text: randomActions[Math.floor(Math.random() * randomActions.length)] };
  }

  // Open app
  if (/^(открой|запусти|открыть|запустить|включи|включить)\s+/.test(text)) {
    const app = findApp(text);
    if (app) {
      return { text: tryOpenApp(app) };
    }
    return { text: "🤔 Не знаю такого приложения. Попробуй: Telegram, YouTube, VK, Steam, WhatsApp, Instagram, TikTok, Discord, Spotify и другие!" };
  }

  // Direct app name mention
  const directApp = findApp(text);
  if (directApp && /^(телеграм|тг|ютуб|вк|стим|вотсап|инста|тикток|дискорд|спотифай|твич)$/i.test(text)) {
    return { text: tryOpenApp(directApp) };
  }

  // Default
  return { text: `Хм, я пока не совсем поняла 🤔 Попробуй написать по-другому или напиши \`помощь\` для списка команд!` };
}

export const commandsList = [
  { cmd: "кубик", desc: "Бросить кубик (1-6)", icon: "🎲" },
  { cmd: "монетка", desc: "Орёл или решка", icon: "🪙" },
  { cmd: "анекдот", desc: "Рассказать шутку", icon: "😂" },
  { cmd: "загадка", desc: "Загадать загадку", icon: "🧩" },
  { cmd: "угадай число", desc: "Игра — угадай число", icon: "🔢" },
  { cmd: "угадай цвет", desc: "Игра — угадай цвет", icon: "🎨" },
  { cmd: "выбери A / B / C", desc: "Случайный выбор", icon: "🎯" },
  { cmd: "скажи что-нибудь", desc: "Случайная фраза", icon: "💬" },
  { cmd: "повтори [текст]", desc: "Повторю за тобой", icon: "🔁" },
  { cmd: "случайное действие", desc: "Сделаю что-то", icon: "🎭" },
  { cmd: "кто ты", desc: "Обо мне", icon: "❓" },
  { cmd: "что ты умеешь", desc: "Мои возможности", icon: "✨" },
  { cmd: "открой telegram", desc: "Открыть приложение", icon: "📱" },
  { cmd: "помощь", desc: "Список команд", icon: "📋" },
];
