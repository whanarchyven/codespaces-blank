"use client"
import React, {FC, useEffect, useState} from 'react';
import DatePicker from "react-datepicker";
import clsx from "clsx";
import {ClipLoader} from "react-spinners";
import axios from "axios";
import {format} from "date-fns";

interface AutoPublicationPopInterface {
    closeFunc:()=>any
}

const AutoPublicationPop:FC<AutoPublicationPopInterface> = ({closeFunc}) => {

    const [isPlaying, setIsPlaying] = useState(false)

    const [date, setDate] = useState(new Date())

    const fetchConfig = async () => {
        await axios.get('https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/getAutoPublishConfig').then((res) => {
            if (res.data) {
                setIsPlaying(res.data.isRunning)
                setDate(new Date(res.data.startDate))
            }
        })
    }

    const togglePlaying = async () => {
        console.log('aaaa')
        await axios.post('/api/toggle-autopublication/', {
            startDate: format(date, 'yyyy-MM-dd'),
            isRunning: !isPlaying
        }).then((res) => {
            if(res.data){
                fetchConfig()
            }
        })
    }

    useEffect(() => {
        fetchConfig()
    }, []);

    return (
        <div className={'fixed w-screen h-screen bg-white left-0 top-0 flex items-center justify-center z-50'}>
            <img onClick={closeFunc} className={'w-16 absolute right-4 cursor-pointer top-4 fill-blue-500'} src={'close_blue.svg'}/>
            <div className={'flex flex-col items-center gap-8'}>
                <p className={'text-4xl font-bold'}>Автопубликация статей</p>
                <div className={'flex items-center gap-4'}>
                    <p>Дата начала:</p>
                    <DatePicker disabled={isPlaying} dateFormat={'dd.MM.yyyy'}
                                className={clsx('text-xl font-bold border-blue-500 border-2 rounded-lg text-center',isPlaying?'opacity-50':'opacity-100')}
                                selected={date} onChange={(date) => {
                        if (date) {
                            setIsPlaying(false)
                            setDate(date)
                        }
                    }}/>
                </div>
                {isPlaying&&<div className={'flex items-center gap-4'}>
                    <p className={'text-[#3B82F6] font-bold'}>Публикуем...</p>
                    <ClipLoader size={20} color={'#3B82F6'}/>
                </div>}
                {isPlaying ? <div onClick={async () => {
                    await togglePlaying()
                }}
                                  className={clsx('bg-red-500 p-3 flex rounded-lg items-center justify-center font-bold cursor-pointer text-white')}>Отменить
                    автопубликацию</div> : <div onClick={async () => {
                    await togglePlaying()

                }}
                                                className={clsx('bg-blue-500 p-3 flex rounded-lg items-center justify-center font-bold cursor-pointer text-white')}>
                    Начать автопубликацию
                </div>}
            </div>
        </div>
    );
};

export default AutoPublicationPop;