// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
// const isApiRoute = createRouteMatcher(["/api/(.*)"]);

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     if (isApiRoute(request)) {
//       const { userId } = await auth();
//       if (!userId) {
//         return new Response("Unauthorized", { status: 401 });
//       }
//     } else {
//       await auth.protect();
//     }
//   }
// });

import { auth } from "@/lib/auth/server";

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/sign-in",
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    // "/account/:path*",
    "/",
  ],
};
