export class ItemWrapper {
  content: GoogleAppsScript.Drive.File | GoogleAppsScript.Drive.Folder;
  datecreated?: Date;
  description?: string;
  downloadurl?: string;
  editors?: GoogleAppsScript.Drive.User[];
  id: string;
  lastupdated?: Date;
  kind: 'file' | 'folder';
  private _name?: string;
  owner?: GoogleAppsScript.Drive.User;
  sharingaccess?: GoogleAppsScript.Drive.Access;
  sharingpermission?: GoogleAppsScript.Drive.Permission;
  size?: GoogleAppsScript.Integer;
  thumbnail?: GoogleAppsScript.Base.Blob;
  private _url?: string;
  viewers?: GoogleAppsScript.Drive.User;
  constructor(
    args: { content: ItemWrapper['content'] }
      & Partial<{ [P in keyof ItemWrapper]: ItemWrapper[P] }>
  ) {
    for (const key in args) {
      this[key] = args[key];
    }
  }
  get name(): string {
    if (this._name === undefined) this._name = this.content.getName();
    return this._name;
  }
  set name(name: string) {
    this._name = name;
  }
  get url(): string {
    if (this._url === undefined) this._url = this.content.getUrl();
    return this._url;
  }
}

export class FileWrapper extends ItemWrapper {
  content: GoogleAppsScript.Drive.File;
  kind = 'file' as const;
  mimetype?: string;
}

export class FolderWrapper extends ItemWrapper {
  content: GoogleAppsScript.Drive.Folder;
  kind = 'folder' as const;
}

export class NotFoundItemWrapper {
  id: string;
  kind: 'file' | 'folder';
  name?: string;
  url?: string;
  constructor(id: string, kind: 'file' | 'folder') {
    this.id = id;
    this.kind = kind;
  }
}

export class NotFoundItemWrapperWithName extends NotFoundItemWrapper {
  name: string;
  url: string;
  constructor(item: { id: string; kind: 'file' | 'folder' } | NotFoundItemWrapper, name: string) {
    super(item.id, item.kind);
    this.name = name;
    this.url =
      item.kind === 'file'
        ? `https://drive.google.com/file/d/${item.id}/view?usp=sharing`
        : `https://drive.google.com/drive/folders/${item.id}?usp=sharing`;
  }
}

export const isItemWrapper = (itemWrapper: ItemWrapper | NotFoundItemWrapper): itemWrapper is ItemWrapper => itemWrapper.hasOwnProperty('content');
