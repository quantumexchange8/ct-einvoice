import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { useForm } from "@inertiajs/react";
import React from "react";

export default function Einvoice() {

    const { data, setData, post, processing, errors, reset } = useForm({
        receipt_no: ''
    });

    return (
        <GuestLayout>
            <div className="p-5 flex flex-col gap-6 bg-white rounded-sm shadow-card">
                <div className="flex flex-col">
                    <div className="text-vulcan-900 text-xl font-bold">Invoice/Receipt <span className="text-vulcan-500">detail</span></div>
                    <div className="text-vulcan-900 text-xs">Below are your invoice or receipt detail in summary.</div>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 w-full">
                        <div className="flex flex-col gap-1">
                            <InputLabel htmlFor="receipt_no" value="Invoice/Receipt No." />
                            <div className="box-border">
                                <TextInput 
                                    id="receipt_no"
                                    type="text"
                                    name="receipt_no"
                                    value={data.receipt_no}
                                    className="mt-1 w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('receipt_no', e.target.value)}
                                />
                            </div>
                        </div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
            </div>
            <div></div>
        </GuestLayout>
    )
}