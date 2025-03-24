import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import React, { useRef, useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { Head, useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { CheckIcon } from '@heroicons/react/16/solid';
import Personal from "./Partials/Personal";
import Business from "./Partials/Business";
import { formatDateDMY } from "@/Composables";
import Button from "@/Components/Button";
import { Calendar } from "primereact/calendar";
import { ClearInputIcon } from "@/Components/Outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import Checkbox from "@/Components/Checkbox";
import { InputNumber } from "primereact/inputnumber";
import toast from "react-hot-toast";

export default function Einvoice() {

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
    const [activeTab, setActiveTab] = useState("Personal");
    const [enabled, setEnabled] = useState(false)

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
      fetchCountry();
    }, []);

    const { data, setData, post, processing, errors, reset, progress } = useForm({
      invoice_no: '',
      merchant_id: '',
      date_issued: '',
      amount: '',
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
      country: '',
      id_type:'',
      business_registration: '',
      type: 'Personal'
    });

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

    const clearDate = () => {
        setData('date_issued', null);
    }

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

                toast.success('Requested e-invoice successfully', {
                    title: 'Requested e-invoice successfully',
                    duration: 3000,
                    variant: 'variant3',
                });

            }
        })
    }

    return (
        <GuestLayout>
            <Head title="E-Invoice" />
            <div className="flex flex-col gap-5">
                <div className="p-5 flex flex-col gap-6 bg-white rounded-sm shadow-card">
                    <div className="flex flex-col">
                        <div className="text-vulcan-900 text-xl font-bold font-Lora">Invoice/Receipt <span className="text-vulcan-500">detail</span></div>
                        <div className="text-vulcan-900 text-xs">Below are your invoice or receipt detail in summary.</div>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-3 md:gap-4 w-full">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <InputLabel htmlFor="receipt_no" value="Invoice/Receipt No." className="text-vulcan-500" />
                                <span className="text-error-800 text-xs ">*</span>
                            </div>
                            
                            <TextInput 
                                id="invoice_no"
                                type="text"
                                name="invoice_no"
                                value={data.invoice_no}
                                className="w-full box-border h-11"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('invoice_no', e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <InputLabel htmlFor="amount" value="Total Amount" className="text-vulcan-500" />
                                <span className="text-error-800 text-xs ">*</span>
                            </div>
                            <InputNumber 
                                inputId="amount" 
                                value={data.amount || 0} 
                                onValueChange={(e) => setData('amount', e.target.value)} 
                                mode="currency" 
                                className="w-full box-border h-11 border border-vulcan-200 rounded-[2px] hover:border-2 focus:border-vulcan-700 outline-none focus:outline-none focus:ring-0 text-vulcan-950 disabled:bg-vulcan-25 disabled:border-vulcan-50 disabled:text-vulcan-400"
                                currency="MYR" 
                                locale="en-MY" 
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <InputLabel htmlFor="date_issued" value="Date Issued" className="text-vulcan-500" />
                                <span className="text-error-800 text-xs ">*</span>
                            </div>
                            <div className="relative">
                                <Calendar 
                                    value={data.date_issued} 
                                    onChange={(e) => setData('date_issued', e.value)} 
                                    className="w-full box-border h-11"
                                />
                                {
                                    data.date_issued && (
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={clearDate}><ClearInputIcon /></span>
                                    )
                                }
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
                
                <div className="p-[20px] w-full flex flex-col justify-center items-start gap-8 border border-vulcan-100 bg-white">
                    <div className="flex flex-col justify-center items-start gap-6">
                        <div className="flex flex-col gap-1">
                            <div className="text-vulcan-900 font-bold text-xl font-Lora">
                                {
                                    data.type === 'Personal' ? (
                                        <div>
                                            Request e-Invoice  <span className="text-vulcan-500">now</span>
                                        </div>
                                    ) : (
                                        <div>
                                            Create e-Invoice  <span className="text-vulcan-500">now</span>
                                        </div>
                                    )
                                }
                                
                            </div>
                            <div className="text-vulcan-900 text-xs font-normal">
                                Please fill in the required personal or business detail. {data.type}
                            </div>
                        </div>
                        <div className="w-full">
                            <TabGroup 
                                className="flex flex-col gap-6"
                                selectedIndex={data.type === 'Personal' ? 0 : 1}
                                onChange={(index) => setData('type', index === 0 ? 'Personal' : 'Business')}
                            >
                                <TabList className="flex items-center gap-1 p-[3px] bg-vulcan-100 max-w-[159px]">
                                    <Tab className="rounded-[2px] py-[5px] px-3 text-xs text-vulcan-700 focus:outline-none data-[selected]:font-bold data-[selected]:bg-white data-[hover]:bg-white/50 data-[selected]:data-[hover]:bg-white data-[focus]:outline-0 data-[focus]:outline-white">
                                        Personal
                                    </Tab>
                                    <Tab className="rounded-[2px] py-[5px] px-3 text-xs text-vulcan-700 focus:outline-none data-[selected]:font-bold data-[selected]:bg-white data-[hover]:bg-white/50 data-[selected]:data-[hover]:bg-white data-[focus]:outline-0 data-[focus]:outline-white">
                                        Business
                                    </Tab>
                                </TabList>
                                <TabPanels className="">
                                    <TabPanel className="">
                                        <Personal data={data} setData={setData} processing={processing} errors={errors} getStates={getStates} getCountries={getCountries} />
                                    </TabPanel>
                                    <TabPanel className="">
                                        <Business data={data} setData={setData} processing={processing} errors={errors} getStates={getStates} getCountries={getCountries} />
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </div>

                        <div className="flex items-start gap-6 w-full flex-wrap">
                            <div className="flex items-start gap-4 w-full">
                                {/* <Checkbox
                                    checked={enabled}
                                    onChange={() => setEnabled(!enabled)}
                                    className=""
                                >
                                    <CheckIcon className="hidden h-5 w-5 fill-black group-data-[checked]:block" />
                                </Checkbox> */}
                                <Checkbox
                                    onChange={() => setEnabled(!enabled)} 
                                    checked={enabled}
                                    className="focus:ring-0 rounded-[2px]"
                                >

                                </Checkbox>

                                <div className="text-vulcan-900 font-manrope text-xs font-medium">
                                    I acknowledge that all the information provided is accurate and
                                    complete. <span className="font-bold">CURRENT TECH INDUSTRIES SDN. BHD</span>. will not be held
                                    responsible for any failure of e-invoice requests submitted after the
                                    cut-off time due to incomplete or incorrect information.
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-4">
                                <canvas ref={canvasRef} className="w-[268px] h-[116px] border border-gray-300"></canvas>
                                <div>
                                    <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="Type the number here"
                                    className="py-3 px-4 max-w-[360px] w-full text-vulcan-950 text-sm font-medium leading-5 border border-gray-200 rounded-sm font-manrope"
                                    />
                                </div>
                            </div>
                            {message && 
                                <div className="text-red-600 text-sm font-medium">{message}</div>
                            }
                            <div className="w-full">
                                <Button
                                    onClick={submit}
                                    size="md"
                                    className="w-full flex justify-center"
                                    disabled={processing || !enabled || userInput !== captchaText}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
        </GuestLayout>
    )
}