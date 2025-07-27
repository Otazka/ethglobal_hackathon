from telegram import Update, Sticker
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes, ConversationHandler

CHOOSE_CONTACT, CHOOSE_STICKER = range(2)

users = []

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if user.username not in users:
        users.append(user.username)
    if len(users) < 2:
        await update.message.reply_text("At least 2 users have to use this bot before you can send stickers.")
        return ConversationHandler.END
    contact_options = [u for u in users if u != user.username]
    context.user_data['options'] = contact_options
    reply_markup = '\n'.join(f"/sendto_{name}" for name in contact_options)
    await update.message.reply_text(f"Choose contact to send sticker to:\n{reply_markup}")
    return CHOOSE_CONTACT

async def choose_contact(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    text = update.message.text
    if not text.startswith('/sendto_'):
        await update.message.reply_text("Use provided commands to choose contact.")
        return CHOOSE_CONTACT
    target = text[len('/sendto_') :]
    if target not in context.user_data['options']:
        await update.message.reply_text("Invalid contact.")
        return CHOOSE_CONTACT
    context.user_data['target'] = target
    await update.message.reply_text("Now send me a sticker to forward.")
    return CHOOSE_STICKER

async def send_sticker(update: Update, context: ContextTypes.DEFAULT_TYPE):
    target = context.user_data['target']
    sticker = update.message.sticker
    # In real bot, save chat_ids for users, not just usernames.
    # Here, you would have a dict: username -> chat_id
    user_chat_id_dict = context.application.user_chat_id_dict
    await context.bot.send_sticker(chat_id=user_chat_id_dict[target], sticker=sticker.file_id)
    await update.message.reply_text("Sticker sent.")
    return ConversationHandler.END

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Canceled.")
    return ConversationHandler.END

app = ApplicationBuilder().token('YOUR_BOT_TOKEN').build()
conv_handler = ConversationHandler(
    entry_points=[CommandHandler('start', start)],
    states={
        CHOOSE_CONTACT: [MessageHandler(filters.TEXT & ~filters.COMMAND, choose_contact),
                         MessageHandler(filters.COMMAND, choose_contact)],
        CHOOSE_STICKER: [MessageHandler(filters.Sticker.ALL, send_sticker)],
    },
    fallbacks=[CommandHandler('cancel', cancel)],
)
app.add_handler(conv_handler)
app.run_polling()