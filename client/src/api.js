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

export const UploadPhoto = async (photos) => {
  const formData = new FormData()
  let counter = 0
  photos.forEach(photo => {
    counter++
    formData.append('archivo', photo, `historia${counter}.jpeg`)
  });
  const response = await fetch("api/usuario/historiaPaciente", {
    method: "POST",
    body: formData,
  })
  if(response.ok) {
    return response.json()
  } else {
    throw await response.json()
  }
}