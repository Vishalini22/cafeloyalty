export enum Tier {
  Regular = 'Regular',
  CoffeeEnthusiast = 'CoffeeEnthusiast',
  CoffeeConnoisseur = 'CoffeeConnoisseur'
}

export enum Role {
  Customer = 'Customer',
  Admin = 'Admin'
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  role: Role;
  pointsBalance: number;
  lifetimePoints: number;
  tier: Tier;
  joinDate: Date;
}
