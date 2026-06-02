import { describe, it, expect } from 'vitest'
import { parseCsvLine } from '@/utils/csvParser'

describe('csvParser', () => {
  it('should parse standard CSV with header', () => {
    const csv = `交易时间,交易分类,交易对方,金额,收/支
2026-06-01 12:00:00,餐饮美食,美团外卖,-15.00,支出
2026-06-02 08:30:00,交通出行,滴滴出行,-12.50,支出`
    const rows = parseCsvLine(csv)
    expect(rows).toHaveLength(2)
    expect(rows[0].date).toBe('2026-06-01')
    expect(rows[0].amount).toBe(15)
    expect(rows[0].description).toContain('美团外卖')
  })

  it('should handle empty lines', () => {
    const csv = `交易时间,金额
2026-06-01,-15.00

2026-06-02,-12.50`
    const rows = parseCsvLine(csv)
    expect(rows).toHaveLength(2)
  })

  it('should skip income rows', () => {
    const csv = `交易时间,交易对方,金额,收/支
2026-06-01,美团,-15.00,支出
2026-06-02,工资,8000.00,收入`
    const rows = parseCsvLine(csv)
    expect(rows).toHaveLength(1)
  })
})
