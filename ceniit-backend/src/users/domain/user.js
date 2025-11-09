class User {
  constructor(id, name, email, role, status, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
  }

  // Aquí se podrían agregar métodos de dominio si la lógica de negocio se vuelve más compleja.
  // Por ejemplo: canBeDeleted(), promote(), etc.
}

export default User;
