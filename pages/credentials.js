import Credentials from "@/containers/Credentials"
import { ALL_CREDENTAILS_QUERY } from "@/data/credentials"
import SSPGenerator from "@/utils/SSPGenerator"

const SSRPage = () => <Credentials />

const getServerSideProps = SSPGenerator(ALL_CREDENTAILS_QUERY)

export { getServerSideProps }

export default SSRPage
