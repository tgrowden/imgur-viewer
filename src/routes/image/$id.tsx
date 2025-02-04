import { createFileRoute, getRouteApi, useLocation, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import { getImgurImageQueryOptions } from '@/lib/imgurGalleryApi'
import { GalleryImageCard } from '@/components/GalleryLinkCard'
import { FullscreenMediaDialog } from '@/components/FullscreenMediaDialog'
import { RedirectErrorHandler } from '@/components/RedirectErrorHandler'

export const Route = createFileRoute('/image/$id')({
  component: RouteComponent,

  loader: async ({ context: { queryClient }, params }) => {
    const queryOptions = getImgurImageQueryOptions(params)

    return queryClient.ensureQueryData(queryOptions)
  },

  errorComponent: (props) => {
    return <RedirectErrorHandler toastMessage="Image not found" {...props} />
  },
})

const routeApi = getRouteApi('/image/$id')

function RouteComponent() {
  const params = routeApi.useParams()
  const queryOptions = getImgurImageQueryOptions(params)

  const { data } = useSuspenseQuery(queryOptions)

  const { hash } = useLocation()

  const n = routeApi.useNavigate()

  const img = data.data

  const isOpen = data.data.id === hash

  return (
    <>
      <FullscreenMediaDialog
        image={img}
        open={isOpen}
        onOpenChange={(open) => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          n({ hash: open ? hash : '' })
        }}
      />

      <h1 className="text-2xl font-bold">{data.data.title}</h1>
      <p className="text-gray-500">{data.data.description}</p>

      <div className="w-full mt-10 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Link hash={img.id} key={img.id} to=".">
          <GalleryImageCard key={img.id} image={img} />
        </Link>
      </div>
    </>
  )
}
