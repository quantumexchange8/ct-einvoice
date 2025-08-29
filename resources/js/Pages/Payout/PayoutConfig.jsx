import Button from "@/Components/Button";
import Modal from "@/Components/Modal";
import { DotVerticleIcon } from "@/Components/Outline";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Menu } from "primereact/menu";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function PayoutConfig() {

    const [payout, setPayout] = useState([]);
    const [merchant, setMerchant] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editOpen, setIsEditOpen] = useState(false);
    const [selectedToEdit, setSelectedToEdit] = useState(null);

    const envType = [
        { name: 'staging', value: 'staging'},
        { name: 'production', value: 'production'},
    ]

    const versionArr = [
        { name: 'v1.0', value: '1.0'},
        { name: 'v1.1', value: '1.1'},
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

    const editPayoutOpen = (row) => {
        setIsEditOpen(true);
        setSelectedToEdit(row);
    }
    const closeEditPayout = () => {
        setIsEditOpen(false);
        setSelectedToEdit(null);
    }

    const actionTemplate = (rowData) => {
        const menuRight = useRef(null);
        const items = [
            {
                label: 'Edit',
                template: () => {
                    return (
                        <div className="p-menuitem-content py-2 px-3 flex items-center gap-3 cursor-pointer" data-pc-section="content" onClick={(e) => {
                            e.stopPropagation()
                            editPayoutOpen(rowData)
                            menuRight.current.hide(e);
                        }}  >
                            
                            <span className="text-vulcan-700 text-sm font-medium">Edit</span>
                        </div>
                    );
                }
            }
            
        ];
        return (
            <>
                <Button size="sm" variant="textOnly" label="Show Right" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup>
                    <DotVerticleIcon />
                </Button>
                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            </>
        )
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        merchant: '',
        env: 'staging',
        url: '',
        version: '1.0',
        callback_url: '',
        cert_path: '',
    });

    const openAddPayout = () => {
        setIsOpen(true);
    }
    const closeAddPayout = () => {
        setIsOpen(false);
    }
    
    useEffect(() => {
        if (selectedToEdit) {
            setData({
                id: selectedToEdit.id,
                env: selectedToEdit.env,
                url: selectedToEdit.url,
                version: selectedToEdit.version,
                callback_url: selectedToEdit.callBackUrl,
                cert_path: selectedToEdit.cert_path
            })
        }
    }, [selectedToEdit])

    const submit = (e) => {
        e.preventDefault();
        post('/store-payout', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                fetchPayout();
                reset();
                closeEditPayout();
                toast.success('Succesfully Added.', {
                    title: 'Succesfully Added.',
                    duration: 3000,
                    variant: 'variant3',
                });
            }
        })
    }

    const update = (e) => {
        e.preventDefault();
        post('/update-payout', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                fetchPayout();
                closeAddPayout();
                toast.success('Succesfully updated.', {
                    title: 'Succesfully updated.',
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
                        <Column field="version" header="Version"  ></Column>
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
                        <div className="max-w-40 w-full text-base font-medium">Version</div>
                        <div className="w-full">
                            <Dropdown 
                                value={data.version}
                                onChange={(e) => setData('version', e.value)} 
                                options={versionArr} 
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
                    <div className="flex items-center w-full gap-6">
                        <div className="max-w-40 w-full text-base font-medium">Cert Path</div>
                        <div className="w-full">
                            <TextInput
                                id="cert_path"
                                type="text"
                                name="cert_path"
                                value={data.cert_path}
                                className="mt-1 w-full box-border h-11"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('cert_path', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                show={editOpen}
                onClose={closeEditPayout}
                maxWidthClass='sm'
                header='Edit Payout'
                footer={
                    <div className="flex justify-end gap-5 ">
                        <Button variant="redOutline" size="md" onClick={closeEditPayout}>Cancel</Button>
                        <Button size="md" disabled={processing} onClick={update}>Save</Button>
                    </div>
                }
            >
                <div className="flex flex-col gap-5 w-full">
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
                        <div className="max-w-40 w-full text-base font-medium">Version</div>
                        <div className="w-full">
                            <Dropdown 
                                value={data.version}
                                onChange={(e) => setData('version', e.value)} 
                                options={versionArr} 
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
                    <div className="flex items-center w-full gap-6">
                        <div className="max-w-40 w-full text-base font-medium">Cert Path</div>
                        <div className="w-full">
                            <TextInput
                                id="cert_path"
                                type="text"
                                name="cert_path"
                                value={data.cert_path}
                                className="mt-1 w-full box-border h-11"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('cert_path', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    )
}