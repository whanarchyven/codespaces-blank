"use client"
import React, {useState} from 'react';
import axios from "axios";
import {useRouter} from "next/navigation";

const Page = () => {

    const [login,setLogin]=useState('')
    const [password,setPassword]=useState('')

    const router=useRouter()

    const handleLogin=async ()=>{
        const {data}=await axios.post('/api/auth',{
            login,password
        })
        console.log(data)
        if(data){
            localStorage.setItem('isAuthorized','true')
            router.push('/')
        }
        else{
            alert('Неправильный логин или пароль')
        }
    }
    return (
        <div className={'w-screen h-screen flex items-center justify-center gap-3'}>
            <div className={'w-96 flex flex-col gap-4'}>
                <input value={login} onChange={(e)=>{setLogin(e.target.value)}} className={'w-full border-2 border-blue-500 p-2'} placeholder={'Логин'}/>
                <input type={'password'} value={password} onChange={(e)=>{setPassword(e.target.value)}} className={'w-full border-2 border-blue-500 p-2'} placeholder={'Пароль'}/>
                <div onClick={handleLogin} className={'flex cursor-pointer p-2 items-center justify-center text-white bg-blue-500'}>
                    Войти
                </div>
            </div>
        </div>
    );
};

export default Page;