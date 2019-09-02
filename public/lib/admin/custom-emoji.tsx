import { h, Component, FunctionalComponent, render } from 'preact';
import { strategy, table, buildEmoji, init as initEmoji } from 'emoji';

// import 'preact/devtools';

const setsEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const h1: { [val: string]: boolean } = {};
  arr1.forEach((val) => { h1[val] = true; });

  return arr2.every((val) => h1[val]);
};

interface EmojiProps {
  editing?: boolean;
  canSave?: boolean;
  emoji: CustomEmoji;
  onSave: Callback;
  onDelete: Callback;
  onEditName: Callback<string>;
  onEditImage: Callback<string>;
  onEditAliases: Callback<string[]>;
  onEditAscii: Callback<string[]>;
}
const Emoji: FunctionalComponent<EmojiProps> = ({
  editing,
  canSave,
  emoji,
  onSave,
  onDelete,
  onEditName,
  onEditImage,
  onEditAliases,
  onEditAscii,
}) => {
  let imageForm: HTMLFormElement;
  let imageInput: HTMLInputElement;
  let fileNameInput: HTMLInputElement;

  const editImage = () => {
    imageInput.click();

    $(imageInput).one('change', () => {
      if (!imageInput.files.length) {
        return;
      }

      const fileName = `${window.utils.generateUUID()}-${imageInput.files[0].name}`;
      fileNameInput.value = fileName;

      $(imageForm).ajaxSubmit({
        success: () => {
          onEditImage(fileName);
          imageInput.value = '';
        },
        error: () => {
          const err = Error('Failed to upload file');
          console.error(err);
          window.app.alertError(err);
          imageInput.value = '';
        },
      });
    });
  };

  return (
    <tr>
      <td>
        <input
          type="text"
          className="form-control"
          value={emoji.name}
          onInput={(e: Event) => onEditName((e.target as HTMLInputElement).value)}
        />
      </td>
      <td>
        <button
          type="button"
          className="btn btn-default"
          onClick={editImage}
          dangerouslySetInnerHTML={{
            __html: buildEmoji({
              character: '',
              pack: 'customizations',
              keywords: [],
              name: emoji.name,
              aliases: emoji.aliases,
              image: emoji.image,
            }),
          }}
        ></button>
        <form
          action={`${window.config.relative_path}/api/admin/plugins/emoji/upload`}
          method="post"
          encType="multipart/form-data"
          style={{ display: 'none' }}
          ref={(form) => { imageForm = form as HTMLFormElement; }}
        >
          <input
            type="file"
            name="emojiImage"
            accept="image/*"
            ref={(input) => { imageInput = input as HTMLInputElement; }}
          />
          <input
            type="hidden"
            name="fileName"
            ref={(input) => { fileNameInput = input as HTMLInputElement; }}
          />
        </form>
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          value={emoji.aliases.join(',')}
          onInput={(e: Event) => onEditAliases(
            (e.target as HTMLInputElement).value.split(',')
          )}
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control"
          value={emoji.ascii.join(',')}
          onInput={(e: Event) => onEditAscii(
            (e.target as HTMLInputElement).value.split(',')
          )}
        />
      </td>
      <td>
        {
          editing ? (
            <button
              className="btn btn-success"
              type="button"
              onClick={() => onSave(null)}
              disabled={!canSave}
            >
              <i className="fa fa-check"></i>
            </button>
          ) : (
            <button
              className="btn btn-warning"
              type="button"
              onClick={() => onDelete(null)}
            >
              <i className="fa fa-trash"></i>
            </button>
          )
        }
      </td>
    </tr>
  );
};

interface EmojiListProps {
  onEdit: Callback<[string, CustomEmoji]>;
  onDelete: Callback<string>;
  emojis: CustomEmoji[];
}
interface EmojiListState {
  /** The previous state before a save or deletion */
  previous: CustomEmoji[];
  emojis: CustomEmoji[];
  messages: JSX.Element[];
  newEmoji: CustomEmoji;
  newEmojiMessage: JSX.Element;
}

const blankEmoji: CustomEmoji = {
  name: '',
  image: '',
  aliases: [],
  ascii: [],
};
class EmojiList extends Component<EmojiListProps, EmojiListState> {
  private static equal(a: CustomEmoji, b: CustomEmoji) {
    if (a === b) {
      return true;
    }

    return (a.name === b.name) &&
      (a.image === b.image) &&
      setsEqual(a.aliases, b.aliases) &&
      setsEqual(a.ascii, b.ascii);
  }

  private static validate(all: CustomEmoji[], emoji: CustomEmoji) {
    const pattern = /^[a-z\-.+0-9_]*$/i;

    const validations: {
      fn: () => boolean;
      message: JSX.Element;
    }[] = [
      {
        fn: () => !!emoji.name,
        message: (
          <span><strong>Name</strong> is required</span>
        ),
      },
      {
        fn: () => !!emoji.image,
        message: (
          <span><strong>Image</strong> is required</span>
        ),
      },
      {
        fn: () => pattern.test(emoji.name),
        message: (
          <span><strong>Name</strong> can only contain letters,
           numbers, and <code>_-+.</code></span>
        ),
      },
      {
        fn: () => emoji.aliases.every((alias) => pattern.test(alias)),
        message: (
          <span><strong>Aliases</strong> can only contain letters,
          numbers, and <code>_-+.</code> (comma-separated)</span>
        ),
      },
      {
        fn: () => all.every(({ name }) => emoji.name !== name),
        message: (
          <span>Multiple custom emojis cannot have the same <strong>Name</strong></span>
        ),
      },
    ];

    return validations.filter((validation) => !validation.fn());
  }

  public constructor({ emojis }: EmojiListProps) {
    super();

    this.setState({
      previous: emojis.slice(),
      emojis: emojis.slice(),
      messages: [],
      newEmoji: blankEmoji,
      newEmojiMessage: null,
    });
  }

  private onAdd() {
    const emojis = this.state.emojis.slice();
    const previous = this.state.previous.slice();
    const emoji = this.state.newEmoji;

    emoji.aliases = emoji.aliases.filter(Boolean);
    emoji.ascii = emoji.ascii.filter(Boolean);

    emojis.push(emoji);
    previous.push(emoji);

    this.setState({
      previous,
      emojis,
      newEmoji: blankEmoji,
    });

    this.props.onEdit([emoji.name, emoji]);
  }

  private onSave(i: number) {
    const emojis = this.state.emojis.slice();
    const previous = this.state.previous.slice();
    const emoji = this.state.emojis[i];

    emoji.aliases = emoji.aliases.filter(Boolean);
    emoji.ascii = emoji.ascii.filter(Boolean);

    const [old] = previous.splice(i, 1, emoji);
    emojis.splice(i, 1, emoji);

    this.setState({
      previous,
      emojis,
    });

    this.props.onEdit([old.name, emoji]);
  }

  private onDelete(i: number) {
    const confirm = () => this.onConfirmDelete(i);
    const nope = () => {
      const messages = this.state.messages.slice();
      messages[i] = null;

      this.setState({
        messages,
      });
    };

    const messages = this.state.messages.slice();

    messages[i] = (
      <tr>
        <td>
          <button className="btn btn-default" type="button" onClick={nope}>Cancel</button>
        </td>
        <td colSpan={3}>
          <span class="help-block">Are you sure you want to delete this emoji?</span>
        </td>
        <td>
          <button className="btn btn-danger" type="button" onClick={confirm}>Yes</button>
        </td>
      </tr>
    );
    this.setState({
      messages,
    });
  }

  private onConfirmDelete(i: number) {
    const emojis = this.state.emojis.slice();
    const previous = this.state.previous.slice();
    const [old] = previous.splice(i, 1);
    emojis.splice(i, 1);

    this.setState({
      emojis,
      previous,
    });

    this.props.onDelete(old.name);
  }

  private onEdit(i: number, emoji: CustomEmoji) {
    const emojis = this.state.emojis.slice();
    emojis.splice(i, 1, emoji);
    this.setState({
      emojis,
    });
  }

  public render(_: EmojiListProps, {
    previous,
    emojis,
    messages,
    newEmoji,
    newEmojiMessage,
  }: EmojiListState) {
    const rows: JSX.Element[] = [];
    emojis.forEach((emoji, i) => {
      const all = previous.slice();
      all.splice(i, 1);

      const failures = EmojiList.validate(all, emoji);

      const props: EmojiProps = {
        emoji,
        onSave: () => this.onSave(i),
        onDelete: () => this.onDelete(i),
        onEditName: (name) => this.onEdit(i, { ...emoji, name }),
        onEditImage: (image) => this.onEdit(i, { ...emoji, image }),
        onEditAliases: (aliases) => this.onEdit(i, { ...emoji, aliases }),
        onEditAscii: (ascii) => this.onEdit(i, { ...emoji, ascii }),
        editing: !EmojiList.equal(emoji, previous[i]),
        canSave: !failures.length,
      };
      rows.push(<Emoji {...props} key={i} />);
      rows.push(...failures.map(({ message }) => (
        <tr className="text-danger">
          <td colSpan={5}>{message}</td>
        </tr>
      )));
      if (messages[i]) {
        rows.push(messages[i]);
      }
    });

    const newEmojiFailures = EmojiList.validate(previous, newEmoji);

    return (
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Image</th><th>Aliases</th><th>ASCII patterns</th><th></th></tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
        <tfoot>
          <Emoji
            emoji={newEmoji}
            onSave={() => this.onAdd()}
            onDelete={() => {}}
            onEditName={(name) => this.setState({ newEmoji: { ...newEmoji, name } })}
            onEditImage={(image) => this.setState({ newEmoji: { ...newEmoji, image } })}
            onEditAliases={(aliases) => this.setState({ newEmoji: { ...newEmoji, aliases } })}
            onEditAscii={(ascii) => this.setState({ newEmoji: { ...newEmoji, ascii } })}
            editing
            canSave={!newEmojiFailures.length}
          />
          {EmojiList.equal(newEmoji, blankEmoji) ? null : newEmojiFailures.map(({ message }) => (
            <tr className="text-danger">
              <td colSpan={5}>{message}</td>
            </tr>
          ))}
          {newEmojiMessage}
        </tfoot>
      </table>
    );
  }
}

interface AdjunctProps {
  editing?: boolean;
  canSave?: boolean;
  adjunct: CustomAdjunct;
  onSave: Callback;
  onDelete: Callback;
  onEditName: Callback<string>;
  onEditAliases: Callback<string[]>;
  onEditAscii: Callback<string[]>;
}
class Adjunct extends Component<AdjunctProps, {}> {
  private nameInput: Element;

  public render({
    editing,
    canSave,
    adjunct,
    onSave,
    onDelete,
    onEditName,
    onEditAliases,
    onEditAscii,
  }: AdjunctProps) {
    const emoji = adjunct.name && table[adjunct.name];
    return (
      <tr>
        <td>
          <input
            type="text"
            className="form-control"
            value={adjunct.name}
            onInput={(e: Event) => onEditName((e.target as HTMLInputElement).value)}
            ref={(input) => { this.nameInput = input; }}
          />
        </td>
        <td dangerouslySetInnerHTML={{ __html: emoji ? buildEmoji(emoji) : '' }}></td>
        <td>
          <input
            type="text"
            className="form-control"
            value={adjunct.aliases.join(',')}
            onInput={(e: Event) => onEditAliases(
              (e.target as HTMLInputElement).value.split(',')
            )}
          />
        </td>
        <td>
          <input
            type="text"
            className="form-control"
            value={adjunct.ascii.join(',')}
            onInput={(e: Event) => onEditAscii(
              (e.target as HTMLInputElement).value.split(',')
            )}
          />
        </td>
        <td>
          {
            editing ? (
              <button
                className="btn btn-success"
                type="button"
                onClick={() => onSave(null)}
                disabled={!canSave}
              >
                <i className="fa fa-check"></i>
              </button>
            ) : (
              <button
                className="btn btn-warning"
                type="button"
                onClick={() => onDelete(null)}
              >
                <i className="fa fa-trash"></i>
              </button>
            )
          }
        </td>
      </tr>
    );
  }

  public componentDidMount() {
    const Textcomplete = window.Textcomplete;
    const { Textarea } = Textcomplete.editors;

    const editor = new Textarea(this.nameInput);
    const completer = new Textcomplete(editor, {
      dropdown: {
        style: { zIndex: 20000 },
      },
    });

    completer.register([{
      ...strategy,
      replace: (emoji: StoredEmoji) => emoji.name,
      match: /^(.+)$/,
    }]);

    completer.on('selected', () => {
      this.props.onEditName((this.nameInput as HTMLInputElement).value);
    });
  }
}

interface AdjunctListProps {
  onEdit: Callback<[string, CustomAdjunct]>;
  onDelete: Callback<string>;
  adjuncts: CustomAdjunct[];
}
interface AdjunctListState {
  /** the previous state before a save or deletion */
  previous: CustomAdjunct[];
  adjuncts: CustomAdjunct[];
  messages: JSX.Element[];
  newAdjunct: CustomAdjunct;
  newAdjunctMessage: JSX.Element;
}

const blankAdjunct: CustomAdjunct = {
  name: '',
  aliases: [],
  ascii: [],
};
class AdjunctList extends Component<AdjunctListProps, AdjunctListState> {
  private static equal(a: CustomAdjunct, b: CustomAdjunct) {
    if (a === b) {
      return true;
    }

    return (a.name === b.name) &&
      setsEqual(a.aliases, b.aliases) &&
      setsEqual(a.ascii, b.ascii);
  }

  private static validate(all: CustomAdjunct[], emoji: CustomAdjunct) {
    const pattern = /^[a-z\-.+0-9_]*$/i;

    const validations: {
      fn: () => boolean;
      message: string;
    }[] = [
      {
        fn: () => !!emoji.name,
        message: '<strong>Name</strong> is required',
      },
      {
        fn: () => !!table[emoji.name],
        message: '<strong>Name</strong> must be an existing emoji',
      },
      {
        fn: () => emoji.aliases.every((alias) => pattern.test(alias)),
        message: '<strong>Aliases</strong> can only contain ' +
          'letters, numbers, and <code>_-+.</code> (comma-separated)',
      },
      {
        fn: () => all.every(({ name }) => emoji.name !== name),
        message: 'Multiple custom extensions cannot have the same <strong>Name</strong>',
      },
    ];

    return validations.filter((validation) => !validation.fn());
  }

  public constructor({ adjuncts }: AdjunctListProps) {
    super();

    this.setState({
      previous: adjuncts.slice(),
      adjuncts: adjuncts.slice(),
      messages: [],
      newAdjunct: blankAdjunct,
      newAdjunctMessage: null,
    });
  }

  private onAdd() {
    const adjuncts = this.state.adjuncts.slice();
    const previous = this.state.previous.slice();
    const adjunct = this.state.newAdjunct;

    adjunct.aliases = adjunct.aliases.filter(Boolean);
    adjunct.ascii = adjunct.ascii.filter(Boolean);

    adjuncts.push(adjunct);
    previous.push(adjunct);

    this.setState({
      previous,
      adjuncts,
      newAdjunct: blankAdjunct,
    });

    this.props.onEdit([adjunct.name, adjunct]);
  }

  private onSave(i: number) {
    const adjuncts = this.state.adjuncts.slice();
    const previous = this.state.previous.slice();
    const adjunct = this.state.adjuncts[i];

    adjunct.aliases = adjunct.aliases.filter(Boolean);
    adjunct.ascii = adjunct.ascii.filter(Boolean);

    const [old] = previous.splice(i, 1, adjunct);
    adjuncts.splice(i, 1, adjunct);

    this.setState({
      previous,
      adjuncts,
    });

    this.props.onEdit([old.name, adjunct]);
  }

  private onDelete(i: number) {
    const confirm = () => this.onConfirmDelete(i);
    const nope = () => {
      const messages = this.state.messages.slice();
      messages[i] = null;

      this.setState({
        messages,
      });
    };

    const messages = this.state.messages.slice();

    messages[i] = (
      <tr>
        <td>
          <button className="btn btn-default" type="button" onClick={nope}>Cancel</button>
        </td>
        <td colSpan={3}>
          <span class="help-block">Are you sure you want to delete this extension?</span>
        </td>
        <td>
          <button className="btn btn-danger" type="button" onClick={confirm}>Yes</button>
        </td>
      </tr>
    );
    this.setState({
      messages,
    });
  }

  private onConfirmDelete(i: number) {
    const adjuncts = this.state.adjuncts.slice();
    const previous = this.state.previous.slice();
    const [old] = previous.splice(i, 1);
    adjuncts.splice(i, 1);

    this.setState({
      adjuncts,
      previous,
    });

    this.props.onDelete(old.name);
  }

  private onEdit(i: number, emoji: CustomAdjunct) {
    const adjuncts = this.state.adjuncts.slice();
    adjuncts.splice(i, 1, emoji);
    this.setState({
      adjuncts,
    });
  }

  public render(_: AdjunctListProps, {
    previous,
    adjuncts,
    messages,
    newAdjunct,
    newAdjunctMessage,
  }: AdjunctListState) {
    const rows: JSX.Element[] = [];
    adjuncts.forEach((adjunct, i) => {
      const all = previous.slice();
      all.splice(i, 1);

      const failures = AdjunctList.validate(all, adjunct);

      const props: AdjunctProps = {
        adjunct,
        onSave: () => this.onSave(i),
        onDelete: () => this.onDelete(i),
        onEditName: (name) => this.onEdit(i, { ...adjunct, name }),
        onEditAliases: (aliases) => this.onEdit(i, { ...adjunct, aliases }),
        onEditAscii: (ascii) => this.onEdit(i, { ...adjunct, ascii }),
        editing: !AdjunctList.equal(adjunct, previous[i]),
        canSave: !failures.length,
      };
      rows.push(<Adjunct {...props} key={i} />);
      rows.push(...failures.map(({ message }) => (
        <tr className="text-danger">
          <td colSpan={5} dangerouslySetInnerHTML={{ __html: message }}></td>
        </tr>
      )));
      if (messages[i]) {
        rows.push(messages[i]);
      }
    });

    const newAdjunctFailures = AdjunctList.validate(previous, newAdjunct);

    return (
      <table className="table">
        <thead>
          <tr><th>Name</th><th>Emoji</th><th>Aliases</th><th>ASCII patterns</th><th></th></tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
        <tfoot>
          <Adjunct
            adjunct={newAdjunct}
            onSave={() => this.onAdd()}
            onDelete={() => {}}
            onEditName={(name) => this.setState({ newAdjunct: { ...newAdjunct, name } })}
            onEditAliases={(aliases) => this.setState({ newAdjunct: { ...newAdjunct, aliases } })}
            onEditAscii={(ascii) => this.setState({ newAdjunct: { ...newAdjunct, ascii } })}
            editing
            canSave={!newAdjunctFailures.length}
          />
          {AdjunctList.equal(newAdjunct, blankAdjunct) ? null :
            newAdjunctFailures.map(({ message }) => (
              <tr className="text-danger">
                <td colSpan={5} dangerouslySetInnerHTML={{ __html: message }}></td>
              </tr>
            ))}
          {newAdjunctMessage}
        </tfoot>
      </table>
    );
  }
}

interface AppProps {
  /** initial state */
  state: AppState;

  onEditEmoji: Callback<[string, CustomEmoji]>;
  onDeleteEmoji: Callback<string>;
  onEditAdjunct: Callback<[string, CustomAdjunct]>;
  onDeleteAdjunct: Callback<string>;
}

interface AppState {
  emojis: CustomEmoji[];
  adjuncts: CustomAdjunct[];
}

class App extends Component<AppProps, AppState> {
  public constructor({ state }: AppProps) {
    super();
    this.state = state;
  }

  // eslint-disable-next-line class-methods-use-this
  public render({
    onEditEmoji,
    onDeleteEmoji,
    onEditAdjunct,
    onDeleteAdjunct,
  }: AppProps, {
    emojis,
    adjuncts,
  }: AppState) {
    return (
      <div>
        <p>
          Below you can add custom emoji, and also add new aliases
          and ASCII patterns for existing emoji. While this list is
          edited live, you must still <strong>Build Emoji Assets </strong>
          to actually use these customizations.
        </p>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Custom Emoji</h3>
          </div>
          <EmojiList
            emojis={emojis}
            onEdit={onEditEmoji}
            onDelete={onDeleteEmoji}
          />
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Custom Extensions</h3>
          </div>
          <AdjunctList
            adjuncts={adjuncts}
            onEdit={onEditAdjunct}
            onDelete={onDeleteAdjunct}
          />
        </div>
      </div>
    );
  }
}

let initialized = false;
export function init(
  elem: Element,
  cb: Callback
) {
  if (initialized) {
    cb(null);
    return;
  }
  initialized = true;

  socket.emit('admin.plugins.emoji.getCustomizations', (err: Error, customizations: AppState) => {
    const props: AppProps = {
      state: customizations,
      onEditEmoji: (args) => {
        socket.emit('admin.plugins.emoji.editEmoji', args);
      },
      onDeleteEmoji: (name) => {
        socket.emit('admin.plugins.emoji.deleteEmoji', name);
      },
      onEditAdjunct: (args) => {
        socket.emit('admin.plugins.emoji.editAdjunct', args);
      },
      onDeleteAdjunct: (name) => {
        socket.emit('admin.plugins.emoji.deleteAdjunct', name);
      },
    };
    initEmoji(() => {
      render((
        <App {...props} />
      ), elem);

      cb(null);
    });
  });
}
