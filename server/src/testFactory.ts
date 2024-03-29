import Resource from './domain/Resource'
import ResourceResponse, { AudioType, ResourceType } from '@shared/Resource'
import { ResourceEntity } from './infrastructure/entity/ResourceEntity'
import { BundleEntity } from './infrastructure/entity/BundleEntity'
import { AuthorEntity } from './infrastructure/entity/AuthorEntity'
import { ComposerEntity } from './infrastructure/entity/ComposerEntity'
import { InstrumentEntity } from './infrastructure/entity/InstrumentEntity'
import { ArrangerEntity } from './infrastructure/entity/ArrangerEntity'

type ResourceFactoryArguments =
  {
    id?: number;
    title?: string;
    type?: ResourceType;
    googleDriveId?: string;
    googleDriveLink?: string;
    source?: string;
    authors?: string[];
    album?: string;
    audioType?: AudioType;
    composers?: string[];
    arrangers?: string[];
    instruments?: string[];
  }
export const ResourceFactory = (
  {
    id = 0,
    title = 'My title rocks!',
    type = 'video',
    googleDriveId = 'someResourceDriveId',
    googleDriveLink = '/path/to/resource/file',
    source = 'https://example.com',
    authors = ['First Author', 'Second Author'],
    album = 'Some Super Hit Album',
    audioType = 'song',
    composers = ['First Composer', 'Second Composer'],
    arrangers = ['First Arranger', 'Second Arranger'],
    instruments = ['Piano', 'Violin', 'Trumpet'],
  }: ResourceFactoryArguments = {},
) =>
  new Resource(
    id,
    title,
    type,
    googleDriveId,
    googleDriveLink,
    source,
    authors,
    album,
    audioType,
    composers,
    arrangers,
    instruments,
  )

type ResourceEntityFactoryArguments =
  {
    id?: number;
    title?: string;
    type?: ResourceType;
    googleDriveId?: string;
    googleDriveLink?: string;
    bundle?: BundleEntity;
    source?: string;
    authors?: AuthorEntity[];
    album?: string;
    audioType?: AudioType;
    composers?: ComposerEntity[];
    arrangers?: AuthorEntity[];
    instruments?: InstrumentEntity[];
  }

export const ResourceEntityFactory = (
  {
    id = 0,
    title = 'My title rocks!',
    type = 'video',
    googleDriveId = 'someResourceDriveId',
    googleDriveLink = '/path/to/resource/file',
    bundle = BundleEntityFactory(),
    source = 'https://example.com',
    authors = [AuthorEntityFactory()],
    album = 'Some Super Hit Album',
    audioType = 'song',
    composers = [ComposerEntityFactory()],
    arrangers = [ArrangerEntityFactory()],
    instruments = [InstrumentEntityFactory()],
  }: ResourceEntityFactoryArguments = {}) => new ResourceEntity(
  id,
  title,
  type,
  googleDriveId,
  googleDriveLink,
  bundle,
  source,
  authors,
  album,
  audioType,
  composers,
  arrangers,
  instruments,
)

type BundleEntityFactoryArguments = {
  id?: number;
  name?: string;
  googleDriveId?: string;
  resources?: ResourceEntity[];
}
const BundleEntityFactory = (
  {
    id = 43,
    name = 'Super Bundle Name',
    googleDriveId = 'SomeDriveId',
    resources = [],
  }: BundleEntityFactoryArguments = {},
) => new BundleEntity(
  id,
  name,
  googleDriveId,
  resources,
)

type AuthorEntityFactoryArguments = {
  id?: number;
  name?: string;
}
const AuthorEntityFactory = (
  {
    id = 98,
    name = 'Amazing Author',
  }: AuthorEntityFactoryArguments = {},
) => new AuthorEntity(
  id,
  name,
)

type ComposerEntityFactoryArguments = {
  id?: number;
  name?: string;
}
const ComposerEntityFactory = (
  {
    id = 674,
    name = 'Amazing Composer',
  }: ComposerEntityFactoryArguments = {},
) => new ComposerEntity(
  id,
  name,
)

type ArrangerEntityFactoryArguments = {
  id?: number;
  name?: string;
}
const ArrangerEntityFactory = (
  {
    id = 902,
    name = 'Amazing Arranger',
  }: ArrangerEntityFactoryArguments = {},
) => new ArrangerEntity(
  id,
  name,
)

type InstrumentEntityFactoryArguments = {
  id?: number;
  name?: string;
}
const InstrumentEntityFactory = (
  {
    id = 78,
    name = 'Piano',
  }: InstrumentEntityFactoryArguments = {},
) => new InstrumentEntity(
  id,
  name,
)

type ResourceResponseFactoryArguments = {
  id?: number;
  title?: string;
  url?: string;
  type?: ResourceType;
  source?: string;
  authors?: string[];
  composers?: string[];
  arrangers?: string[];
  instruments?: string[];
  album?: string;
  audioType?: AudioType;
}
export const ResourceResponseFactory = (
  {
    id = 89,
    title = 'My title rocks!',
    url = '/path/to/resource/file',
    type = 'video',
    source = 'https://example.com',
    authors = ['First Author', 'Second Author'],
    album = 'Some Super Hit Album',
    audioType = 'song',
    composers = ['First Composer', 'Second Composer'],
    arrangers = ['First Arranger', 'Second Arranger'],
    instruments = ['Piano', 'Violin', 'Trumpet'],
  }: ResourceResponseFactoryArguments = {},
): ResourceResponse => ({
  id,
  title,
  url,
  type,
  source,
  authors,
  album,
  audioType,
  composers,
  arrangers,
  instruments,
})