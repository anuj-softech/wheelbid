import {
    pgTable, uuid, varchar, text, integer, bigint,
    timestamp, boolean, pgEnum
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["super", "manager", "staff"]);
export const dealTypeEnum = pgEnum("deal_type", ["sell", "auction", "sold", "unavailable"]);
export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "electric", "hybrid", "cng"]);
export const transmissionEnum = pgEnum("transmission", ["manual", "automatic", "amt"]);
export const dealStatusEnum = pgEnum("deal_status", ["enquiry" , "provisional", "cancel", "done"]);

export const cities = pgTable("cities", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    state: varchar("state", { length: 100 }).notNull(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

export const offices = pgTable("offices", {
    id: uuid("id").primaryKey().defaultRandom(),
    cityId: uuid("city_id").references(() => cities.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address").notNull(),
    contactNumber: varchar("contact_number", { length: 20 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: varchar("phone", { length: 15 }).unique().notNull(),
    name: varchar("name", { length: 255 }),
    cityId: uuid("city_id").references(() => cities.id),
    address: text("address"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

export const admins = pgTable("admins", {
    id: uuid("id").primaryKey().defaultRandom(),
    officeId: uuid("office_id").references(() => offices.id),
    email: varchar("email", { length: 255 }).unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("staff").notNull(),
    lastLogin: timestamp("last_login"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const cars = pgTable("cars", {
    id: uuid("id").primaryKey().defaultRandom(),
    officeId: uuid("office_id").references(() => offices.id, { onDelete: "cascade" }),
    cityId: uuid("city_id").references(() => cities.id),
    createdBy: uuid("created_by").references(() => admins.id),

    make: varchar("make", { length: 50 }).notNull(),
    model: varchar("model", { length: 100 }).notNull(),
    year: integer("year").notNull(),
    vin: varchar("vin", { length: 17 }).unique(),
    registrationNumber: varchar("registration_number", { length: 20 }).unique(),

    fuelType: fuelTypeEnum("fuel_type").notNull(),
    transmission: transmissionEnum("transmission").notNull(),
    kilometersDriven: integer("kilometers_driven").notNull(),
    ownershipCount: integer("ownership_count").notNull(),
    bodyType: varchar("body_type", { length: 50 }),
    exteriorColor: varchar("exterior_color", { length: 50 }),
    conditionGrade: varchar("condition_grade", { length: 50 }),

    basePrice: bigint("base_price", { mode: "number" }).notNull(),
    description: text("description"),
    dealType: dealTypeEnum("deal_type").default("sell").notNull(),
    isFeatured: boolean("is_featured").default(false),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow()
});

export const auctions = pgTable("auctions", {
    id: uuid("id").primaryKey().defaultRandom(),
    carId: uuid("car_id").references(() => cars.id, { onDelete: "cascade" }),
    officeId: uuid("office_id").references(() => offices.id),
    cityId: uuid("city_id").references(() => cities.id),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    currentBid: bigint("current_bid", { mode: "number" }).default(0),
    minNextBid: bigint("min_next_bid", { mode: "number" }).default(0),
    processed: boolean("processed").default(false),
});

export const bids = pgTable("bids", {
    id: uuid("id").primaryKey().defaultRandom(),
    auctionId: uuid("auction_id").references(() => auctions.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id),
    bidAmount: bigint("bid_amount", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const deals = pgTable("deals", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id),
    carId: uuid("car_id").references(() => cars.id),
    dealType: dealTypeEnum("deal_type").default("sell").notNull(),
    dealStatus: dealStatusEnum("deal_status").default("provisional").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})