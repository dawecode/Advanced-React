import { useState } from "react";

export default function useForm(initial = {}) {
  const [inputs, setInputs] = useState(initial);

  function handleChange(e) {
    let { value, name, type } = e.target;

    if (type === "number") {
      value = parseInt(value);
    }
    if (type === "file") {
      [value] = e.target.files;
    }
    setInputs({
      //copy the existing state
      ...inputs,

      [name]: e.target.value,
    });
  }

  function resetForm() {
    setInputs(initial)
  }
  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key,value]) => 
      [key,""])); 
      setInputs(blankState)
  }
  //returns the things we want to surface from this custom hooks
  return { 
    inputs, 
    handleChange,
    resetForm,
    clearForm 
  };
}
