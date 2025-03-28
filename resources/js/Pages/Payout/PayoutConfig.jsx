import Button from "@/Components/Button";
import Modal from "@/Components/Modal";
import { DotVerticleIcon } from "@/Components/Outline";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PayoutConfig() {

    const [payout, setPayout] = useState([]);
    const [merchant, setMerchant] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const envType = [
        { name: 'staging', value: 'staging'},
        { name: 'production', value: 'production'},
    ]

    const fetchPayout = async () => {
        try {

            const response = await axios.get('/getPayout');
            
            setPayout(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMerchant = async () => {
        try {

            const response = await axios.get('/getMerchants');
            
            setMerchant(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayout();
        fetchMerchant();
    }, []);

    const merchantTemplate = (data) => {
        return (
            <div>
                {data.merchant.name}
            </div>
        )
    }

    const actionTemplate = (data) => {
        return (
            <div className="cursor-pointer hover:bg-vulcan-50 rounded-full w-6 h-6 flex items-center justify-center">
                <DotVerticleIcon />
            </div>
        )
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        merchant: '',
        env: 'staging',
        url: '',
    });

    const openAddPayout = () => {
        setIsOpen(true);
    }
    const closeAddPayout = () => {
        setIsOpen(false);
    }

    const submit = (e) => {
        e.preventDefault();
        post('/store-payout', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                fetchPayout();
                reset();
                closeAddPayout();
                toast.success('Succesfully Added.', {
                    title: 'Succesfully Added.',
                    duration: 3000,
                    variant: 'variant3',
                });
            }
        })
    }
    
    return (
        <AuthenticatedLayout>
            <div className="flex flex-col gap-5 py-5 px-6">
                <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">Payout Config</div>
                    <div>
                        <Button size="md" onClick={openAddPayout}>
                            Add Payout
                        </Button>
                    </div>
                </div>
                
                <div>
                    <DataTable
                        value={payout}
                        paginator 
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        tableStyle={{ minWidth: '50rem' }}
                        scrollable
                    >
                        <Column field="id" header="Merchant Name" body={merchantTemplate}  ></Column>
                        <Column field="url" header="URL"  ></Column>
                        <Column field="callBackUrl" header="Callback Url"  ></Column>
                        <Column field="secret_key" header="API Key" ></Column>
                        <Column field="" header="" body={actionTemplate} style={{ minWidth: '40px', maxWidth: '40px' }}></Column>
                    </DataTable>
                </div>
            </div>

            <Modal
                show={isOpen}
                onClose={closeAddPayout}
                maxWidthClass='sm'
                header='Add Payout'
                footer={
                    <div className="flex justify-end gap-5 ">
                        <Button variant="redOutline" size="md" onClick={closeAddPayout}>Cancel</Button>
                        <Button size="md" disabled={processing} onClick={submit}>Save</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center w-full gap-6">
                        <div className="max-w-40 w-full text-base font-medium">Merchant</div>
                        <div className="w-full">
                            <Dropdown 
                                value={data.merchant}
                                onChange={(e) => setData('merchant', e.value)} 
                                options={merchant} 
                                optionLabel="name" 
                                placeholder="Select merchant"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex items-center w-full gap-6">
                        <div className="max-w-40 w-full text-base font-medium">Env</div>
                        <div className="w-full">
                            <Dropdown 
                                value={data.env}
                                onChange={(e) => setData('env', e.value)} 
                                options={envType} 
                                optionLabel="name" 
                                placeholder="Select env"
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className="flex items-center w-full gap-6">
                        <div className="max-w-40 w-full text-base font-medium">URL</div>
                        <div className="w-full">
                            <TextInput
                                id="url"
                                type="text"
                                name="url"
                                value={data.url}
                                className="mt-1 w-full box-border h-11"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('url', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center w-full gap-6">
                        <div className="max-w-40 w-full text-base font-medium">Callback Url</div>
                        <div className="w-full">
                            <TextInput
                                id="callback_url"
                                type="text"
                                name="callback_url"
                                value={data.callback_url}
                                className="mt-1 w-full box-border h-11"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('callback_url', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )
}