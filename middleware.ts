
import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";


const { auth } = NextAuth(authConfig)


export default auth((req) => {

    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
  
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    

    if (isApiAuthRoute) {
      return;
    }
  
    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      return;
    }

    if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
      let callbackUrl = nextUrl.pathname;
      if (nextUrl.search) {
        callbackUrl += nextUrl.search;
      }
  
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
  
      return Response.redirect(new URL(
        `/auth/sign-in?callbackUrl=${encodedCallbackUrl}`,
        nextUrl
      ));
    }


    return;

    
})


export const config = {
    matcher: [
      '/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'
    ],
}