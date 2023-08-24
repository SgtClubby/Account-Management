import { ChangeEvent, useState } from "react";

interface FormValues {
  // form field types
}

export default function useForm<T extends FormValues>(initialValues: T) {
  const [formValues, setFormValues] = useState(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return {
    formValues,
    setFormValues,
    handleChange,
  };
}
