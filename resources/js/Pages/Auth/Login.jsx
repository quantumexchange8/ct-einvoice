import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';


import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="w-full absolute top-0 right-0 flex justify-end items-center p-5 bg-white shadow">
                <img src="/assets/image/Header icon.svg" alt="icon" />
            </div>
            <div className="flex items-center justify-center w-full">
                <form 
                    onSubmit={submit} 
                    className="w-[432px] p-10 flex flex-col items-center border rounded-md border-gray-300 shadow-lg bg-white"
                >
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <div className="flex flex-col gap-8 w-full">
                        <div className="flex flex-col items-center gap-5 w-full">
                            <img src="/assets/image/currenttechlogo.png" alt="logo" />
                            <div className="text-center w-full">
                                <span className="text-vulcan-900 font-sans text-[32px] font-medium">
                                    Welcome <span className="text-vulcan-500">Back!</span>
                                </span>
                                <span className="block text-sm font-manrope font-normal">Admin portal</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-col w-full">
                                <div className="flex items-center">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <span className="text-error-700">*</span>
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>


                            <div className="flex flex-col w-full">
                                <div className="flex items-center">
                                    <InputLabel htmlFor="password" value="Password" />
                                    <span className="text-error-700">*</span>
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>


                            <div className="w-full flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="font-manrope not-italic font-medium leading-[18px] text-xs text-vulcan-700">Remember Me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs text-vulcan-950 font-manrope not-italic font-medium leading-5 underline hover:text-gray-900"
                                    >
                                        Forgot Password?
                                    </Link>
                                )}
                            </div>
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Log in
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-center text-vulcan-400 font-manrope text-xs">
                Copyright © Current Tech Industries 2022. All rights reserved.
            </div>
        </div>
    );
}
