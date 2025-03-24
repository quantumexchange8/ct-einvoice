import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Topbar from './Topbar';
import { CustomToaster } from '@/Components/CustomToaster';

export default function GuestLayout({ children }) {
    return (
        <div>
            <CustomToaster />
            <Topbar />

            <div className='w-full flex justify-center bg-gray-100 pt-5'>
                <div className='max-w-[800px] w-full flex flex-col'>
                    {children}
                </div>
            </div>
        </div>
    );
}
