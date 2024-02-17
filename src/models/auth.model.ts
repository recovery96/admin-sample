export interface SigninData {
  email: string
  password: string
}

export interface SigninResponse {
  token: string
  email: string
}

export interface SigninFormValues extends SigninData {
  submit: null
}
