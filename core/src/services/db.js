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

    async getActiveInvite(userId) {
        return await this.prisma.invite.findFirst({
            where: {
                inviter_id: userId,
                status: 'pending'
            }
        })
    }

    async cancelInvite(inviteId) {
        return await this.prisma.invite.update({
            where: {
                id: inviteId
            },
            data: {
                status: 'cancelled'
            }
        })
    }

    async getLastRequest() {
        return await this.prisma.request.findFirst({
            orderBy: {
                processed_at: 'desc'
            }
        })
    }

    async getNLastRequests(n) {
        return await this.prisma.request.findMany({
            orderBy: {
                processed_at: 'desc'
            },
            take: n
        })
    }
}

const db = new Database()

export {db}