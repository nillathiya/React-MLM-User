export const slugToConstant = (slug) => {
    return slug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
};

export const labelToConstant = (label) => {
    return label.replace(/^company/i, '') // Remove "company" prefix
        .replace(/([a-z])([A-Z])/g, '$1_$2') // Convert camelCase to underscore
        .toUpperCase(); // Convert to uppercase
};

export const safeParseJSON = (str) => {
    try {
        if (typeof str !== 'string' || !str) {
            return [];
        }
        return JSON.parse(str);
    } catch {
        if (typeof str === 'string' && str.includes(',')) {
            return str.split(',').map((item) => item.trim());
        }
        return typeof str === 'string' ? str : [];
    }
};