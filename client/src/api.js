export const Login = async (user) => {
  const response = await fetch("api/usuario/iniciarSesion", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      'content-type': 'application/json'
    }
  })
  if(response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}

export const UploadPhoto = async () => {

}