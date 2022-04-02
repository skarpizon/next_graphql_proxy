import { includes } from "lodash-es"
import { useRouter } from "next/router"

function Route({ exact, path, children }) {
  const router = useRouter()
  if (
    (exact && path === router?.asPath) ||
    (!exact && includes(router.asPath, path))
  )
    return children
  return null
}

export default Route
