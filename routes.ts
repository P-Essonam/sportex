/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
/*
*
**  Bug- 2FA retest doesn't work, and verification
     of credentials after 2FA sent!!!!!!!!!
     Social must be inside a form component to have
     transition effect
**
*
*/
export const publicRoutes = [
    "/",
    '/pricing',
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
    "/auth/new-verification",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/check";