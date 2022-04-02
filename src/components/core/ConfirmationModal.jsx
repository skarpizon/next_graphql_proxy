import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import { get } from "lodash-es"
import Dialog from "./Dialog"

const ConfirmationModalContext = createContext(null)

function useConfirmationModal(data) {
  const { openModal, setData } = useContext(ConfirmationModalContext)
  useEffect(() => {
    if (data) {
      setData(data)
    }
  }, [data])

  return { openModal }
}

function ConfirmationModalProvider({ children }) {
  const modal = useRef(null)
  const [data, setData] = useState({
    title: "Confirm action",
    contentConfig: {
      text: "Please confirm this action",
      confirmLabel: "Confirm",
      rejectLabel: "Cancel"
    }
  })

  async function openModal() {
    const modalEl = get(modal, "current", null)
    return modalEl.open()
  }

  return (
    <ConfirmationModalContext.Provider value={{ openModal, setData }}>
      <Dialog
        ref={modal}
        type="confirmation"
        maxWidth="xs"
        title={data.title}
        contentConfig={data.contentConfig}
      />
      {children}
    </ConfirmationModalContext.Provider>
  )
}

export { ConfirmationModalProvider, useConfirmationModal }
