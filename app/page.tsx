"use client"
import Image from "next/image";
import {useParams, useSearchParams} from "next/navigation";
import {format} from "date-fns";
import {useEffect, useState} from "react";
import axios from "axios";
import ArticleCard, {ArticleInterface} from "@/app/components/article-card";
import {HashLoader} from "react-spinners";

export default function Home() {

    const paramDate=useSearchParams().get('date')

    const defaultDate = paramDate ? new Date(paramDate ?? '') : new Date()

    const [articles, setArticles] = useState<Omit<ArticleInterface, 'mutateFunc'>[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const fetchArticles=async ()=>{
        axios.get(`https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/parserInfo?date=${format(defaultDate, 'yyyy-MM-dd')}`).then((res) => {
            setArticles(res.data.reverse())
            setIsLoading(false)
            console.log(res.data)
        })

    }

    useEffect(() => {
        fetchArticles()
    }, []);

    return (
        <main className="p-10">
            <div className={'mt-5 flex flex-col gap-12'}>
                <div className={'flex items-center justify-between'}>
                    <p className={'text-4xl font-bold'}>Статьи Medical Exchange Alliance</p>
                    <p className={'text-4xl font-bold'}>{format(defaultDate, 'dd.MM.yyyy')}</p>
                </div>
                {isLoading ? <div className={'h-screen flex justify-center -mt-32 items-center'}>
                    <HashLoader color={'#3b82f6'}/>
                </div> : <>{articles.map((article,counter) => {
                    return <ArticleCard key={counter} mutateFunc={fetchArticles} {...article}/>
                })}</>}
            </div>
        </main>
    );
}
