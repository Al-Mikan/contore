import HealthPoint from '../utils/HealthPoint'

test('HealthPoint', () => {
    let sat = new HealthPoint(6, 3600 * 20, 3600 * 96)
    console.log(sat.health_point)
})