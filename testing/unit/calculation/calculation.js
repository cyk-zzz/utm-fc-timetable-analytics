function normalize(val, max, min) {
    if (max - val === 0) return 1;
    let result = (val - min) / max
    result = parseFloat(result.toFixed(3));
    return result;
}

export {normalize}