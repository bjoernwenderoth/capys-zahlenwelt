import { AVATAR_LABELS, RACCOON_AVATAR, T_REX_AVATAR } from '../utils/storage.js'

const CUSTOM_AVATAR_IMAGES = {
  [RACCOON_AVATAR]: 'waschbaer-kopf.png',
  [T_REX_AVATAR]: 't-rex-kopf-v2.png'
}

export default function AnimalAvatar({ avatar, className = '' }) {
  const image = CUSTOM_AVATAR_IMAGES[avatar]
  const imageVariantClass = avatar === RACCOON_AVATAR
    ? ' animal-avatar-image-raccoon'
    : avatar === T_REX_AVATAR
      ? ' animal-avatar-image-t-rex'
      : ''

  if (image) {
    return (
      <img
        className={`animal-avatar-image${imageVariantClass}${className ? ` ${className}` : ''}`}
        src={`${import.meta.env.BASE_URL}bilder/avatar/${image}`}
        alt={AVATAR_LABELS[avatar]}
        draggable={false}
      />
    )
  }

  return <span className={className}>{avatar}</span>
}
