import {
  Avatars,
  Client,
  Account,
  Storage,
  Databases,
} from "node-appwrite";

import { AUTH_COOKIE } from "@/constants";
import { getClientCookie } from './utils';
export { ID } from "appwrite";

const { APPWRITE_ENDPOINT, PROJECT_ID } = useRuntimeConfig().public;
export function createSessionClient(event?) {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID);

  let session;

  if (event) {
    session = getCookie(event, AUTH_COOKIE);
  } else {
    session = getClientCookie(AUTH_COOKIE);
  }

  client.setSession(session);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
  };
};

export async function createAdminClient() {
  if (process.client) {
    throw new Error("Unauthorized");
  }
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(process.env.NUXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
};