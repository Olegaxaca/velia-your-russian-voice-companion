
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
];

function matchNlp(text: string): string | null {
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
    return { text: `📋 **Команды Велии:**\n\n🎲 \`кубик\` — бросить кубик (1-6)\n🪙 \`монетка\` — орёл или решка\n😂 \`анекдот\` — рассказать шутку\n🧩 \`загадка\` — загадать загадку\n🔢 \`угадай число\` — игра в угадывание\n🎨 \`угадай цвет\` — угадай загаданный цвет\n🎯 \`выбери A / B / C\` — случайный выбор\n🔁 \`повтори [текст]\` — повторю за тобой\n💬 \`скажи что-нибудь\` — случайная фраза\n🎭 \`случайное действие\` — сделаю что-то\n❓ \`кто ты\` / \`что ты умеешь\`` };
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
  { cmd: "помощь", desc: "Список команд", icon: "📋" },
];
