import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {format} from "date-fns";

export async function POST(request: NextRequest) {
    const data = await request.json()
    console.log(data)
    // return NextResponse.json(request.body)
    const result = await axios.post('https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/updateAiThresholdConfig', {
        ai_threshold: data.ai_threshold,
    },)
    console.log(result.data)
    return NextResponse.json(result.data)
}

export async function GET(request: NextRequest) {
    // return NextResponse.json(request.body)
    console.log(request)
    const result = await axios.get(`https://d5dvsartlv83ra2p2eek.apigw.yandexcloud.net/getAiThresholdConfig`)
    console.log(result.data)
    return NextResponse.json(result.data)
}
