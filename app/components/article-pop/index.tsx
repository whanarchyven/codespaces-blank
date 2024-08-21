"use client"
import React, {FC, useState} from 'react';
import {ArticleInterface} from "@/app/components/article-card";
import axios from "axios";
import {ClipLoader} from "react-spinners";
import clsx from "clsx";
import TextareaAutosize from 'react-textarea-autosize';
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
                                                 subcategory,
                                                 pdf_text_translation_human,
                                                 pdf_text_summary_human,
                                                 pdf_text,
                                                 updatedAt,
                                                 closeFunc,
                                                 mutateFunc,
                                                 isPublished,
                                                 category, references_human,references
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
            setInputReferences(data.references_human.join('\n'))
        }
        setIsFetching(false)
        console.log(data)
    }

    const [categoryInput, setCategoryInput] = useState<'news' | 'articles'>(category == 'news' || category == 'articles' ? category : 'news')
    const [subcategoryInput, setSubcategoryInput] = useState<'Детская дерматология' | 'Дерматовенерология'>(subcategory == 'Детская дерматология' || subcategory == 'Дерматовенерология' ? subcategory : 'Детская дерматология')

    const updateArticle = async () => {
        const {data}: any = await axios.post('/api/update-article', {
            articleUrl: articleUrl,
            summary_human: inputSummary,
            translation_human: inputContent,
            title_translation_human: inputTitle,
        })
        const publish: any = await axios.post('/api/update-category', {
            articleUrl: articleUrl,
            category: categoryInput,
        })

        const publishSubcategory: any = await axios.post('/api/update-subcategory', {
            articleUrl: articleUrl,
            subcategory: subcategoryInput,
        })

        if (pdfInputText.length > 0 && pdfInputSummary.length > 0) {
            const publishPdf: any = await axios.post('/api/update-pdf', {
                articleUrl: articleUrl,
                pdf_text_translation_human: pdfInputText,
                pdf_text_summary_human: pdfInputSummary
            })

        }
        if (inputReferences != null) {
            const refs = inputReferences.split('\n')
            console.log(refs)
            const publishRefs = await axios.post('/api/update-references', {
                articleUrl: articleUrl,
                references_human: refs
            })
            console.log(publishRefs)
        }

        // const updateRef=await axios.post('/api/update-references',{
        //
        // })

        console.log(data, publish.data)
        mutateFunc()
        closeFunc()
        setIsLoading(false)
    }

    const initializeReferences=()=>{
        if(references_human&&references_human.length>0){
            return references_human
        }
        if(references&&references.length>0){
            return references
        }
        return []
    }

    const [inputReferences, setInputReferences] = useState(initializeReferences().join('\n'))

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

    const fetchPdf = async () => {
        const {data}: any = await axios.post('/api/summarize-pdf', {
            articleUrl: articleUrl
        })
        if (data) {
            console.log(data)
            setPdfInputSummary(data.pdf_text_summary_human)
            setPdfInputText(data.pdf_text_translation_human)
            // setPdfInputTitle(data.)
        }
        setIsPdfFetching(false)
        console.log(data)
    }

    console.log(pdf_text_summary_human)

    const [pdfInputSummary, setPdfInputSummary] = useState(pdf_text_summary_human ?? '')
    const [pdfInputText, setPdfInputText] = useState(pdf_text_translation_human ?? '')

    const [isPdfFetching, setIsPdfFetching] = useState(false)

    return (
        <div
            className={'fixed w-screen h-screen top-0 left-0 bg-black backdrop-blur-sm flex justify-center items-center bg-opacity-50'}>
            <img onClick={closeFunc} className={'w-12 absolute cursor-pointer right-9 top-9'} src={'/close.svg'}/>
            <div className={'w-2/3 bg-white flex flex-col gap-5 p-5 overflow-y-scroll max-h-screen rounded-2xl'}>
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
                    <TextareaAutosize rows={10} value={inputContent} onChange={(event) => {
                        setInputContent(event.target.value)
                    }}
                              className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{inputContent}</TextareaAutosize>
                </div>

                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Саммари</p>
                    <TextareaAutosize rows={10} value={inputSummary} onChange={(event) => {
                        setInputSummary(event.target.value)
                    }}
                              className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{inputSummary}</TextareaAutosize>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Список используемых источников (каждый источник с новой
                        строки)</p>
                    <TextareaAutosize rows={10} value={inputReferences} onChange={(event) => {
                        setInputReferences(event.target.value)
                    }}
                              className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{inputReferences}</TextareaAutosize>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Категория</p>
                    <div className={'flex items-center gap-2'}>
                        <div onClick={() => {
                            setCategoryInput('news')
                        }}
                             className={clsx('p-2 rounded-xl cursor-pointer', categoryInput == 'news' ? 'bg-blue-500 border-2 border-transparent flex items-center justify-center text-white' : 'border-blue-500 border-2 flex items-center justify-center text-blue-500')}>
                            Новости
                        </div>
                        <div onClick={() => {
                            setCategoryInput('articles')
                        }}
                             className={clsx('p-2 rounded-xl cursor-pointer', categoryInput == 'articles' ? 'bg-blue-500 border-2 border-transparent flex items-center justify-center text-white' : 'border-blue-500 border-2 flex items-center justify-center text-blue-500')}>
                            Статьи
                        </div>
                    </div>
                </div>
                <div className={'flex flex-col gap-1'}>
                    <p className={'text-blue-500 font-medium'}>Подкатегория</p>
                    <div className={'flex items-center gap-2'}>
                        <div onClick={() => {
                            setSubcategoryInput('Детская дерматология')
                        }}
                             className={clsx('p-2 rounded-xl cursor-pointer', subcategoryInput == 'Детская дерматология' ? 'bg-blue-500 border-2 border-transparent flex items-center justify-center text-white' : 'border-blue-500 border-2 flex items-center justify-center text-blue-500')}>
                            Детская дерматология
                        </div>
                        <div onClick={() => {
                            setSubcategoryInput('Дерматовенерология')
                        }}
                             className={clsx('p-2 rounded-xl cursor-pointer', subcategoryInput == 'Дерматовенерология' ? 'bg-blue-500 border-2 border-transparent flex items-center justify-center text-white' : 'border-blue-500 border-2 flex items-center justify-center text-blue-500')}>
                            Дерматовенерология
                        </div>
                    </div>
                </div>

                {pdf_text &&
                    <div className={'flex flex-col gap-2'}>
                        <div className={'flex justify-between items-center'}>
                            <div className={'flex items-center gap-12'}>
                                <p className={'text-2xl font-bold'}>Редактирование PDF</p>
                            </div>
                            <div onClick={() => {
                                setIsPdfFetching(true);
                                fetchPdf()
                            }}
                                 className={'bg-blue-500 cursor-pointer p-2 rounded-xl flex items-center justify-center gap-2'}>
                                {isPdfFetching ? <ClipLoader size={25} color={'#FFF'}/> : <><p
                                    className={'text-white font-bold'}>AI</p>
                                    <img className={'w-5'} src={'/ai.svg'}/></>}
                            </div>
                        </div>
                        <div className={'flex flex-col gap-1'}>
                            <p className={'text-blue-500 font-medium'}>Перевод текста PDF</p>
                            <TextareaAutosize rows={10} value={pdfInputText} onChange={(event) => {
                                setPdfInputText(event.target.value)
                            }}
                                      className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{pdfInputText}</TextareaAutosize>
                        </div>
                        <div className={'flex flex-col gap-1'}>
                            <p className={'text-blue-500 font-medium'}>Саммари PDF</p>
                            <TextareaAutosize rows={10} value={pdfInputSummary} onChange={(event) => {
                                setPdfInputSummary(event.target.value)
                            }}
                                      className={'text-xl font-normal w-full border-blue-500 rounded-xl border-2 p-2'}>{pdfInputSummary}</TextareaAutosize>
                        </div>
                    </div>}
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