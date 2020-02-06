import duplicate from './duplicate';

test('for duplicate present', () => {
    const choices = ['Anish','Bob','Gavin'];
    const choice = 'Anish';

    expect(duplicate(choices,choice)).toBe(true);
});

test('for duplicate not present', () => {
    const choices = ['Anish','Bob','Gavin'];
    const choice = '123';

    expect(duplicate(choices,choice)).toBe(false);
});