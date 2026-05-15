import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Keycloak from "next-auth/providers/keycloak"
import Logto from "next-auth/providers/logto"
import Auth0 from "next-auth/providers/auth0"
import Okta from "next-auth/providers/okta"
import EntraID from "next-auth/providers/microsoft-entra-id"
import OryHydra from "next-auth/providers/ory-hydra"
import Authentik from "next-auth/providers/authentik"
import IdentityServer4 from "next-auth/providers/identity-server4"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google,
    Keycloak({
      clientId: process.env.KEYCLOAK_ID || "",
      clientSecret: process.env.KEYCLOAK_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER || "",
    }),
    Logto({
      clientId: process.env.LOGTO_CLIENT_ID || "",
      clientSecret: process.env.LOGTO_CLIENT_SECRET || "",
      issuer: process.env.LOGTO_ISSUER || "",
    }),
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER || "",
    }),
    Okta({
      clientId: process.env.OKTA_CLIENT_ID || "",
      clientSecret: process.env.OKTA_CLIENT_SECRET || "",
      issuer: process.env.OKTA_ISSUER || "",
    }),
    EntraID({
      clientId: process.env.ENTRA_CLIENT_ID || "",
      clientSecret: process.env.ENTRA_CLIENT_SECRET || "",
    }),
    OryHydra({
      clientId: process.env.ORY_CLIENT_ID || "",
      clientSecret: process.env.ORY_CLIENT_SECRET || "",
      issuer: process.env.ORY_ISSUER || "",
    }),
    Authentik({
      clientId: process.env.AUTHENTIK_CLIENT_ID || "",
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET || "",
      issuer: process.env.AUTHENTIK_ISSUER || "",
    }),
    IdentityServer4({
      clientId: process.env.WSO2_CLIENT_ID || "",
      clientSecret: process.env.WSO2_CLIENT_SECRET || "",
      issuer: process.env.WSO2_ISSUER || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})