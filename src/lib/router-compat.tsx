/**
 * Router-compat shim — bridges @/lib/router-compat v6 call sites to
 * @tanstack/react-router without hand-rewriting every component.
 * This is the same load-bearing pattern used in Klar's dev-copy migration.
 */
import {
  useNavigate as tsNavigate,
  useLocation as tsLocation,
  useParams as tsParams,
  useSearch as tsSearch,
  useRouter,
  Link as TSLink,
  Navigate as TSNavigate,
  Outlet as TSOutlet,
} from "@tanstack/react-router";
import { useMemo, useCallback, useEffect, useState, forwardRef, type ComponentProps, type ReactNode } from "react";
import { resolveLinkTarget } from "@/data/linkTargets";

// ---------- shared URL parsing ----------

function parseTo(to: string): { pathname: string; search?: Record<string, string>; hash?: string } {
  const [beforeHash, hashStr] = (to ?? "").split("#");
  const [pathname, searchStr] = beforeHash.split("?");
  return {
    // react-router keeps the current path for search-only ("?a=1") and
    // hash-only ("#section") targets; TanStack's "." means current route.
    pathname: pathname || ".",
    search: searchStr ? Object.fromEntries(new URLSearchParams(searchStr)) : undefined,
    hash: hashStr || undefined,
  };
}

// ---------- useNavigate ----------

type NavigateOptions = { replace?: boolean; state?: unknown };

type NavigateFn = {
  (to: string | number, options?: NavigateOptions): void;
  (delta: number): void;
};

export function useNavigate(): NavigateFn {
  const tsNav = tsNavigate();
  const router = useRouter();
  return useCallback((to: string | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      router.history.go(to);
      return;
    }
    const { pathname, search, hash } = parseTo(to);
    tsNav({
      to: pathname,
      search: search as never,
      hash,
      state: options?.state as never,
      replace: options?.replace,
    });
  }, [tsNav, router]) as NavigateFn;
}

// ---------- useLocation ----------

export function useLocation() {
  const loc = tsLocation();
  return useMemo(
    () => ({
      pathname: loc.pathname,
      search: loc.searchStr ? `?${loc.searchStr}` : "",
      hash: loc.hash ?? "",
      state: (loc.state ?? null) as unknown,
      key: loc.pathname + (loc.searchStr ?? ""),
    }),
    [loc.pathname, loc.searchStr, loc.hash, loc.state],
  );
}

// ---------- useParams ----------

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return tsParams({ strict: false } as never) as T;
}


// ---------- useSearchParams (@/lib/router-compat compat) ----------

export function useSearchParams(): [URLSearchParams, (init: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams), opts?: { replace?: boolean }) => void] {
  const loc = tsLocation();
  const nav = tsNavigate();
  const router = useRouter();
  const params = useMemo(() => new URLSearchParams(loc.searchStr ?? ""), [loc.searchStr]);
  const setParams = useCallback(
    (
      init: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams),
      opts?: { replace?: boolean },
    ) => {
      // Functional updaters read the router's live location, not the render
      // snapshot — react-router passes call-time params, and chained updates
      // within one tick must see each other's writes.
      const live = router.state.location;
      const current = new URLSearchParams(live.searchStr ?? "");
      const next =
        typeof init === "function"
          ? init(current)
          : init instanceof URLSearchParams
            ? init
            : new URLSearchParams(init);
      const searchObj: Record<string, string> = {};
      next.forEach((v, k) => { searchObj[k] = v; });
      nav({ to: live.pathname, search: searchObj as never, replace: opts?.replace });
    },
    [nav, router],
  );
  return [params, setParams];
}

// ---------- Link ----------

type LinkProps = Omit<ComponentProps<typeof TSLink>, "to"> & {
  to: string;
  replace?: boolean;
  state?: unknown;
  children?: ReactNode;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, state, children, ...rest },
  ref,
) {
  // Retired slugs resolve to their live page, so no internal link lands on a redirect or a 404.
  const { pathname, search, hash } = parseTo(resolveLinkTarget(to));
  return (
    <TSLink
      ref={ref as never}
      to={pathname as never}
      search={search as never}
      hash={hash}
      replace={replace}
      state={state as never}
      {...((rest ?? {}) as Record<string, unknown>)}
    >
      {children}
    </TSLink>
  );
});


// ---------- Navigate ----------

export function Navigate({ to, replace, state }: { to: string; replace?: boolean; state?: unknown }) {
  const { pathname, search, hash } = parseTo(to);
  return <TSNavigate to={pathname as never} search={search as never} hash={hash} state={state as never} replace={replace} />;
}

// ---------- Outlet ----------

export const Outlet = TSOutlet;

// ---------- NavLink (react-router-dom compat: function className/style/children) ----------

type NavLinkRenderProps = { isActive: boolean };

type NavLinkProps = Omit<ComponentProps<typeof Link>, "className" | "style" | "children" | "to"> & {
  to: string;
  end?: boolean;
  className?: string | ((p: NavLinkRenderProps) => string);
  style?: React.CSSProperties | ((p: NavLinkRenderProps) => React.CSSProperties);
  children?: ReactNode | ((p: NavLinkRenderProps) => ReactNode);
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, style, children, ...rest },
  ref,
) {
  const location = useLocation();
  const pathname = location.pathname;
  const target = to.split("?")[0] ?? to;
  const isActive = end
    ? pathname === target
    : pathname === target || pathname.startsWith(target.endsWith("/") ? target : `${target}/`);
  return (
    <Link
      ref={ref}
      to={to as never}
      className={typeof className === "function" ? className({ isActive }) : className}
      style={typeof style === "function" ? style({ isActive }) : style}
      {...(rest as Record<string, unknown>)}
    >
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
});

// ---------- useNavigationType (react-router-dom compat) ----------

export type NavigationType = "POP" | "PUSH" | "REPLACE";

let __lastNavAction: NavigationType = "POP";

export function useNavigationType(): NavigationType {
  const router = useRouter();
  const [type, setType] = useState<NavigationType>(__lastNavAction);
  useEffect(() => {
    return router.history.subscribe(({ action }: { action?: { type?: string } }) => {
      const t = action?.type;
      const mapped: NavigationType =
        t === "PUSH" ? "PUSH" : t === "REPLACE" ? "REPLACE" : "POP";
      __lastNavAction = mapped;
      setType(mapped);
    });
  }, [router]);
  return type;
}
