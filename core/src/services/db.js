import {PrismaClient} from "@prisma/client";

class Database {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async isChatMember(userId) {

    }

    async hasActiveInvite(userId) {
        const activeInvites = await this.prisma.invite.count({
            where: {
                inviter_id: userId,
                status: 'pending'
            }
        })

        return activeInvites > 0
    }

    async wasSubscriber(userId) {

    }

    async alreadyInvitedById(userId) {

    }

    async alreadyInvitedByUsername(userId) {

    }

    async createInvite(inviterId, invitedId, invitedUsername) {

    }

    async markEventAsProcessed(id) {
        await this.prisma.event.update({
            where: {
                id: id,
            },
            data: {
                processed_at: new Date()
            }
        })
    }
}

const db = new Database()

export {db}