export const FOLDER_STATE_CHANGE = "work-folder-state-change";

export type FolderStateChange = {
  source: Event;
  open: boolean;
};

const issuedChanges = new WeakMap<
  Event,
  { trigger: HTMLButtonElement; change: FolderStateChange }
>();

export function dispatchFolderStateChange(
  trigger: HTMLButtonElement,
  source: Event,
  open: boolean,
) {
  if (
    !(source instanceof Event) ||
    !source.isTrusted ||
    trigger.dataset.slot !== "folder-trigger" ||
    trigger.getAttribute("aria-expanded") !== String(open)
  )
    return;

  const change = { source, open };
  const event = new CustomEvent<FolderStateChange>(FOLDER_STATE_CHANGE, {
    bubbles: true,
    detail: { ...change },
  });
  issuedChanges.set(event, { trigger, change });
  try {
    trigger.dispatchEvent(event);
  } finally {
    issuedChanges.delete(event);
  }
}

export function consumeFolderStateChange(event: Event): FolderStateChange | null {
  const issued = issuedChanges.get(event);
  issuedChanges.delete(event);
  if (
    !issued ||
    event.target !== issued.trigger ||
    issued.trigger.getAttribute("aria-expanded") !== String(issued.change.open)
  )
    return null;
  return issued.change;
}
