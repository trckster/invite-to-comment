import {Telegraf} from "telegraf"
import * as dotenv from "dotenv";

dotenv.config()

class TelegramApi {
    constructor() {
        this.bot = new Telegraf(process.env.BOT_TOKEN)
    }

    async sendMessage(chat, message, extra = {}) {
        await this.bot.telegram.sendMessage(chat, message, extra)
    }

    async sendToAdmin(message) {
        await this.bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)
    }

    async acceptJoinRequest(userId) {
        await this.bot.telegram.approveChatJoinRequest(process.env.GROUP_CHAT_ID, userId)
    }

    async kickFromGroup(userId) {
        await this.bot.telegram.banChatMember(process.env.GROUP_CHAT_ID, userId)
        await this.bot.telegram.unbanChatMember(process.env.GROUP_CHAT_ID, userId)
    }
}

const telegramApi = new TelegramApi()

export {telegramApi}