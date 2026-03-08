// Mock para resolver "invariant expected app router to be mounted" en Storybook con Vite
export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  prefetch: () => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
  pathname: '/',
});

export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
