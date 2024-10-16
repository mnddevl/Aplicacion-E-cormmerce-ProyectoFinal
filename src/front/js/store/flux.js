const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
<<<<<<< HEAD
			usuario: {
                name: "",
                email: "",
                direccion: "",
				codigo_postal: "",
                ciudad: "",
            },
			cafe: [
=======
			usuario: [

			],
			productos: [
>>>>>>> f6ae5fcfd9e0ef1562b794172789e43d8e356f2c
				
			  ]
		},
		actions: {
			registrar: (form, navigate) => { 
				fetch(`${process.env.BACKEND_URL}/api/registro`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(form)
				})
				.then(response => {
					if (!response.ok) {
						return response.json().then(err => { throw new Error(err.error); });
					}
					return response.json();
				})
				.then(data => {
					console.log("Registro exitoso:", data);
					navigate('/loginView'); 
				})
				.catch(error => {
					console.error('Error en la solicitud:', error);
					alert('Error al registrar: ' + error.message); 
				});
			},

			loginUsuario: (email, password, onSuccess, onError) => {
                fetch(`${process.env.BACKEND_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                        console.log("Inicio de sesión exitoso"); 
						setStore({usuario: data.user})
                        if (onSuccess) onSuccess();
                    } else {
                        const errorMessage = data.error || "Error desconocido al iniciar sesión.";
                        if (onError) onError(errorMessage);
                    }
                })
                .catch(error => {
                    if (onError) onError('Error de conexión. Inténtalo de nuevo.');
                });
            },

             getUsuarioData: async () => {
                const token = sessionStorage.getItem('token');
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/usuario`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("No se pudieron obtener los datos del usuario");
                    }

                    const data = await response.json();
                    setStore({ usuario: data });
                    return data;
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                }
            },
      
            validarSenhas: (newPassword, confirmNewPassword) => {
				if (newPassword || confirmNewPassword) {
					if (newPassword.length < 6) {
						return "La contraseña debe tener al menos 6 caracteres.";
					}
					if (newPassword !== confirmNewPassword) {
						return "Las contraseñas no coinciden.";
					}
				}
				return null; 
			},			
         
            submitUsuario: async (form) => {
                const { usuario } = getStore();
                const error = getActions().validarSenhas(form.newPassword, form.confirmNewPassword);
                if (error) {
                    alert(error);
                    return;
                }

                const updatedUserData = {
                    ...usuario,
                    ...form,
                    password: form.newPassword || usuario.password,
                };

                const token = sessionStorage.getItem('token');
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/usuario/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(updatedUserData)
                    });

                    if (!response.ok) {
                        throw new Error("Error al actualizar los datos");
                    }

                    const data = await response.json();
                    setStore({ usuario: data.usuario });
                    return data;
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    alert('Error al actualizar los datos.');
                }
            }
        }
    };
};

export default getState;