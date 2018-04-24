/**
 * Created by Administer on 23/04/2018.
 */
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});