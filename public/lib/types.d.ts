/* eslint-disable @typescript-eslint/no-explicit-any */

declare type Callback<T = void> = (result: T) => void;

declare const config: {
  relative_path: string;
  assetBaseUrl: string;
  'cache-buster': string;
  emojiCustomFirst: boolean;
  csrf_token: string;
};
declare const app: {
  require(module: string):any
};
declare const ajaxify: {
  data: any;
};
declare const utils: {
  generateUUID(): string;
  isTouchDevice(): boolean;
};

interface String {
  startsWith(str: string): boolean;
}

interface JQuery {
  ajaxSubmit: any;
  draggable: any;
}

declare module 'translator' {
  export class Translator {
    public static create(lang?: string): Translator;

    public translate(input: string): Promise<string>;
  }
  export function translate(input: string, callback: Callback<string>): void;
}
declare module 'benchpress' {
  export function render(template: string, data: any): Promise<string>;
}
declare module 'composer/controls' {
  export function insertIntoTextarea(textarea: HTMLTextAreaElement, text: string): void;
  export function updateTextareaSelection(
    textarea: HTMLTextAreaElement, start: number, end: number
  ): void;
}
declare module 'composer/formatting' {
  export function addButtonDispatch(name: string, callback: any): void;
}
declare module 'scrollStop' {
  export function apply(element: Element): void;
}
declare module 'fuzzysearch' {
  const fuzzysearch: (needle: string, haystack: string) => boolean;
  export = fuzzysearch;
}
declare module 'leven' {
  const leven: (a: string, b: string) => number;
  export = leven;
}
