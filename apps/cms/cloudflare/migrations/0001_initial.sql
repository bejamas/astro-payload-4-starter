PRAGMA defer_foreign_keys = ON;
CREATE TABLE `_folders_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version__h_folders_id` integer,
	`version_name` text NOT NULL,
	`version_updated_at` text,
	`version_created_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version__h_folders_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `_folders_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_folders_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_media_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_alt` text NOT NULL,
	`version__h_folders_id` integer,
	`version_updated_at` text,
	`version_created_at` text,
	`version_url` text,
	`version_thumbnail_u_r_l` text,
	`version_filename` text,
	`version_mime_type` text,
	`version_filesize` numeric,
	`version_width` numeric,
	`version_height` numeric,
	`version_original_filename` text,
	`version_original_url` text,
	`version_original_mime_type` text,
	`version_original_filesize` numeric,
	`version_original_width` numeric,
	`version_original_height` numeric,
	`version_original_prefix` text,
	`version_original__objectkey` text,
	`version_focal_x` numeric,
	`version_focal_y` numeric,
	`version_variants_card_url` text,
	`version_variants_card_width` numeric,
	`version_variants_card_height` numeric,
	`version_variants_card_mime_type` text,
	`version_variants_card_filesize` numeric,
	`version_variants_card_filename` text,
	`version_variants_card_prefix` text,
	`version_variants_card__objectkey` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version__h_folders_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `_media_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`tags_id` integer,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_media_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tags_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_slug` text,
	`version_seo_title` text,
	`version_seo_description` text,
	`version_updated_at` text,
	`version_created_at` text,
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	`autosave` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `_pages_v_blocks_content` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`body` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_blocks_cta` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`heading` text,
	`description` text,
	`link_label` text,
	`href` text DEFAULT '/journal',
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_blocks_faq` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`heading` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_blocks_faq_items` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`question` text,
	`answer` text,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_faq`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_blocks_features` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`heading` text,
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_blocks_features_items` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v_blocks_features`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_blocks_hero` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`description` text,
	`link_label` text,
	`href` text DEFAULT '/journal',
	`_uuid` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_pages_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_pages_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_posts_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_title` text,
	`version_slug` text,
	`version_excerpt` text,
	`version_category` text DEFAULT 'Notes',
	`version_author` text DEFAULT 'Fieldnotes team',
	`version_published_at` text,
	`version_cover_id` integer,
	`version_body` text,
	`version_seo_title` text,
	`version_seo_description` text,
	`version_updated_at` text,
	`version_created_at` text,
	`version__status` text DEFAULT 'draft',
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`latest` integer,
	`autosave` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version_cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `_posts_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_posts_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_site_settings_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`version_name` text DEFAULT 'Fieldnotes' NOT NULL,
	`version_description` text DEFAULT 'Ideas on design, the web, and making things that matter.' NOT NULL,
	`version_footer` text DEFAULT 'An open notebook for a better web.',
	`version_updated_at` text,
	`version_created_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE `_site_settings_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_site_settings_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_site_settings_v_version_navigation` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`href` text DEFAULT '/journal' NOT NULL,
	`_uuid` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `_site_settings_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_tags_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version__h_tags_id` integer,
	`version_name` text NOT NULL,
	`version_updated_at` text,
	`version_created_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`version__h_tags_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `_tags_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_tags_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_users_v` (
	`id` integer PRIMARY KEY NOT NULL,
	`parent_id` integer,
	`version_name` text,
	`version_updated_at` text,
	`version_created_at` text,
	`version_email` text NOT NULL,
	`version_reset_password_token` text,
	`version_reset_password_expiration` text,
	`version_salt` text,
	`version_hash` text,
	`version_reset_password_requested_at` text,
	`version_login_attempts` numeric DEFAULT 0,
	`version_lock_until` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `_users_v_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `_users_v`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `_users_v_version_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`_uuid` text NOT NULL,
	`created_at` text,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `_users_v`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `folders` (
	`id` integer PRIMARY KEY NOT NULL,
	`_h_folders_id` integer,
	`name` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`_h_folders_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `folders_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text NOT NULL,
	`_h_folders_id` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric,
	`original_filename` text,
	`original_url` text,
	`original_mime_type` text,
	`original_filesize` numeric,
	`original_width` numeric,
	`original_height` numeric,
	`original_prefix` text,
	`original__objectkey` text,
	`focal_x` numeric,
	`focal_y` numeric,
	`variants_card_url` text,
	`variants_card_width` numeric,
	`variants_card_height` numeric,
	`variants_card_mime_type` text,
	`variants_card_filesize` numeric,
	`variants_card_filename` text,
	`variants_card_prefix` text,
	`variants_card__objectkey` text, prefix text DEFAULT '', _object_key text,
	FOREIGN KEY (`_h_folders_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `media_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`tags_id` integer,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tags_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`slug` text,
	`seo_title` text,
	`seo_description` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft'
);
CREATE TABLE `pages_blocks_content` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`body` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_blocks_cta` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text,
	`description` text,
	`link_label` text,
	`href` text DEFAULT '/journal',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_blocks_faq` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_blocks_faq_items` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`question` text,
	`answer` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_faq`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_blocks_features` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`heading` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_blocks_features_items` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_features`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_blocks_hero` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`eyebrow` text,
	`heading` text,
	`description` text,
	`link_label` text,
	`href` text DEFAULT '/journal',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `pages_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `payload_kv` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL
);
CREATE TABLE `payload_llm_instructions` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_slug` text NOT NULL,
	`entity_type` text NOT NULL,
	`additional_instructions` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE `payload_llm_instructions_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` text NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_llm_instructions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE `payload_locked_documents_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	`pages_id` integer,
	`posts_id` integer,
	`media_id` integer,
	`folders_id` integer,
	`tags_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`posts_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`folders_id`) REFERENCES `folders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tags_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
CREATE TABLE `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`slug` text,
	`excerpt` text,
	`category` text DEFAULT 'Notes',
	`author` text DEFAULT 'Fieldnotes team',
	`published_at` text,
	`cover_id` integer,
	`body` text,
	`seo_title` text,
	`seo_description` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`_status` text DEFAULT 'draft',
	FOREIGN KEY (`cover_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `posts_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text DEFAULT 'Fieldnotes' NOT NULL,
	`description` text DEFAULT 'Ideas on design, the web, and making things that matter.' NOT NULL,
	`footer` text DEFAULT 'An open notebook for a better web.',
	`updated_at` text,
	`created_at` text
);
CREATE TABLE `site_settings_navigation` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`href` text DEFAULT '/journal' NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `site_settings`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `site_settings_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `site_settings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY NOT NULL,
	`_h_tags_id` integer,
	`name` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`_h_tags_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE set null
);
CREATE TABLE `tags_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`email` text NOT NULL,
	`reset_password_token` text,
	`reset_password_expiration` text,
	`salt` text,
	`hash` text,
	`reset_password_requested_at` text,
	`login_attempts` numeric DEFAULT 0,
	`lock_until` text
);
CREATE TABLE `users_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `users_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE INDEX `_folders_v_created_at_idx` ON `_folders_v` (`created_at`);
CREATE INDEX `_folders_v_parent_idx` ON `_folders_v` (`parent_id`);
CREATE INDEX `_folders_v_rels_order_idx` ON `_folders_v_rels` (`order`);
CREATE INDEX `_folders_v_rels_parent_idx` ON `_folders_v_rels` (`parent_id`);
CREATE INDEX `_folders_v_rels_path_idx` ON `_folders_v_rels` (`path`);
CREATE INDEX `_folders_v_rels_users_id_idx` ON `_folders_v_rels` (`users_id`);
CREATE INDEX `_folders_v_updated_at_idx` ON `_folders_v` (`updated_at`);
CREATE INDEX `_folders_v_version_version__h_folders_idx` ON `_folders_v` (`version__h_folders_id`);
CREATE INDEX `_folders_v_version_version_created_at_idx` ON `_folders_v` (`version_created_at`);
CREATE INDEX `_folders_v_version_version_updated_at_idx` ON `_folders_v` (`version_updated_at`);
CREATE INDEX `_media_v_created_at_idx` ON `_media_v` (`created_at`);
CREATE INDEX `_media_v_parent_idx` ON `_media_v` (`parent_id`);
CREATE INDEX `_media_v_rels_order_idx` ON `_media_v_rels` (`order`);
CREATE INDEX `_media_v_rels_parent_idx` ON `_media_v_rels` (`parent_id`);
CREATE INDEX `_media_v_rels_path_idx` ON `_media_v_rels` (`path`);
CREATE INDEX `_media_v_rels_tags_id_idx` ON `_media_v_rels` (`tags_id`);
CREATE INDEX `_media_v_rels_users_id_idx` ON `_media_v_rels` (`users_id`);
CREATE INDEX `_media_v_updated_at_idx` ON `_media_v` (`updated_at`);
CREATE INDEX `_media_v_version_original_version_original_filename_idx` ON `_media_v` (`version_original_filename`);
CREATE INDEX `_media_v_version_variants_card_version_variants_card_fil_idx` ON `_media_v` (`version_variants_card_filename`);
CREATE INDEX `_media_v_version_version__h_folders_idx` ON `_media_v` (`version__h_folders_id`);
CREATE INDEX `_media_v_version_version_created_at_idx` ON `_media_v` (`version_created_at`);
CREATE INDEX `_media_v_version_version_filename_idx` ON `_media_v` (`version_filename`);
CREATE INDEX `_media_v_version_version_updated_at_idx` ON `_media_v` (`version_updated_at`);
CREATE INDEX `_pages_v_autosave_idx` ON `_pages_v` (`autosave`);
CREATE INDEX `_pages_v_blocks_content_order_idx` ON `_pages_v_blocks_content` (`_order`);
CREATE INDEX `_pages_v_blocks_content_parent_id_idx` ON `_pages_v_blocks_content` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_content_path_idx` ON `_pages_v_blocks_content` (`_path`);
CREATE INDEX `_pages_v_blocks_cta_order_idx` ON `_pages_v_blocks_cta` (`_order`);
CREATE INDEX `_pages_v_blocks_cta_parent_id_idx` ON `_pages_v_blocks_cta` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_cta_path_idx` ON `_pages_v_blocks_cta` (`_path`);
CREATE INDEX `_pages_v_blocks_faq_items_order_idx` ON `_pages_v_blocks_faq_items` (`_order`);
CREATE INDEX `_pages_v_blocks_faq_items_parent_id_idx` ON `_pages_v_blocks_faq_items` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_faq_order_idx` ON `_pages_v_blocks_faq` (`_order`);
CREATE INDEX `_pages_v_blocks_faq_parent_id_idx` ON `_pages_v_blocks_faq` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_faq_path_idx` ON `_pages_v_blocks_faq` (`_path`);
CREATE INDEX `_pages_v_blocks_features_items_order_idx` ON `_pages_v_blocks_features_items` (`_order`);
CREATE INDEX `_pages_v_blocks_features_items_parent_id_idx` ON `_pages_v_blocks_features_items` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_features_order_idx` ON `_pages_v_blocks_features` (`_order`);
CREATE INDEX `_pages_v_blocks_features_parent_id_idx` ON `_pages_v_blocks_features` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_features_path_idx` ON `_pages_v_blocks_features` (`_path`);
CREATE INDEX `_pages_v_blocks_hero_order_idx` ON `_pages_v_blocks_hero` (`_order`);
CREATE INDEX `_pages_v_blocks_hero_parent_id_idx` ON `_pages_v_blocks_hero` (`_parent_id`);
CREATE INDEX `_pages_v_blocks_hero_path_idx` ON `_pages_v_blocks_hero` (`_path`);
CREATE INDEX `_pages_v_created_at_idx` ON `_pages_v` (`created_at`);
CREATE INDEX `_pages_v_latest_idx` ON `_pages_v` (`latest`);
CREATE INDEX `_pages_v_parent_idx` ON `_pages_v` (`parent_id`);
CREATE INDEX `_pages_v_rels_order_idx` ON `_pages_v_rels` (`order`);
CREATE INDEX `_pages_v_rels_parent_idx` ON `_pages_v_rels` (`parent_id`);
CREATE INDEX `_pages_v_rels_path_idx` ON `_pages_v_rels` (`path`);
CREATE INDEX `_pages_v_rels_users_id_idx` ON `_pages_v_rels` (`users_id`);
CREATE INDEX `_pages_v_updated_at_idx` ON `_pages_v` (`updated_at`);
CREATE INDEX `_pages_v_version_version__status_idx` ON `_pages_v` (`version__status`);
CREATE INDEX `_pages_v_version_version_created_at_idx` ON `_pages_v` (`version_created_at`);
CREATE INDEX `_pages_v_version_version_slug_idx` ON `_pages_v` (`version_slug`);
CREATE INDEX `_pages_v_version_version_updated_at_idx` ON `_pages_v` (`version_updated_at`);
CREATE INDEX `_posts_v_autosave_idx` ON `_posts_v` (`autosave`);
CREATE INDEX `_posts_v_created_at_idx` ON `_posts_v` (`created_at`);
CREATE INDEX `_posts_v_latest_idx` ON `_posts_v` (`latest`);
CREATE INDEX `_posts_v_parent_idx` ON `_posts_v` (`parent_id`);
CREATE INDEX `_posts_v_rels_order_idx` ON `_posts_v_rels` (`order`);
CREATE INDEX `_posts_v_rels_parent_idx` ON `_posts_v_rels` (`parent_id`);
CREATE INDEX `_posts_v_rels_path_idx` ON `_posts_v_rels` (`path`);
CREATE INDEX `_posts_v_rels_users_id_idx` ON `_posts_v_rels` (`users_id`);
CREATE INDEX `_posts_v_updated_at_idx` ON `_posts_v` (`updated_at`);
CREATE INDEX `_posts_v_version_version__status_idx` ON `_posts_v` (`version__status`);
CREATE INDEX `_posts_v_version_version_cover_idx` ON `_posts_v` (`version_cover_id`);
CREATE INDEX `_posts_v_version_version_created_at_idx` ON `_posts_v` (`version_created_at`);
CREATE INDEX `_posts_v_version_version_slug_idx` ON `_posts_v` (`version_slug`);
CREATE INDEX `_posts_v_version_version_updated_at_idx` ON `_posts_v` (`version_updated_at`);
CREATE INDEX `_site_settings_v_created_at_idx` ON `_site_settings_v` (`created_at`);
CREATE INDEX `_site_settings_v_rels_order_idx` ON `_site_settings_v_rels` (`order`);
CREATE INDEX `_site_settings_v_rels_parent_idx` ON `_site_settings_v_rels` (`parent_id`);
CREATE INDEX `_site_settings_v_rels_path_idx` ON `_site_settings_v_rels` (`path`);
CREATE INDEX `_site_settings_v_rels_users_id_idx` ON `_site_settings_v_rels` (`users_id`);
CREATE INDEX `_site_settings_v_updated_at_idx` ON `_site_settings_v` (`updated_at`);
CREATE INDEX `_site_settings_v_version_navigation_order_idx` ON `_site_settings_v_version_navigation` (`_order`);
CREATE INDEX `_site_settings_v_version_navigation_parent_id_idx` ON `_site_settings_v_version_navigation` (`_parent_id`);
CREATE INDEX `_tags_v_created_at_idx` ON `_tags_v` (`created_at`);
CREATE INDEX `_tags_v_parent_idx` ON `_tags_v` (`parent_id`);
CREATE INDEX `_tags_v_rels_order_idx` ON `_tags_v_rels` (`order`);
CREATE INDEX `_tags_v_rels_parent_idx` ON `_tags_v_rels` (`parent_id`);
CREATE INDEX `_tags_v_rels_path_idx` ON `_tags_v_rels` (`path`);
CREATE INDEX `_tags_v_rels_users_id_idx` ON `_tags_v_rels` (`users_id`);
CREATE INDEX `_tags_v_updated_at_idx` ON `_tags_v` (`updated_at`);
CREATE INDEX `_tags_v_version_version__h_tags_idx` ON `_tags_v` (`version__h_tags_id`);
CREATE INDEX `_tags_v_version_version_created_at_idx` ON `_tags_v` (`version_created_at`);
CREATE INDEX `_tags_v_version_version_updated_at_idx` ON `_tags_v` (`version_updated_at`);
CREATE INDEX `_users_v_created_at_idx` ON `_users_v` (`created_at`);
CREATE INDEX `_users_v_parent_idx` ON `_users_v` (`parent_id`);
CREATE INDEX `_users_v_rels_order_idx` ON `_users_v_rels` (`order`);
CREATE INDEX `_users_v_rels_parent_idx` ON `_users_v_rels` (`parent_id`);
CREATE INDEX `_users_v_rels_path_idx` ON `_users_v_rels` (`path`);
CREATE INDEX `_users_v_rels_users_id_idx` ON `_users_v_rels` (`users_id`);
CREATE INDEX `_users_v_updated_at_idx` ON `_users_v` (`updated_at`);
CREATE INDEX `_users_v_version_sessions_order_idx` ON `_users_v_version_sessions` (`_order`);
CREATE INDEX `_users_v_version_sessions_parent_id_idx` ON `_users_v_version_sessions` (`_parent_id`);
CREATE INDEX `_users_v_version_version_created_at_idx` ON `_users_v` (`version_created_at`);
CREATE INDEX `_users_v_version_version_email_idx` ON `_users_v` (`version_email`);
CREATE INDEX `_users_v_version_version_updated_at_idx` ON `_users_v` (`version_updated_at`);
CREATE INDEX `folders__h_folders_idx` ON `folders` (`_h_folders_id`);
CREATE INDEX `folders_created_at_idx` ON `folders` (`created_at`);
CREATE INDEX `folders_rels_order_idx` ON `folders_rels` (`order`);
CREATE INDEX `folders_rels_parent_idx` ON `folders_rels` (`parent_id`);
CREATE INDEX `folders_rels_path_idx` ON `folders_rels` (`path`);
CREATE INDEX `folders_rels_users_id_idx` ON `folders_rels` (`users_id`);
CREATE INDEX `folders_updated_at_idx` ON `folders` (`updated_at`);
CREATE INDEX `media__h_folders_idx` ON `media` (`_h_folders_id`);
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);
CREATE INDEX `media_original_original_filename_idx` ON `media` (`original_filename`);
CREATE INDEX `media_rels_order_idx` ON `media_rels` (`order`);
CREATE INDEX `media_rels_parent_idx` ON `media_rels` (`parent_id`);
CREATE INDEX `media_rels_path_idx` ON `media_rels` (`path`);
CREATE INDEX `media_rels_tags_id_idx` ON `media_rels` (`tags_id`);
CREATE INDEX `media_rels_users_id_idx` ON `media_rels` (`users_id`);
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);
CREATE INDEX `media_variants_card_variants_card_filename_idx` ON `media` (`variants_card_filename`);
CREATE INDEX `pages__status_idx` ON `pages` (`_status`);
CREATE INDEX `pages_blocks_content_order_idx` ON `pages_blocks_content` (`_order`);
CREATE INDEX `pages_blocks_content_parent_id_idx` ON `pages_blocks_content` (`_parent_id`);
CREATE INDEX `pages_blocks_content_path_idx` ON `pages_blocks_content` (`_path`);
CREATE INDEX `pages_blocks_cta_order_idx` ON `pages_blocks_cta` (`_order`);
CREATE INDEX `pages_blocks_cta_parent_id_idx` ON `pages_blocks_cta` (`_parent_id`);
CREATE INDEX `pages_blocks_cta_path_idx` ON `pages_blocks_cta` (`_path`);
CREATE INDEX `pages_blocks_faq_items_order_idx` ON `pages_blocks_faq_items` (`_order`);
CREATE INDEX `pages_blocks_faq_items_parent_id_idx` ON `pages_blocks_faq_items` (`_parent_id`);
CREATE INDEX `pages_blocks_faq_order_idx` ON `pages_blocks_faq` (`_order`);
CREATE INDEX `pages_blocks_faq_parent_id_idx` ON `pages_blocks_faq` (`_parent_id`);
CREATE INDEX `pages_blocks_faq_path_idx` ON `pages_blocks_faq` (`_path`);
CREATE INDEX `pages_blocks_features_items_order_idx` ON `pages_blocks_features_items` (`_order`);
CREATE INDEX `pages_blocks_features_items_parent_id_idx` ON `pages_blocks_features_items` (`_parent_id`);
CREATE INDEX `pages_blocks_features_order_idx` ON `pages_blocks_features` (`_order`);
CREATE INDEX `pages_blocks_features_parent_id_idx` ON `pages_blocks_features` (`_parent_id`);
CREATE INDEX `pages_blocks_features_path_idx` ON `pages_blocks_features` (`_path`);
CREATE INDEX `pages_blocks_hero_order_idx` ON `pages_blocks_hero` (`_order`);
CREATE INDEX `pages_blocks_hero_parent_id_idx` ON `pages_blocks_hero` (`_parent_id`);
CREATE INDEX `pages_blocks_hero_path_idx` ON `pages_blocks_hero` (`_path`);
CREATE INDEX `pages_created_at_idx` ON `pages` (`created_at`);
CREATE INDEX `pages_rels_order_idx` ON `pages_rels` (`order`);
CREATE INDEX `pages_rels_parent_idx` ON `pages_rels` (`parent_id`);
CREATE INDEX `pages_rels_path_idx` ON `pages_rels` (`path`);
CREATE INDEX `pages_rels_users_id_idx` ON `pages_rels` (`users_id`);
CREATE UNIQUE INDEX `pages_slug_idx` ON `pages` (`slug`);
CREATE INDEX `pages_updated_at_idx` ON `pages` (`updated_at`);
CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);
CREATE INDEX `payload_llm_instructions_created_at_idx` ON `payload_llm_instructions` (`created_at`);
CREATE INDEX `payload_llm_instructions_entity_slug_idx` ON `payload_llm_instructions` (`entity_slug`);
CREATE INDEX `payload_llm_instructions_rels_order_idx` ON `payload_llm_instructions_rels` (`order`);
CREATE INDEX `payload_llm_instructions_rels_parent_idx` ON `payload_llm_instructions_rels` (`parent_id`);
CREATE INDEX `payload_llm_instructions_rels_path_idx` ON `payload_llm_instructions_rels` (`path`);
CREATE INDEX `payload_llm_instructions_rels_users_id_idx` ON `payload_llm_instructions_rels` (`users_id`);
CREATE INDEX `payload_llm_instructions_updated_at_idx` ON `payload_llm_instructions` (`updated_at`);
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);
CREATE INDEX `payload_locked_documents_rels_folders_id_idx` ON `payload_locked_documents_rels` (`folders_id`);
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);
CREATE INDEX `payload_locked_documents_rels_pages_id_idx` ON `payload_locked_documents_rels` (`pages_id`);
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);
CREATE INDEX `payload_locked_documents_rels_posts_id_idx` ON `payload_locked_documents_rels` (`posts_id`);
CREATE INDEX `payload_locked_documents_rels_tags_id_idx` ON `payload_locked_documents_rels` (`tags_id`);
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);
CREATE INDEX `posts__status_idx` ON `posts` (`_status`);
CREATE INDEX `posts_cover_idx` ON `posts` (`cover_id`);
CREATE INDEX `posts_created_at_idx` ON `posts` (`created_at`);
CREATE INDEX `posts_rels_order_idx` ON `posts_rels` (`order`);
CREATE INDEX `posts_rels_parent_idx` ON `posts_rels` (`parent_id`);
CREATE INDEX `posts_rels_path_idx` ON `posts_rels` (`path`);
CREATE INDEX `posts_rels_users_id_idx` ON `posts_rels` (`users_id`);
CREATE UNIQUE INDEX `posts_slug_idx` ON `posts` (`slug`);
CREATE INDEX `posts_updated_at_idx` ON `posts` (`updated_at`);
CREATE INDEX `site_settings_navigation_order_idx` ON `site_settings_navigation` (`_order`);
CREATE INDEX `site_settings_navigation_parent_id_idx` ON `site_settings_navigation` (`_parent_id`);
CREATE INDEX `site_settings_rels_order_idx` ON `site_settings_rels` (`order`);
CREATE INDEX `site_settings_rels_parent_idx` ON `site_settings_rels` (`parent_id`);
CREATE INDEX `site_settings_rels_path_idx` ON `site_settings_rels` (`path`);
CREATE INDEX `site_settings_rels_users_id_idx` ON `site_settings_rels` (`users_id`);
CREATE INDEX `tags__h_tags_idx` ON `tags` (`_h_tags_id`);
CREATE INDEX `tags_created_at_idx` ON `tags` (`created_at`);
CREATE INDEX `tags_rels_order_idx` ON `tags_rels` (`order`);
CREATE INDEX `tags_rels_parent_idx` ON `tags_rels` (`parent_id`);
CREATE INDEX `tags_rels_path_idx` ON `tags_rels` (`path`);
CREATE INDEX `tags_rels_users_id_idx` ON `tags_rels` (`users_id`);
CREATE INDEX `tags_updated_at_idx` ON `tags` (`updated_at`);
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);
CREATE INDEX `users_rels_order_idx` ON `users_rels` (`order`);
CREATE INDEX `users_rels_parent_idx` ON `users_rels` (`parent_id`);
CREATE INDEX `users_rels_path_idx` ON `users_rels` (`path`);
CREATE INDEX `users_rels_users_id_idx` ON `users_rels` (`users_id`);
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);
