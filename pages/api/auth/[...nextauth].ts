import spotifyApi, { LOGIN_URL } from '@lib/spotify';
import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

async function refreshAccessToken(token: any) {
    try {
        spotifyApi.setAccessToken(token.accessToken);
        spotifyApi.setRefreshToken(token.refreshToken);

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

        return {
            ...token,
            accessToken: refreshedToken,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    } catch (err) {
        console.error(err);

        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIEND_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET as string,
            authorization: LOGIN_URL,
        }),
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, account, user }): Promise<any> {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at as number * 1000,
                }
            }

            if (Date.now() < (token as any).accessTokenExpires) {
                return token;
            }

            return await refreshAccessToken(token);
        },
        async session({ session, token }: { session: any; token: any }): Promise<any> {
            session.user.accessToken = token.accessToken;
            session.user.refreshToken = token.refreshToken;
            session.user.username = token.username;

            return session;
        }
    },
});
