import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: async ({ token }) => {
      return !!token;
    },
  },
});

export const config = { matcher: ["/profile", "/messages", "/notifications"] };
