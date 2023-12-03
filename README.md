# Invite to comment

## About

This bot allows to write comments only to those people, who had invited someone to the channel.
It can automatically check subscriptions, add and remove users from comments. The launch is quite simple:

## Set up

- Create a Telegram channel (if you don't have one)
- Create a Telegram group and link it with your channel
- Make this group available only by join requests
- Create a Telegram bot via [BotFather](https://t.me/BotFather)
- Add this bot to your group and give him full access (make him admin)

It is strongly recommended to create a new Telegram account that will be responsible for channel auto-monitoring.
Let's call this account app-user.

- Create application on behalf of app-user on [my.telegram.org](https://my.telegram.org)
- Give app-user full access to your channel (make him admin)
- `git clone git@github.com:trckster/invite-to-comment.git && cd invite-to-comment`
- `cp .env.example .env`
- Set necessary environment variables
- `docker compose up -d`

That's it!

## Contact

If you have troubles or questions or need translations from code, don't hesitate to write me:
[@trckster](https://trckster.t.me)