declare type Callback<T = void> = (result: T) => void;

interface Window {
  config: {
    relative_path: string,
    'cache-buster': string,
  };
  app: {
    alertSuccess(message?: string): void,
    alertError(message?: string): void,
    alertError(error: Error): void,
  };
  templates: {
    parse(template: string, data: any, callback: Callback<string>): void,
  };
  utils: {
    generateUUID(): string;
  };
}

declare const socket: SocketIO.Server;

interface JQuery {
  textcomplete: any;
  ajaxSubmit: any;
}

declare module 'translator' {
  export function translate(input: string, callback: Callback<string>): void;
}
declare module 'composer/controls' {
  export function insertIntoTextarea(textarea: HTMLTextAreaElement, text: string): void;
  export function updateTextareaSelection(textarea: HTMLTextAreaElement, start: number, end: number): void;
}
declare module 'composer/formatting' {
  export function addButtonDispatch(name: string, callback: Callback<Element>): void;
}
declare module 'scrollStop' {
  export function apply(element: Element): void;
}
declare module 'Fuse' {
  import * as Fuse from 'fuse';
  export = Fuse;
}
