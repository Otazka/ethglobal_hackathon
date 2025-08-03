import os
import asyncio
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from inchApi import get_eth_to_usdt_quote

# Load environment variables
load_dotenv()

API_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ONEINCH_API_KEY = os.getenv('ONE_INCH_API_KEY')

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

# Простой хардкод кошельков для MVP
user_wallets = {}
user_languages = {}  # Store user language preferences

# Language texts
TEXTS = {
    'EN': {
        'welcome': "🚀 Hello! I'm a crypto bot for ETH and TON transfers.\n\nHere's what I can do:\n💰 /wallet – show your wallet\n💱 /rate <amount> – get ETH to USDT rate\n💎 /rate_ton <amount> – get TON to USDT rate\n📤 /send – send funds\n📥 /receive – show address for receiving\n🔄 /swap – currency exchange (in development)\n🌐 /language – change language",
        'wallet_info': "💼 Your addresses:\n🔷 ETH: {eth}\n💎 TON: {ton}\n\n💰 Balance:\n🔷 ETH: {eth_balance}\n💎 TON: {ton_balance}",
        'no_wallet': "❌ You don't have a wallet yet. Write /start",
        'receive_info': "📥 To receive funds, transfer to address:\n\n🔷 ETH: {eth}\n💎 TON: {ton}",
        'send_dev': "🚧 Send function is in development. Soon you'll be able to send crypto via Telegram username.",
        'swap_dev': "🚧 Exchange function is in development. Stay tuned for updates.",
        'choose_language': "🌐 Choose your language:",
        'language_changed': "✅ Language changed to English! 🇺🇸",
        'select_language': "🌐 Please select your language:"
    },
    'UA': {
        'welcome': "🚀 Привіт! Я крипто-бот для допомоги з переводами ETH і TON.\n\nОсь що я вмію:\n💰 /wallet – показати ваш гаманець\n💱 /rate <amount> – отримати курс ETH до USDT\n💎 /rate_ton <amount> – отримати курс TON до USDT\n📤 /send – відправити кошти\n📥 /receive – показати адресу для отримання\n🔄 /swap – обмін валюти (в розробці)\n🌐 /language – змінити мову",
        'wallet_info': "💼 Ваші адреси:\n🔷 ETH: {eth}\n💎 TON: {ton}\n\n💰 Баланс:\n🔷 ETH: {eth_balance}\n💎 TON: {ton_balance}",
        'no_wallet': "❌ У вас ще немає гаманця. Напишіть /start",
        'receive_info': "📥 Для отримання коштів переведіть на адресу:\n\n🔷 ETH: {eth}\n💎 TON: {ton}",
        'send_dev': "🚧 Функція відправки в розробці. Скоро ви зможете відправляти крипту через Telegram username.",
        'swap_dev': "🚧 Функція обміну поки в розробці. Слідкуйте за оновленнями.",
        'choose_language': "🌐 Виберіть вашу мову:",
        'language_changed': "✅ Мову змінено на українську! 🇺🇦",
        'select_language': "🌐 Будь ласка, виберіть вашу мову:"
    },
    'RU': {
        'welcome': "🚀 Привет! Я крипто-бот для помощи с переводами ETH и TON.\n\nВот что я умею:\n💰 /wallet – показать ваш кошелёк\n💱 /rate <amount> – получить курс ETH к USDT\n💎 /rate_ton <amount> – получить курс TON к USDT\n📤 /send – отправить средства\n📥 /receive – показать адрес для получения\n🔄 /swap – обмен валюты (в разработке)\n🌐 /language – изменить язык",
        'wallet_info': "💼 Ваши адреса:\n🔷 ETH: {eth}\n💎 TON: {ton}\n\n💰 Баланс:\n🔷 ETH: {eth_balance}\n💎 TON: {ton_balance}",
        'no_wallet': "❌ У вас ещё нет кошелька. Напишите /start",
        'receive_info': "📥 Для получения переведите средства на адрес:\n\n🔷 ETH: {eth}\n💎 TON: {ton}",
        'send_dev': "🚧 Функция отправки в разработке. Скоро вы сможете отправлять крипту по Telegram username.",
        'swap_dev': "🚧 Функция обмена пока в разработке. Следите за обновлениями.",
        'choose_language': "🌐 Выберите ваш язык:",
        'language_changed': "✅ Язык изменён на русский! 🇷🇺",
        'select_language': "🌐 Пожалуйста, выберите ваш язык:"
    }
}

def get_text(user_id: int, key: str, **kwargs) -> str:
    """Get text in user's language"""
    lang = user_languages.get(user_id, 'EN')
    text = TEXTS[lang][key]
    return text.format(**kwargs) if kwargs else text

@dp.message(Command("start"))
async def start_cmd(message: types.Message):
    user_id = message.from_user.id
    user_wallets.setdefault(user_id, {'eth': '0x...', 'ton': 'EQ...', 'balance': {'ETH': 0, 'TON': 0}})
    
    # If user hasn't set language yet, show language selection
    if user_id not in user_languages:
        await show_language_selection(message)
        return
    
    await message.reply(get_text(user_id, 'welcome'))

@dp.message(Command("wallet"))
async def wallet_cmd(message: types.Message):
    user_id = message.from_user.id
    wallet = user_wallets.get(user_id)
    if wallet:
        reply = get_text(user_id, 'wallet_info', 
                        eth=wallet['eth'], 
                        ton=wallet['ton'], 
                        eth_balance=wallet['balance']['ETH'], 
                        ton_balance=wallet['balance']['TON'])
    else:
        reply = get_text(user_id, 'no_wallet')
    await message.reply(reply)

@dp.message(Command("rate"))
async def get_rate_cmd(message: types.Message):
    try:
        amount = float(message.text.split()[1])
        rate = get_eth_to_usdt_quote(amount)
        await message.reply(f"💱 Exchange Rate:\n1 ETH = {rate} USDT\nFor {amount} ETH: {amount * rate:.2f} USDT")
    except (ValueError, IndexError):
        await message.reply("Please use the format: /rate <amount>\nExample: /rate 1")
    except Exception as e:
        await message.reply(f"❌ Error getting rate: {str(e)}\nPlease try again later.")

@dp.message(Command("rate_ton"))
async def get_ton_rate_cmd(message: types.Message):
    try:
        amount = float(message.text.split()[1])
        # Simple TON price approximation (you can replace this with actual API call)
        ton_price = 2.5  # Approximate TON price in USDT
        total_value = amount * ton_price
        await message.reply(f"💎 TON Exchange Rate:\n1 TON = {ton_price} USDT\nFor {amount} TON: {total_value:.2f} USDT")
    except (ValueError, IndexError):
        await message.reply("Please use the format: /rate_ton <amount>\nExample: /rate_ton 1")
    except Exception as e:
        await message.reply(f"❌ Error getting TON rate: {str(e)}\nPlease try again later.")

@dp.message(Command("receive"))
async def receive_cmd(message: types.Message):
    user_id = message.from_user.id
    wallet = user_wallets.get(user_id)
    if wallet:
        await message.reply(get_text(user_id, 'receive_info', eth=wallet['eth'], ton=wallet['ton']))
    else:
        await message.reply(get_text(user_id, 'no_wallet'))

@dp.message(Command("send"))
async def send_cmd(message: types.Message):
    user_id = message.from_user.id
    await message.reply(get_text(user_id, 'send_dev'))

@dp.message(Command("swap"))
async def swap_cmd(message: types.Message):
    user_id = message.from_user.id
    await message.reply(get_text(user_id, 'swap_dev'))

@dp.message(Command("language"))
async def language_cmd(message: types.Message):
    await show_language_selection(message)

async def show_language_selection(message: types.Message):
    """Show language selection keyboard"""
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="🇺🇸 Eng", callback_data="lang_EN"),
            InlineKeyboardButton(text="🇺🇦 Укр", callback_data="lang_UA"),
            InlineKeyboardButton(text="🇷🇺 Рус", callback_data="lang_RU")
        ]
    ])
    await message.reply("🌐 Please select your language:\n🌐 Будь ласка, виберіть вашу мову:\n🌐 Пожалуйста, выберите ваш язык:", reply_markup=keyboard)

@dp.callback_query(lambda c: c.data.startswith('lang_'))
async def process_language_selection(callback_query: types.CallbackQuery):
    """Handle language selection"""
    user_id = callback_query.from_user.id
    selected_lang = callback_query.data.split('_')[1]
    
    user_languages[user_id] = selected_lang
    
    # Initialize wallet if not exists
    user_wallets.setdefault(user_id, {'eth': '0x...', 'ton': 'EQ...', 'balance': {'ETH': 0, 'TON': 0}})
    
    await callback_query.message.edit_text(get_text(user_id, 'language_changed'))
    await callback_query.answer()
    
    # Send welcome message
    await callback_query.message.answer(get_text(user_id, 'welcome'))

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())