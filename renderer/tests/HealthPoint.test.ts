import HealthPoint from '../utils/HealthPoint'

test('HealthPoint case:easy', () => {
    let sat = new HealthPoint(3600 * 0)
    for (let i = 0; i <= 20; i++) {
        let add = 4.8 * 3600
        sat.update_health_point(add)
        console.log(sat.health_point / 3600, sat.get_health_point_formatted(10))
        // 1 1 2 2 3 3 4 4 5 5 6 6 7 7 8 8 9 9 10
    }
})