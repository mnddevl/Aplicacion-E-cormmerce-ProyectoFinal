const getState = ({ getStore, getActions, setStore }) => {

    return {
        store: {
            usuario: [],
            productos: [],
            carrito: [],
            carrito_id: null,
        },
        actions: {
            
            //AGREGAR A CARRITO
            addToCart: (producto) => {
                setStore({ carrito: [...getStore().carrito, producto]});
            },

            //REGISTRAR USUARIO
            registrar: (form, navigate) => {
                fetch(`${process.env.BACKEND_URL}/api/registro`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                })
                    .then(async response => {
                        if (!response.ok) {
                            const err = await response.json();
                            throw new Error(err.error);
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
            //LOGIN USUARIO
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
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('user', JSON.stringify(data.user));
                        setStore({ usuario: data.user, isAuthenticated: true }); 
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
            logoutUsuario: () => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                setStore({ usuario: [], isAuthenticated: false }); 
            },
            //UPDATE USUARIO
            update_usuario: async () => {
                const token = sessionStorage.getItem('token');
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/usuario/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("No se pudieron obtener los datos del usuario");
                    }

                    const data = await response.json();
                    const store = getStore();
                    setStore({ ...store, usuario: data });
                    return data;
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                }
            },
            //CONFIRMAR CAMBIOS USUARIO
            submitUsuario: async (form) => {
                const { usuario } = getStore();
                //const error = getActions().validarPassword(form.newPassword, form.confirmNewPassword);

                // if (error) {
                //     alert(error);
                //     return;
                // }
                const updatedUserData = {
                    ...form
                };
                if (form.newPassword) {
                    updatedUserData.password = form.newPassword;
                } else {
                    delete updatedUserData.password;
                }
                console.log("Informacion del usuario actualizada", updatedUserData)

                const token = sessionStorage.getItem('token');
                if (!token) {
                    alert("No hay un token de autenticación");
                    return;
                }
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
                        throw new Error(errorMessage, "Error al actualizar los datos");
                    }

                    const data = await response.json();
                    const store = getStore();
                    console.log(updatedUserData)
                    setStore({ ...store, usuario: updatedUserData });
                    sessionStorage.setItem('user', JSON.stringify(updatedUserData))
                    return data;

                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    alert('Error al actualizar los datos: ' + error.message);
                }
            },
            //GET PRODUCTOS
            get_productos: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/productos`);
                     console.log(response);
                    if (response.ok) {
                        const data = await response.json();
                        const store = getStore();
                        setStore({ ...store, productos: data.productos });
                    } else {
                        console.error("Error al obtener los productos:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error en get_productos:", error);
                }
            },
            //GET PRODUCTOS POR PAIS
            getProductosPorPais: async (country) => {
                try {
                    const response = await fetch(`/api/productoPorPais/${country}`);
                    const data = await response.json();

                    if (response.ok) {
                        setStore({ productos: data });
                    } else {
                        console.error("Error al obtener productos:", data.error);
                    }
                } catch (error) {
                    console.error("Error al conectar con la API:", error);
                }
            },
            //GET PRODUCTO POR ID
            get_producto_by_id: async (producto_id) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/producto/${producto_id}`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Producto recibido:", data);
                        const store = getStore();
                        setStore({ ...store, producto: data.producto });
                    } else {
                        console.error("Error al obtener el producto:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error en get_producto_by_id:", error);
                }
            },
            //GET USUARIO
            getUsuario: async () => {
                const token = sessionStorage.getItem('token');
                try {
                    const response = await fetch (`${process.env.BACKEND_URL}/api/usuario`, {
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }})
                    if (!response.ok){
                        return (
                            {"error": "Usuario no autenticado"}
                        )}
                    else {
                       const data = await response.json()
                       return(data)
                    }
                } catch(error) {
                    console.log(error)
                }
            },
            //AGREGAR AL CARRITO
            addToCart: async (selectedProduct) => {
                const store = getStore();  
                const userToken = sessionStorage.getItem('token');  

                const productData = {
                    producto_id: selectedProduct.id,
                    cantidad: selectedProduct.cantidad
                };
            
                try {
                    const response = await fetch('https://solitary-fishsticks-g4x9gvw7j6w6fw774-3001.app.github.dev/api/carrito/agregar'
, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`,  
                        },
                        
                        body: JSON.stringify({
                            producto_id: selectedProduct.id,
                            cantidad: selectedProduct.cantidad
                        }),
                    });
            
                    const data = await response.json();
                    console.log("Response from backend:", data);
            
                    if (response.ok) {
                        setStore({ carrito: [...store.carrito, selectedProduct] });
                        localStorage.setItem("carrito_id", data.carrito_id)
                    }
                } catch (error) {
                    console.error("Error adding to cart:", error);
                }
            },  
            //GET CARRITO
            get_carrito: async () => {
                const token = sessionStorage.getItem("token")
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/carrito/productos`,{
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    } 
                    );
                    console.log(response);
                    if (response.ok) {
                        const data = await response.json();
                        const store = getStore();
                        setStore({ ...store, carrito: data.productos });
                    } else {
                        console.error("Error al obtener los productos:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error en get_productos:", error);
                }
            },
            //UPDATE CANTIDAD PRODUCTOS EN CARRITO
            handleQuantityChange : async (carritoId, productoId, newCantidad) => {
                try {
                    const token = sessionStorage.getItem("token");
                    const payload = {
                        carrito_id: carritoId,
                        producto_id: productoId,
                        cantidad: newCantidad,
                    };
                    const response = await fetch(`${process.env.BACKEND_URL}/api/carrito/update_quantity`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        getActions().get_carrito()
                        return {
                            type: 'UPDATE_QUANTITY_SUCCESS',
                            payload: { productoId, newCantidad }
                        };
                    }
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Falló la actualización de la cantidad');
                   
                } catch (error) {
                    console.error("Error al actualizar la cantidad:", error);
                    return {
                        type: 'UPDATE_QUANTITY_FAILURE',
                        payload: error.message
                    };
                }
            }         
        }
    };
};

export default getState;