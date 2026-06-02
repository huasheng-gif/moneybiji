export interface ParsedCsvRow {
  date: string        // YYYY-MM-DD
  amount: number      // 正数
  description: string // 交易对方 + 备注
}

/**
 * 解析支付宝/微信 CSV 账单
 * 支持常见格式：交易时间,交易分类,交易对方,金额,收/支
 */
export function parseCsvLine(csv: string): ParsedCsvRow[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []

  const header = lines[0].split(',').map(h => h.trim())
  const dateIdx = header.findIndex(h => h.includes('时间'))
  const amountIdx = header.findIndex(h => h.includes('金额'))
  const descIdx = header.findIndex(h => h.includes('对方') || h.includes('商品'))
  const typeIdx = header.findIndex(h => h.includes('收/支'))

  if (dateIdx === -1 || amountIdx === -1) return []

  const rows: ParsedCsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const cols = line.split(',').map(c => c.trim())

    // 跳过收入行
    if (typeIdx !== -1 && cols[typeIdx]?.includes('收入')) continue

    // 解析日期 → YYYY-MM-DD
    const rawDate = cols[dateIdx] || ''
    const dateMatch = rawDate.match(/(\d{4}-\d{2}-\d{2})/)
    if (!dateMatch) continue

    // 解析金额（去掉负号和货币符号）
    const rawAmount = cols[amountIdx] || '0'
    const amount = Math.abs(parseFloat(rawAmount.replace(/[^0-9.-]/g, '')))
    if (isNaN(amount) || amount === 0) continue

    // 描述
    const description = descIdx !== -1 ? (cols[descIdx] || '') : ''

    rows.push({ date: dateMatch[1], amount, description })
  }

  return rows
}
