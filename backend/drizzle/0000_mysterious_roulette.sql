CREATE TABLE `ongs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp` text NOT NULL,
	`city` text NOT NULL,
	`uf` text(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`value` text NOT NULL,
	`ong_id` text NOT NULL,
	FOREIGN KEY (`ong_id`) REFERENCES `ongs`(`id`) ON UPDATE no action ON DELETE no action
);
