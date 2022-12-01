import {Command} from "./command.js";
import {publish} from "../services/amqp.js";
import {db} from "../services/db.js";

class CheckCommand extends Command {
    async process() {
        const invite = await db.getActiveInvite(this.event.message.from.id)

        if (invite === null) {
            await this.respond('У вас нет активного приглашения')

            return
        }

        const lastRequest = await db.getLastRequest()

        if (lastRequest !== null) {
            const diffInSeconds = Math.round((new Date() - lastRequest.processed_at) / 1000)
            const secondsToWait = await this.getWaitingTimeInSeconds(diffInSeconds)

            if (secondsToWait !== null) {
                await this.respond(
                    'Из-за ограничений телеграма я не могу слишком часто проверять подписчиков канала, ' +
                    `последняя проверка была ${diffInSeconds} секунд назад. Пожалуйста, запросите проверку ` +
                    `через ${secondsToWait} секунд 🤖`
                )

                return
            }
        }

        await this.respond('Проверяем ♻')

        await publish(JSON.stringify({
            command: 'check-admin-log',
            chatId: this.chatId,
            invitedId: invite.invited_id,
            invitedUsername: invite.invited_username
        }), 'mtproto-requests')
    }

    async getWaitingTimeInSeconds(diffInSeconds) {
        const lastFiveRequests = await db.getNLastRequests(5)

        if (lastFiveRequests.length === 5) {
            const tenMinutesAgo = new Date(new Date() - 1000 * 60 * 10)

            if (tenMinutesAgo < lastFiveRequests[4].processed_at) {
                const requestsProhibitedUntil = new Date(lastFiveRequests[4].processed_at.getTime() + 1000 * 60 * 10)

                return Math.round((requestsProhibitedUntil - new Date()) / 1000)
            }
        }

        if (diffInSeconds < 60) {
            return 60 - diffInSeconds
        }

        return null
    }
}

export {CheckCommand}