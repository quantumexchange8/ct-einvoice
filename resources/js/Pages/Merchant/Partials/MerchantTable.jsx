import Badge from "@/Components/Badge";
import { DefaultSortIcon, DotVerticleIcon, SortAsc, SortDesc } from "@/Components/Outline";
import { formatDate, formatDateDMY } from "@/Composables";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from 'primereact/api';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import TextInput from "@/Components/TextInput";
import Button from "@/Components/Button";
import { Menu } from "primereact/menu";
import Modal from "@/Components/Modal";
import axios from "axios";

export default function MerchantTable({ CountTotalMerchant }) {

    const [merchant, setMerchant] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isEditClientOpen, setIsEditClientOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

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
        fetchMerchant();
    }, []);

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const dateTemplate = (data) => {
        return (
            <div className="max-w-28">
                {formatDateDMY(data.created_at)}
            </div>
        )
    }

    const statusTemplate = (data) => {
        return (
            <div className="">
                {
                    data.status === 'active' && (
                        <Badge variant="success">
                            Active
                        </Badge>
                    )
                }
                {
                    data.status === 'inactive' && (
                        <Badge variant="grey">
                            Inactive
                        </Badge>
                    )
                }
            </div>
        )
    }

    const editClientOpen = (data) => {
        window.location.href = `/edit-merchant/${data.merchant_uid}`;
    }

    const deactivateClient = async (data) => {
        try {
            
            const response = await axios.post(`/deactivate-client/${data.merchant_uid}`)
            
            if (response.status === 200) {
                fetchMerchant();
                CountTotalMerchant();
            }
        } catch (error) {
            console.error('errro: ', error)
        }
    }

    const actionTemplate = (rowData) => {
        const menuRight = useRef(null);
        const items = [
            {
                label: 'Edit Client',
                template: () => {
                    return (
                        <div className="p-menuitem-content py-2 px-3 flex items-center gap-3 cursor-pointer" data-pc-section="content" onClick={(e) => {
                            e.stopPropagation()
                            editClientOpen(rowData)
                            menuRight.current.hide(e);
                        }}  >
                            
                            <span className="text-vulcan-700 text-sm font-medium">Edit Client</span>
                        </div>
                    );
                }
            },
            {
                label: 'Deactivate Client',
                template: () => {
                    return (
                        <div className="p-menuitem-content py-2 px-3 flex items-center gap-3 cursor-pointer" data-pc-section="content" onClick={(e) => {
                            e.stopPropagation()
                            deactivateClient(rowData)
                            menuRight.current.hide(e);
                            
                        }}  >
                            {
                                rowData.status === 'active' && (
                                    <span className="text-error-700 text-sm font-medium font-sans">Deactivate Client</span>
                                )
                            }
                            {
                                rowData.status === 'inactive' && (
                                    <span className="text-error-700 text-sm font-medium font-sans">Activate Client</span>
                                )
                            }
                        </div>
                    );
                }
            }
        ];

        return (
            <div className="flex items-center justify-center">
                <Button size="sm" variant="textOnly" label="Show Right" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup>
                    <DotVerticleIcon />
                </Button>
                <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
            </div>
        )
    }

    const renderHeader = () => {
        return (
            <div className="flex justify-between">
                <div>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <TextInput 
                            value={globalFilterValue} 
                            onChange={onGlobalFilterChange} 
                            placeholder="Keyword Search"
                            withIcon
                            className='bg-vulcan-50'
                        />
                    </IconField>
                </div>
            </div>
        );
    };

    const header = renderHeader();

    const customSortIcon = ({ field, sorted, sortOrder }) => {
        if (!sorted) return (<div className="ml-1"><DefaultSortIcon className='text-neutral-200' /></div>); // Default state
        return sortOrder === 1 ? <div className="ml-1"><SortAsc className='text-neutral-900' /></div> : <div className="ml-1"><SortDesc className='text-neutral-900' /></div>;
    }

    return (
        <div className="flex w-full">

            <DataTable 
                value={merchant ? merchant : null}
                paginator 
                rows={10}
                tableStyle={{ minWidth: '50rem' }}
                scrollable
                filters={filters}
                header={header}
                className="w-full flex flex-col gap-4"
                sortIcon={customSortIcon}
                removableSort
            >
                <Column field="created_at" body={dateTemplate} header="Date Created" style={{ width: '112px', maxWidth: '112px' }} sortable></Column>
                <Column field="merchant_uid" header="Client ID" style={{ width: '112px', maxWidth: '112px' }} sortable></Column>
                <Column field="name" header="Name" style={{ width: '400px', maxWidth: '400px' }} sortable></Column>
                <Column field="id" header="Status" body={statusTemplate} style={{ width: '100px', maxWidth: '100px' }} sortable></Column>
                <Column field="id" header="Action" body={actionTemplate} style={{ width: '60px', maxWidth: '60px' }} sortable></Column>
            </DataTable>
        </div>
    )
}