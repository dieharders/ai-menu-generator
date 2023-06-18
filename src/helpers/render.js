/**
 * Parse and render 1 or more sections in a menu using provided render func.
 * @param {*} data { }
 * @param {*} render Render function
 * @returns 
 */
export const renderSections = (data, render) => {
    if (!data) return;

    const sections = Object.entries(data)?.map(([key, val]) => {
        return render({key, val});
    });

    return sections;
};
