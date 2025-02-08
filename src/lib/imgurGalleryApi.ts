import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'
import { z } from 'zod'

const BASE_URL = import.meta.env.VITE_IMGUR_API_URL as string
const CLIENT_ID = import.meta.env.VITE_IMGUR_API_CLIENT_ID as string

if (!BASE_URL || typeof BASE_URL !== 'string') {
  throw new Error('No base URL provided for the Imgur API')
}

if (!CLIENT_ID || typeof CLIENT_ID !== 'string') {
  throw new Error('No client ID provided for the Imgur API')
}

export const SortOptions = ['time', 'top', 'viral'] as const

// Change the date range of the request if the sort is 'top'
// defaults to all
export const WindowOptions = ['day', 'week', 'month', 'year', 'all'] as const

export const searchParamSchema = z.object({
  q: z.string().trim().optional().default(''),
  sort: z.enum(SortOptions).default('time'),
  window: z.enum(WindowOptions).optional().default('all'),
  page: z.number().default(0),
})

type SearchParams = z.infer<typeof searchParamSchema>

const baseImgurGalleryItemSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().nullable().optional(),
  datetime: z.number().int(),
  link: z.string(),
})

const imgurGalleryImageSchema = baseImgurGalleryItemSchema.extend({
  type: z.string(),
  is_animated: z.boolean().optional(),
  mp4: z.string().optional(),
  width: z.number().int(),
  height: z.number().int(),
})

const imgurGalleryAlbumSchema = baseImgurGalleryItemSchema.extend({
  is_album: z.literal(true),
  images: z.array(imgurGalleryImageSchema),
})

export function isVideo(type: string | undefined | null) {
  return Boolean(type) && type?.startsWith('video/')
}

export type GalleryImage = z.infer<typeof imgurGalleryImageSchema>
export type GalleryAlbum = z.infer<typeof imgurGalleryAlbumSchema>
export type GalleryItem = GalleryImage | GalleryAlbum

export function isGalleryAlbum(item: GalleryItem): item is GalleryAlbum {
  return 'is_album' in item && item.is_album
}

const imgurSearchItemSchema = z.discriminatedUnion('is_album', [
  imgurGalleryImageSchema.extend({
    is_album: z.literal(false),
  }),
  imgurGalleryAlbumSchema,
])

const baseRequestSchema = z.object({
  success: z.boolean(),
  status: z.number().int(),
})

const imgurSearchResponseSchema = baseRequestSchema.extend({
  data: z.array(imgurSearchItemSchema),
})

const imgurGalleryAlbumResponseSchema = baseRequestSchema.extend({
  data: imgurGalleryAlbumSchema,
})

const imgurImageResponseSchema = baseRequestSchema.extend({
  data: imgurGalleryImageSchema,
})

async function searchImgurApi({ q, ...searchParams }: SearchParams) {
  const url = new URL(
    [
      'gallery',
      'search',
      searchParams.sort,
      searchParams.sort === 'top' ? searchParams.window : undefined,
      searchParams.page,
    ]
      // only include the window param if the sort is 'top'
      .filter((i) => {
        return i !== undefined
      })
      .join('/'),
    BASE_URL,
  )

  if (!q) {
    return null
  }

  url.searchParams.set('q', q)

  const response = await axios.get(url.toString(), {
    headers: {
      Authorization: `Client-ID ${CLIENT_ID}`,
    },
  })

  const data = imgurSearchResponseSchema.parse(response.data)

  return data.data
}

export function getImgurGallerySearchQueryOptions({ page, q, window, sort }: SearchParams) {
  return queryOptions({
    queryKey: ['gallery-search', { page, q, window, sort }],
    queryFn: () => searchImgurApi({ page, q, window, sort }),
    enabled: !!q,
  })
}

export function getImgurGalleryAlbumQueryOptions({ id }: { id: string }) {
  return queryOptions({
    queryKey: ['gallery-album', { id }],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/gallery/album/${id}`, {
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
        },
      })

      return imgurGalleryAlbumResponseSchema.parse(response.data)
    },
  })
}

export function getImgurImageQueryOptions({ id }: { id: string }) {
  return queryOptions({
    queryKey: ['image', { id }],
    queryFn: async () => {
      const response = await axios.get(`${BASE_URL}/image/${id}`, {
        headers: {
          Authorization: `Client-ID ${CLIENT_ID}`,
        },
      })

      return imgurImageResponseSchema.parse(response.data)
    },
  })
}
