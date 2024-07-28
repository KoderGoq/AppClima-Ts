export type Searchtype = {
  city: string,
  country: string
}

export type Country = {
  code: string,
  name: string
}

// Type  Asing
export type Weather = {
  name: string,
  main: {
    temp: number
    temp_max: number
    temp_min: number
  }
}