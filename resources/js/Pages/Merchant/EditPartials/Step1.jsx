import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Dropdown } from "primereact/dropdown";
import React, { useEffect, useState } from "react";

export default function Step1({data, setData, errors}) {

    const [states, setStates] = useState([]);
    const [country, setCountry] = useState([]);
    const [classifications, setClassifications] = useState([]);
    const [msicCodes, setMSICCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStates = async () => {
        try {

            const response = await axios.get('/getStates');
            
            setStates(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };7

    const fetchCountry = async () => {
        try {

            const response = await axios.get('/getCountries');
            
            setCountry(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClassification = async () => {
        try {

            const response = await axios.get('/getClassification');
            
            setClassifications(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMsicCode = async () => {
        try {

            const response = await axios.get('/getMSICcode');
            
            setMSICCodes(response.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStates();
        fetchCountry();
        fetchClassification();
        fetchMsicCode();
    }, []);

    const countryOptionTemplate = (option) => {
        return (
            <div className="flex items-center">
              <div className="max-w-80 truncate">{option.country}</div>
            </div>
        )
    }

    const classificationTemplate = (option) => {
        return (
            <div className="flex items-center">
              <div className="max-w-80 truncate">{option.code} - {option.description}</div>
            </div>
        )
    }

    const msiccodeTemplate = (option) => {
        return (
            <div className="flex items-center">
              <div className="max-w-80 truncate">{option.code} - {option.description}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
                <div className="text-base font-semibold font-Lora">Account Details</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                Merchant Name <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="merchant_name"
                            type="text"
                            name="merchant_name"
                            value={data.merchant_name}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('merchant_name', e.target.value)}
                            placeholder='e.g. Burger Sdn Bhd'
                        />
                        <InputError message={errors.merchant_name} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                Merchant Email <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="merchant_email"
                            type="email"
                            name="merchant_email"
                            value={data.merchant_email}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('merchant_email', e.target.value)}
                            placeholder='e.g. burger@burger.com'
                        />
                        <InputError message={errors.merchant_email} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                Merchant Contact <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="merchant_contact"
                            type="number"
                            name="merchant_contact"
                            value={data.merchant_contact}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('merchant_contact', e.target.value)}
                            placeholder='e.g. 6012345677'
                        />
                        <InputError message={errors.merchant_contact} />
                    </div>
                </div>
            </div>

            <div className="border border-dashed border-vulcan-100 w-full h-[1px]"></div>

            <div className="flex flex-col gap-4">
                <div className="text-base font-semibold font-Lora">Merchant Details</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                Merchant Address <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="address_1"
                            type="text"
                            name="address_1"
                            value={data.address_1}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('address_1', e.target.value)}
                        />
                        <InputError message={errors.address_1} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value='Merchant Address 2'/>
                        <TextInput 
                            id="address_2"
                            type="text"
                            name="address_2"
                            value={data.address_2}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('address_2', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value='Merchant Address 3'/>
                        <TextInput 
                            id="address_3"
                            type="text"
                            name="address_3"
                            value={data.address_3}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('address_3', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                City <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="city"
                            type="text"
                            name="city"
                            value={data.city}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('city', e.target.value)}
                            placeholder="e.g. Kuala Lumpur"
                        />
                        <InputError message={errors.city} />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-3">
                        <div className="col-span-2 w-full">
                            <div className="flex flex-col gap-1 w-full">
                                <InputLabel value={
                                    <div>
                                        State <span className="text-error-500">*</span>
                                    </div>
                                }/>
                                <Dropdown 
                                    value={data.state}
                                    onChange={(e) => setData('state', e.value)} 
                                    options={states.map((state) => (
                                        { name: state.State, code: state.State }
                                    ))} 
                                    optionLabel="name"
                                    optionValue="code"
                                    placeholder="Select state"
                                    className="w-full"
                                />
                                <InputError message={errors.state} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                            <InputLabel value={
                                <div>
                                    Postal Code <span className="text-error-500">*</span>
                                </div>
                            }/>
                            <TextInput 
                                id="postal_code"
                                type="number"
                                name="postal_code"
                                value={data.postal_code}
                                className="mt-1 w-full box-border h-11"
                                autoComplete="username"
                                onChange={(e) => setData('postal_code', e.target.value)}
                            />
                            <InputError message={errors.postal_code} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                Country <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <Dropdown 
                            value={data.country}
                            onChange={(e) => setData('country', e.value)} 
                            options={country} 
                            optionLabel="country"
                            placeholder="Select state"
                            className="w-full"
                            itemTemplate={countryOptionTemplate}
                            editable
                        />
                        <InputError message={errors.country} />
                    </div>
                </div>
            </div>

            <div className="border border-dashed border-vulcan-100 w-full h-[1px]"></div>

            <div className="flex flex-col gap-4">
                <div className="text-base font-semibold font-Lora">Merchant Tax Info</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                TIN No <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="tin_no"
                            type="text"
                            name="tin_no"
                            value={data.tin_no}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('tin_no', e.target.value)}
                        />
                        <InputError message={errors.tin_no} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                BRN No <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="brn_no"
                            type="text"
                            name="brn_no"
                            value={data.brn_no}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('brn_no', e.target.value)}
                        />
                        <InputError message={errors.brn_no} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value='SST No'/>
                        <TextInput 
                            id="sst_no"
                            type="number"
                            name="sst_no"
                            value={data.sst_no}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('sst_no', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value='TTX No'/>
                        <TextInput 
                            id="ttx_no"
                            type="number"
                            name="ttx_no"
                            value={data.ttx_no}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('ttx_no', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                Claasification Code <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <Dropdown 
                            value={data.classification_code}
                            onChange={(e) => setData('classification_code', e.value)} 
                            options={classifications.map((classification) => (
                                { id: classification.id, code: classification.code, description: classification.description }
                            ))} 
                            optionLabel="code"
                            optionValue="id"
                            placeholder="Select state"
                            className="w-full"
                            itemTemplate={classificationTemplate}
                        />
                        <InputError message={errors.classification_code} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                MSIC Code <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <Dropdown 
                            value={data.msic_code}
                            onChange={(e) => setData('msic_code', e.value)} 
                            options={msicCodes.map((msic) => (
                                { id: msic.id, code: msic.Code, description: msic.Description }
                            ))} 
                            optionLabel="code"
                            optionValue="id"
                            placeholder="Select state"
                            className="w-full"
                            itemTemplate={msiccodeTemplate}
                        />
                        <InputError message={errors.msic_code} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                IRBM Client ID <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="irbm_client_id"
                            type="text"
                            name="irbm_client_id"
                            value={data.irbm_client_id}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('irbm_client_id', e.target.value)}
                        />
                        <InputError message={errors.irbm_client_id} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <InputLabel value={
                            <div>
                                IRBM Client Secret <span className="text-error-500">*</span>
                            </div>
                        }/>
                        <TextInput 
                            id="irbm_client_secret"
                            type="text"
                            name="irbm_client_secret"
                            value={data.irbm_client_secret}
                            className="mt-1 w-full box-border h-11"
                            autoComplete="username"
                            onChange={(e) => setData('irbm_client_secret', e.target.value)}
                        />
                        <InputError message={errors.irbm_client_secret} />
                    </div>
                </div>
            </div>
        </div>
    )
}