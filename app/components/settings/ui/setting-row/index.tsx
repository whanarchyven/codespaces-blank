import React, {FC, useEffect, useState} from 'react';
import {ClipLoader} from "react-spinners";

interface SettingRowInterface {
    setting_name: string,
    fetchFunc: (arg?: any) => any
    updateFunc: (arg?: any) => any,
    type?:'number'|'text'
    step?:number
    max?:number
    min?:number
    description?:string
}

const SettingRow: FC<SettingRowInterface> = ({setting_name, fetchFunc, updateFunc, type, step, min, max,description}) => {

    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFunc().then((res) => {
            if(res){
                setValue(res)
                setLoading(false)
            }
        })
    }, [])

    return (
        <div className={'flex flex-col gap-1 w-full'}>
            <p className={'text-lg'}>{setting_name}</p>
            {description&&<p className={'font-medium text-sm opacity-50 whitespace-pre'}>{description}</p>}
            <div className={'grid grid-cols-6 gap-2 items-center'}>
                <input min={min} max={max} step={step} type={type??'text'} value={value} onChange={(event) => {
                    setValue(event.target.value)
                }} className={'border-blue-500 p-2 rounded-lg col-span-4 border-2'}/>
                <div onClick={async ()=>{
                    if(!loading) {
                        setLoading(true)
                        await updateFunc(value)
                        setLoading(false)
                    }
                }} className={'bg-blue-500 p-2 rounded-lg col-span-2 flex cursor-pointer items-center justify-center text-white font-bold'}>
                    {loading?<ClipLoader size={20} color={'#FFF'}/>:'Обновить'}
                </div>
            </div>
        </div>
    );
};

export default SettingRow;