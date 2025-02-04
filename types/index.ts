import { type Models } from "node-appwrite";

export type FileType = "document" | "image" | "video" | "audio" | "other";

export type FormType = "sign-in" | "sign-up";

export interface ActionType {
  label: string;
  icon: string;
  value: string;
}

export interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

export interface GetFilesResponseType {
  documents: Models.Document[];
  total: number;
}

export interface TotalSpaceType {
  image: {
    size: number
    latestDate: string
  }
  document: {
    size: number
    latestDate: string
  }
  video: {
    size: number
    latestDate: string
  }
  audio: {
    size: number
    latestDate: string
  }
  other: {
    size: number
    latestDate: string
  }
  used: number
  all: number
}

export const pathsEnum = {
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up'
} as const;
