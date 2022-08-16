// cannot be compiled under '--isolatedModules を回避するためimportする
import { sampleFunction } from '../utils/api'

test('sample test', () => {
  expect('Hello,World').toBe('Hello,World')
})
