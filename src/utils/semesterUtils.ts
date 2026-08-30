export default function getPresentationSemesters(date = new Date()) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1–12

    let options;

    if (month >= 1 && month <= 4) {
        // Jan–Apr
        options = [`${year}A`, `${year}B`];
    } else if (month >= 5 && month <= 10) {
        // May–Oct
        options = [`${year}B`, `${year + 1}A`];
    } else {
        // Nov–Dec
        options = [`${year + 1}A`, `${year + 1}B`];
    }

    return options;
}

export function sortSemesters(semesters: string[]) {
    return [...semesters].sort((a, b) => {
        const yearDiff = parseInt(a.slice(0, 4)) - parseInt(b.slice(0, 4));
        if (yearDiff !== 0) return yearDiff;
        return a.slice(4).localeCompare(b.slice(4));
    });
}