export class User {
  id: string;
  name: string;
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  login(): void {
    console.log(`User ${this.name} logged in`);
  }

  logout(): void {
    console.log(`User ${this.name} logged out`);
  }

  /** Create a User instance from a Prisma record */
  static fromPrisma(data: { id: string; name: string; email: string }): User {
    return new User(data.id, data.name, data.email);
  }
}
