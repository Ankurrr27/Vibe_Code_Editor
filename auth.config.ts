import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

const githubClientId =
    process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID;
const githubClientSecret =
    process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET;
const googleClientId =
    process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
    process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;

export default{
    pages: {
        signIn: "/auth/sign-in",
    },
    providers:[
        GitHub({
            clientId: githubClientId,
            clientSecret: githubClientSecret,
            authorization: {
                params: {
                    scope: "read:user repo",
                },
            },
        }),
        Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        })
    ]
} satisfies NextAuthConfig
