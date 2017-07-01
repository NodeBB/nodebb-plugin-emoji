declare type Callback<T = void> = (result: T) => void;

declare interface EmojiX {
  base: string;
  buster: string;
  buildEmoji(emoji: StoredEmoji, defer?: boolean): string;
  strategy: any;
  table: MetaData.table;
  fuse: Fuse<StoredEmoji>;
  init(): void;
}

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
}

