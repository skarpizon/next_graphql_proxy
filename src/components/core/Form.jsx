import {
  styled,
  useEventCallback,
  FormControl as MuiFormControl,
  FormHelperText
} from "@mui/material"
import { isNull } from "lodash-es"
import { isEmpty } from "lodash-es"
import { mapValues } from "lodash-es"
import { isUndefined } from "lodash-es"
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import Button from "./Button"

const FormContext = createContext(null)

const FormControl = styled(MuiFormControl)(({ theme }) => ({
  width: "100%"
}))

function Form({ children }) {
  const ref = useRef()
  const [data, setData] = useState({})
  const [errors, setStateError] = useState({})
  const [touched, setStateTouched] = useState({})

  function setField(field, value) {
    setData((d) => ({
      ...d,
      [field]: value
    }))
  }

  function setError(field, value) {
    setStateError(({ [field]: current, ...e }) => ({
      ...e,
      ...(value ? { [field]: value } : {})
    }))
  }

  function setTouched(field) {
    setStateTouched((t) => ({
      ...t,
      [field]: true
    }))
  }

  function touchAll() {
    setStateTouched((t) => ({
      ...t,
      ...mapValues(errors, (error) => !!error)
    }))
  }

  function openForm(data = {}) {
    setData(data)
    ref?.current?.open()
  }

  return (
    <FormContext.Provider
      value={{
        data,
        errors,
        touched,
        setField,
        setError,
        setTouched,
        setData,
        touchAll,
        openForm,
        editMode: Boolean(data.id),
        ref
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

function EmptyComponent({ label }) {
  return <div>Oops... Component for &quot;{label}&quot; don&apos;t set</div>
}

function Field({
  component: Component = EmptyComponent,
  field,
  defaultValue,
  label,
  hideError,
  required,
  ...other
}) {
  const formData = useContext(FormContext)
  const {
    data: { [field]: value },
    errors: { [field]: error },
    touched: { [field]: touched },
    setField,
    setError,
    setTouched
  } = formData

  useEffect(() => {
    if (value === undefined) setField(field, defaultValue ?? "")
  }, [])

  useEffect(() => {
    let newError = undefined
    if (!value && required) newError = "Required field"
    setError(field, newError)
  }, [value])

  useEffect(() => {
    if (isUndefined(value)) setField(field, defaultValue ?? "")
  }, [value])

  const onChange = useEventCallback(
    (v) => {
      setField(field, v)
    },
    [setField]
  )

  const onTouch = useEventCallback(() => {
    setTouched(field)
  }, [setTouched])

  return useMemo(
    () =>
      !isUndefined(value) && !isNull(value) ? (
        <FormControl>
          <Component
            {...other}
            value={value}
            onChange={onChange}
            onBlur={onTouch}
            label={required ? <span>{label} *</span> : label}
          />
          <FormHelperText error>
            {hideError ? "" : (!!touched && error) || " "}
          </FormHelperText>
        </FormControl>
      ) : null,
    [value, error, touched, required]
  )
}

function SumbitButton({ label = "Save", onClick, ...other }) {
  const { data, errors, touchAll } = useContext(FormContext)

  const handleClick = () => {
    if (!isEmpty(errors)) {
      touchAll()
    } else if (onClick) {
      onClick(data)
    }
  }

  return <Button {...other} label={label} onClick={handleClick} />
}

const withForm = (Component) =>
  function Wrapped(props) {
    return (
      <Form>
        <Component {...props} />
      </Form>
    )
  }

function useFormContext() {
  const { openForm, setData, editMode, ref } = useContext(FormContext)
  return { open: openForm, setData, editMode, ref }
}

export { Field, SumbitButton, withForm, useFormContext }

export default Form
