import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  price: doublePrecision("price").notNull(),
  instructorId: integer("instructor_id")
    .references(() => users.id)
    .notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .references(() => courses.id)
    .notNull(),
  title: text("title").notNull(),
  duration: integer("duration").notNull(),
  videoId: integer("video_id")
    .references(() => videos.id)
    .notNull(),
  orderIndex: integer("order_index").notNull(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  storageKey: text("storage_key").notNull().unique(),
  duration: integer("duration").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const enrollments = pgTable(
  "enrollments",
  {
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    courseId: integer("course_id")
      .references(() => courses.id)
      .notNull(),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
    status: text("status").notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.courseId] })],
);

export const watchProgress = pgTable(
  "watch_progress",
  {
    userId: integer("user_id")
      .references(() => users.id)
      .notNull(),
    lessonId: integer("lesson_id")
      .references(() => lessons.id)
      .notNull(),
    positionSeconds: integer("position_seconds").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
);

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  deviceId: text("device_id").notNull(),
  deviceType: text("device_type").notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type WatchProgress = typeof watchProgress.$inferSelect;
export type NewWatchProgress = typeof watchProgress.$inferInsert;
export type Device = typeof devices.$inferSelect;
export type NewDevice = typeof devices.$inferInsert;
