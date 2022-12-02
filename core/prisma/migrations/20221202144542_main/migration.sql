-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('pending', 'duplicate', 'cancelled', 'successful');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('subscribed', 'unsubscribed');

-- CreateTable
CREATE TABLE "invites" (
    "id" SERIAL NOT NULL,
    "inviter_id" BIGINT NOT NULL,
    "invited_id" BIGINT,
    "invited_username" VARCHAR(255),
    "status" "InviteStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_members" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscribers" (
    "id" SERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "telegram_event_id" BIGINT NOT NULL,
    "happened_at" TIMESTAMP(3) NOT NULL,
    "processed_at" TIMESTAMP(3),
    "type" "EventType" NOT NULL,
    "user_id" BIGINT NOT NULL,
    "username" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_telegram_event_id_key" ON "events"("telegram_event_id");
