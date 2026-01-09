import { useEffect, useState } from 'react';
import { transport } from './lib/rpc-client';
import {type Car, CarService} from "./gen/proto/wheelbid/v1/car_pb.ts";
import {createClient} from "@connectrpc/connect";

export default function App() {
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCar() {
            try {
                // Calling your ConnectRPC server
                let carClient = createClient(CarService, transport);
                const response = await carClient.getCarDetails({});
                setCar(response);
            } catch (error) {
                console.error("Failed to fetch car from Bhopal server:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCar();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">WheelBid</h1>
                        <p className="text-slate-500">Premium Auctions • {car?.location}</p>
                    </div>
                    <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                        {car?.auctionActive ? '● Live Auction' : 'Auction Closed'}
                    </div>
                </header>

                <main className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold">{car?.name}</h2>
                                <p className="text-slate-600 mt-2 max-w-xl">{car?.desc}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400 uppercase font-semibold">Current Bid</p>
                                <p className="text-4xl font-black text-blue-600">
                                    ₹{car?.currentBid.toLocaleString('en-IN')}
                                </p>
                            </div>
                        </div>

                        <hr className="my-8 border-slate-100" />

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <Spec label="Transmission" value={car?.features?.transmission === 1 ? 'Manual' : 'Auto'} />
                            <Spec label="Fuel Type" value="Petrol" />
                            <Spec label="Mileage" value={`${car?.features?.mileageKm.toLocaleString()} km`} />
                            <Spec label="Location" value="Bhopal, MP" />
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200">
                                Place a Bid
                            </button>
                            <button className="px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl border border-slate-200 transition-all">
                                View History
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                        <span>Location: {car?.address}</span>
                        <span>Closing: {new Date(Number(car?.auctionClosingTime?.seconds) * 1000).toLocaleDateString()}</span>
                    </div>
                </main>
            </div>
        </div>
    );
}

function Spec({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">{label}</p>
            <p className="font-semibold text-slate-800">{value}</p>
        </div>
    );
}