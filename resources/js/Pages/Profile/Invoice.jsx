import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Button } from "primereact/button";
import React, { useRef, useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';

export default function Invoice() {

  const [checked, setChecked] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const canvasRef = useRef(null);
  const [getCountries, setGetCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);
  const [getStates, setGetStates] = useState([]);
  const [selectedid_type, setSelectedid_type] = useState(null);
  const fetchCountry = async () => {
    try {
        const response = await axios.get('/getCountries');
        setGetCountries(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);
    }
  };

  const [enabled, setEnabled] = useState(false)
  // useEffect(() => {
  //   fetchCountry();
  //   const malaysia = getCountries.find(country => country.country === 'Malaysia');
  //   if (malaysia) {
  //     setSelectedCountry(malaysia);
  //   }
  // }, [getCountries]);

  const fetchState = async () => {
    try {

        const response = await axios.get('/getStates');
        
        setGetStates(response.data);
        
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
  fetchState();
}, []);

const { data, setData, post, processing, errors, reset, progress } = useForm({
  full_name: '',
  tin_no: '',
  id_no: '',
  sst_no: '',
  email: '',
  contact: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  city: '',
  postcode: '',
  state: '',
  country: 'Malaysia',
  id_type:'',

});

const id_type = [
    { name: 'IC', code: 'ic' },
    { name: 'Passport', code: 'pass' },

];
  // Function to generate a random CAPTCHA string
  const generateCaptchaText = () => {
    const chars = "1234567890"; // You can mix letters if needed
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Function to draw CAPTCHA on the canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e8f5e9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px Manrope";
    ctx.fillStyle = "#b71c1c";
    ctx.textBaseline = "middle";
  

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 20 + i * 30;
      const y = canvas.height / 2 + Math.random() * 10 - 5;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

     for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 2,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "#6a1b9a";
        ctx.fill();
      }
    };

  // Initialize CAPTCHA on component mount
  useEffect(() => {
    const newCaptchaText = generateCaptchaText();
    setCaptchaText(newCaptchaText);
    drawCaptcha(newCaptchaText);
  }, []);
  
  // Handle CAPTCHA input validation
  const handleInputChange = (value) => {
    setUserInput(value);
    if (value !== captchaText) {
      setMessage("Incorrect CAPTCHA. Please try again.");
    } else {
      setMessage("");
    }
  };

  // Form submission
const submit = (e) => {
  e.preventDefault();

  if (!enabled) {
    setMessage("You must acknowledge the information before submitting.");
    return;
  }

  if (userInput !== captchaText) {
    setMessage("Incorrect CAPTCHA. Please try again.");
    return;
  }

  setIsLoading(true);
  
    post('/submitInvoice', {
        preserveScroll: true,
        onSuccess: () => {
            reset();
            setIsLoading(false);
            setUserInput("");
            setMessage("");
            // toast.success('Item added successfully.', {
            //     title: 'Item added successfully.',
            //     description: 'This item has been added to your item listing.',
            //     duration: 3000,
            //     variant: 'variant1',
            // });
        }
    })
  }



  return (
    <GuestLayout>
      <div className="flex flex-col pb-6 self-stretch gap-5">

        <div className="py-8 px-5 md:p-10 w-full flex flex-col justify-center items-start gap-5 border border-vulcan-100 bg-white">

          <div className="flex flex-col gap-1">
            <div className="text-vulcan-900 font-bold text-xl">
              Invoice/Receipt  <span className="text-vulcan-500">detail</span>
            </div>
            <div className="text-vulcan-900 text-xs">
              Below are your invoice or receipt detail in summary.
            </div>
          </div>

          <div className="w-full grid grid-cols-2 grid-rows-2 items-start gap-4 ">

            <div className="w-full flex gap-1 ">
              <div className="w-full font-manrope text-vulcan-500 text-xs font-medium flex-col items-start">
                <div className="flex items-center gap-1">
                  <InputLabel value="Invoice/Receipt No." className="text-vulcan-500" />
                  <span className="text-error-800 gap-1">*</span>
                </div>
                <TextInput 
                  id="invoice_no"
                  name="invoice_no"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  type="text"
                  placeholder="CTINV00001"
                  className="placeholder:flex py-3 px-4 items-center w-full border-vulcan-25 rounded-sm bg-vulcan-50 border text-vulcan-400"
                />
              </div>
            </div>
            <div className="w-full flex gap-1">
              <div className="flex w-full text-vulcan-500 font-man text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1">
                      <InputLabel value="Total Amount" />
                      <span className="text-error-800 gap-1">*</span>
                  </div>
                    <TextInput 
                      id="amount"
                      name="amount"
                      value={data.amount}
                      onChange={(e) => setData('amount', e.target.value)}
                      type="text"
                      placeholder="1,500.00"
                      className="placeholder:flex py-3 px-4 items-center w-full border-vulcan-25 rounded-sm bg-vulcan-50 border text-vulcan-400"
                    />
              </div>
            </div>
            <div className="w-full flex gap-1">
              <div  className="w-full text-vulcan-500 font-man text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1">
                      <InputLabel value=" Date Issued" />
                      <span className="text-error-800 gap-1">*</span>
                  </div>
                  <div className="relative w-full">
                    <TextInput 
                      id="date"
                      name="date"
                      type="text"
                      placeholder=" 10/01/2024"
                      className="placeholder:flex py-3 px-4 items-center w-full border-vulcan-25 rounded-sm bg-vulcan-50 border text-vulcan-400"
                    />
                    <span className="w-[16px] h-[16px] bg-vulcan-100 ml-auto ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect width="16" height="16" rx="8" fill="#F0F1F1"/>
                        <path d="M10.0006 6.00244L6.00391 9.99911" stroke="#CECFD2" strokeLinecap="square"/>
                        <path d="M10 10.0008L6 6" stroke="#CECFD2" strokeLinecap="square"/>
                      </svg>
                    </span>
                  </div>
              </div>
            </div>
          </div >
        </div>

        <div className="p-[20px] w-full flex flex-col justify-center items-start gap-8 border border-vulcan-100 bg-white">
          <div className="flex flex-col justify-center items-start gap-6">
            <div className="flex flex-col gap-1">
             <div className="text-vulcan-900 font-bold text-xl shrink-0 ">
                Request e-Invoice  <span className="text-vulcan-500">now</span>
              </div>
              <div className="text-vulcan-900 text-xs font-normal">
                Please fill in the required personal or business detail.
              </div>
            </div>
            <div className="flex p-[3px] items-center rounded-md bg-vulcan-100 gap-1">
              <div className="flex py-[5px] px-3 justify-center items-center gap-1 rounded-sm bg-[#FFF]">
                Personal
              </div>
              <div className="flex py-[5px] px-3 text-vulcan-800 font-normal gap-6" >
                Business
              </div>
            </div>
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
            <div className="flex items-start gap-6 w-full flex-wrap">
                <div className="flex items-start gap-4 w-full">
                  <Checkbox
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    className="group max-w-5 w-full
                   h-5 rounded-md bg-white border border-vulcan-900 ring-1 ring-white/15 ring-inset data-[checked]:bg-white"
                  >
                    <CheckIcon className="hidden h-5 w-5 fill-black group-data-[checked]:block" />
                  </Checkbox>

                  <div className="text-vulcan-900 font-manrope text-xs font-medium">
                    I acknowledge that all the information provided is accurate and
                    complete. CURRENT TECH INDUSTRIES SDN. BHD. will not be held
                    responsible for any failure of e-invoice requests submitted after the
                    cut-off time due to incomplete or incorrect information.
                  </div>
                </div>

                <div className="flex w-full flex-col gap-4">{}
                  <canvas ref={canvasRef} className="w-[268px] h-[116px] border border-gray-300"></canvas>
                  <div> {}
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Type the number here"
                      className="py-3 px-4 max-w-[360px] w-full text-vulcan-950 text-sm font-medium leading-5 border border-gray-200 rounded-sm font-manrope"
                    />
                  </div>
                </div>

                {message && <div className="text-red-600 text-sm font-medium">{message}</div>}

                <Button
                    onClick={submit}
                    disabled={processing || !enabled || userInput !== captchaText}
                    className={`text-vulcan-25 font-manrope text-sm font-medium leading-5 w-full py-3 px-4 flex flex-col justify-center items-center ${
                      processing || !enabled || userInput !== captchaText
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-vulcan-700"
                    }`}
                  >
                  Submit
                </Button>
            </div>
          </div>
        </div>
      </div>
      
    </GuestLayout>
  )
}

