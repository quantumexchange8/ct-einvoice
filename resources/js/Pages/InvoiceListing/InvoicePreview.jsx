import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function InvoicePreview({ isPreviewOpen, setIsPreviewOpen, rowData }) {
    return (
        <Transition appear show={isPreviewOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsPreviewOpen(false)}>
                <div className="fixed inset-0 bg-black bg-opacity-30" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">Invoice Details</Dialog.Title>

                        <Dialog.Description className="mt-4 text-gray-700">
                            <div className="space-y-2">
                                <div><strong>Invoice No:</strong> {rowData?.invoice_no}</div>
                                <div><strong>Amount:</strong> {rowData?.amount}</div>
                                <div><strong>Date:</strong> {rowData?.date}</div>
                                <div><strong>Type:</strong> {rowData?.type}</div>
                                <div><strong>Company URL:</strong> <a href={rowData?.company_url} target="_blank" className="text-blue-500">{rowData?.company_url}</a></div>
                                <div><strong>Full Name:</strong> {rowData?.full_name}</div>
                                <div><strong>Email:</strong> {rowData?.email}</div>
                                <div><strong>Contact:</strong> {rowData?.contact}</div>
                                <div><strong>Address:</strong> {rowData?.addressLine1}, {rowData?.city}, {rowData?.state}, {rowData?.postcode}, {rowData?.country}</div>
                            </div>
                        </Dialog.Description>

                        <div className="mt-6 flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                onClick={() => setIsPreviewOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}
