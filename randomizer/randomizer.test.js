const randomizer = require('./randomizer');

it('Возвращает случайное число от 10 до 80 невключительно', () => {
    for(i = 0; i < 10; i++) {
        let num = randomizer();
        expect(typeof num).toEqual(typeof 0);
        expect(num).toBeGreaterThan(10);
        expect(num).toBeLessThan(80);
    }
})
// Ваш код здесь