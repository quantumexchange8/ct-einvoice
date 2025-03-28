import Button from "@/Components/Button";
import { ExportIcon, PlusIcon } from "@/Components/Outline";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import MerchantTable from "./Partials/MerchantTable";
import CountUp from "react-countup";

export default function Merchant() {

    const [totalClient, setTotalClient] = useState();
    const [totalActiveClient, setTotalActiveClient] = useState();
    const [totalInactiveClient, setTotalInactiveClient] = useState();
    const [isLoading, setIsLoading] = useState(true);
    
    const CountTotalMerchant = async () => {
        try {

            const response = await axios.get('/countTotalMerchant');
            
            setTotalClient(response.data.total_client);
            setTotalActiveClient(response.data.active_client);
            setTotalInactiveClient(response.data.inactive_client);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        CountTotalMerchant();
    }, []);
    

    return (
        <AuthenticatedLayout>
            <Head title='Merchant Listing' />

            <div className="flex flex-col gap-4 py-5 px-6">
                <div className="flex items-center gap-4">
                    <div className="w-full border-l border-vulcan-700 shadow-card rounded-sm">
                        <div className="p-4 flex justify-between items-center border border-vulcan-200 rounded-sm ">
                            <div className="text-sm font-medium text-vulcan-900">Total <span className="text-vulcan-500 text-sm">Client</span></div>
                            <div className="text-vulcan-900 font-Lora text-3xl font-medium">
                                <CountUp end={isLoading ? 10 : totalClient} duration={1}/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-l border-vulcan-700 shadow-card rounded-sm">
                        <div className="p-4 flex justify-between items-center border border-vulcan-200 rounded-sm ">
                            <div className="text-sm font-medium text-vulcan-900">Active <span className="text-vulcan-500 text-sm">Client</span></div>
                            <div className="text-vulcan-900 font-Lora text-3xl font-medium">
                                <CountUp end={isLoading ? 10 : totalActiveClient} duration={1}/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full border-l border-vulcan-700 shadow-card rounded-sm">
                        <div className="p-4 flex justify-between items-center border border-vulcan-200 rounded-sm ">
                            <div className="text-sm font-medium text-vulcan-900">Inactive <span className="text-vulcan-500 text-sm">Client</span></div>
                            <div className="text-vulcan-900 font-Lora text-3xl font-medium">
                                <CountUp end={isLoading ? 10 : totalInactiveClient} duration={1}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-4 border border-vulcan-200 rounded-sm shadow-card">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col w-2/3">
                            <div className="text-vulcan-900 text-lg font-bold font-Lora">List of <span className="text-vulcan-500">Client</span></div>
                            <div className="text-xs text-vulcan-900">Active client and inactive client will all be shown up in this list.</div>
                        </div>
                        <div className="flex items-center justify-end gap-3 w-1/3">
                            <Button
                                size="sm"
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <ExportIcon />
                                Export
                            </Button>
                            <Link href={route('add-merchant')}>
                                <Button
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <PlusIcon />
                                    Add Merchant
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <MerchantTable />
                </div>
            </div>
        </AuthenticatedLayout>
    )
}