export const FOLDER_STATE_CHANGE = "work-folder-state-change";

export type FolderStateChange = {
  source: Event;
  open: boolean;
};
