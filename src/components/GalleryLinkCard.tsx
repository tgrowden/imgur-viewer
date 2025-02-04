import { Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

import {
  GalleryItem,
  isGalleryAlbum,
  GalleryAlbum,
  GalleryImage,
  getImgurGalleryAlbumQueryOptions,
  getImgurImageQueryOptions,
} from '@/lib/imgurGalleryApi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{image.title}</CardTitle>
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
      <Link to={`/album/$id`} params={{ id: data.id }} className="hover:underline h-[fit-content]">
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
    <Link to={`/image/$id`} params={{ id: data.id }} className="hover:underline h-[fit-content]">
      <GalleryImageCard image={data} />
    </Link>
  )
}
