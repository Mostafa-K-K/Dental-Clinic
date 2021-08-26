import React, { useState, useEffect, useContext } from 'react'
import API from '../API'
import SessionContext from "./session/SessionContext"
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

export default function Doctors(props) {

  let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

  const [doctors, setdoctors] = useState([]);

  const fetchdata = async () => {
    await API.get(`doctor`, {
      headers: {
        id: id,
        token: token,
        isAdmin: isAdmin
      }
    })
      .then(res => {
        const result = res.data.result;
        let data = [];
        result.map(res =>
          data.push({
            id: res.id,
            name: res.first_name + " " + res.middle_name + " " + res.last_name
          })
        )
        setdoctors(data);
      });
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <Autocomplete
      id="id_doctor"
      options={doctors}
      getOptionLabel={(option) => option.name} variant="outlined"
      value={props.value}
      onChange={props.onChange}
      renderInput={(params) =>
        <TextField
          required
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