import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    const data = await request.json()
    console.log(data)
    // return NextResponse.json(request.body)
    const result = await axios.post('https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/updateSummary', {
        articleUrl: data.articleUrl,
        summary_human:data.summary_human,
        translation_human:data.translation_human,
        title_translation_human:data.title_translation_human,
    },{timeout:60000})
    console.log(result.data)
    return NextResponse.json(result.data)
}