import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import Bundle from '@shared/Bundle'

interface RouteInfo {
  id: string;
}

export const BundleDetailPage = (routeInfo: RouteComponentProps<RouteInfo>) => {
  const [bundle, setBundle] = useState<Bundle>({ id: 0, name: '' })

  useEffect(() => {
    fetch(`/api/bundles/${routeInfo.match.params.id}`)
      .then(response => response.json())
      .then(data => setBundle(data))
  }, [routeInfo.match.params.id])

  return <div id='bundle-detail'>
    <Typography variant='h3' data-bundle-name={bundle.name}>{bundle.name}</Typography>
  </div>
}