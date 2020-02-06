
/**
 * Returns true if dupicates present else return false.
 *
 * @param {Array} choices The list of choices.
 * @param {String} choice The choice to check for duplicates in the list of choices.
 * @return {boolean} true if dupicates present else return false.
 */
const duplicate = (choices, choice) => {
    for (const c of choices) {
        if (c.toUpperCase() === choice.toUpperCase()) {
            return true;
        }
    }
    return false;
}

export default duplicate;