export type DriveActivityAPIResponse = {
  activities: DriveActivity[];
  nextPageToken?: string;
};

interface DriveActivityBase {
  primaryActionDetail: ActionDetail;
  actors: Actor[];
  actions: Action[];
  targets: Target[];
}

export type DriveActivity = DriveActivityBase & Time;

// https://developers.google.com/drive/activity/v2/reference/rest/v2/activity/actiondetail
export type ActionDetail = any; // TODO: implement

export type Actor = {
  // TODO: implement other actor types
  // https://developers.google.com/drive/activity/v2/reference/rest/v2/activity/actor
  user: User;
};

export type User = {
  // TODO: implement other user types
  knownUser: { personName: string; isCurrentUser: boolean };
};

interface ActionBase {
  detail: ActionDetail;
  actor: Actor;
  target: Target;
}

export type Action = ActionBase & Time;

export type Target = TargetDriveItem | TargetTeamDrive | TargetFileComment;

// TODO: いらないのでは？
export interface TargetDriveItem {
  driveItem: DriveItem;
}

export interface TargetTeamDrive {
  teamDrive: TeamDrive;
}

export interface TargetFileComment {
  fileComment: FileComment;
}

export const isTargetDriveItem = (target: Target): target is TargetDriveItem => target.hasOwnProperty('driveItem');
export const isTargetTeamDrive = (target: Target): target is TargetTeamDrive => target.hasOwnProperty('teamDrive');
export const isTargetFileComment = (target: Target): target is TargetFileComment => target.hasOwnProperty('fileComment');
/*
export type DiscriminatedTarget =
  | (TargetDriveItem & { kind: 'driveItem' })
  | (TargetTeamDrive & { kind: 'teamDrive' })
  | (TargetFileComment & { kind: 'fileComment' });

export const discriminateTarget = (target: Target): DiscriminatedTarget => {
  if (isTargetDriveItem(target)) return Object.assign({}, target, { kind: 'driveItem' as const });
  else if (isTargetTeamDrive(target)) return Object.assign({}, target, { kind: 'teamDrive' as const });
  else if (isTargetFileComment(target)) return Object.assign({}, target, { kind: 'fileComment' as const });
  else {
    const _exhaustiveCheck: never = target;
    return _exhaustiveCheck;
  }
}*/

export type DriveItem = FileItem | FolderItem;

export type FileItem = DriveItemBase & { file: File };
export type FolderItem = DriveItemBase & { folder: Folder };

export const targetIsFolder = (target: Target): target is { driveItem: FolderItem } =>
  isTargetDriveItem(target) && target.driveItem.hasOwnProperty('folder');

interface DriveItemBase {
  name: string;
  title: string;
  mimeType: string;
  owner: Owner;
}

export type TeamDrive = {
  name: string;
  title: string;
  root: DriveItem;
};

export type Owner = {
  // TODO: implement other owner types
  // https://developers.google.com/drive/activity/v2/reference/rest/v2/activity/driveitem
  user: User;
};

export type Folder = {
  type: 'TYPE_UNSPECIFIED' | 'MY_DRIVE_ROOT' | 'TEAM_DRIVE_ROOT' | 'STANDARD_FOLDER';
};

export type File = {
  file: {};
};

export type FileComment = {
  legacyCommentId: string;
  legacyDiscussionId: string;
  linkToDiscussion: string;
  parent: DriveItem;
};

export type TimeRange = {
  startTime: string;
  endTime: string;
};

export type Timestamp = string;

type Time =
  | {
      timestamp: Timestamp;
    }
  | {
      timeRange: TimeRange;
    };

export const actionHasTimeStamp = (time: Action): time is ActionBase & { timestamp: Timestamp } =>
  time.hasOwnProperty('timestamp');

export const actionHasTimeRange = (time: Action): time is ActionBase & { timeRange: TimeRange } =>
  time.hasOwnProperty('timeRange');

export const activityHasTimeStamp = (time: DriveActivity): time is DriveActivityBase & { timestamp: Timestamp } =>
  time.hasOwnProperty('timestamp');

export const activityHasTimeRange = (time: DriveActivity): time is DriveActivityBase & { timeRange: TimeRange } =>
  time.hasOwnProperty('timeRange');
