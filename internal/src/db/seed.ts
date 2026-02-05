import { cities, offices, admins, users, cars, auctions, bids } from "./schema";
import { faker } from "@faker-js/faker";
import {db} from "./main";

async function seed() {
    console.log("🌱 Starting Seed...");

    // 1. Create Cities
    console.log("Creating Cities...");
    const cityIds: string[] = [];
    const cityData = [
        { name: "New Delhi", state: "Delhi" },
        { name: "Mumbai", state: "Maharashtra" },
        { name: "Bangalore", state: "Karnataka" },
    ];

    for (const c of cityData) {
        const [city] = await db.insert(cities).values({
            name: c.name,
            state: c.state
        }).returning({ id: cities.id });
        cityIds.push(city.id);
    }

    // 2. Create Offices (1 per city)
    console.log("Creating Offices...");
    const officeIds: string[] = [];
    for (const cityId of cityIds) {
        const [office] = await db.insert(offices).values({
            cityId: cityId,
            name: `${faker.location.city()} Branch`,
            address: faker.location.streetAddress(),
            contactNumber: faker.phone.number(),
        }).returning({ id: offices.id });
        officeIds.push(office.id);
    }

    // 3. Create Admins (1 per office)
    console.log("Creating Admins...");
    const adminIds: string[] = [];
    for (const officeId of officeIds) {
        const [admin] = await db.insert(admins).values({
            officeId: officeId,
            email: faker.internet.email(),
            passwordHash: "hashed_password_123", // In real app, hash this!
            fullName: faker.person.fullName(),
            role: "manager",
        }).returning({ id: admins.id });
        adminIds.push(admin.id);
    }

    // 4. Create Users (20 users)
    console.log("Creating Users...");
    const userIds: string[] = [];
    for (let i = 0; i < 20; i++) {
        const [user] = await db.insert(users).values({
            phone: faker.phone.number({ style: 'international' }),
            name: faker.person.fullName(),
            cityId: cityIds[Math.floor(Math.random() * cityIds.length)], // Random city
            address: faker.location.streetAddress(),
        }).returning({ id: users.id });
        userIds.push(user.id);
    }

    // 5. Create Cars (50 cars)
    console.log("Creating Cars...");
    const carIds: string[] = [];
    for (let i = 0; i < 50; i++) {
        const officeId = officeIds[Math.floor(Math.random() * officeIds.length)];
        const [car] = await db.insert(cars).values({
            officeId: officeId,
            cityId: cityIds[0], // Simplified: all cars linked to first city logic or random
            createdBy: adminIds[0],
            make: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
            year: faker.date.past({ years: 10 }).getFullYear(),
            vin: faker.vehicle.vin(),
            registrationNumber: faker.vehicle.vrm(),
            fuelType: faker.helpers.arrayElement(["petrol", "diesel", "electric"]),
            transmission: faker.helpers.arrayElement(["manual", "automatic"]),
            kilometersDriven: faker.number.int({ min: 1000, max: 100000 }),
            ownershipCount: faker.number.int({ min: 1, max: 3 }),
            basePrice: faker.number.int({ min: 30000000, max: 80000000 }),
            description: faker.lorem.sentence(),
            dealType: "auction",
        }).returning({ id: cars.id });
        carIds.push(car.id);
    }

    // 6. Create Auctions for those cars
    console.log("Creating Auctions...");
    const auctionIds: string[] = [];
    for (const carId of carIds) {
        const [auction] = await db.insert(auctions).values({
            carId: carId,
            officeId: officeIds[0],
            cityId: cityIds[0],
            startsAt: new Date(),
            endsAt: faker.date.future(),
            currentBid: (0),
            minNextBid: (100000),
            processed: false,
        }).returning({ id: auctions.id });
        auctionIds.push(auction.id);
    }

    // 7. Place Random Bids
    console.log("Placing Bids...");
    for (const auctionId of auctionIds) {
        // Add 3-5 bids per auction
        const numBids = faker.number.int({ min: 3, max: 5 });
        for (let k = 0; k < numBids; k++) {
            await db.insert(bids).values({
                auctionId: auctionId,
                userId: userIds[Math.floor(Math.random() * userIds.length)],
                bidAmount: (faker.number.int({ min: 30000000, max: 90000000 })),
            });
        }
    }

    console.log("✅ Seeding Complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});