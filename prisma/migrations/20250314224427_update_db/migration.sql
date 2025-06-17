-- CreateTable
CREATE TABLE `reddit_posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(350) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `subreddit` VARCHAR(191) NOT NULL,
    `url` VARCHAR(350) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `posted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `type` VARCHAR(50) NOT NULL DEFAULT 'reddit',
    `body` TEXT NULL,
    `body_html` TEXT NULL,
    `upvotes` INTEGER NOT NULL DEFAULT 0,
    `downvotes` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `reddit_posts_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip_address` VARCHAR(150) NOT NULL,
    `type` ENUM('web', 'fcm') NOT NULL DEFAULT 'web',
    `endpoint` VARCHAR(350) NOT NULL,
    `keys` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `subscriptions_endpoint_key`(`endpoint`),
    UNIQUE INDEX `subscriptions_endpoint_type_keys_key`(`endpoint`, `type`, `keys`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `locations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionId` INTEGER NOT NULL,
    `ip_address` VARCHAR(150) NOT NULL,
    `accuracy` DOUBLE NULL,
    `altitude` DOUBLE NULL,
    `altitude_accuracy` DOUBLE NULL,
    `heading` DOUBLE NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `speed` DOUBLE NULL,
    `mocked` BOOLEAN NOT NULL,
    `timestamp` BIGINT NULL,
    `city` VARCHAR(150) NULL,
    `country` VARCHAR(150) NULL,
    `district` VARCHAR(150) NULL,
    `formatted_address` TEXT NULL,
    `iso_country_code` VARCHAR(10) NULL,
    `name` VARCHAR(150) NULL,
    `postal_code` VARCHAR(20) NULL,
    `region` VARCHAR(150) NULL,
    `street` VARCHAR(150) NULL,
    `street_number` VARCHAR(50) NULL,
    `subregion` VARCHAR(150) NULL,
    `timezone` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reddit_messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reddit_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `body_html` TEXT NULL,
    `subreddit` VARCHAR(191) NULL,
    `context_url` VARCHAR(191) NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL,
    `received_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parent_id` VARCHAR(191) NULL,
    `raw_data` JSON NULL,
    `message_type` VARCHAR(191) NULL,
    `is_subreddit_mod_mail` BOOLEAN NOT NULL DEFAULT false,
    `is_internal` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `reddit_messages_reddit_id_key`(`reddit_id`),
    INDEX `reddit_messages_author_idx`(`author`),
    INDEX `reddit_messages_created_at_idx`(`created_at`),
    INDEX `reddit_messages_is_read_idx`(`is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `locations` ADD CONSTRAINT `locations_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
