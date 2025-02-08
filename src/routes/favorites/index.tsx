import { useQueries } from '@tanstack/react-query'
import { Link, createFileRoute, getRouteApi, useLocation } from '@tanstack/react-router'

import { FullscreenMediaDialog } from '@/components/FullscreenMediaDialog'
import { GalleryImageCard } from '@/components/GalleryLinkCard'
import { getImgurImageQueryOptions } from '@/lib/imgurGalleryApi'
import { useFavoriteImages } from '../../hooks/useFavoriteImages'

export const Route = createFileRoute('/favorites/')({
  component: RouteComponent,
})

const routeApi = getRouteApi('/favorites/')

function RouteComponent() {
  const [favorites] = useFavoriteImages()
  const { hash } = useLocation()

  const n = routeApi.useNavigate()

  const currentImage = favorites.find((img) => img.id === hash)

  // fetch in case of any changes in remote data
  const queryResults = useQueries({
    queries: favorites.map((img) => {
      return {
        ...getImgurImageQueryOptions(img),
        initialData: {
          status: 200,
          data: img,
          success: true,
        },
      }
    }),
  })

  return (
    <>
      <FullscreenMediaDialog
        image={currentImage}
        open={Boolean(currentImage)}
        onOpenChange={(open) => {
          n({ hash: open ? hash : '' })
        }}
      />

      <h1 className="text-2xl font-bold">Favorites</h1>

      {favorites.length ? (
        <div className="w-full mt-10 gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {queryResults.map(({ data }) => {
            const img = data?.data

            if (!img) {
              return null
            }

            return (
              <Link hash={img.id} key={img.id} to=".">
                <GalleryImageCard key={img.id} image={img} />
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="mt-10 w-full">
          <p className="text-center">
            You don't have any favorites yet. Try{' '}
            <Link to="/" className="text-blue-500 hover:underline">
              searching for something
            </Link>
            !
          </p>
        </div>
      )}
    </>
  )
}
