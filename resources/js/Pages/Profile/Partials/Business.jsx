import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Dropdown } from 'primereact/dropdown';
import InputError from "@/Components/InputError";


export default function Business({ data, setData, errors,processing, getStates, getCountries}) {
   

    const [enabled, setEnabled] = useState(false)

    const countryOptionTemplate = (option) => {
      return (
          <div className="flex align-items-center">
              <div className="max-w-80 truncate">{option.country}</div>
          </div>
      );
    };
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex p-3 justify-center items-center rounded-sm border-information-100 bg-information-50 font-medium text-xs font-manrope text-information-700">
              To facilitate the issuance of e-invoices, it is essential for us to gather comprehensive information in line with the guidelines set forth by the Inland Revenue Board of Malaysia (IRBM). We want to assure you that we dedicated to safeguarding your personal information and upholding your privacy.
            </div>
            
            <div className="w-full grid grid-cols-2 grid-rows-7 items-start gap-4">
              <div className="w-full flex flex-col gap-1 ">
                  <div className="text-vulcan-900 text-xs font-medium flex items-center gap-1 w-full">
                    <InputLabel value="Company Name" />
                    <span className="text-error-800 gap-1">*</span>
                  </div>
                  <TextInput 
                    id="full_name"
                    name="full_name"
                    value={data.full_name}
                    onChange={(e) => setData('full_name', e.target.value)}
                    type="text"
                    placeholder="e.g. Company Sdn Bhd"
                    className="w-full box-border h-11"
                  />
                  <InputError message={errors.full_name} className="mt-2" />
              </div>
              <div className="w-full flex flex-col gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="TIN No." />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="tin_no"
                  name="tin_no"
                  value={data.tin_no}
                  onChange={(e) => setData('tin_no', e.target.value)}
                  type="text"
                  placeholder=" e.g. C12345678900"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.tin_no} className="mt-2" />
              </div>
              <div className="w-full flex flex-col gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="Business Registration No. " />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="business_registration"
                  name="business_registration"
                  value={data.business_registration}
                  onChange={(e) => setData('business_registration', e.target.value)}
                  type="text"
                  placeholder=" e.g. 202400123456"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.business_registration  } className="mt-2"/>
              </div>
              <div className="w-full flex flex-col gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="SST No."/>
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="sst_no"
                  name="sst_no"
                  value={data.sst_no}
                  onChange={(e) => setData('sst_no', e.target.value)}
                  type="text"
                  placeholder=" Put ‘NA’ if none"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.sst_no} className="mt-2"/>
              </div>
              <div className="w-full flex flex-col gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1 ">
                  <InputLabel value="Email Address"/>
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  type="text"
                  placeholder="e.g. tanmeimei@gmail.com"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.email} className="mt-2" />
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="Contact No." />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="contact"
                  name="contact"
                  value={data.contact}
                  onChange={(e) => setData('contact', e.target.value)}
                  type="number"
                  placeholder=" e.g. 601123451234"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.contact} className="mt-2"/>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="Address Line 1" />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="addressLine1"
                  name="addressLine1"
                  value={data.addressLine1}
                  onChange={(e) => setData('addressLine1', e.target.value)}
                  type="text"
                  placeholder=" e.g. 23, Jalan 1/1, Taman Suntex"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.addressLine1} className="mt-2" />
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="Address Line 2" />
                </div>
                <TextInput 
                  id="addressLine2"
                  name="addressLine2"
                  value={data.addressLine2}
                  onChange={(e) => setData('addressLine2', e.target.value)}
                  type="text"
                  placeholder="Optional"
                  className="w-full box-border h-11"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value="Address Line 3" />
                </div>
                <TextInput 
                  id="addressLine3"
                  name="addressLine3"
                  value={data.addressLine3}
                  onChange={(e) => setData('addressLine3', e.target.value)}
                  type="text"
                  placeholder="Optional"
                  className="w-full box-border h-11"
                />
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value=" City" />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="city"
                  name="city"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  type="text"
                  placeholder="e.g. Kuala Lumpur"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.city} className="mt-2"/>
              </div>
              <div className="w-full flex flex-col gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                  <InputLabel value=" Postcode" />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="postcode"
                  name="postcode"
                  value={data.postcode}
                  onChange={(e) => setData('postcode', e.target.value)}
                  type="number"
                  placeholder="e.g. 55100"
                  className="w-full box-border h-11"
                />
                <InputError message={errors.postcode} className="mt-2"/>
              </div>
              <div className="w-full flex flex-col gap-1">
                  <div className="w-full text-vulcan-900 text-xs font-medium flex items-center gap-1">
                    <InputLabel value="State" />
                    <span className="text-error-800">*</span>
                  </div>
                  <Dropdown
                    value={data.state}
                    onChange={(e) => setData('state', e.target.value)}
                    options={getStates}
                    editable
                    optionLabel="State"
                    placeholder="Select"
                    className="w-full box-border h-11"
                    panelClassName="bg-white text-black border border-vulcan-900"
                  />
                  {errors.state && (
                    <p className="text-error-700 text-sm font-medium mt-2">
                      {errors.state}
                    </p>
                  )}
                </div>
              <div className="w-full flex flex-col gap-1">
                  <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                    Country
                    <span className="text-error-800 gap-1">*</span>
                  </div>
                  <Dropdown
                    value={data.country}
                    onChange={(e) => setData('country', e.target.value)}
                    options={getCountries} 
                    optionLabel="country"
                    itemTemplate={countryOptionTemplate}
                    editable
                    placeholder="Malaysia"
                    className="w-full box-border h-11"
                  />
                  <InputError message={errors.Country} className="mt-2"/>
              </div>
            </div>
           
        </div>
    )
}