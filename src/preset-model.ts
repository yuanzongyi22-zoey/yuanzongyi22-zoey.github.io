export type PresetType = '色彩' | '人像' | '组合'
export type ScopeNode = { id: string; label: string; children?: ScopeNode[] }
const colorItems = ['样片仿色', '智能调色', '白平衡', '影调', '曲线', '混色器', '颜色分级', '镜头调整', '细节', '效果', '滤镜', '校准']
export const presetScopes: ScopeNode[] = [
  { id: 'color', label: '色彩', children: [
    { id: 'color-global', label: '全图', children: colorItems.map((label, index) => ({ id: `color-global-${index}`, label })) },
    { id: 'color-local', label: '局部', children: [{ id: 'color-background', label: '背景' }, { id: 'color-subject', label: '主体' }] },
  ] },
  { id: 'portrait', label: '人像' },
  { id: 'background', label: '背景' },
  { id: 'clothes', label: '衣物' },
  { id: 'frame', label: '画面' },
]

export const scopeLeaves = (node: ScopeNode): string[] => node.children ? node.children.flatMap(scopeLeaves) : [node.id]
export const adjustedScopes = ['color-global-0', 'portrait']
export function defaultPresetScopes(type: PresetType): string[] {
  const groups = type === '色彩' ? ['color'] : type === '人像' ? ['portrait'] : ['color', 'portrait', 'background', 'clothes']
  return presetScopes.filter(node => groups.includes(node.id)).flatMap(scopeLeaves)
}
export function inferPresetType(selected: string[]): PresetType | null {
  if (!selected.length) return null
  const colors = scopeLeaves(presetScopes[0])
  if (selected.every(id => colors.includes(id))) return '色彩'
  if (selected.every(id => id === 'portrait')) return '人像'
  return '组合'
}
export function toggleScope(selected: string[], node: ScopeNode): string[] {
  const leaves = scopeLeaves(node)
  return leaves.every(id => selected.includes(id)) ? selected.filter(id => !leaves.includes(id)) : [...new Set([...selected, ...leaves])]
}
