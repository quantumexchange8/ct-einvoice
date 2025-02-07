import React, { useState, useEffect } from "react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Dropdown } from 'primereact/dropdown';
import InputError from "@/Components/InputError";
export default function Personal({ data, setData, errors, getStates, getCountries}) {
   

    const id_type = [
        { name: 'IC', code: 'ic' },
        { name: 'Passport', code: 'pass' },
    
    ];

    const [enabled, setEnabled] = useState(false)

    return (
        <>
            <div className="flex p-[12px] justify-center items-center rounded-sm border-information-100 bg-information-50">
              <div className="flex px-3 py-3 font-medium text-xs font-manrope text-information-700">
                To facilitate the issuance of e-invoices, it is essential for us to gather comprehensive information in line with the guidelines set forth by the Inland Revenue Board of Malaysia (IRBM). We want to assure you that we dedicated to safeguarding your personal information and upholding your privacy.
              </div>
            </div>
            
            <div className="w-full grid grid-cols-2 grid-rows-7 items-start gap-4">
              <div className="w-full flex gap-1 ">
                  <div className="text-vulcan-900 text-xs font-medium flex-col items-start w-full">
                    <div className="flex items-center gap-1">
                      <InputLabel value="Full Name" />
                      <span className="text-error-800 gap-1">*</span>
                    </div>
                      <TextInput 
                        id="full_name"
                        name="full_name"
                        value={data.full_name}
                        onChange={(e) => setData('full_name', e.target.value)}
                        type="text"
                        placeholder="e.g. Tan Mei Mei"
                      />
                      <InputError message={errors.full_name} className="mt-2" />
                  </div>
              </div>
              <div className="w-full flex gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
                    <InputLabel value="TIN No." />
                    <span className="text-error-800 gap-1">*</span>
                  </div>
                  <TextInput 
                      id="tin_no"
                      name="tin_no"
                      value={data.tin_no}
                      onChange={(e) => setData('tin_no', e.target.value)}
                      type="text"
                      placeholder=" e.g. EI00000000010"
                    />
                    <InputError message={errors.tin_no} className="mt-2" />
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1">
                    <InputLabel value="ID Type" />
                    <span className="text-error-800">*</span>
                  </div>
                  <div className="card flex justify-content-center py-3 px-4 w-full text-sm items-center self-stretch rounded-sm border bg-white border-vulcan-200 text-vulcan-950">
                    <Dropdown
                      value={data.id_type}
                      onChange={(e) => setData('id_type', e.target.value)}
                      options={id_type}
                      optionLabel="name"
                      placeholder="Select"
                      className="w-full"
                      panelClassName="bg-white text-black border border-vulcan-900"
                    />
                  </div>
                  {}
                  {errors.id_type && (
                    <p className="text-error-700 text-sm font-medium mt-2">
                      {errors.id_type}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
                    <InputLabel value="ID Value" />
                    <span className="text-error-800 gap-1">*</span>
                  </div>
                    <TextInput 
                      id="id_no"
                      name="id_no"
                      value={data.id_no}
                      onChange={(e) => setData('id_no', e.target.value)}
                      type="text"
                      placeholder=" e.g. 010101121982"
                    />
                     <InputError message={errors.id_no} className="mt-2"/>
                </div>
              </div>
              <div className="w-full flex gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
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
                    />
                    <InputError message={errors.sst_no} className="mt-2"/>
                </div>
              </div>
              <div className="w-full flex gap-1 ">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start ">
                  <div className="flex items-center gap-1"> 
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
                    />
                     <InputError message={errors.email} className="mt-2" />
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
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
                    />
                    <InputError message={errors.contact} className="mt-2"/>
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
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
                    />
                     <InputError message={errors.addressLine1} className="mt-2" />
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
                      <InputLabel value="Address Line 2" />
                  </div>
                      <TextInput 
                            id="addressLine2"
                            name="addressLine2"
                            value={data.addressLine2}
                            onChange={(e) => setData('addressLine2', e.target.value)}
                            type="text"
                            placeholder="Optional"
                      />
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
                      <InputLabel value="Address Line 3" />
                  </div>
                      <TextInput 
                            id="addressLine3"
                            name="addressLine3"
                            value={data.addressLine3}
                            onChange={(e) => setData('addressLine3', e.target.value)}
                            type="text"
                            placeholder="Optional"
                      />
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
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
                    />
                     <InputError message={errors.city} className="mt-2"/>
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1"> 
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
                    />
                     <InputError message={errors.postcode} className="mt-2"/>
                </div>
              </div>
              <div className="w-full flex gap-1">
                <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1">
                    <InputLabel value="State" />
                    <span className="text-error-800">*</span>
                  </div>
                  <div className="card flex justify-content-center py-3 px-4 w-full text-sm items-center self-stretch rounded-sm border bg-white border-vulcan-200 text-vulcan-950">
                    <Dropdown
                      value={data.state}
                      onChange={(e) => setData('state', e.target.value)}
                      options={getStates}
                      optionLabel="state"
                      placeholder="Select"
                      className="w-full"
                      panelClassName="bg-white text-black border border-vulcan-900"
                    />
                  </div>
                  {}
                  {errors.state && (
                    <p className="text-error-700 text-sm font-medium mt-2">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-full flex gap-1">
                  <div className="w-full text-vulcan-900 text-xs font-medium flex-col items-start">
                    Country
                    <span className="text-error-800 gap-1">*</span>
                    <div className="card flex justify-content-center py-3 px-4 w-full text-sm items-center self-stretch rounded-sm border bg-white border-vulcan-200 text-vulcan-950">
                      <Dropdown
                        value={data.Country}
                        onChange={(e) => setData('Country', e.target.value)}
                        options={getCountries} 
                        optionLabel="country"
                        placeholder="Malaysia"
                        className="w-full"
                        panelClassName="bg-white text-black border border-vulcan-900"
                        disabled 
                      />
                       <InputError message={errors.Country} className="mt-2"/>
                    </div>
                  </div>
              </div>
            </div>
            
        </>
    )
}