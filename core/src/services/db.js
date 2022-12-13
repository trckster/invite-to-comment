import {PrismaClient} from "@prisma/client";

class Database {
    constructor() {
        this.prisma = new PrismaClient({log: ["query"]});
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

    async getActiveInviteBySubscription(userId, username) {
        return await this.prisma.invite.findFirst({
            where: {
                OR: [
                    {
                        invited_id: userId
                    }, {
                        invited_username: username
                    }
                ],
                status: 'pending'
            },
            orderBy: {
                created_at: 'asc'
            }
        })
    }

    async markInviteAs(inviteId, status) {
        return await this.prisma.invite.update({
            where: {
                id: inviteId
            },
            data: {
                status
            }
        })
    }

    async updateOtherInvitesOfThisUserAsDuplicate(userId, username) {
        let filters = {
            status: 'pending',
            OR: [
                {
                    invited_id: userId
                }
            ]
        }

        if (username) {
            filters.OR.push({
                invited_username: username
            })
        }

        await this.prisma.invite.updateMany({
            where: filters,
            data: {
                status: 'duplicate'
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

    async saveNewSubscriber(userId, username) {
        const existingSubscriber = await this.prisma.subscriber.findFirst({
            where: {
                user_id: userId,
                username: username,
            }
        })

        if (existingSubscriber === null) {
            await this.prisma.subscriber.create({
                data: {
                    user_id: userId,
                    username: username,
                }
            })
        }
    }

    async getSuccessfulInvitesCount(userId) {
        return await this.prisma.invite.count({
            where: {
                inviter_id: userId,
                status: 'successful'
            }
        })
    }

    async getSuccessfulInvitationByInvited(invitedId, invitedUsername) {
        let filters = {
            status: 'successful',
            OR: [
                {
                    invited_id: invitedId
                }
            ]
        }

        if (invitedUsername) {
            filters.OR.push({
                invited_username: invitedUsername
            })
        }

        return await this.prisma.invite.findFirst({
            where: filters
        })
    }
}

const db = new Database()

export {db}