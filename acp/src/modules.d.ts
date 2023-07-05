/// <reference types="svelte" />

/* eslint-disable @typescript-eslint/no-explicit-any */

interface JQuery {
  ajaxSubmit: any;
  draggable: any;
  modal: any;
}

module 'ajaxify' {
  const ajaxify: {
    data: any;
  };
  export default ajaxify;
}

module '@textcomplete/core' {
  export const Textcomplete: any;
}

module '@textcomplete/textarea' {
  export const TextareaEditor: any;
}

module 'config' {
  const config: {
    relative_path: string;
    assetBaseUrl: string;
    'cache-buster': string;
    emojiCustomFirst: boolean;
    csrf_token: string;
  };
  export default config;
}

declare module 'alerts' {
  export function success(message?: string): void;
  export function error(message?: string): void;
  export function error(err?: Error): void;
}

declare module 'api' {
  const api: {
    get(route: string, payload: NonNullable<unknown>): Promise<any>;
    head(route: string, payload: NonNullable<unknown>): Promise<any>;
    post(route: string, payload: NonNullable<unknown>): Promise<any>;
    put(route: string, payload: NonNullable<unknown>): Promise<any>;
    del(route: string, payload: NonNullable<unknown>): Promise<any>;
  };
  export default api;
}

declare module 'translator' {
  export class Translator {
    public static create(lang?: string): Translator;

    public translate(input: string): Promise<string>;
  }
}

declare module 'utils' {
  const utils: {
    generateUUID(): string;
  };
  export default utils;
}
