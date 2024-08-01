"use client"
import React, {FC, useState} from 'react';
import {format} from "date-fns";
import ArticlePop from "@/app/components/article-pop";
import clsx from "clsx";

export interface ArticleInterface {
    articleUrl: string,
    content: string,
    createdAt: string,
    mainUrl: string,
    publishedDate: string,
    title: string,
    updatedAt: string,
    summary_ai: string,
    summary_human: string,
    translation_ai: string
    translation_human: string,
    title_translation_ai: string,
    title_translation_human: string,
    source: string,
    mutateFunc: () => any,
    isPublished?: string,
    category:string,
    subcategory:string
}

const ArticleCard: FC<ArticleInterface> = ({
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
                                               publishedDate, subcategory,
                                               updatedAt, mutateFunc, isPublished,category
                                           }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isTranslateOpen, setIsTranslateOpen] = useState(false)
    const [isPopOpen, setIsPopOpen] = useState(false)
    return (
        <div className={'flex flex-col p-4 rounded-xl border-2 border-blue-500 gap-1 w-full'}>
            <div className={'flex justify-between gap-2 items-center'}>
                <a href={articleUrl} className={'font-bold underline text-blue-500 text-xl'}>{title}</a>
                <div onClick={() => {
                    setIsPopOpen(true)
                }}
                     className={'flex justify-center cursor-pointer rounded-xl items-center p-2 bg-blue-500 text-white'}>
                    Редактировать
                </div>
            </div>
            <p className={clsx('text-sm font-bold', Boolean(isPublished) ? 'text-green-500' : 'text-red-500')}>{Boolean(isPublished) ? 'Опубликовано ✔' : 'Не опубликованно ✕ '}</p>
            <div className={'flex items-center gap-5'}>
                <p className={'font-bold underline'}>{format(new Date(publishedDate), 'dd.MM.yyyy')}</p>
                <a href={mainUrl} className={'underline cursor-pointer text-blue-500 font-bold'}>{source}</a>
                {category?.length>0?<p className={'font-bold underline'}>{category=='news'?'Новости':'Статьи'}</p>:<p className={'font-bold underline'}>категория не указана</p>}
                {subcategory?.length>0?<p className={'font-bold underline'}>{subcategory=='Детская дерматология'?'Детская дерматология':'Дерматовенерология'}</p>:<p className={'font-bold underline'}>категория не указана</p>}
            </div>
            {isOpen ? <p className={'text-justify'}>{content}</p> :
                <p className={'text-justify'}>{content.slice(0, 1000)}... <span onClick={() => {
                    setIsOpen(true)
                }} className={'underline text-blue-500 cursor-pointer'}>Показать полностью</span></p>}
            <p className={'text-xl font-bold mt-7'}>Саммари:</p>
            <p className={'text-justify'}>{summary_human?.length > 0 ? summary_human : 'не составлено'}</p>
            <p className={'text-xl font-bold mt-7'}>Перевод:</p>
            {translation_human?.length > 0 ? <>            {isTranslateOpen ?
                <p className={'text-justify'}>{translation_human}</p> :
                <p className={'text-justify'}>{translation_human.slice(0, 1000)}... <span onClick={() => {
                    setIsTranslateOpen(true)
                }} className={'underline text-blue-500 cursor-pointer'}>Показать полностью</span></p>}
            </> : <p>не составлено</p>}
            <p className={'text-xl font-bold mt-7'}>Перевод заголовка:</p>
            <p className={'text-justify'}>{title_translation_human?.length > 0 ? title_translation_human : 'не составлено'}</p>
            {isPopOpen ?
                <ArticlePop subcategory={subcategory} category={category} isPublished={isPublished} title_translation_ai={title_translation_ai} mutateFunc={mutateFunc} articleUrl={articleUrl}
                            content={content} createdAt={createdAt} mainUrl={mainUrl}
                            publishedDate={publishedDate} title={title} updatedAt={updatedAt} summary_ai={summary_ai}
                            summary_human={summary_human}
                            translation_ai={translation_ai} translation_human={translation_human}
                            title_translation_human={title_translation_human} closeFunc={() => {
                    setIsPopOpen(false)
                }} source={source}/> : null}
        </div>
    );
};

export default ArticleCard;