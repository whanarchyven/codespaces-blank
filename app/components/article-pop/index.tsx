"use client"
import React, {FC, useState} from 'react';
import {ArticleInterface} from "@/app/components/article-card";
import axios from "axios";
import {ClipLoader, MoonLoader} from "react-spinners";
import clsx from "clsx";

interface ArticlePopInterface extends ArticleInterface {
    closeFunc: () => any,
}

const ArticlePop: FC<ArticlePopInterface> = ({
                                                 articleUrl,
                                                 mainUrl,
                                                 title_translation_ai,
                                                 title_translation_human,
                                                 translation_ai,
                                                 translation_human,
                                                 summary_human,
                                                 title,
                                                 summary_ai,
                                                 source,
                                                 content,
                                                 createdAt,
                                                 publishedDate,
                                                 updatedAt, closeFunc, mutateFunc, isPublished, category
                                             }) => {

    const [inputTitle, setInputTitle] = useState(title_translation_human)
    const [inputContent, setInputContent] = useState(translation_human)
    const [inputSummary, setInputSummary] = useState(summary_human)

    const [isFetching, setIsFetching] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const fetchSummary = async () => {
        const {data}: any = await axios.post('/api/summarize', {
            articleUrl: articleUrl
        })
        if (data) {
            console.log(data)
            setInputSummary(data.summary_human)
            setInputContent(data.translation_human)
            setInputTitle(data.title_translation_human)
        }
        setIsFetching(false)
        console.log(data)
    }

    const [categoryInput, setCategoryInput] = useState<'news' | 'derma'>(category == 'news' || category == 'derma' ? category : 'news')

    const updateArticle = async () => {
        const {data}: any = await axios.post('/api/update-article', {
            articleUrl: articleUrl,
            summary_human: inputSummary,
            translation_human: inputContent,
            title_translation_human: inputTitle
        })
        const publish: any = await axios.post('/api/update-category', {
            articleUrl: articleUrl,
            category: categoryInput,
        })

        console.log(data, publish.data)
        mutateFunc()
        closeFunc()
        setIsLoading(false)
    }

    const publishArticle = async (isPublished: 'true' | 'false') => {

        const {data}: any = await axios.post('/api/update-publishing', {
            articleUrl: articleUrl,
            isPublished: isPublished,
        })
        console.log(data)
        setIsLoading(false)
        mutateFunc()
        closeFunc()
    }


    return (
        <div
            className={'fixed w-screen h-screen top-0 left-0 bg-black backdrop-blur-sm flex justify-center items-center bg-opacity-50'}>
            <img onClick={closeFunc} className={'w-12 absolute cursor-pointer right-9 top-9'} src={'/close.svg'}/>
            <div className={'w-2/3 bg-white flex flex-col gap-5 p-5 rounded-2xl'}>
                <div className={'flex justify-between items-center'}>
                    <div className={'flex items-center gap-12'}>
                        <p className={'text-2xl font-bold'}>Редактирование статьи</p>
                        <p className={clsx('text-sm font-bold', Boolean(isPublished) ? 'text-green-500' : 'text-red-500')}>{Boolean(isPublished) ? 'Опубликовано ✔' : 'Не опубликованно ✕ '}</p>
                    </div>
                    <div onClick={() => {
                        setIsFetching(true);
                        fetchSummary()
                    }} className={'bg-blue-500 cursor-pointer p-2 rounded-xl flex items-center justify-center gap-2'}>
                        {isFetching ? <ClipLoader size={25} color={'#FFF'}/> : <><p
                            className={'text-white font-bold'}>AI</p>
                            <img className={'w-5'} src={'/ai.svg'}/></>}
                    </div>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Перевод заголовка</p>
                    <input value={inputTitle} onChange={(event) => {
                        setInputTitle(event.target.value)
                    }} className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}/>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Перевод текста</p>
                    <textarea rows={5} value={inputContent} onChange={(event) => {
                        setInputContent(event.target.value)
                    }}
                              className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{inputContent}</textarea>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Саммари</p>
                    <textarea rows={5} value={inputSummary} onChange={(event) => {
                        setInputSummary(event.target.value)
                    }}
                              className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{inputSummary}</textarea>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Категория</p>
                    <div className={'flex items-center gap-2'}>
                        <div onClick={() => {
                            setCategoryInput('news')
                        }}
                             className={clsx('p-2 rounded-xl cursor-pointer', categoryInput == 'news' ? 'bg-blue-500 border-2 border-transparent flex items-center justify-center text-white' : 'border-blue-500 border-2 flex items-center justify-center text-blue-500')}>
                            Новости / статьи
                        </div>
                        <div onClick={() => {
                            setCategoryInput('derma')
                        }}
                             className={clsx('p-2 rounded-xl cursor-pointer', categoryInput == 'derma' ? 'bg-blue-500 border-2 border-transparent flex items-center justify-center text-white' : 'border-blue-500 border-2 flex items-center justify-center text-blue-500')}>
                            Детская дерматология / дерматовенерология
                        </div>
                    </div>
                </div>
                {inputSummary?.length > 0 && inputContent?.length > 0 && inputTitle?.length > 0 ? <div onClick={() => {
                        setIsLoading(true);
                        updateArticle()
                    }} className={'bg-blue-500 cursor-pointer p-2 rounded-xl flex items-center justify-center gap-2'}>
                        {isLoading ? <ClipLoader size={25} color={'#FFF'}/> :
                            <p className={'text-white font-bold'}>Сохранить</p>}

                    </div> :
                    null}
                {inputSummary?.length > 0 && inputContent?.length > 0 && inputTitle?.length > 0 ? <>
                        {Boolean(isPublished) ? <div onClick={() => {
                            setIsLoading(true);
                            publishArticle('false')
                        }} className={'bg-red-500 cursor-pointer p-2 rounded-xl flex items-center justify-center gap-2'}>
                            {isLoading ? <ClipLoader size={25} color={'#FFF'}/> :
                                <p className={'text-white font-bold'}>Снять с публикации</p>}

                        </div> : <div onClick={() => {
                            setIsLoading(true);
                            publishArticle('true')
                        }} className={'bg-green-500 cursor-pointer p-2 rounded-xl flex items-center justify-center gap-2'}>
                            {isLoading ? <ClipLoader size={25} color={'#FFF'}/> :
                                <p className={'text-white font-bold'}>Опубликовать</p>}

                        </div>}
                    </> :
                    null}
            </div>
        </div>
    );
};

export default ArticlePop;