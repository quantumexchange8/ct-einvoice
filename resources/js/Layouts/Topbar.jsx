import Button from "@/Components/Button";
import { changeLanguage } from "i18next";
import { Menu } from "primereact/menu";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function Topbar() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // 使用 'en' 或 'cn'
    };

    const menuRight = useRef(null);
    const items = [
        {
            label: 'English',
            template: () => {
                return (
                    <div className="p-menuitem-content py-2 px-3 flex items-center gap-3 cursor-pointer" data-pc-section="content" onClick={(e) => {
                        e.stopPropagation()
                        changeLanguage('en')
                        menuRight.current.hide(e);
                    }}  >
                        
                        English
                    </div>
                );
            }
        },
        {
            label: 'English',
            template: () => {
                return (
                    <div className="p-menuitem-content py-2 px-3 flex items-center gap-3 cursor-pointer" data-pc-section="content" onClick={(e) => {
                        e.stopPropagation()
                        changeLanguage('cn')
                        menuRight.current.hide(e);
                    }}  >
                        
                        中文
                    </div>
                );
            }
        },
    ];
    
    return (
        <div className="w-full h-[72px] z-30 sticky top-0 flex items-center justify-between p-[20px] bg-white shadow">
            <img src="/assets/image/currenttech logo H black 1.png" alt="logo" />
            <Button size="sm" variant="textOnly" label="Show Right" onClick={(event) => menuRight.current.toggle(event)} aria-controls="popup_menu_right" aria-haspopup>
                <img src="/assets/image/Header icon.svg" alt="icon" className="justify-content: space-between;" ></img>
            </Button>
            <Menu model={items} popup ref={menuRight} id="popup_menu_right" popupAlignment="right" />
        </div>
    )
}