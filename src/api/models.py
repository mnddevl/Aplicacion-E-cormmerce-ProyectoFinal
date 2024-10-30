from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSON

db = SQLAlchemy()

# Muchos a muchos entre CarritoDeCompras y Producto
class CarritoProducto(db.Model):
    __tablename__ = 'carrito_producto'
    id = db.Column(db.Integer, primary_key=True)
    producto_id = db.Column(db.Integer, db.ForeignKey('productos.producto_id'), nullable=False)
    producto = db.relationship('Producto', back_populates='carrito_producto')
    carrito_id = db.Column(db.Integer, db.ForeignKey('carritos.carrito_id'), nullable=False)
    carrito = db.relationship('CarritoDeCompra', back_populates='productos')
    cantidad = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<CarritoProducto {self.carrito_id} - {self.producto_id}>'

class Usuario(db.Model):
    __tablename__ = 'usuario'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(500), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    es_admin = db.Column(db.Boolean(), nullable=False, default=False)

    nombre_completo = db.Column(db.String(120), unique=False, nullable=True)
    direccion = db.Column(db.String(120), unique=False, nullable=True)
    codigo_postal = db.Column(db.String(120), unique=False, nullable=True)
    ciudad = db.Column(db.String(120), unique=False, nullable=True)
    telefono = db.Column(db.String(120), unique=False, nullable=True)
    carrito = db.relationship('CarritoDeCompra', back_populates='usuario')

    def __repr__(self):
        return f'<Usuario {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre_completo": self.nombre_completo,
            "direccion": self.direccion,
            "codigo_postal": self.codigo_postal,
            "ciudad": self.ciudad,
            "telefono": self.telefono
            # do not serialize the password, its a security breach
        }
    
class Producto(db.Model):
    __tablename__ = 'productos'

    producto_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(255), nullable=False)
    precio = db.Column(db.Float, nullable=False)
    region = db.Column(db.String(50), nullable=False)
    peso = db.Column(db.Integer, nullable=False)
    nivel_tostado = db.Column(db.Integer, nullable=False)
    perfil_sabor = db.Column(db.JSON, nullable=False)  # Array o JSON
    opcion_molido = db.Column(db.JSON, nullable=False)    # Array o JSON
    imagen_url = db.Column(db.String(255), nullable=False)

    precio_stripe_id = db.Column(db.String(50), nullable=False)
    producto_stripe_id = db.Column(db.String(50), nullable=False)

    carrito_producto = db.relationship('CarritoProducto', back_populates='producto')

    def __repr__(self):
        return f'<Producto {self.producto_id}>'

    def serialize(self):
        return {
            "id": self.producto_id,
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "precio": self.precio,
            "region": self.region,
            "peso": self.peso,
            "nivel_tostado": self.nivel_tostado,
            "perfil_sabor": self.perfil_sabor,
            "opcion_molido": self.opcion_molido,
            "imagen_url": self.imagen_url,
            "precio_stripe_id": self.precio_stripe_id,
            "producto_stripe_id": self.producto_stripe_id       
        }

class CarritoDeCompra(db.Model):
    __tablename__ = 'carritos'
    
    carrito_id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False, unique=True)
    usuario = db.relationship('Usuario', back_populates='carrito')
    productos = db.relationship('CarritoProducto', back_populates='carrito')

    def __repr__(self):
        return f'<CarritoDeCompra {self.carrito_id}>'
    

class Pedido(db.Model):
    __tablename__ = 'pedidos'

    pedido_id = db.Column(db.Integer, primary_key=True)
    carrito_id = db.Column(db.Integer, db.ForeignKey('carritos.carrito_id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)

    fecha_pedido = db.Column(db.DateTime, nullable=False)
    total_facturacion = db.Column(db.Float, nullable=False)
    stripe_session_id = db.Column(db.String(255), unique=True)
  
    carrito = db.relationship('CarritoDeCompra', backref=db.backref('pedidos', lazy=True))
    usuario = db.relationship('Usuario', backref=db.backref('pedidos', lazy=True))

    def __repr__(self):
        return f'<Pedido {self.pedido_id}>'



    


