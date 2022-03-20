import { useMutation, useQuery } from '@apollo/client'
import { DialogActions, DialogContent, Grid, Toolbar, Typography } from '@mui/material'
import { useRef } from 'react'
import Dialog from '../../components/core/Dialog'
import { Field, SumbitButton, useFormContext, withForm } from '../../components/core/Form'
import Table from '../../components/core/Table'
import TextField from '../../components/fields/TextField'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Button from '../../components/core/Button'
import { map } from 'lodash-es'
import { ALL_COMPUTERS_QUERY, COMPUTERS_BRANCH, CREATE_COMPUTER_MUTATION, DELETE_COMPUTER_MUTATION, UPDATE_COMPUTER_MUTATION } from './data'
import { byteToReadable, getApiUrl } from '../../utils/helpers'
import { useRouter } from 'next/router'

const byteFormatter = ({ value }) => byteToReadable(value)

const fields = [
  { field: 'name', label: 'Name', flex: 1 },
  { field: 'thread_count', label: 'Thread count', flex: 1, noForm: true },
  { field: 'ram_amount', label: 'RAM Amount', flex: 1, noForm: true, valueFormatter: byteFormatter },
  { field: 'ram_usage', label: 'RAM Usage', flex: 1, noForm: true, valueFormatter: byteFormatter },
  { field: 'load_average', label: 'Load (avg)', flex: 1, noForm: true },
  { field: 'uptime', label: 'Uptime', flex: 1, noForm: true },
  { field: 'status', label: 'Status', flex: 1, noForm: true },
]

const columns = map(fields, ({ label, noForm, ...other }) => ({ headerName: label, ...other }))

const formFields = map(fields, ({ field, label, component = TextField, noForm }) => noForm ? null : (
  <Grid key={field} item xs={12}>
    <Field field={field} label={label} component={component} />
  </Grid>
))

function Computers () {
  const router = useRouter()
  const ref = useRef()
  const { loading: dataLoading, data = {} } = useQuery(ALL_COMPUTERS_QUERY)
  const [createComputer, { loading: createLoading }] = useMutation(CREATE_COMPUTER_MUTATION)
  const { setData: setFormData, editMode } = useFormContext()

  const loading = dataLoading || createLoading

  const { computers: rows = [] } = data

  const handleSubmit = async (data) => {
    if (editMode) {
      await updateComputer({
        variables: data,
        refetchQueries: [
          ALL_COMPUTERS_QUERY
        ]
      })
    } else {
      await createComputer({
        variables: data,
        refetchQueries: [
          ALL_COMPUTERS_QUERY
        ]
      })
    }
    ref?.current?.close()
  }

  const handleOpenNew = () => {
    setFormData({})
    ref?.current?.open()
  }

  const onRowClick = (params) => {
    const id = params?.id
    id && router.push(getApiUrl(COMPUTERS_BRANCH, id))
  }

  return (
    <div>
      <Dialog ref={ref} maxWidth='sm' title='Computers'>
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
          Computers
        </Typography>
        <Button loading={loading} size='medium' label='New' icon={AddRoundedIcon} onClick={handleOpenNew} />
      </Toolbar>
      <div>
        <Table
          loading={loading}
          data={rows}
          columns={columns}
          onRowClick={onRowClick}
        />
      </div>
    </div>
  )
}

export default withForm(Computers)
