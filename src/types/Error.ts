export type ErrorResponse = {
    type: string,
    title: string,
    status: number,
    errors: Errors,
    traceId: string
}

export type Errors = {
    [fieldName: string]: string[];
};

export function errorResponseToString(error: ErrorResponse): string {
    const lines: string[] = [];

    // Titre général
    lines.push(`❌ ${error.title}`);

    // Liste des erreurs
    for (const [field, messages] of Object.entries(error.errors)) {
        lines.push(`\n📌 ${field}:`);
        messages.forEach(msg => {
            lines.push(`   - ${msg}`);
        });
    }

    return lines.join('\n');
}