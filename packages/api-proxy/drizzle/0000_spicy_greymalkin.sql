CREATE TABLE `memory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`shard` text NOT NULL,
	`path` text NOT NULL,
	`data` text NOT NULL,
	`datetime` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `token_index` ON `memory` (`token`);