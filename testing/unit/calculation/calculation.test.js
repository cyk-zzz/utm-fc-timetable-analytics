import { expect, test } from 'vitest'
import { normalize } from './calculation.js'

const MAX = 50
const MIN = 0

test('Normalize 20 (0-50)', () => {
  expect(normalize(20,MAX,MIN)).toBe(0.4)
})

test('Normalize 40 (0-50)', () => {
  expect(normalize(40,MAX,MIN)).toBe(0.8)
})

test('Normalize 50 (0-50)', () => {
  expect(normalize(50,MAX,MIN)).toBe(1.0)
})