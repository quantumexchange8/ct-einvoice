import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full flex items-center justify-between p-5 bg-white shadow">
              
                    <button className="flex items-center gap-[15px]" 
                        onClick={() => window.location.href = route('login')}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M25.3327 16H6.66602M6.66602 16L15.9993 25.3333M6.66602 16L15.9993 6.66667" stroke="#161B26" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-black text-center font-manrope text-[16px] not-italic font-normal leading-[22px]">Back to log in</span>
                    </button>

                    <div>
                        <img src="/assets/image/Header icon.svg" alt="icon" />
                    </div>
               
            </div>
            <div className="flex items-center justify-center flex-1 w-full">
                <form onSubmit={submit}
                    className="w-[432px] p-10 flex flex-col items-center border rounded-md border-gray-300 shadow-lg bg-white"
                    >
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                        )}
                    <div className="flex flex-col gap-8 w-full">
                        <div className="flex flex-col w-full text-center not-italic self-stretch">
                           <div className='text-vulcan-900 flex flex-col gap-2 font-sans text-[32px] font-medium leading-[38px]'>
                            Forgot Password?
                            <span className=' text-vulcan-700 font-manrope text-sm font-normal leading-5'>
                                 Enter your email and we’ll send instruction to reset your password
                            </span>
                           </div>
                        </div>
                        <div className='flex flex-col w-full'>
                            <div className="flex items-center">
                                <InputLabel htmlFor="email" value="Email Address" />
                                <span className="text-error-700">*</span>
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />

                        </div>
                            <div className="flex ">
                                <PrimaryButton className="flex w-full items-center justify-center text-vulcan-25 font-manrope text-sm not-italic font-medium leading-5" disabled={processing}>
                                   Send
                                </PrimaryButton>
                            </div>
                    </div>
                </form>
            </div>
                    

        </div>
    );
}
