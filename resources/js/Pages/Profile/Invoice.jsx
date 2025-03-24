import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import React, { useRef, useState, useEffect } from "react";
import { Dropdown } from 'primereact/dropdown';
import axios from "axios";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid';
import Personal from "./Partials/Personal";
import Business from "./Partials/Business";
import { formatDateDMY } from "@/Composables";
import Button from "@/Components/Button";
import { ClearInputIcon } from "@/Components/Outline";

export default function Invoice({invoice_no, merchant_id, date_issued, amount }) {

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
  invoice_no: invoice_no,
  merchant_id: merchant_id,
  date_issued: date_issued,
  amount: amount,
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
  business_registration: '',
  type: activeTab
});

useEffect(() => {
  setData("type", activeTab);
}, [activeTab])
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
      <div className="flex flex-col pb-6 self-stretch gap-5 ">

        <div className="py-8 px-5 md:p-10 w-full flex flex-col justify-center items-start gap-5 border border-vulcan-100 bg-white">

          <div className="flex flex-col gap-1">
            <div className="text-vulcan-900 font-bold text-xl font-Lora">
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
                  value={data.invoice_no}
                  onChange={(e) => setData('invoice_no', e.target.value)}
                  type="text"
                  disabled={true}
                  placeholder="CTINV00001"
                  className="w-full box-border h-11"
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
                      disabled={true}
                      className="w-full box-border h-11"
                    />
              </div>
            </div>
            <div className="w-full flex gap-1">
              <div  className="w-full text-vulcan-500 font-man text-xs font-medium flex-col items-start">
                  <div className="flex items-center gap-1">
                      <InputLabel value="Date Issued" />
                      <span className="text-error-800 gap-1">*</span>
                  </div>
                  <div className="relative">
                    <Calendar 
                      value={data.date_issued} 
                      onChange={(e) => setData('date_issued', e.value)} 
                      className="w-full box-border h-11"
                    />
                    <span className="absolute right-1"><ClearInputIcon /></span>
                  </div>
              </div>
            </div>
          </div >
        </div>

        <div className="p-[20px] w-full flex flex-col justify-center items-start gap-8 border border-vulcan-100 bg-white">
          <div className="flex flex-col justify-center items-start gap-6">
            <div className="flex flex-col gap-1">
             <div className="text-vulcan-900 font-bold text-xl font-Lora">
                Request e-Invoice  <span className="text-vulcan-500">now</span>
              </div>
              <div className="text-vulcan-900 text-xs font-normal">
                Please fill in the required personal or business detail.
              </div>
            </div>
            <div className="flex p-[3px] items-center rounded-md bg-vulcan-100 gap-1">
              <button
                className={`flex py-[5px] px-3 justify-center items-center gap-1 rounded-sm ${activeTab === "Personal" ? "bg-white border-r" : "bg-gray-100"}`}
                onClick={() => setActiveTab("Personal")}
              >
                Personal
              </button>
              <button
                className={`flex py-[5px] px-3 text-vulcan-800 font-normal gap-6 ${activeTab === "Business" ? "bg-white" : "bg-gray-100"}`}
                onClick={() => setActiveTab("Business")}
              >
                Business
              </button>
            </div>

            {
              activeTab === 'Personal' && (
                <Personal data={data} setData={setData} processing={processing} errors={errors} getStates={getStates} getCountries={getCountries} />
              )
            }
            {
              activeTab === 'Business' && (
                <Business data={data} setData={setData} processing={processing} errors={errors} getStates={getStates} getCountries={getCountries} />
              )
            }

            {/* if else {
              activeTab === 'Personal' ? (
                <Personal data={data} setData={setData} errors={errors} getStates={getStates} getCountries={getCountries} />
              ) : (
                <Business data={data} setData={setData} errors={errors} getStates={getStates} getCountries={getCountries} />
              )
            } */}
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
                {message && <div className="text-red-600 text-sm font-medium">{message}</div>}
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

