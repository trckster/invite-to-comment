import {PrismaClient} from "@prisma/client";

class Database {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async isChatMember(userId) {

    }

    async hasActiveInvite(userId) {
        return 0 < await this.prisma.invite.count({
            where: {
                inviter_id: userId,
                status: 'pending'
            }
        })
    }

    async wasSubscribedCheckById(userId) {
        return 0 < await this.prisma.subscriber.count({
            where: {
                user_id: userId
            }
        })
    }

    async wasSubscribedCheckByUsername(username) {
        return 0 < await this.prisma.subscriber.count({
            where: {
                username: username
            }
        })
    }

    async alreadyInvitedById(userId) {
        return 0 < await this.prisma.invite.count({
            where: {
                invited_id: userId,
                status: 'pending'
            }
        })
    }

    async alreadyInvitedByUsername(username) {
        return 0 < await this.prisma.invite.count({
            where: {
                invited_username: username,
                status: 'pending'
            }
        })
    }

    async createInviteById(inviterId, invitedId) {
        return await this.prisma.invite.create({
            data: {
                invited_id: invitedId,
                inviter_id: inviterId,
                status: 'pending'
            }
        })
    }

    async createInviteByUsername(inviterId, invitedUsername) {
        return await this.prisma.invite.create({
            data: {
                invited_username: invitedUsername,
                inviter_id: inviterId,
                status: 'pending'
            }
        })
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