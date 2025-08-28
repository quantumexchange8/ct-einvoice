import Button from '@/Components/Button';
import { DashSubmittedIcon, PendingIcon, SuccessIcon } from '@/Components/Outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { XCircleIcon } from '@heroicons/react/16/solid';
import { Head } from '@inertiajs/react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState } from 'react';
import { ErrorIcon } from 'react-hot-toast';

export default function Dashboard() {

    const monthArr = [
        { name: 'Jan', value: 'jan'},
        { name: 'Feb', value: 'feb'},
        { name: 'Mar', value: 'mar'},
        { name: 'Apr', value: 'april'},
        { name: 'May', value: 'may'},
        { name: 'June', value: 'jun'},
        { name: 'July', value: 'july'},
        { name: 'Aug', value: 'aug'},
        { name: 'Sep', value: 'sep'},
        { name: 'Oct', value: 'oct'},
        { name: 'Nov', value: 'nov'},
        { name: 'Dec', value: 'dec'},
    ];

    const [invoiceStatus, setInvoiceStatus] = useState([]);
    const [invoiceChartData, setInvoiceChartData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isChartLoading, setChartLoading] = useState(false);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const [getMerchant, setGetMerchant] = useState([]);
    const [filterMerchant, setFilterMerchant] = useState(null);

    const currentMonth = new Date().getMonth();
    const [selectedMonth, setSelectedMonth] = useState(monthArr[currentMonth].value);


    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearOptions, setYearOptions] = useState([]);

    useEffect(() => {
        // Example: last 5 years up to current year
        const years = [];
        for (let y = currentYear; y >= currentYear - 5; y--) {
            years.push({ name: y.toString(), value: y });
        }
        setYearOptions(years);
    }, [currentYear]);


    const fetchInvoiceStatus = async () => {
        setLoading(true);

         try {
            const response = await axios.get("/getInvoiceStatus", {
                params: {selectedMonth, filterMerchant}
            });

            setInvoiceStatus(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    const fetchInvoiceChart = async () => {
        setChartLoading(true);

         try {
            const response = await axios.get("/getInvoiceChartData", {
                params: {selectedYear}
            });

            setInvoiceChartData(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setChartLoading(false);
        }
    }

    const fetchMerchant = async () => {
        setLoading(true);

         try {
            const response = await axios.get("/getMerchants");

            setGetMerchant(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInvoiceStatus();
    }, [selectedMonth, filterMerchant]);

    useEffect(() => {
        fetchInvoiceChart();
    }, [selectedYear]);

    useEffect(() => {
        fetchMerchant();
    }, [])


    useEffect(() => {

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

        // Prepare arrays for 12 months, default 0
        const validData = Array(12).fill(0);
        const invalidData = Array(12).fill(0);

        // Fill values from API
        invoiceChartData.forEach(item => {
            const monthIndex = item.month - 1; // because Jan = 0 in chart
            if (item.status === "Valid") {
                validData[monthIndex] = item.total;
            } else if (item.status === "Invalid") {
                invalidData[monthIndex] = item.total;
            }
        });

        const data = {
            labels: ["January", "February", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    label: "Valid",
                    backgroundColor: documentStyle.getPropertyValue("--gray-900"),
                    borderColor: documentStyle.getPropertyValue("--gray-900"),
                    data: validData
                },
                {
                    label: "Invalid",
                    backgroundColor: documentStyle.getPropertyValue("--gray-500"),
                    borderColor: documentStyle.getPropertyValue("--gray-500"),
                    data: invalidData
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: { weight: 500 }
                    },
                    grid: { display: false, drawBorder: false }
                },
                y: {
                    ticks: { stepSize: 1, color: textColorSecondary, callback: function(value) {
                        return Number.isInteger(value) ? value : null; // Show only integers
                    }},
                    grid: { color: surfaceBorder, drawBorder: false }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [invoiceChartData]);


    return (
        <AuthenticatedLayout >
            <Head title="Dashboard" />

            <div className='p-4 flex flex-col gap-4'>
                {/* statistic */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between'>
                        <div className='font-Lora text-xl font-bold '>Total Submission this <span className=''>{monthArr.find(m => m.value === selectedMonth)?.name}</span></div>
                        <div className='flex items-center gap-2'>
                            <div className='relative'>
                                <Dropdown 
                                    value={filterMerchant}
                                    onChange={(e) => setFilterMerchant(e.value)} 
                                    options={getMerchant.map((item) => (
                                        { name: item.name, value: item.merchant_uid}
                                    ))}
                                    optionLabel='name'
                                    optionValue='value'
                                    placeholder='Merchant'
                                    className='custom-dropdown'
                                    loading={isLoading}
                                />
                                {
                                    filterMerchant && (
                                        <button 
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                            onClick={() => setFilterMerchant(null)}
                                        >
                                            <XCircleIcon className="w-4 h-4" />
                                        </button>
                                    )
                                }
                            </div>
                            <Dropdown 
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.value)} 
                                options={monthArr}
                                optionLabel='name'
                                optionValue='value'
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-col md:grid md:grid-cols-3 gap-4'>
                        <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card '>
                            <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                                <PendingIcon />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-vulcan-900 text-xs'>Pending Invoices</div>
                                <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.pending}</div>
                            </div>
                        </div>
                        <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card '>
                            <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                                <DashSubmittedIcon />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-vulcan-900 text-xs'>Submitted Invoices</div>
                                <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.submitted}</div>
                            </div>
                        </div>
                        <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card '>
                            <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                                <DashSubmittedIcon />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-vulcan-900 text-xs'>Consolidated Invoices</div>
                                <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.consolidated}</div>
                            </div>
                        </div>
                        <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card '>
                            <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                                <SuccessIcon />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-vulcan-900 text-xs'>Valid Invoices</div>
                                <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.valid}</div>
                            </div>
                        </div>
                        <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card '>
                            <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                                <ErrorIcon />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <div className='text-vulcan-900 text-xs'>Invalid Invoices</div>
                                <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.invalid}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col gap-1'>
                    <div className='w-full flex items-center justify-between'>
                        <span className='font-Lora text-xl font-bold'>E-Invoice Status - {selectedYear}</span>
                        <Dropdown 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.value)} 
                            options={yearOptions}
                            optionLabel='name'
                            optionValue='value'
                        />
                    </div>
                    <Chart type='bar' data={chartData} options={chartOptions} />
                </div>
                <div></div>
            </div>
        </AuthenticatedLayout>
    );
}
