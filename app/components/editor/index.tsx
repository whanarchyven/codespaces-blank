import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { ChangeEvent, useCallback, useEffect, useState,FC } from "react";

const initialMarkdown = `## **Основные моменты:**\\n\\nВторичный анализ рандомизированного исследования показывает, что влияние приема рыбьего жира во время беременности на риск развития атопического дерматита (АД) у детей зависит от конкретного генотипа циклооксигеназы-1 (COX1) матери.\\n\\n## **Методология:**\\n\\n  * Исследователи провели вторичный анализ клинического испытания n-3 длинноцепочечных полиненасыщенных жирных кислот (ДЦПНЖК) в рамках когорты 2010 года COPSAC с марта 2009 по март 2014 года.\\n  * В исследование было включено 635 пар мать-ребенок в период с 2019 по 2021 год; беременные женщины были набраны на сроке от 22 до 26 недель и случайным образом распределены для приема либо n-3 ДЦПНЖК (рыбий жир), либо плацебо (оливковое масло) до одной недели после родов.\\n  * Оценивали возникновение АД у их детей до 10 лет.\\n\\n## **Основные выводы:**\\n\\n  * Среди детей, у которых были доступны данные по мочевым эйкозаноидам, прием рыбьего жира во время беременности был связан с более низким уровнем тромбоксана А2 в моче в возрасте 1 года.\\n  * Прием рыбьего жира во время беременности не был связан с риском АД в зависимости от генотипа COX1 ребенка.\\n  * Прием рыбьего жира во время беременности снижал риск развития АД только у детей, рожденных от матерей с генотипом COX1 _TT_. Для детей, чьи матери имели генотип COX1 _CT_, не было выявлено общей ассоциации.\\n  * В сравнении с плацебо, прием рыбьего жира был связан с повышенным риском АД у детей, рожденных от матерей с генотипом COX1 _CC_.\\n\\n## **На практике:**\\n\\n\\"Эти результаты поддерживают использование персонализированной профилактической стратегии для снижения нагрузки АД в детском возрасте путем назначения n-3 ДЦПНЖК только беременным женщинам с генотипом COX1 _TT_,\\" заключили авторы. В будущих исследовательских работах они рекомендовали повторить результаты для тестирования потенциала персонализированной профилактики.\\n\\n## **Источник:**\\n\\nИсследование было выполнено Лян Ченом, MSc из Копенгагенского университета, Дания, и опубликовано онлайн 28 августа 2024 года в _JAMA Dermatology_.\\n\\n## **Ограничения:**\\n\\nОграничения включают отсутствие валидационной когорты, небольшое количество матерей с генотипом _CC_, и отсутствие данных по экспрессии гена COX1 и/или уровню белка фермента.\\n\\n## **Разглашение информации:**\\n\\nИсследование было поддержано грантами Европейского исследовательского совета. Четыре автора сообщили о финансовых связях за пределами этой работы. Других раскрытий не было.`;


interface EditorInterface{
    value:string,
    mutate:(arg:any)=>any
}


const Editor:FC<EditorInterface>=({value,mutate})=> {
    // Creates a new editor instance.
    const editor = useCreateBlockNote();

    const markdownInputChanged = useCallback(
        async (e: ChangeEvent<HTMLTextAreaElement>) => {
            const blocks = await editor.tryParseMarkdownToBlocks(e.target.value);
            editor.replaceBlocks(editor.document, blocks);
        },
        [editor]
    );

    // For initialization; on mount, convert the initial Markdown to blocks and replace the default editor's content
    useEffect(() => {
        async function loadInitialHTML() {
            const blocks = await editor.tryParseMarkdownToBlocks(initialMarkdown);
            editor.replaceBlocks(editor.document, blocks);
        }
        loadInitialHTML();
    }, [editor]);

    const [outputMarkdown, setOutputMarkdown] = useState('');

    const onChange = async () => {
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        setOutputMarkdown(markdown);
        mutate(markdown.toString())
    };

    // Пример строки из API (в вашем случае передавайте реальное значение)
    const apiResponse = value;

    // Функция для корректной замены символов новой строки
    const formatMarkdownString = (str:any) => {
        return str.replace(/\\n/g, '\n');
    };

    // Используем эффект для обработки строки, полученной с API
    useEffect(() => {
        const formattedMarkdown = formatMarkdownString(apiResponse);
        console.log("Formatted Markdown: ", formattedMarkdown);

        async function loadApiContent() {
            const blocks = await editor.tryParseMarkdownToBlocks(formattedMarkdown);
            editor.replaceBlocks(editor.document, blocks);
        }

        loadApiContent();
    }, [editor]);

    // Выводим отформатированный markdown
    return (
        <div className={"wrapper"}>
            {/* <div>Input (Markdown):</div>
            <div className={"bg-blue-500"}>
                <code>
                    <textarea
                        defaultValue={initialMarkdown}
                        onChange={markdownInputChanged}
                    />
                </code>
            </div>
            <div>Output (BlockNote Editor):</div> */}
            <div className={"border-blue-500 w-full border-2 rounded-xl"}>
                <BlockNoteView theme={'light'} editor={editor} onChange={onChange} editable={true} />
            </div>

            {/* <div className={''}>
                Output MD
                <p className={'whitespace-pre'}>{outputMarkdown.toString()}</p>
            </div> */}
        </div>
    );
}

export default Editor