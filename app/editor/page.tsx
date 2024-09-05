"use client"
import React, {useEffect, useState} from 'react';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import Editor from "@/app/components/editor";

const Page = () => {

    const [display,setDisplay]=useState(false)

    useEffect(() => {
        setTimeout(()=>{
            setDisplay(true)
        },2000)
    }, []);
    return(
        <div>
            {display&&<Editor/>}
        </div>
    )
};

export default Page;