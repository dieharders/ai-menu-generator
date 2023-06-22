const translateMenu = (companyData, lang) => {
    const menu = companyData?.menu;
    const englishMenu = menu?.en;
    const targetLanguage = menu?.[lang];

    if (!targetLanguage) {
        console.error('No target language available!');
        // Return default menu data
        return { ...companyData, menu: englishMenu };
    }

    try {
        let newMenu = {};
        Object.entries(targetLanguage)?.forEach(([sectionTitle, section], index) => {
            const englishSection = Object.values(englishMenu)?.[index];
            const translatedSection = section.map((item, itemIndex) => {
                const englishItem = englishSection?.[itemIndex];
                return { ...englishItem, ...item };
            });

            newMenu[sectionTitle] = translatedSection;
        });
        const parsedData = { ...companyData, menu: newMenu };
        return parsedData;
    } catch(err) {
        console.error('Error translating!', err);
    };
};

export default translateMenu;
 