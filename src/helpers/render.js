/**
 * Parse and render 1 or more sections in a menu using provided render func.
 * @param {*} data { }
 * @param {*} render Render function, displays a section.
 * @returns
 */
export const renderSections = (data, render) => {
  if (!data || data.items?.length === 0) return;
  return data.sectionNames?.map((name, index) => {
    const items = data.items?.filter((item) => name === item.sectionName);
    const section = {
      id: `${index}`,
      items,
      name,
    };
    return render(section);
  });
};
