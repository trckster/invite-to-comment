import {PingCommand} from "../events/ping-command.js";
import {UserSubscribed} from "../events/user-subscribed.js";
import {UserUnsubscribed} from "../events/user-unsubscribed.js";
import {JoinRequestMade} from "../events/join-request-made.js";
import {InviteCommand} from "../events/invite-command.js";
import {HelpCommand} from "../events/help-command.js";
import {StartCommand} from "../events/start-command.js";
import {UnknownCommand} from "../events/unknown-command.js";
import {ReportCommand} from "../events/report-command.js";
import {CancelCommand} from "../events/cancel-command.js";
import {GetIdCommand} from "../events/get-id-command.js";

function recognizeEvent(event) {
    switch (event.action) {
        case 'subscribed':
            return new UserSubscribed(event)
        case 'unsubscribed':
            return new UserUnsubscribed(event)
        case 'join-request':
            return new JoinRequestMade(event)
        case 'message':
            return recognizeMessage(event)
    }
}

function recognizeMessage(event) {
    const message = event.message.text

    if (message.startsWith('/cancel')) {
        return new CancelCommand(event);
    }

    if (message.startsWith('/ping')) {
        return new PingCommand(event)
    }

    if (message.startsWith('/start')) {
        return new StartCommand(event)
    }

    if (message.startsWith('/help')) {
        return new HelpCommand(event)
    }

    if (message.startsWith('/report')) {
        return new ReportCommand(event)
    }

    if (message.startsWith('/id')) {
        return new GetIdCommand(event)
    }

    if (isValidTelegramUserId(message) || message.startsWith('@')) {
        return new InviteCommand(event)
    }

    return new UnknownCommand(event)
}

function isValidTelegramUserId(text) {
    return !isNaN(text)
}

export {recognizeEvent}