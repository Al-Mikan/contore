import HealthPoint from '../utils/HealthPoint'

test('HealthPoint case:easy', () => {
    let sat = new HealthPoint(3600 * 20)
    console.log(sat.health_point)
})