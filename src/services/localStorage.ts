import type { FinanceData } from '@/types'
import type { StorageService } from './storage'

const STORAGE_KEY = 'finance-tracker-data'

export class LocalStorageService implements StorageService {
  load(): FinanceData | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as FinanceData
    } catch {
      return null
    }
  }

  save(data: FinanceData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  }

  exportJson(): string {
    const data = this.load()
    return JSON.stringify(data, null, 2)
  }

  importJson(json: string): FinanceData {
    const data = JSON.parse(json) as FinanceData
    if (!data.profile || !data.budgets || !data.transactions) {
      throw new Error('无效的数据格式')
    }
    this.save(data)
    return data
  }
}
