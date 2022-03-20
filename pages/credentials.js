import Credentials, { ALL_CREDENTAILS_QUERY } from '../src/components/Credentials'
import SSPGenerator from '../src/utils/SSPGenerator'

const SSRPage = () => (
  <Credentials />
)

const getServerSideProps = SSPGenerator(ALL_CREDENTAILS_QUERY)

export {
  getServerSideProps
}

export default SSRPage