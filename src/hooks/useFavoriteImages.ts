import useLocalStorageState from 'use-local-storage-state'

import type { GalleryImage } from '@/lib/imgurGalleryApi'

export function useFavoriteImages() {
  return useLocalStorageState<GalleryImage[]>('favorite-images', {
    defaultValue: [],
  })
}
