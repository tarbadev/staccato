import Bundle from '../domain/Bundle'
import BundleResponse from '@shared/Bundle'
import ResourceResponse from '@shared/Resource'
import Resource from '../domain/Resource'

export const mapBundleToResponse = (bundle: Bundle): BundleResponse => ({
  id: bundle.id,
  name: bundle.name,
  driveUrl: `https://drive.google.com/drive/folders/${bundle.googleDriveId}`,
  resources: bundle.resources.map(mapResourceToResponse),
})

export const mapResourceToResponse = (resource: Resource): ResourceResponse => ({
  id: resource.id,
  title: resource.title,
  url: resource.googleDriveLink,
  type: resource.type,
  source: resource.source,
  authors: resource.authors,
  album: resource.album,
  audioType: resource.audioType,
  composers: resource.composers,
  arrangers: resource.arrangers,
  instruments: resource.instruments,
})
