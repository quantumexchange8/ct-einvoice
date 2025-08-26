import { DashSubmittedIcon, PendingIcon, SuccessIcon } from '@/Components/Outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Chart } from 'primereact/chart';
import { Skeleton } from 'primereact/skeleton';
import { useEffect, useState } from 'react';
import { ErrorIcon } from 'react-hot-toast';

export default function Dashboard() {

    const [invoiceStatus, setInvoiceStatus] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const fetchInvoiceStatus = async () => {
        setLoading(true);

         try {
            const response = await axios.get("/getInvoiceStatus");

            setInvoiceStatus(response.data);

        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInvoiceStatus();
    }, []);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Validated',
                    backgroundColor: documentStyle.getPropertyValue('#161B26'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'Rejected',
                    backgroundColor: documentStyle.getPropertyValue('--gray-500'),
                    borderColor: documentStyle.getPropertyValue('--gray-500'),
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <AuthenticatedLayout >
            <Head title="Dashboard" />

            <div className='p-4 flex flex-col gap-4'>
                {/* statistic */}
                <div className='w-full flex flex-col md:grid md:grid-cols-3 gap-4'>
                    <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card min-w-64'>
                        <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                            <PendingIcon />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='text-vulcan-900 text-xs'>Pending Invoices</div>
                            <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.pending}</div>
                        </div>
                    </div>
                    <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card min-w-64'>
                        <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                            <DashSubmittedIcon />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='text-vulcan-900 text-xs'>Submitted Invoices</div>
                            <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.submitted}</div>
                        </div>
                    </div>
                    <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card min-w-64'>
                        <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                            <DashSubmittedIcon />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='text-vulcan-900 text-xs'>Consolidated Invoices</div>
                            <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.consolidated}</div>
                        </div>
                    </div>
                    <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card min-w-64'>
                        <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                            <SuccessIcon />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='text-vulcan-900 text-xs'>Valid Invoices</div>
                            <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.valid}</div>
                        </div>
                    </div>
                    <div className='p-4 flex items-center gap-4 border border-vulcan-200 bg-white shadow-card min-w-64'>
                        <div className='w-[60px] h-[60px] bg-[#FAFAFA] shadow-statistic flex items-center justify-center'>
                            <ErrorIcon />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <div className='text-vulcan-900 text-xs'>Invalid Invoices</div>
                            <div className='text-vulcan-900 text-3xl font-medium font-Lora'>{isLoading ? <Skeleton height="2rem" className="mb-2"></Skeleton> : invoiceStatus.invalid}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <Chart type='bar' data={chartData} options={chartOptions} />
                </div>
                <div></div>
            </div>
        </AuthenticatedLayout>
    );
}
