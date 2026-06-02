import type { FinanceData } from '@/types'

export interface StorageService {
  load(): FinanceData | null
  save(data: FinanceData): void
  clear(): void
  exportJson(): string
  importJson(json: string): FinanceData
}
