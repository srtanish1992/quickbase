const duplicate = (choices, choice) => {
    for (const c of choices) {
        if (c.toUpperCase() === choice.toUpperCase()) {
            return true;
        }
    }
    return false;
}

export default duplicate;