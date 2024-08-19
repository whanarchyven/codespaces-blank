"use client"
import {useParams, useRouter, useSearchParams} from "next/navigation";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import axios from "axios";
import ArticleCard, {ArticleInterface} from "@/app/components/article-card";
import {HashLoader} from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {

    const paramDate = useSearchParams().get('date')

    const defaultDate = paramDate ? new Date(paramDate ?? '') : new Date()

    const [date, setDate] = useState(new Date())

    const [articles, setArticles] = useState<Omit<ArticleInterface, 'mutateFunc'>[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthorized')
        if (isAuth != 'true'&&router) {
            router.push('/auth')
        }
    }, [])

    const fetchArticles = async () => {
        axios.get(`https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/parserInfo?date=${format(date, 'yyyy-MM-dd')}`).then((res) => {
            setArticles(res.data.reverse())
            setIsLoading(false)
            console.log(res.data)
        })

    }

    useEffect(() => {
        fetchArticles()
    }, [date]);


    return (
        <main className="p-10">
            <div className={'mt-5 flex flex-col gap-12'}>
                <div className={'flex items-center pr-32 justify-between'}>
                    <p className={'text-4xl font-bold'}>Статьи Medical Exchange Alliance</p>
                    <div className={'flex flex-col w-48 justify-end'}>
                        <DatePicker dateFormat={'dd.MM.yyyy'}
                                    className={'text-xl font-bold border-blue-500 border-2 rounded-xl text-center'}
                                    selected={date} onChange={(date) => {
                            if (date) {
                                setDate(date)
                            }
                        }}/>
                    </div>
                    {/*<p className={'text-4xl font-bold'}>{format(defaultDate, 'dd.MM.yyyy')}</p>*/}
                </div>
                {isLoading ? <div className={'h-screen flex justify-center -mt-32 items-center'}>
                    <HashLoader color={'#3b82f6'}/>
                </div> : <>{articles.map((article, counter) => {
                    return <ArticleCard key={counter} mutateFunc={fetchArticles} {...article}/>
                })}</>}
            </div>
        </main>
    );
}
