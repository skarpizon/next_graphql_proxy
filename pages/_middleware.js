import { NextResponse } from "next/server"

const baseUrl = process.env.SERVER_API_URL

export async function middleware(request, ev) {
  let response = NextResponse.next()

  if (request.nextUrl.pathname.includes("/auth")) {
    if (request.nextUrl.pathname.includes("/logout")) {
      response = NextResponse.redirect(new URL("/auth", request.url))
      response.clearCookie("refresh_token")
      response.clearCookie("access_token")
      return response
    }
    if (request.cookies["refresh_token"]) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else {
    if (!request.cookies["refresh_token"]) {
      return NextResponse.redirect(new URL("/auth", request.url))
    }
  }

  if (request.cookies["refresh_token"] && !request.cookies["access_token"]) {
    try {
      const res = await fetch(`${baseUrl}/users/get_access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: request.cookies["refresh_token"]
        })
      })

      const at = (await res.json())?.token

      if (at) {
        response.cookie("access_token", at, {
          maxAge: 7000000,
          httpOnly: true
        })
      }
    } catch (error) {
      response = NextResponse.redirect(new URL("/auth", request.url))
      response.clearCookie("refresh_token")
      response.clearCookie("access_token")
      return response
    }
  }
  return response
}
