CREATE TABLE `ai_usage` (
	`key` text NOT NULL,
	`kind` text NOT NULL,
	`day` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`key`, `kind`, `day`)
);
--> statement-breakpoint
CREATE TABLE `problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`level` integer NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`function_name` text DEFAULT 'solution' NOT NULL,
	`params` text NOT NULL,
	`examples` text NOT NULL,
	`tests` text NOT NULL,
	`reference_solution` text,
	`source` text DEFAULT 'seed' NOT NULL,
	`created_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`problem_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`code` text NOT NULL,
	`passed` integer NOT NULL,
	`passed_count` integer NOT NULL,
	`total_count` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `submissions_user_idx` ON `submissions` (`user_id`,`problem_id`);