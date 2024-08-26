"use client"
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {motion} from "framer-motion";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import axios from "axios";
import ArticleCard, {ArticleInterface} from "@/app/components/article-card";
import {HashLoader} from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoPublicationPop from "@/app/components/auto-publication-pop";

export default function Home() {

    const paramDate = useSearchParams().get('date')

    const defaultDate = paramDate ? new Date(paramDate ?? '') : new Date()

    const [date, setDate] = useState(new Date())

    const [articles, setArticles] = useState<Omit<ArticleInterface, 'mutateFunc'>[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const [isPdf, setIsPdf] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthorized')
        if (isAuth != 'true' && router) {
            router.push('/auth')
        }
    }, [])

    const fetchArticles = async () => {
        axios.get(`https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/parserInfo?hasPdf=${isPdf}&date=${format(date, 'yyyy-MM-dd')}`).then((res) => {
            setArticles(res.data.reverse())
            setIsLoading(false)
            console.log(res.data)
        })

    }

    useEffect(() => {
        fetchArticles()
    }, [date, isPdf]);

    const [isAutoPublicationPopOpen,setIsAutoPublicationPopOpen]=useState(false)

    return (
        <main className="p-10">
            {isAutoPublicationPopOpen&&<AutoPublicationPop closeFunc={()=>{setIsAutoPublicationPopOpen(false)}}/>}
            <div className={'mt-5 flex flex-col gap-12'}>
                <div className={'flex items-center pr-32 justify-between'}>
                    <div className={'flex items-center gap-20'}>
                        <p className={'text-3xl font-bold'}>Статьи Medical Exchange Alliance</p>
                        <div onClick={() => {
                            setIsLoading(true);
                            setIsPdf(!isPdf)
                        }} className={'flex cursor-pointer items-center gap-2'}>
                            <p>Статьи</p>
                            <div
                                className={'w-16 relative rounded-full flex items-center border-2 h-7 border-blue-500'}>
                                <motion.div variants={{
                                    open: {left: 3, right: 'auto', opacity: 0.3},
                                    closed: {left: 'auto', right: 3, opacity: 1}
                                }} animate={!isPdf ? 'open' : 'closed'}
                                            className={'w-5 absolute aspect-square bg-blue-500 rounded-full'}>

                                </motion.div>
                            </div>
                        </div>
                        <div onClick={()=>{setIsAutoPublicationPopOpen(true)}} className={'bg-blue-500 font-bold rounded-xl cursor-pointer p-2 flex items-center justify-center text-white'}>
                            Автопубликация
                        </div>
                    </div>
                    <div className={'flex flex-col w-48 justify-end'}>
                        <DatePicker dateFormat={'dd.MM.yyyy'}
                                    className={'text-xl font-bold border-blue-500 border-2 rounded-xl text-center'}
                                    selected={date} onChange={(date) => {
                            if (date) {
                                setIsLoading(true)
                                setDate(date)
                            }
                        }}/>
                    </div>
                    {/*<p className={'text-4xl font-bold'}>{format(defaultDate, 'dd.MM.yyyy')}</p>*/}
                </div>
                {isLoading ? <div className={'h-screen flex justify-center -mt-32 items-center'}>
                    <HashLoader color={'#3b82f6'}/>
                </div> : <>{articles.map((article, counter) => {
                    return <ArticleCard hasPdf={isPdf} key={counter} mutateFunc={fetchArticles} {...article}/>
                })}</>}
            </div>
        </main>
    );
}
