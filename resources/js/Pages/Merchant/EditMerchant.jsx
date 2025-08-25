import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Step1 from "./EditPartials/Step1";
import Step2 from "./EditPartials/Step2";
import { Steps } from "primereact/steps";
import Button from "@/Components/Button";
import toast from "react-hot-toast";

export default function EditMerchant({ merchant }) {

    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const stepItems = [
        {
            label: 'Merchant Details'
        },
        {
            label: 'Summary'
        }
    ];

    const validateStep = (e) => {
        e.preventDefault();
        post('/update-validate-step1', {
            preserveScroll: true,
            onSuccess: () => {
                setStep(1);
            }
        });
    }

    const previousStep = () => {
        setStep(0);
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        merchant_name: '',
        merchant_email: '',
        merchant_contact: '',
        address_1: '',
        address_2: '',
        address_3: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        tin_no: '',
        brn_no: '',
        sst_no: '',
        ttx_no: '',
        classification_code: '',
        msic_code: '',
        irbm_client_id: '',
        irbm_client_secret: '',
    });

    useEffect(() => {
        if (merchant) {
            setData({
                id: merchant.id || '',
                merchant_name: merchant.name || '',
                merchant_email: merchant.email || '',
                merchant_contact: merchant.contact || '',
                address_1: merchant.address1 || '',
                address_2: merchant.address2 || '',
                address_3: merchant.address3 || '',
                city: merchant.city || '',
                state: merchant.state_code || '',
                postal_code: merchant.postcode || '',
                country: merchant.country_code || '',
                tin_no: merchant.tin_no || '',
                brn_no: merchant.brn_no || '',
                sst_no: merchant.sst_no || '',
                ttx_no: merchant.ttx_no || '',
                classification_code: merchant.classification_id || '',
                msic_code: merchant.msic_id || '',
                irbm_client_id: merchant.irbm_client_id || '',
                irbm_client_secret: merchant.irbm_client_key || '',
            });
        }
    }, [])

    
    const submit = (e) => {
        e.preventDefault();
        post('/update-merchant-details', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                reset();
                setStep(0);
                toast.success('Merchant Updated', {
                    title: 'Merchant Updated',
                    duration: 3000,
                    variant: 'variant3',
                });
            }
        })
    }


    return (
        <AuthenticatedLayout header='Create Merchant'>
            <Head title='Create Merchant' />

            <div className="flex flex-col gap-4 py-5 px-6">
                <div className="text-lg font-bold text-vulcan-700 font-Lora">
                    Edit Merchant
                </div>
                <div className="p-4 flex flex-col gap-4 border border-vulcan-200 rounded-sm shadow-card">
                    <div>
                        <Steps model={stepItems} activeIndex={step} />
                    </div>

                    {/* content */}
                    {
                        step === 0 && (
                            <Step1 data={data} setData={setData} errors={errors} />
                        )
                    }
                    {
                        step === 1 && (
                            <Step2 data={data} setData={setData} />
                        )
                    }

                    {/* footer */}
                    <div className="flex justify-end items-center gap-4">
                        {
                            step === 0 && (
                                <Button size="md" variant="secondary" onClick={validateStep} disabled={processing}>
                                    Next
                                </Button>
                            )
                        }
                        {
                            step === 1 && (
                                <Button size="md" variant="secondary" onClick={previousStep}>
                                    Previous
                                </Button>
                            )
                        }
                        {
                            step === 1 && (
                                <Button size="md" onClick={submit} disabled={processing}>
                                    Save
                                </Button>
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}