import Button from "@/Components/Button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Steps } from "primereact/steps";
import React, { useState } from "react";
import Step1 from "./Partials/Step1";
import Step2 from "./Partials/Step2";

export default function AddMerchant() {

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
        post('/validate-step1', {
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

    const submit = (e) => {
        e.preventDefault();
        post('/store-merchant', {
            preserveScroll: true,
            onSuccess: () => {
                setIsLoading(false);
                reset();
                setStep(0);
            }
        })
    }

    return (
        <AuthenticatedLayout
            header='Create Merchant'
        >
            <Head title='Create Merchant' />

            <div className="flex flex-col gap-4 py-5 px-6">
                <div className="text-lg font-bold text-vulcan-700 font-Lora">
                    Create Merchant
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
                                    Previos
                                </Button>
                            )
                        }
                        {
                            step === 1 && (
                                <Button size="md" onClick={submit} disabled={processing}>
                                    Create
                                </Button>
                            )
                        }
                        
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}