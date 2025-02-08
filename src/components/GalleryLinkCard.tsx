import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  type GalleryAlbum,
  type GalleryImage,
  type GalleryItem,
  getImgurGalleryAlbumQueryOptions,
  getImgurImageQueryOptions,
  isGalleryAlbum,
} from '@/lib/imgurGalleryApi'
import { cn } from '@/lib/utils'
import { useFavoriteImages } from '../hooks/useFavoriteImages'
import { GalleryMedia } from './GalleryMedia'

interface GalleryLinkCardProps {
  data: GalleryItem
}

export function GalleryAlbumCard({ album }: { album: GalleryAlbum }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{album.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <GalleryMedia media={album.images[0]} />
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export function GalleryImageCard({ image }: { image: GalleryImage }) {
  const [favorites, setFavorites] = useFavoriteImages()

  const isFavorite = favorites.find((i) => i.id === image.id)

  const handleFavoriteButtonClick = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((i) => Boolean(i) && typeof i === 'object' && 'id' in i && i.id !== image.id))
    } else {
      setFavorites([...favorites, image])
    }
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="flex items-center justify-between">
          <span
            title={image.title ?? undefined}
            className="overflow-ellipsis max-w-full whitespace-nowrap overflow-hidden"
          >
            {image.title}
          </span>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      handleFavoriteButtonClick()
                    }}
                  >
                    <Star size={16} className={cn(isFavorite && 'fill-yellow-400 stroke-yellow-400')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <GalleryMedia media={image} />
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export function GalleryLinkCard({ data }: GalleryLinkCardProps) {
  const client = useQueryClient()
  if (isGalleryAlbum(data)) {
    const queryOptions = getImgurGalleryAlbumQueryOptions({ id: data.id })

    client.setQueryData(queryOptions.queryKey, {
      status: 200,
      success: true,
      data,
    })

    return (
      <Link to="/album/$id" params={{ id: data.id }} className="hover:underline h-[fit-content]">
        <GalleryAlbumCard album={data} />
      </Link>
    )
  }

  const queryOptions = getImgurImageQueryOptions({ id: data.id })

  client.setQueryData(queryOptions.queryKey, {
    status: 200,
    success: true,
    data,
  })

  return (
    <Link to="/image/$id" params={{ id: data.id }} className="hover:underline h-[fit-content]">
      <GalleryImageCard image={data} />
    </Link>
  )
}
