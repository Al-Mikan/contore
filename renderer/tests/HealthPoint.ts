import HealthPoint from '../utils/HealthPoint'

test('HealthPoint', () => {
    let sat = new HealthPoint(6, 3600 * 72);
    console.log(sat.get_health_point())
})