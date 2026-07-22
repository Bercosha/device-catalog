type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  function applyTheme(value: Theme) {
    theme.value = value

    if (import.meta.client) {
      document.documentElement.dataset.theme = value
      localStorage.setItem('device-catalog-theme', value)
    }
  }

  function toggleTheme() {
    applyTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  onMounted(() => {
    const savedTheme = localStorage.getItem('device-catalog-theme') as Theme | null

    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    applyTheme(prefersDark ? 'dark' : 'light')
  })

  return {
    theme: readonly(theme),
    toggleTheme,
    applyTheme,
  }
}