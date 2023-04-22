/**
 * Schema for defining an emoji
 */
interface Emoji {
  /** alternative names for this emoji */
  aliases?: string[];
  /** keywords to match when searching for emoji */
  keywords?: string[];
  /** common ascii representations for this emoji */
  ascii?: string[];
  /**
   * **`images` mode** image file name [`grinning-face.png`]
   */
  image?: string;
  /**
   * **`sprite` mode** CSS `background-position`
   */
  backgroundPosition?: string;
  /** unicode text character */
  character: string;
  /**
   * categories this emoji fits in (default: `['other']`)
   *
   * known categories:
   * `'people'`,
   * `'nature'`,
   * `'food'`,
   * `'activity'`,
   * `'travel'`,
   * `'objects'`,
   * `'symbols'`,
   * `'flags'`,
   * `'regional'`,
   * `'modifier'`,
   * `'other'`
   *
   * if adding other categories, add translations for them like
   * `"categories.people": "People"` under `emoji.json`
   */
  categories?: string[];
}

interface EmojiDefinition {
  /**
   * human-friendly name of this emoji pack
   */
  name: string;

  /**
   * The ID of this emoji pack.
   * Used in the CSS classname, etc
   */
  id: string;

  /**
   * The absolute base path of the emoji pack. Other paths are relative to this one
   * Usually `__dirname` works well for this
   */
  path: string;

  /**
   * Legal attribution for using these emoji, if applicable
   */
  attribution?: string;

  /**
   * License for these emoji
   */
  license?: string;

  /**
   * The mode of this emoji pack.
   * `images` for individual image files.
   * `sprite` for a single image sprite file.
   * `font` for an emoji font.
   */
  mode: 'images' | 'sprite' | 'font';

  /**
   * **`images` mode** options
   */
  images?: {
    /** Path to the directory where the image files are located */
    directory: string;
  };
  /**
   * **`sprite` mode** options
   */
  sprite?: {
    /** Path to the sprite image file */
    file: string;
    /** CSS `background-size` */
    backgroundSize: string;
  };
  /**
   * **`font` mode** options
   */
  font?: {
    /** Path to the emoji font `.eot` file (for old IE support) */
    eot?: string;
    /** Path to the emoji font `.ttf` file */
    ttf?: string;
    /** Path to the emoji font `.woff` file */
    woff?: string;
    /** Path to the emoji font `.woff2` file */
    woff2?: string;
    /** Path to the emoji font `.svg` file
     * (for Apple support, end this with the `#fontname` convention) */
    svg?: string;

    /** CSS `font-family` name */
    family: string;
  };

  /**
   * A map of emoji names to one of the following
   */
  dictionary: {
    [name: string]: Emoji;
  };
}

declare type NodeBack<T = any> = (err?: Error, ...args: T[]) => void;

interface StoredEmoji {
  name: string;
  character: string;
  image: string;
  pack: string;
  aliases: string[];
  keywords: string[];
}

declare namespace MetaData {
  /** table of all emoji */
  interface Table {
    [name: string]: StoredEmoji;
  }

  /** map of all aliases to the base name */
  interface Aliases {
    [alias: string]: string;
  }

  /** map of ascii to base names */
  interface Ascii {
    [str: string]: string;
  }

  /** list of emoji names in each category */
  interface Categories {
    [category: string]: string[];
  }

  /** map of characters to emoji names */
  interface Characters {
    [character: string]: string;
  }

  /** storing pack information for dialog */
  type Packs = {
    name: string;
    id: string;
    attribution: string;
    license: string;
  }[];
}

declare namespace NodeJS {
  export interface Global {
    env: 'development' | 'production';
  }
}

interface CustomEmoji {
  /** name of custom emoji */
  name: string;
  /** custom image for emoji */
  image: string;
  aliases: string[];
  ascii: string[];
}

interface CustomAdjunct {
  /** Name of original emoji */
  name: string;
  /** Additional aliases for the emoji */
  aliases: string[];
  /** Additional ascii patterns for this emoji */
  ascii: string[];
}

interface Customizations {
  emojis: {
    [id: number]: CustomEmoji
  };
  adjuncts: {
    [id: number]: CustomAdjunct
  }
}

interface Settings {
  parseNative: boolean;
  parseAscii: boolean;
  customFirst: boolean;
  parseTitles: boolean;
}
