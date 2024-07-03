function SessionFilter(input) {
    var out = '';

    const session = `${input.slice(0, 4)}/${input.slice(4, 8)}`;
    const semester = input.slice(8, 9);

    out = `${session} - ${semester}`;

    return out;
}

function TitleCase(input) {
    input = input || '';
    return input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

export {SessionFilter, TitleCase}