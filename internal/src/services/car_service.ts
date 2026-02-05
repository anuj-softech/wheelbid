import { validate as isValidUUID } from "uuid";
import { cars } from "../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { create } from "@bufbuild/protobuf";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { ConnectError, Code } from "@connectrpc/connect";
import {
    CarSchema,
    CarListResponseSchema,
    FuelType,
    Transmission,
    DealType,GetCarRequest,
    ListCarsRequest
} from "../../proto/gen/wheelbid/v1/car_pb";
import {db} from "../db/main";


const fuelMap: Record<string, FuelType> = {
    petrol: FuelType.PETROL,
    diesel: FuelType.DIESEL,
    electric: FuelType.ELECTRIC,
    hybrid: FuelType.HYBRID,
    cng: FuelType.CNG,
};

const transmissionMap: Record<string, Transmission> = {
    manual: Transmission.MANUAL,
    automatic: Transmission.AUTOMATIC,
    amt: Transmission.AMT,
};

const dealTypeMap: Record<string, DealType> = {
    sell: DealType.SELL,
    auction: DealType.AUCTION,
    sold: DealType.SOLD,
    unavailable: DealType.UNAVAILABLE,
};

const dbToProto = (car: typeof cars.$inferSelect) => {
    return create(CarSchema, {
        id: car.id,
        officeId: car.officeId || undefined,
        cityId: car.cityId || undefined,
        createdBy: car.createdBy || undefined,
        make: car.make,
        model: car.model,
        year: car.year,
        vin: car.vin || "",
        registrationNumber: car.registrationNumber || "",
        fuelType: fuelMap[car.fuelType] ?? FuelType.PETROL,
        transmission: transmissionMap[car.transmission] ?? Transmission.MANUAL,
        kilometersDriven: car.kilometersDriven,
        ownershipCount: car.ownershipCount,
        bodyType: car.bodyType || undefined,
        exteriorColor: car.exteriorColor || undefined,
        conditionGrade: car.conditionGrade || undefined,
        basePrice: BigInt(car.basePrice),
        description: car.description || undefined,
        dealType: dealTypeMap[car.dealType],
        isFeatured: car.isFeatured || false,
        createdAt: car.createdAt ? timestampFromDate(car.createdAt) : undefined,
        updatedAt: car.updatedAt ? timestampFromDate(car.updatedAt) : undefined,
    });
};

export const carService = {
    async getCar(req: GetCarRequest) {
        try {
            if (!req.id || req.id.trim() === "" || !isValidUUID(req.id)) {
                throw new ConnectError("Invalid or missing Car ID", Code.InvalidArgument);
            }

            console.log(`Fetching car with ID: ${req.id}`);

            const [result] = await db
                .select()
                .from(cars)
                .where(eq(cars.id, req.id))
                .limit(1);

            if (!result) {
                throw new ConnectError("Car not found", Code.NotFound);
            }

            return dbToProto(result);
        } catch (err) {
            console.error("Error in getCar:", err);
            if (err instanceof ConnectError) throw err;
            throw new ConnectError("Internal Server Error", Code.Internal);
        }
    },

    async listCars(req: ListCarsRequest) {
        const filters = [];

        if (req.cityId) {
            filters.push(eq(cars.cityId, req.cityId));
        }

        if (req.dealType !== undefined && req.dealType !== null) {
            const statusKey = Object.keys(dealTypeMap).find(
                key => dealTypeMap[key] === req.dealType
            );
            if (statusKey) {
                filters.push(eq(cars.dealType, statusKey as any));
            }
        }

        const [countResult] = await db
            .select({ count: sql<number>`count(*)` })
            .from(cars)
            .where(and(...filters));

        const results = await db
            .select()
            .from(cars)
            .where(and(...filters))
            .limit(req.limit || 10)
            .offset(req.offset || 0)
            .orderBy(desc(cars.createdAt));

        return create(CarListResponseSchema, {
            cars: results.map(dbToProto),
            totalCount: countResult?.count || 0,
        });
    },
};