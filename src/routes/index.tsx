import { useState, useEffect } from 'react'
import { createFileRoute, Link, getRouteApi } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { getImgurGallerySearchQueryOptions, searchParamSchema, SortOptions, WindowOptions } from '@/lib/imgurGalleryApi'
import { GalleryLinkCard } from '@/components/GalleryLinkCard'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: searchParamSchema,

  loaderDeps: ({ search: { page, q, sort, window } }) => {
    return {
      page,
      q,
      sort,
      window,
    }
  },

  loader: async ({ context: { queryClient }, deps }) => {
    const queryOptions = getImgurGallerySearchQueryOptions(deps)
    return queryClient.ensureQueryData(queryOptions)
  },

  pendingComponent: LoadingComponent,
})

const routeApi = getRouteApi('/')

function LoadingComponent() {
  const search = routeApi.useSearch()

  if (!search.q) {
    return null
  }

  return (
    <>
      <div>
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
      <div className="flex items-center gap-2 py-6">
        <SortDropdowns />
      </div>
      <div className="w-full mt-10 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 50 }, (_, i) => (
          <Skeleton className="w-full h-full min-h-60 rounded-md" key={i} />
        ))}
      </div>
    </>
  )
}

function SortDropdowns() {
  const search = routeApi.useSearch()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="capitalize px-2 text-sm">
            {search.sort} <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="cursor-default">Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SortOptions.map((opt) => (
            <Link className="capitalize" key={opt} to="." search={(prev) => ({ ...prev, sort: opt, page: 0 })}>
              <DropdownMenuCheckboxItem checked={search.sort === opt} className="cursor-pointer">
                {opt}
              </DropdownMenuCheckboxItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {search.sort === 'top' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="capitalize px-2 text-sm">
              {search.window} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="cursor-default">Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {WindowOptions.map((opt) => (
              <Link
                className="capitalize"
                key={opt}
                to="/"
                search={(prev) => ({
                  q: prev.q ?? '',
                  sort: 'top',
                  window: opt,
                  page: 0,
                })}
              >
                <DropdownMenuCheckboxItem checked={search.window === opt} className="cursor-pointer">
                  {opt}
                </DropdownMenuCheckboxItem>
              </Link>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

function SearchForm() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const [inputVal, setInputVal] = useState(() => {
    return search.q ?? ''
  })

  useEffect(() => {
    setInputVal(search.q ?? '')
  }, [search.q])

  const canSubmit = inputVal !== search.q

  return (
    <form
      className="flex gap-2 items-center"
      onSubmit={async (e) => {
        e.preventDefault()

        await navigate({
          search: (prev) => ({
            ...prev,
            page: inputVal === search.q ? prev.page : 0,
            q: inputVal,
          }),
        })
      }}
      autoComplete="off"
    >
      <Input
        type="text"
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value)
        }}
        name="q"
        placeholder="Search images..."
      />
      <Button type="submit" disabled={!canSubmit} variant="secondary">
        Search
      </Button>
    </form>
  )
}

function Results() {
  const search = routeApi.useSearch()
  const queryOptions = getImgurGallerySearchQueryOptions(search)

  const { data, status } = useSuspenseQuery(queryOptions)

  if (status === 'error') {
    return <div>Error</div>
  }

  return (
    <>
      {Boolean(data) && (
        <>
          {data?.length ? (
            <>
              <div className="w-full mt-10 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {data.map((item) => (
                  <GalleryLinkCard data={item} key={item.id} />
                ))}
              </div>
              <div className="flex justify-center mt-10 align-center gap-4">
                <Link
                  to="/"
                  search={(prev) => ({
                    ...prev,
                    page: Math.max(0, (prev.page ?? 0) - 1),
                  })}
                  disabled={search.page === 0}
                >
                  <Button
                    variant={search.page === 0 ? 'ghost' : 'outline'}
                    disabled={search.page === 0}
                    onClick={() => {}}
                  >
                    Previous
                  </Button>
                </Link>

                <Link
                  to="/"
                  search={(prev) => ({
                    ...prev,
                    page: (prev.page ?? 0) + 1,
                  })}
                >
                  <Button variant="outline">Next</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-center">No results found</p>
            </div>
          )}
        </>
      )}
    </>
  )
}

function RouteComponent() {
  return (
    <>
      <div>
        <SearchForm />
      </div>
      <div className="flex items-center gap-2 py-6">
        <SortDropdowns />
      </div>
      <Results />
    </>
  )
}
