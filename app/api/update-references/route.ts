import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    const data = await request.json()
    console.log(data)
    // return NextResponse.json(request.body)
    const result = await axios.post('https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/updateReferences', {
        articleUrl: data.articleUrl,
        references_human: data.references_human,
    }, {timeout: 60000})
    console.log(result.data)
    return NextResponse.json(result.data)
}