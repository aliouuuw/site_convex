/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as blog from "../blog.js";
import type * as content from "../content.js";
import type * as http from "../http.js";
import type * as media from "../media.js";
import type * as mediaUpload from "../mediaUpload.js";
import type * as myFunctions from "../myFunctions.js";
import type * as team from "../team.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  blog: typeof blog;
  content: typeof content;
  http: typeof http;
  media: typeof media;
  mediaUpload: typeof mediaUpload;
  myFunctions: typeof myFunctions;
  team: typeof team;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
