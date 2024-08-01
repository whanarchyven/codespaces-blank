import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
    const data = await request.json()

    const login1 = process.env.LOGIN_ONE
    const login2 = process.env.LOGIN_TWO
    const pass1 = process.env.PASSWORD_ONE
    const pass2 = process.env.PASSWORD_TWO


    const userPass = data.password
    const userLogin = data.login

    let result = false

    if ((userPass == pass1 && userLogin == login1) || (userPass == pass2 && userLogin == login2)) {
        result = true
    }

    // return NextResponse.json(request.body)

    return NextResponse.json(result);
}