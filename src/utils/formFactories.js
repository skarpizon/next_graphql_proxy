import { useConfirmationModal } from "@/components/core/ConfirmationModal"
import Dialog from "@/components/core/Dialog"
import { Field, SumbitButton, useFormContext } from "@/components/core/Form"
import TextField from "@/components/fields/TextField"
import { gql, useMutation } from "@apollo/client"
import { DialogActions, DialogContent, Grid } from "@mui/material"
import { compact } from "lodash-es"
import { isEmpty } from "lodash-es"
import { map } from "lodash-es"
import { useCallback } from "react"

const gerFormFields = (fields) =>
  compact(
    map(
      fields,
      ({ field, label, component = TextField, defaultValue, noForm }) =>
        noForm ? null : (
          <Grid key={field} item xs={12}>
            <Field
              field={field}
              label={label}
              component={component}
              defaultValue={defaultValue}
            />
          </Grid>
        )
    )
  )

const emptyGQL = gql`
  mutation empty($id: id) {
    empty(id: $id) {
      s
    }
  }
`

function EditForm({
  title = "Form",
  maxWidth = "sm",
  refetchGQL = [],
  createGQL = emptyGQL,
  updateGQL = emptyGQL,
  fields
}) {
  const { editMode, ref } = useFormContext()

  const [create, { loading: createLoading }] = useMutation(createGQL)
  const [update, { loading: updateLoading }] = useMutation(updateGQL)

  const loading = createLoading || updateLoading

  const handleSubmit = async (data) => {
    if (editMode) {
      await update({
        variables: data,
        ...(refetchGQL && !isEmpty(refetchGQL)
          ? { refetchQueries: refetchGQL }
          : {})
      })
    } else {
      await create({
        variables: data,
        ...(refetchGQL && !isEmpty(refetchGQL)
          ? { refetchQueries: refetchGQL }
          : {})
      })
    }
    ref?.current?.close()
  }

  return (
    <Dialog ref={ref} maxWidth={maxWidth} title={title}>
      <DialogContent>
        <Grid container spacing={1}>
          {fields}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 2 }}>
        <SumbitButton
          loading={loading}
          label={editMode ? "Save" : "Create"}
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  )
}

const editFormFactory = ({ fields, ...other }) => {
  const formFields = gerFormFields(fields)
  const FormWrapper = (props) => {
    return <EditForm {...other} fields={formFields} {...props} />
  }
  return FormWrapper
}

const removeModalFactory = ({
  modalConfig = {},
  refetchGQL = [],
  removeGQL = emptyGQL
}) => {
  const useRemoveModal = () => {
    const [remove, { loading }] = useMutation(removeGQL)
    const { openModal: openDeleteModal } = useConfirmationModal(modalConfig)

    const handleDelete = useCallback(
      async (id) => {
        if (id) {
          try {
            await openDeleteModal()
            remove({
              variables: { id },
              ...(refetchGQL && !isEmpty(refetchGQL)
                ? { refetchQueries: refetchGQL }
                : {})
            })
          } catch (error) {}
        }
      },
      [openDeleteModal, remove]
    )
    return { remove: handleDelete, loading }
  }
  return useRemoveModal
}

export { editFormFactory, removeModalFactory }
