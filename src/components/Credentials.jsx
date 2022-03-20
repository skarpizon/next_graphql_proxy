import { gql, useMutation, useQuery } from '@apollo/client'
import { DialogActions, DialogContent, Grid, Toolbar, Typography } from '@mui/material'
import { useCallback, useMemo, useRef, useState } from 'react'
import Dialog from './core/Dialog'
import { Field, SumbitButton, useFormContext, withForm } from './core/Form'
import IconButton from './core/IconButton'
import Table from './core/Table'
import TextField from './fields/TextField'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import Button from './core/Button'
import { useConfirmationModal } from './core/ConfirmationModal'
import { map } from 'lodash-es'

const gqlFields = `
  id
  name
  farmer_public_key
  pool_contract_address
  cold_wallet_address
  farm_wallet_mnemonic
`

export const ALL_CREDENTAILS_QUERY = gql`
  query {
    credentials {
      ${gqlFields}
    }
  }
`

export const CREATE_CREDENTAIL_MUTATION = gql`
  mutation createCredential(
    $name: String,
    $farmer_public_key: String,
    $pool_contract_address: String,
    $cold_wallet_address: String,
    $farm_wallet_mnemonic: String!
  ) {
    createCredential(
      name: $name,
      farmer_public_key: $farmer_public_key,
      pool_contract_address: $pool_contract_address,
      cold_wallet_address: $cold_wallet_address,
      farm_wallet_mnemonic: $farm_wallet_mnemonic
    ) {
      ${gqlFields}
    }
  }
`

export const UPDATE_CREDENTAIL_MUTATION = gql`
  mutation updateCredential(
    $id: ID!,
    $name: String,
    $farmer_public_key: String,
    $pool_contract_address: String,
    $cold_wallet_address: String,
    $farm_wallet_mnemonic: String
  ) {
    updateCredential(
      id: $id,
      name: $name,
      farmer_public_key: $farmer_public_key,
      pool_contract_address: $pool_contract_address,
      cold_wallet_address: $cold_wallet_address,
      farm_wallet_mnemonic: $farm_wallet_mnemonic
    ) {
      ${gqlFields}
    }
  }
`

export const DELETE_CREDENTAIL_MUTATION = gql`
  mutation deleteCredential(
    $id: ID!
  ) {
    deleteCredential(
      id: $id
    ) {
      success
    }
  }
`

const ActionsCell = ({ params: { row }, handleEdit, handleDelete }) => (
  <div>
    <IconButton icon={EditRoundedIcon} color='default' tooltip='Edit' onClick={() => handleEdit(row)} />
    <IconButton icon={DeleteForeverRoundedIcon} color='default' tooltip='Delete' onClick={() => handleDelete(row?.id)} />
  </div>
)

const fields = [
  { field: 'name', label: 'Name', flex: 1 },
  { field: 'farmer_public_key', label: 'Farmer Public Key', flex: 1 },
  { field: 'pool_contract_address', label: 'Pool Contract Address', flex: 1 },
  { field: 'cold_wallet_address', label: 'Cold Wallet Address', flex: 1 },
  { field: 'farm_wallet_mnemonic', label: 'Farm Wallet Mnemonic', flex: 1 },
]

const getColumns = ({ handleEdit, handleDelete }) => [
  {
    field: 'actions',
    headerName: '',
    width: 80,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => <ActionsCell params={params} handleEdit={handleEdit} handleDelete={handleDelete} />
  },
  ...map(fields, ({ label, ...other }) => ({ headerName: label, ...other }))
]

const formFields = map(fields, ({ field, label, component = TextField }) => (
  <Grid key={field} item xs={12}>
    <Field field={field} label={label} component={component} />
  </Grid>
))

const deleteModalConfig = {
  title: 'Remove',
  contentConfig: {
    text: 'Are you sure you want to delete it?',
    confirmLabel: 'Confirm',
    rejectLabel: 'Cancel'
  }
}

function Credentials () {
  const ref = useRef()
  const { loading: dataLoading, data } = useQuery(ALL_CREDENTAILS_QUERY)
  const [createCredential, { loading: createLoading }] = useMutation(CREATE_CREDENTAIL_MUTATION)
  const [updateCredential, { loading: updateLoading }] = useMutation(UPDATE_CREDENTAIL_MUTATION)
  const [deleteCredential, { loading: deleteLoading }] = useMutation(DELETE_CREDENTAIL_MUTATION)
  const { setData: setFormData, editMode } = useFormContext()
  const { openModal: openDeleteModal } = useConfirmationModal(deleteModalConfig)

  const handleEdit = useCallback(
    (data) => {
      setFormData(data)
      ref?.current?.open()
    },
    [ref?.current],
  )

  const handleDelete = useCallback(
    async (id) => {
      if (id) {
        try {
          await openDeleteModal()
          deleteCredential({
            variables: { id },
            refetchQueries: [
              ALL_CREDENTAILS_QUERY
            ]
          })
        } catch (error) {}
      }
    },
    [openDeleteModal, deleteCredential],
  )

  const columns = useMemo(() => getColumns({ handleEdit, handleDelete }), [handleEdit, handleDelete])

  const loading = dataLoading || createLoading || updateLoading || deleteLoading

  const { credentials } = data

  const handleSubmit = async (data) => {
    if (editMode) {
      await updateCredential({
        variables: data,
        refetchQueries: [
          ALL_CREDENTAILS_QUERY
        ]
      })
    } else {
      await createCredential({
        variables: data,
        refetchQueries: [
          ALL_CREDENTAILS_QUERY
        ]
      })
    }
    ref?.current?.close()
  }

  const handleOpenNew = () => {
    setFormData({})
    ref?.current?.open()
  }

  return (
    <div>
      <Dialog ref={ref} maxWidth='sm' title='Credentials'>
        <DialogContent>
          <Grid container spacing={1}>
            {formFields}
          </Grid>
        </DialogContent>
        <DialogActions>
          <SumbitButton loading={loading} label={editMode ? 'Save' : 'Create'} onClick={handleSubmit} />
        </DialogActions>
      </Dialog>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant='h4'>
          Credentials
        </Typography>
        <Button loading={loading} size='medium' label='New' icon={AddRoundedIcon} onClick={handleOpenNew} />
      </Toolbar>
      <div>
        <Table loading={loading} data={credentials} columns={columns} />
      </div>
    </div>
  )
}

export default withForm(Credentials)
