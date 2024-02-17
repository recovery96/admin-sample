import { Option } from '@/models/option.model'

export function filterOptionsByValue(options: Option[], value: string) {
  const option = options.find((option) => option.value === value)

  if (option) {
    return option.label
  }

  return '-'
}

export const postTypeOptions = [
  { label: '일러스트', value: 'illust' },
  { label: '만화', value: 'manga' },
  { label: '소설', value: 'novel' },
]
