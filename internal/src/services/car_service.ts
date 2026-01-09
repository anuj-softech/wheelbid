import {create} from "@bufbuild/protobuf";
import {CarSchema} from "../../proto/gen/wheelbid/v1/car_pb";
import {timestampFromDate} from "@bufbuild/protobuf/wkt";
import {FeaturesSchema, FuelType, TransmissionType} from "../../proto/gen/wheelbid/v1/features_pb";

export const carService = {
    async getCarDetails() {
        return create(CarSchema, {
            name: "Classic Mustang 1967",
            desc: "A beautifully restored vintage Mustang with original parts and premium paint.",
            location: "Bhopal, MP",
            address: "Arera Colony, Near Bittan Market, Bhopal, Madhya Pradesh 462016",
            modelType: "Fastback",
            basePriceINR: 5000000,
            currentBid: 5250000,
            auctionActive: true,
            auctionClosingTime: timestampFromDate(new Date("2026-01-15T18:00:00Z")),

            features: create(FeaturesSchema, {
                transmission: TransmissionType.MANUAL,
                fuel: FuelType.PETROL,
                exteriorColor: "Candy Apple Red",
                interiorColor: "Black Leather",
                mileageKm: 12500,
                manufactureYear: 1967,
                ownersCount: 2,
                hasSunroof: false,
                hasNavigation: true,
                isInsured: true,
            }),
        });
    },
};