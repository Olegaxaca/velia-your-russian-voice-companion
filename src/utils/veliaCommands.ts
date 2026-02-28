
// Game state stored in-memory per session
let guessNumberTarget: number | null = null;
let guessNumberMax: number = 100;
let guessColorTarget: string | null = null;

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
  { q: "Что можно увидеть с закрытыми глазами?", a: "Сон 💤" },
  { q: "Что идёт, не двигаясь с места?", a: "Время ⏰" },
  { q: "У чего нет длины, ширины, глубины, а можно измерить?", a: "Температура 🌡️" },
  { q: "Что можно приготовить, но нельзя съесть?", a: "Уроки 📚" },
  { q: "Какой рукой лучше размешивать чай?", a: "Лучше ложкой! 🥄" },
  { q: "Что становится больше, если его поставить вверх ногами?", a: "Число 6 → 9 🔢" },
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

export interface CommandResult {
  text: string;
  isGame?: boolean;
}

export function processCommand(input: string): CommandResult {
  const text = input.trim().toLowerCase();

  // Roll a die
  if (text === "бросить кубик" || text === "кубик" || text === "кость") {
    const num = Math.floor(Math.random() * 1000000) + 1;
    return { text: `🎲 Кубик показал: **${num.toLocaleString()}** (от 1 до 1 000 000)` };
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

  // Riddle
  if (text === "загадка" || text === "загадай загадку") {
    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    return { text: `🧩 Загадка: ${riddle.q}\n\n||Ответ: ${riddle.a}||` };
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
    return { text: `📋 **Команды Велии:**\n\n🎲 \`кубик\` — число от 1 до 1 000 000\n🪙 \`монетка\` — орёл или решка\n😂 \`анекдот\` — рассказать шутку\n🧩 \`загадка\` — загадать загадку\n🔢 \`угадай число\` — игра в угадывание\n🎨 \`угадай цвет\` — угадай загаданный цвет\n🎯 \`выбери A / B / C\` — случайный выбор\n🔁 \`повтори [текст]\` — повторю за тобой\n💬 \`скажи что-нибудь\` — случайная фраза\n🎭 \`случайное действие\` — сделаю что-то\n❓ \`кто ты\` / \`что ты умеешь\`` };
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
  return { text: `Я пока не понимаю эту команду 🤔\nНапиши \`помощь\` чтобы увидеть список команд!` };
}

export const commandsList = [
  { cmd: "кубик", desc: "Число от 1 до 1 000 000", icon: "🎲" },
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
