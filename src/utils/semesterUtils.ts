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

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(value: string) {
    if (!DATE_PATTERN.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

export function getTodayString(date = new Date()) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

// 'YYYY-MM-DD' to a local Date at midnight
export function parseDateString(value: string) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// 2026A is Jan 1 - Jun 30 of 2026, 2026B is Jul 1 - Dec 31 of 2026
export function getSemesterRange(semester: string) {
    const year = semester.slice(0, 4);
    return semester.endsWith('A')
        ? { start: `${year}-01-01`, end: `${year}-06-30` }
        : { start: `${year}-07-01`, end: `${year}-12-31` };
}

// A semester has passed once its date is behind us or the half-year it belongs to is over
export function hasSemesterPassed(semester: string, date: string | null) {
    const today = getTodayString();
    if (date && date < today) return true;
    return getSemesterRange(semester).end < today;
}

// Returns an error message, or true when the date is valid for the semester
export function validateSemesterDate(semester: string, date: string): string | true {
    if (!isValidDateString(date)) return 'Introduzca una fecha válida (AAAA-MM-DD)';
    if (date < getTodayString()) return 'La fecha no puede haber pasado';
    const { start, end } = getSemesterRange(semester);
    if (date < start || date > end) return `La fecha debe estar entre ${start} y ${end}`;
    return true;
}

// Semesters that haven't ended yet and start at most `yearsAhead` years from today (e.g. 2026B, 2027A, ... 2029B)
export function generateFutureSemesters(yearsAhead = 3, date = new Date()) {
    const today = getTodayString(date);
    const limit = getTodayString(new Date(date.getFullYear() + yearsAhead, date.getMonth(), date.getDate()));
    const semesters: string[] = [];

    for (let year = date.getFullYear(); year <= date.getFullYear() + yearsAhead; year++) {
        for (const half of ['A', 'B']) {
            const semester = `${year}${half}`;
            const { start, end } = getSemesterRange(semester);
            if (end >= today && start <= limit) semesters.push(semester);
        }
    }
    return semesters;
}

export function sortSemesters(semesters: string[]) {
    return [...semesters].sort((a, b) => {
        const yearDiff = parseInt(a.slice(0, 4)) - parseInt(b.slice(0, 4));
        if (yearDiff !== 0) return yearDiff;
        return a.slice(4).localeCompare(b.slice(4));
    });
}