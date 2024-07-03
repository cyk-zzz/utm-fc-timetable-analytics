import { expect, test } from 'vitest'
import { SessionFilter, TitleCase } from './filter.js'

test('SessionFilter 2023/2024-1', () => {
  expect(SessionFilter('202320241')).toBe('2023/2024 - 1')
})

test('SessionFilter 2023/2024-2', () => {
  expect(SessionFilter('202320242')).toBe('2023/2024 - 2')
})

test('TitleCase Dr Mohd Razak Bin Samingan', () => {
  expect(TitleCase('dr mohd razak bin samingan')).toBe('Dr Mohd Razak Bin Samingan')
})