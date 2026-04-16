const TelegramBot = require('node-telegram-bot-api');

const TOKEN = '8705424999:AAGdYHS2kA3Loj33KOh3ji5tmRYclnRsrRA';
const GROUP_ID = -1003999546769;

const bot = new TelegramBot(TOKEN, { polling: true });

console.log('DG Welcome Bot starting...');

// Delete system 'joined the group' message
function deleteJoinedMessage(msg) {
  const chatId = msg.chat.id;
  if (chatId !== GROUP_ID) return;
  
  // Delete the system message (user joined notification)
  setTimeout(() => {
    bot.deleteMessage(chatId, msg.message_id).catch(() => {});
  }, 1000);
}

// Welcome message template
function getWelcomeMessage(user) {
  const name = user.first_name || 'User';
  const username = user.username ? `@${user.username}` : name;
  
  return `🎉 ကြိုဆိုပါတယ် ${username}!\n\nဒီ Group မှာ Digital Products တွေ ဝယ်ယူနိုင်ပါတယ်။\n\n🛒 ဝယ်ယူလိုရင် → @digital_zay_bot\n❓ မေးချင်ရင် → @Nickthuya225\n\n📖 ဝယ်နည်းကို သေချာသိချင်ပါက ဒီ Channel မှာ ဝင်ရောက်ကြည့်ရှုပေးပါ — https://t.me/digitalzay223\n\n═══════════════════`;
}

// Handle new members
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  
  if (chatId !== GROUP_ID) return;
  
  const newMembers = msg.new_chat_members;
  if (!newMembers || newMembers.length === 0) return;
  
  // Delete the system 'X joined the group' message
  deleteJoinedMessage(msg);
  
  for (const member of newMembers) {
    if (member.is_bot) continue; // skip bots
    
    const welcomeText = getWelcomeMessage(member);
    bot.sendMessage(chatId, welcomeText, { parse_mode: 'HTML' })
      .then(sent => {
        setTimeout(() => {
          bot.deleteMessage(chatId, sent.message_id).catch(() => {});
        }, 60000);
      })
      .catch(err => console.error('Send welcome error:', err.message));
  }
});

// Handle /start in group
bot.onText(/\/start/, (msg) => {
  if (msg.chat.id !== GROUP_ID) return;
  
  const user = msg.from;
  const welcomeText = getWelcomeMessage(user);
  bot.sendMessage(msg.chat.id, welcomeText)
    .then(sent => {
      setTimeout(() => {
        bot.deleteMessage(msg.chat.id, sent.message_id).catch(() => {});
      }, 30000);
    })
    .catch(err => console.error('Send error:', err.message));
});

// Handle /id command (debug)
bot.onText(/\/id/, (msg) => {
  if (msg.chat.id !== GROUP_ID) return;
  bot.sendMessage(msg.chat.id, `Chat ID: ${msg.chat.id}\nYour ID: ${msg.from.id}`);
});

// Handle left_chat_member (user leaves/is removed)
bot.on('left_chat_member', (msg) => {
  const chatId = msg.chat.id;
  if (chatId !== GROUP_ID) return;
  
  // Delete the system 'X left the group' message
  setTimeout(() => {
    bot.deleteMessage(chatId, msg.message_id).catch(() => {});
  }, 1000);
});

console.log('Bot is running!');
