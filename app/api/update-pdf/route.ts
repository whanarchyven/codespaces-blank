import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    const data = await request.json()
    console.log(data)
    // return NextResponse.json(request.body)
    const result = await axios.post('https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/updateSummaryPDF', {
        articleUrl: data.articleUrl,
        pdf_text_translation_human: data.pdf_text_translation_human,
        pdf_text_summary_human: data.pdf_text_summary_human
    }, {timeout: 60000})
    console.log(result.data)
    return NextResponse.json(result.data)
}