// cannot be compiled under '--isolatedModules を回避するためimportする
import ExperiencePoint from '../utils/experience_point'

test('ExperiencePoint case:minus', () => {
  let ex = new ExperiencePoint(-1000)
  expect(0).toBe(ex.experience_point)
})

test('ExperiencePoint case:large', () => {
  let ex = new ExperiencePoint(100000000)
  expect(false).toBe(ex.experience_point === 100000000)
})

test('ExperiencePoint case:division-1', () => {
  let ex = new ExperiencePoint(0)
  expect(0).toBe(ex.progress(2))
  ex.add_point(1)
  expect(0).toBe(ex.progress(2))
  ex.add_point(298)
  //299
  expect(0).toBe(ex.progress(2))
  ex.add_point(1)
  expect(1).toBe(ex.progress(2))
  ex.add_point(1)
  expect(1).toBe(ex.progress(2))
  ex.add_point(298)
  expect(1).toBe(ex.progress(2))
  ex.add_point(1)
  expect(0).toBe(ex.progress(2))
})

test('ExperiencePoint case:division-2', () => {
  let ex = new ExperiencePoint(357000)
  let exp = new ExperiencePoint(ex.accumulate[99])
  for (let i = 0; i <= ex.accumulate[100] - ex.accumulate[99]; i++) {
    expect(i).toBe(exp.progress(ex.accumulate[100] - ex.accumulate[99]))
    exp.add_point(1)
  }
})

test('ExperiencePoint case:division-3', () => {
  let ex = new ExperiencePoint(357000)
  for (let i = 1; i <= 100; i++) {
    expect(i).toBe(ex.progress(i))
  }
})

test('ExperiencePoint case:get_level', () => {
  let ex = new ExperiencePoint(0)
  let exp = new ExperiencePoint(0)
  for (let i = 1; i <= 100; i++) {
    exp.add_point(ex.accumulate[i] - ex.accumulate[i - 1])
    expect(i).toBe(exp.get_level())
  }
})

test('ExperiencePoint case:add large', () => {
  let exp = new ExperiencePoint(0)
  exp.add_point(10000000)
  expect(357000).toBe(exp.experience_point)
})
