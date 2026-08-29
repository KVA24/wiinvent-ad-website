export function usePathname() {
  return '/'
}

export function useRouter() {
  return {
    back() {},
    forward() {},
    prefetch() {},
    push() {},
    refresh() {},
    replace() {},
  }
}

export function redirect() {}
export function permanentRedirect() {}
export function notFound() {
  throw new Error('notFound')
}
