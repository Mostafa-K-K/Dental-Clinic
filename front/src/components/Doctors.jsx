import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Doctors(props) {

  let { session: { user: { id, token } } } = useContext(SessionContext);

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {

    async function fetchData() {
      await API.get(`doctor`, {
        headers: {
          id: id,
          token: token
        }
      })
        .then(res => {
          const result = res.data.result;
          setDoctors(result);
        });
    }

    fetchData();
  }, [props.value]);

  return (
    <Autocomplete
      options={doctors}
      getOptionLabel={(option) => option.first_name + " " + option.middle_name + " " + option.last_name}
      value={props.value != "" ? doctors.find(d => d.id == props.value) : null}
      variant="outlined"
      onChange={props.onChange}
      renderInput={(params) =>
        <TextField
          fullWidth
          {...params}
          variant="outlined"
          label="Doctor"
          className={props.className}
        />
      }
    />
  );
}