"use client"
import React, {useState} from 'react';
import AiThresholdSetting from "@/app/components/settings/ai-treshold";
const Settings = () => {

    const [isOpen,setIsOpen]=useState(false)

    if(!isOpen){
        return (
            <div onClick={()=>{setIsOpen(true)}} className={'flex items-center justify-center p-3 rounded-xl border-2 border-blue-500 text-blue-500 cursor-pointer font-bold'}>
                Настройки
            </div>
        );
    }
    else{
        return (
            <div className={'fixed left-0 p-5 top-0 w-screen h-screen bg-white z-50'}>
                <img onClick={()=>{setIsOpen(false)}} className={'w-16 absolute right-4 cursor-pointer top-4 fill-blue-500'} src={'close_blue.svg'}/>
                <p className={'font-bold text-black text-3xl'}>Настройки</p>
                <div className={'flex flex-col mt-5 gap-2 w-1/3'}>
                    <AiThresholdSetting/>
                </div>
            </div>
        );

    }
};

export default Settings;