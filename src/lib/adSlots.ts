// Идентификаторы рекламных блоков РСЯ из env. Если значение пустое,
// AdBlock не отрендерит ничего (см. src/components/AdBlock.tsx).

export const AD_SLOTS = {
  home: (import.meta.env.VITE_RSYA_BLOCK_HOME as string | undefined) ?? '',
  homeBottom: (import.meta.env.VITE_RSYA_BLOCK_HOME_BOTTOM as string | undefined) ?? '',
  result: (import.meta.env.VITE_RSYA_BLOCK_RESULT as string | undefined) ?? '',
  footer: (import.meta.env.VITE_RSYA_BLOCK_FOOTER as string | undefined) ?? '',
}
