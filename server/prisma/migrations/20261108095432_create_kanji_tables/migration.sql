-- CreateEnum
CREATE TYPE "question_type" AS ENUM ('read', 'mean');

-- CreateEnum
CREATE TYPE "answer_mode" AS ENUM ('choice', 'typing');

-- CreateEnum
CREATE TYPE "lang" AS ENUM ('th', 'en');

-- CreateEnum
CREATE TYPE "jlpt_level" AS ENUM ('N5', 'N4', 'N3', 'N2', 'N1');

-- CreateTable
CREATE TABLE "words" (
    "id" SERIAL NOT NULL,
    "kanji" VARCHAR(255) NOT NULL,
    "reading" VARCHAR(255) NOT NULL,
    "meanings_th" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "meanings_en" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
    "level" "jlpt_level" NOT NULL DEFAULT 'N5',
    "created_by" VARCHAR(255),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(255),

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_word_stats" (
    "user_id" UUID NOT NULL,
    "word_id" INTEGER NOT NULL,
    "qtype" "question_type" NOT NULL,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "wrong_count" INTEGER NOT NULL DEFAULT 0,
    "last_correct" BOOLEAN,
    "last_answered_at" TIMESTAMPTZ(3),

    CONSTRAINT "user_word_stats_pkey" PRIMARY KEY ("user_id","word_id","qtype")
);

-- CreateTable
CREATE TABLE "answer_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "word_id" INTEGER NOT NULL,
    "qtype" "question_type" NOT NULL,
    "mode" "answer_mode" NOT NULL,
    "lang" "lang" NOT NULL DEFAULT 'th',
    "given" VARCHAR(255) NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "overridden" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "words_level_idx" ON "words"("level");

-- CreateIndex
CREATE UNIQUE INDEX "words_kanji_reading_key" ON "words"("kanji", "reading");

-- CreateIndex
CREATE INDEX "answer_logs_user_id_created_at_idx" ON "answer_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "answer_logs_user_id_word_id_qtype_created_at_idx" ON "answer_logs"("user_id", "word_id", "qtype", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "user_word_stats" ADD CONSTRAINT "user_word_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_word_stats" ADD CONSTRAINT "user_word_stats_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_logs" ADD CONSTRAINT "answer_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_logs" ADD CONSTRAINT "answer_logs_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE CASCADE;
