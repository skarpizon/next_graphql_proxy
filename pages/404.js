import ErrorPage from "@/components/ErrorPage"

const Page = () => <ErrorPage mainText="404" subText="Page not found" />

Page.getLayout = (page) => <div>{page}</div>

export default Page
