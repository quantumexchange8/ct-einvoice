import React from "react";
import { Button } from "primereact/button";

export default function Navbar() {

    return (
        <nav className="flex p-4 justify-between items-center flex-shrink-0 self-stretch border-b border-vulcan-100 bg-white ">
            <div className="flex p-4 flex-col w-full gap-3 self-stretch">
            
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} />
            </div>
            <div className="flex items-center gap-2">
                <Button icon="pi pi-globe" className="p-button-text p-2" />
                <Button icon="pi pi-sign-out" className="p-button-text p-2" />
            </div>
        </nav>
    )
}