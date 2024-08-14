import { generateShortId } from "./uniqueId";

interface I_Props {
  data: any;
  id?: string;
  hash?: string;
  primary?: any;
}

/**
 * Loop through all items and assign a unique id
 */
export const assignUniqueIds = ({
  data,
  id = "",
  hash = "",
  primary = {},
}: I_Props) => {
  if (!data || Object.keys(data).length === 0)
    throw new Error("No data to assign.");
  const menu = { ...data };
  // assign id to menu
  menu.id = id || generateShortId();
  // record unique hash of source file
  menu.documentHash = hash;
  // assign unique id to each item if no primary supplied
  const items = menu?.items?.map((item, itemIndex) => {
    const primaryItemId = primary?.items?.[itemIndex]?.id;
    return { ...item, id: primaryItemId || generateShortId() };
  });
  menu.items = items;

  return menu;
};
