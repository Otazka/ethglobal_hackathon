import os
import asyncio
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.filters import Command

# Load environment variables
load_dotenv()

API_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

# Простой хардкод кошельков для MVP
user_wallets = {}

@dp.message(Command("start"))
async def start_cmd(message: types.Message):
    user_id = message.from_user.id
    user_wallets.setdefault(user_id, {'eth': '0x...', 'ton': 'EQ...', 'balance': {'ETH': 0, 'TON': 0}})
    await message.reply(
        "Привет! Я крипто-бот для помощи с переводами ETH и TON.\n\n"
        "Вот что я умею:\n"
        "/wallet – показать ваш кошелёк\n"
        "/send – отправить средства\n"
        "/receive – показать адрес для получения\n"
        "/swap – обмен валюты (в разработке)"
    )

@dp.message(Command("wallet"))
async def wallet_cmd(message: types.Message):
    user_id = message.from_user.id
    wallet = user_wallets.get(user_id)
    if wallet:
        reply = f"Ваши адреса:\nETH: {wallet['eth']}\nTON: {wallet['ton']}\n\nБаланс:\nETH: {wallet['balance']['ETH']}\nTON: {wallet['balance']['TON']}"
    else:
        reply = "У вас ещё нет кошелька. Напишите /start"
    await message.reply(reply)

@dp.message(Command("receive"))
async def receive_cmd(message: types.Message):
    user_id = message.from_user.id
    wallet = user_wallets.get(user_id)
    if wallet:
        await message.reply(f"Для получения переведите средства на адрес:\n\nETH: {wallet['eth']}\nTON: {wallet['ton']}")
    else:
        await message.reply("Сначала выполните /start")

@dp.message(Command("send"))
async def send_cmd(message: types.Message):
    await message.reply("Функция отправки в разработке. Скоро вы сможете отправлять крипту по Telegram username.")

@dp.message(Command("swap"))
async def swap_cmd(message: types.Message):
    await message.reply("Функция обмена пока в разработке. Следите за обновлениями.")

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    asyncio.run(main())