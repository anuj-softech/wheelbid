import type {ConnectRouter} from "@connectrpc/connect";
import {CarService} from "../../proto/gen/wheelbid/v1/car_pb";
import {carService} from "../services/car_service";

export const dataRouter = (router: ConnectRouter) => {
    router.service(CarService, carService);
};

