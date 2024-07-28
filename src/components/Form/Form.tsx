import { ChangeEvent, FormEvent, useState } from 'react';
import { countries } from '../../data/countries';
import styles from './Form.module.css';
import type { Searchtype } from '../../types';
import Alert from '../Alert/Alert';


type FormProps = {
  fetchWeather: (search: Searchtype) => Promise<void>
}

const Form = ({ fetchWeather }: FormProps) => {

  const [search, setSearch] = useState<Searchtype>({
    city: '',
    country: ''
  });

  const [alert, setAlert] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (Object.values(search).includes('')) {
      setAlert('Todos los campos son obligatorios');
      return;
    }
    fetchWeather(search);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >

      {alert && <Alert>{alert}</Alert>}
      <div className={styles.field}>
        <label htmlFor="city">Cuidad:</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder='Cuidad'
          value={search.city}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="country">Pais:</label>

        <select
          id='country'
          value={search.country}
          name='country'
          onChange={handleChange}
        >
          <option value="">== Selccione un pais ==</option>
          {countries.map(county => (
            <option key={county.code} value={county.code}>{county.name}</option>
          ))}

        </select>
      </div>

      <input className={styles.submit} type="submit" value={'Consultar Clima'} />
    </form>
  )
}

export default Form