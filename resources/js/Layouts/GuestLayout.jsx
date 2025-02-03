import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Topbar from './Topbar';

export default function GuestLayout({ children }) {
    return (
        <div className="">
            <Topbar />

            <div className='w-full flex justify-center pt-5 bg-gray-100'>
                <div className='max-w-[800px] w-full flex'>
                    {children}
                </div>
            </div>
        </div>
    );
}
