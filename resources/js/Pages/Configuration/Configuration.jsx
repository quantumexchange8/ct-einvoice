import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { Dropdown } from "primereact/dropdown";
import toast from "react-hot-toast";

export default function Configuration({ adminDetails }) {
    
    const [imageFile, setImageFile] = useState(null);
    const [getMsic, setGetMsic] = useState([]);
    const [getClassification, setGetClassification] = useState([]);
    const [getCountry, setGetCountry] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const fetchMsic = async () => {
        setLoading(true);

         try {
            const response = await axios.get("/getMSICcode");

            setGetMsic(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchClassification = async () => {
        setLoading(true);

         try {
            const response = await axios.get("/getClassification");

            setGetClassification(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCountries = async () => {
        setLoading(true);

         try {
            const response = await axios.get("/getCountries");

            setGetCountry(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMsic();
        fetchClassification();
        fetchCountries();
    }, [])

    const { data, setData, post, processing, errors, reset, progress } = useForm({
        company_name: '',
        tin: '',
        registration: '',
        sst: '',
        irbm_client_id: '',
        irbm_client_key: '',
        phone: '',
        email: '',
        MSIC: '',
        defaultClassification: '',
        businessActivity: '',
        address1: '',
        address2: '',
        area: '',
        poscode: '',
        state: '',
        country: '',
    });

    useEffect(() => {
        if (adminDetails) {
            setData({
                company_name: adminDetails.companyName,
                tin: adminDetails.tin,
                registration: adminDetails.registration,
                sst: adminDetails.sst,
                irbm_client_id: adminDetails.irbm_client_id,
                irbm_client_key: adminDetails.irbm_client_key,
                phone: adminDetails.phone,
                email: adminDetails.email,
                MSIC: adminDetails.MSIC,
                defaultClassification: adminDetails.defaultClassification,
                businessActivity: adminDetails.businessActivity,
                address1: adminDetails.address1,
                address2: adminDetails.address2,
                area: adminDetails.area,
                poscode: adminDetails.poscode,
                state: adminDetails.state,
                country: adminDetails.country,
            })
        }
    }, [adminDetails])

    const onUpload = () => {

    }
    
    const save = (e) => {
        e.preventDefault();
        post('/updateConfiguration', {
            preserveScroll: true,
            onSuccess: () => {
                setLoading(false);
                
                toast.success('Company details updated', {
                title: 'Company details updated',
                duration: 3000,
                variant: 'variant3',
            });
            }
        })
    }

    return (
        <AuthenticatedLayout>
            <div className="flex w-full flex-col justify-center items-center self-stretch p-5 gap-6 bg-white rounded-lg max-w-3xl mx-auto">
                <div className="flex w-full p-4 flex-col gap-6 self-stretch border rounded-sm border-vulcan-200 bg-white">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <div className="font-sans text-vulcan-900 font-bold text-xl">
                                Company <span className="text-vulcan-500">Detail</span>
                            </div>
                            <div className="text-xs text-vulcan-900">
                                Active and inactive clients will all be shown in this list.
                            </div>
                        </div>
                        <button className="px-4 py-2 border shadow-sm border-gray-300 rounded-sm text-sm" onClick={save}>
                            Save Changes
                        </button>
                    </div>
                    <div className="flex w-full justify-between items-center gap-4">
                     
                            {imageFile && (
                                <img 
                                    src={URL.createObjectURL(imageFile)} 
                                    alt="Uploaded" 
                                    className="flex w-full max-w-[208px] max-h-[80px] object-cover " 
                                />
                            )}
                             <div className="flex border border-vulcan-950 rounded-md">
                                <FileUpload
                                    mode="basic"
                                    chooseLabel={
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M14 10V10.8C14 11.9201 14 12.4802 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.4802 14 11.9201 14 10.8 14H5.2C4.07989 14 3.51984 14 3.09202 13.782C2.71569 13.5903 2.40973 13.2843 2.21799 12.908C2 12.4802 2 11.9201 2 10.8V10M11.3333 5.33333L8 2M8 2L4.66667 5.33333M8 2V10"
                                            stroke="#61646C"
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        </svg>
                                        <span>Upload Photo</span>
                                    </div>
                                    }
                                    auto
                                    customUpload
                                    uploadHandler={onUpload}
                                    className="w-full"
                                />
                            </div>

                        <button className="ml-auto"> {/* Pushes the button to the right */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4.4082 3.65058L4.86259 1H10.7696L11.224 3.65058" stroke="#161B26" strokeLinejoin="round"/>
                                <path d="M1 3.65234H14.6316" stroke="#161B26" strokeLinecap="round"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.7395 3.65234L11.9822 15.3906H3.65184L2.89453 3.65234H12.7395Z" stroke="#161B26" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M5.92188 12.3594H9.70842" stroke="#161B26" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Company Name' />
                            <TextInput 
                                id="company_name"
                                type="text"
                                name="company_name"
                                value={data.company_name || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('company_name', e.target.value)}
                            />
                            <InputError message={errors.company_name} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='TIN' />
                            <TextInput 
                                id="tin"
                                type="text"
                                name="tin"
                                value={data.tin || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('tin', e.target.value)}
                            />
                            <InputError message={errors.tin} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='BRN' />
                            <TextInput 
                                id="registration"
                                type="text"
                                name="registration"
                                value={data.registration || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('registration', e.target.value)}
                            />
                            <InputError message={errors.registration} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='SST No' />
                            <TextInput 
                                id="sst"
                                type="text"
                                name="sst"
                                value={data.sst || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('sst', e.target.value)}
                            />
                            <InputError message={errors.sst} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='IRBM Client ID' />
                            <TextInput 
                                id="irbm_client_id"
                                type="text"
                                name="irbm_client_id"
                                value={data.irbm_client_id || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('irbm_client_id', e.target.value)}
                            />
                            <InputError message={errors.irbm_client_id} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='IRBM Client Secret' />
                            <TextInput 
                                id="irbm_client_key"
                                type="text"
                                name="irbm_client_key"
                                value={data.irbm_client_key || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('irbm_client_key', e.target.value)}
                            />
                            <InputError message={errors.irbm_client_key} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Phone' />
                            <TextInput 
                                id="phone"
                                type="text"
                                name="phone"
                                value={data.phone || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            <InputError message={errors.phone} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Email' />
                            <TextInput 
                                id="email"
                                type="email"
                                name="email"
                                value={data.email || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='MSIC' />
                            <Dropdown 
                                value={data.MSIC}
                                onChange={(e) => setData('MSIC', e.value)} 
                                options={getMsic.map((item) => (
                                    { label: `${item.Code} - ${item.Description}`, value: item.Code}
                                ))} 
                                optionLabel="label" 
                                placeholder="Select msic"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Classification' />
                            <Dropdown 
                                value={data.defaultClassification}
                                onChange={(e) => setData('defaultClassification', e.value)} 
                                options={getClassification.map((item) => (
                                    { label: `${item.code} - ${item.description}`, value: item.code}
                                ))} 
                                optionLabel="label" 
                                placeholder="Select classification"
                            />
                            <InputError message={errors.defaultClassification} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Business Activity' />
                            <TextInput 
                                id="businessActivity"
                                type="text"
                                name="businessActivity"
                                value={data.businessActivity || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('businessActivity', e.target.value)}
                                placeholder='Business Activity'
                            />
                            <InputError message={errors.businessActivity} className="mt-2" />
                        </div>

                        <div className="col-span-2 font-bold">
                            Company Address
                        </div>

                        <div className="flex flex-col gap-1">
                            <InputLabel value='Address' />
                            <TextInput 
                                id="address1"
                                type="text"
                                name="address1"
                                value={data.address1 || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('address1', e.target.value)}
                                placeholder='Business Activity'
                            />
                            <InputError message={errors.address1} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Address 2' />
                            <TextInput 
                                id="address2"
                                type="text"
                                name="address2"
                                value={data.address2 || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('address2', e.target.value)}
                                placeholder='Address 2'
                            />
                            <InputError message={errors.address2} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 flex flex-col gap-1">
                                <InputLabel value='City' />
                                <TextInput 
                                    id="area"
                                    type="text"
                                    name="area"
                                    value={data.area || ''}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('area', e.target.value)}
                                    placeholder='City'
                                />
                                <InputError message={errors.area} className="mt-2" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <InputLabel value='Postcode' />
                                <TextInput 
                                    id="poscode"
                                    type="text"
                                    name="poscode"
                                    value={data.poscode || ''}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) => setData('poscode', e.target.value)}
                                    placeholder='postcode'
                                />
                                <InputError message={errors.poscode} className="mt-2" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='State' />
                            <TextInput 
                                id="state"
                                type="text"
                                name="state"
                                value={data.state || ''}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('state', e.target.value)}
                                placeholder='State'
                            />
                            <InputError message={errors.state} className="mt-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <InputLabel value='Country' />
                            <Dropdown 
                                value={data.country}
                                onChange={(e) => setData('country', e.value)} 
                                options={getCountry.map((item) => (
                                    { label: `${item.code} - ${item.country}`, value: item.code}
                                ))} 
                                filter
                                optionLabel="label" 
                                placeholder="Select country"
                            />
                            <InputError message={errors.country} className="mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
